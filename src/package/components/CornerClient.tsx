import { Component, createEffect, createMemo, on, onCleanup, onMount } from 'solid-js';
import {
  BorderOption,
  CSS,
  CreateCorner,
  FigmaSquircleParams,
  Props,
  PropsLocal,
  Size,
  TimeoutCallback,
} from '../type';
import { attrs } from '../utils/domAttr';
// import { container, createCss, getElement, getSize, setCssStyle } from '../utils/domMethods';
import DomMethods from '../utils/domMethods';
import {
  calculateEachCornerEadius,
  createInlineSvg,
  createPath,
  fitBorderSize,
} from '../utils/svgPathMethods';
const { wrapperBorder, border, cloneContentElement, content } = attrs;

type P = Props & PropsLocal;

const CornerClient: Component<P> = (props) => {
  // const [localFigmaSquircleOptions, setLocalFigmaSquircleOptions] = createSignal<Options>({});

  // eslint-disable-next-line prefer-const
  let resizeObserver: ResizeObserver | null = null;
  // eslint-disable-next-line prefer-const
  let timeoutDebounce: ReturnType<typeof setTimeout> | null = null;
  // eslint-disable-next-line prefer-const
  let oldSizeElment: Size = { width: 0, height: 0 };
  // eslint-disable-next-line prefer-const
  let contentElement: HTMLElement | null = null;
  // eslint-disable-next-line prefer-const
  let domMethods: DomMethods;

  const localFigmaSquircleOptions = createMemo(() => {
    return props.options;
  });

  const createListCss = {
    cssContent: (pathSvg: string, elementCloneSize?: Size, borderOption?: BorderOption) => {
      let propertiesWithBorder: CSS.PropertiesHyphen = {};

      if (borderOption && elementCloneSize) {
        const { size } = borderOption;
        const { height, width } = elementCloneSize;

        propertiesWithBorder = {
          ...propertiesWithBorder,
          position: 'absolute',
          top: 0,
          height: height - size * 2 + 'px',
          width: width - size * 2 + 'px',
          transform: 'translate(' + size + 'px,' + size + 'px)',
        };
        // propertiesWithBorder['border-radius'] = 'unset !important';
        // propertiesWithBorder.border = 'unset !important';
      }

      if (localFigmaSquircleOptions().backgroundColor) {
        propertiesWithBorder = {
          ...propertiesWithBorder,
          'background-color': localFigmaSquircleOptions().backgroundColor,
        };
      }

      return domMethods.createCss({
        selector: domMethods.createSelector(content.name),
        properies: {
          'mask-image': createInlineSvg(pathSvg),
          '-webkit-mask-image': createInlineSvg(pathSvg),
          // "url('path('" + pathSvg + "')')",
          overflow: 'hidden',
          ...propertiesWithBorder,
        },
      });
    },
    cssBorderWrapper: () =>
      domMethods.createCss({
        selector: domMethods.createSelector(wrapperBorder.name),
        properies: {
          position: 'relative', // getPositionProperty(props.parent as HTMLElement),
          'box-sizing': 'border-box',
          'border-width': 0 + ' !important',
        },
      }),
    cssBorder: (pathSvgBorder: string, borderColor: string) =>
      domMethods.createCss({
        selector: domMethods.createSelector(border.name),
        properies: {
          position: 'absolute',
          inset: 0,
          'background-color': borderColor,
          'mask-image': createInlineSvg(pathSvgBorder),
          '-webkit-mask-image': createInlineSvg(pathSvgBorder),
          // 'clip-path': "path('" + pathSvgBorder + "')",
          overflow: 'hidden',
        },
      }),
    cssCloneContent: () =>
      domMethods.createCss({
        selector: domMethods.createSelector(cloneContentElement.name),
        properies: {
          opacity: 0,
        },
      }),
  };

  const createCorner: CreateCorner = (skipCheck?: boolean): void => {
    if (contentElement) {
      const borderOption: BorderOption | undefined = localFigmaSquircleOptions().border;

      // https://stackoverflow.com/questions/32438642/clientwidth-and-clientheight-report-zero-while-getboundingclientrect-is-correct
      const checkEmementSize: Size = domMethods.getSize(
        domMethods.getElement(
          props.id,
          borderOption ? cloneContentElement.name : content.name
        ) as HTMLElement
      ) as Size; // the element being tracked changes size

      if (
        skipCheck ||
        checkEmementSize.height !== oldSizeElment.height ||
        (checkEmementSize.width !== oldSizeElment.width &&
          checkEmementSize.height !== 0 &&
          checkEmementSize.width !== 0)
      ) {
        // the function will be called twice so need to save the value to check if it is necessary to run the content in the function
        oldSizeElment = checkEmementSize;

        if (!borderOption) {
          const pathSvg = createPath({
            ...checkEmementSize,
            ...(localFigmaSquircleOptions() as FigmaSquircleParams),
          });

          // create style tag to head tag
          domMethods.setCssStyle(props.id, [createListCss.cssContent(pathSvg)]);
        } else {
          const pathSvg = createPath({
            // ...sizeElement,
            ...(localFigmaSquircleOptions() as FigmaSquircleParams),
            height: checkEmementSize.height - borderOption.size * 2,
            width: checkEmementSize.width - borderOption.size * 2,
            cornerRadius: Number(localFigmaSquircleOptions().cornerRadius) - borderOption.size,
            ...calculateEachCornerEadius(
              borderOption.size,
              localFigmaSquircleOptions() as FigmaSquircleParams
            ),
          });

          let borderCornerRadius = Number(localFigmaSquircleOptions().cornerRadius);
          // + Number(localFigmaSquircleOptions().border?.size);

          if (borderOption.fitBorderSize) {
            borderCornerRadius =
              borderCornerRadius - fitBorderSize(borderOption.size, borderOption.fitBorderSize);
          }

          const pathSvgBorder = createPath({
            ...checkEmementSize,
            ...(localFigmaSquircleOptions() as FigmaSquircleParams),
            cornerRadius: borderCornerRadius,
          });

          // create style tag to head tag
          domMethods.setCssStyle(props.id, [
            createListCss.cssCloneContent(),
            createListCss.cssContent(pathSvg, checkEmementSize, borderOption),
            createListCss.cssBorderWrapper(),
            createListCss.cssBorder(pathSvgBorder, borderOption.color),
          ]);
        }
      }
    }
  };

  const createResizeObserver = (
    skipCheck?: boolean,
    timeoutCallback?: null | TimeoutCallback,
    callback?: () => void
  ): void => {
    // remove old resizeObserver before create new
    removeObserver();
    // create new

    resizeObserver = new ResizeObserver(() => {
      // createCorner(skipCheck);
      if (timeoutCallback) {
        timeoutCallback(createCorner);
      } else {
        createCorner(skipCheck);
      }
      if (callback) callback();
    });
  };

  // Watch for resizing changes in the DOM and do svgpath regeneration
  const watchDomResize = (skipCheck?: boolean): void => {
    const { reSize, debounce } = props.options;
    // if (props.parent) {
    if (contentElement) {
      if (reSize) {
        if (debounce) {
          createResizeObserver(skipCheck, (callback: CreateCorner) => {
            if (timeoutDebounce) clearTimeout(timeoutDebounce);
            timeoutDebounce = setTimeout(() => {
              callback(skipCheck);
            }, debounce);
          });
        } else {
          createResizeObserver(skipCheck);
        }

        addObserve();
      } else {
        createCorner(skipCheck);
      }
    }
  };

  const addObserve = (): void => {
    /* 
    Needs to get the element directly so it can get its size, but cannot pre-assign to a variable. This only happens when using pre-rendering (SSR), see link below for details

    https://stackoverflow.com/questions/32438642/clientwidth-and-clientheight-report-zero-while-getboundingclientrect-is-correct

    */

    if (domMethods) {
      const el = domMethods.getElement(
        props.id,
        localFigmaSquircleOptions().border ? cloneContentElement.name : content.name
      ) as HTMLElement;

      if (el) {
        resizeObserver?.observe(el);
      }
    }
  };

  // remove watch element
  const removeObserver = (): void => {
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  };

  // call cleanup when component unmout
  const clean = (): void => {
    if (domMethods) {
      const el = domMethods.getElement(props.id);

      if (el) el.remove();
      removeObserver();
    }
  };

  createEffect(
    on(
      localFigmaSquircleOptions,
      () => {
        if (localFigmaSquircleOptions().reSize) {
          watchDomResize(true);
        } else {
          removeObserver();
          createCorner(true);
        }
      },
      { defer: true }
    )
  );

  onMount(() => {
    // Create domMethods with document
    domMethods = new DomMethods(document, props.id);

    requestIdleCallback(() => {
      // This is currently only for the purpose of checking if the content exists or not
      contentElement = domMethods.getElement(props.id, content.name);

      // Create style tag to head tag
      domMethods.setCssStyle(props.id, [createListCss.cssBorderWrapper()]);

      createResizeObserver(true, null, () => {
        if (localFigmaSquircleOptions().reSize) {
          watchDomResize();
        } else {
          removeObserver();
          watchDomResize();
        }

        // if (props.onCallBack) props.onCallBack();
      });

      addObserve();
    });
  });

  onCleanup(() => {
    clean();
  });

  return <></>;
};

export default CornerClient;
