import { Component, createEffect, createMemo, on, onCleanup, onMount } from 'solid-js';
import {
  BorderOption,
  CSS,
  CreateCorner,
  FigmaSquircleParams,
  Props,
  Size,
  TimeoutCallback,
} from '../type';
import { attrs } from '../utils/domAttr';
// import { container, createCss, getElement, getSize, setCssStyle } from '../utils/domMethods';
import DomMethods from '../utils/domMethods';
import { calculateEachCornerEadius, createPath, fitBorderSize } from '../utils/svgPathMethods';
const { wrapperBorder, border, cloneContentElement, content } = attrs;

const CornerClient: Component<Props> = (props) => {
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
      const propertiesWithBorder: CSS.PropertiesHyphen = {};

      if (borderOption && elementCloneSize) {
        propertiesWithBorder.position = 'absolute';
        propertiesWithBorder.top = 0;
        propertiesWithBorder.height = elementCloneSize.height - borderOption.size * 2 + 'px';
        propertiesWithBorder.width = elementCloneSize.width - borderOption.size * 2 + 'px';
        propertiesWithBorder.transform =
          'translate(' + borderOption?.size + 'px,' + borderOption?.size + 'px)';
        // propertiesWithBorder['border-radius'] = 'unset !important';
        // propertiesWithBorder.border = 'unset !important';
      }

      if (props.options?.backgroundColor) {
        propertiesWithBorder['background-color'] = props.options?.backgroundColor;
      }

      return domMethods?.createCss({
        selector: '[' + content.name + '="' + props.id + '"]',
        properies: {
          'clip-path': "path('" + pathSvg + "')",
          overflow: 'hidden',
          ...propertiesWithBorder,
        },
      });
    },
    cssBorderWrapper: () =>
      domMethods?.createCss({
        selector: '[' + wrapperBorder.name + '="' + props.id + '"]',
        properies: {
          position: 'relative', // getPositionProperty(props.parent as HTMLElement),
          'box-sizing': 'border-box',
          'border-width': 0 + ' !important',
        },
      }),
    cssBorder: (pathSvgBorder: string, borderColor: string) =>
      domMethods?.createCss({
        selector: '[' + border.name + '="' + props.id + '"]',
        properies: {
          position: 'absolute',
          inset: 0,
          'background-color': borderColor,
          'clip-path': "path('" + pathSvgBorder + "')",
          overflow: 'hidden',
        },
      }),
    cssCloneContent: () =>
      domMethods?.createCss({
        selector: '[' + cloneContentElement.name + '="' + props.id + '"]',
        properies: {
          opacity: 0,
        },
      }),
  };

  const createCorner: CreateCorner = (skipCheck?: boolean): void => {
    if (contentElement) {
      const borderOption: BorderOption | undefined = props.options?.border;

      // https://stackoverflow.com/questions/32438642/clientwidth-and-clientheight-report-zero-while-getboundingclientrect-is-correct
      const checkEmementSize: Size = domMethods?.getSize(
        domMethods?.getElement(
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
          domMethods?.setCssStyle(props.id, [createListCss.cssContent(pathSvg)]);
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

          if (borderOption?.fitBorderSize) {
            borderCornerRadius =
              borderCornerRadius - fitBorderSize(borderOption.size, borderOption?.fitBorderSize);
          }

          const pathSvgBorder = createPath({
            ...checkEmementSize,
            ...(localFigmaSquircleOptions() as FigmaSquircleParams),
            cornerRadius: borderCornerRadius,
          });

          // create style tag to head tag
          domMethods?.setCssStyle(props.id, [
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
    // if (props.parent) {
    //   if (props.options?.reSize) {
    //     if (props.options?.debounce) {
    //       resizeObserver = new ResizeObserver(() => {
    //         if (timeoutDebounce) clearTimeout(timeoutDebounce);

    //         timeoutDebounce = setTimeout(() => {
    //           createCorner(skipCheck);
    //         }, props.options?.debounce) as unknown as ReturnType<typeof setTimeout>;
    //       });
    //     } else {
    //       resizeObserver = new ResizeObserver(() => {
    //         createCorner(skipCheck);
    //       });
    //     }
    //     resizeObserver.observe(props.options?.border ? props.parentClone : props.parent);
    //   } else {
    //     createCorner(skipCheck);
    //   }
    // }

    // if (props.parent) {
    if (contentElement) {
      if (props.options?.reSize) {
        if (props.options?.debounce) {
          createResizeObserver(skipCheck, (callback: CreateCorner) => {
            if (timeoutDebounce) clearTimeout(timeoutDebounce);
            timeoutDebounce = setTimeout(() => {
              callback(skipCheck);
            }, props.options?.debounce);
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

    const el = domMethods?.getElement(
      props.id,
      props.options?.border ? cloneContentElement.name : content.name
    ) as HTMLElement;

    if (el) {
      resizeObserver?.observe(el);
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
    const el = domMethods?.getElement(props.id);

    if (el) el.remove();
    removeObserver();
  };

  // createEffect(() => {
  //   const newObj = Object.assign(props.options);

  //   console.log({ newObj });

  //   setLocalFigmaSquircleOptions({
  //     ...newObj,
  //     preserveSmoothing: props.options?.preserveSmoothing || true,
  //   });
  // });

  createEffect(
    on(
      localFigmaSquircleOptions,
      () => {
        if (props.options?.reSize) {
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
    domMethods = new DomMethods(document);

    requestIdleCallback(() => {
      // This is currently only for the purpose of checking if the content exists or not
      contentElement = domMethods.getElement(props.id, content.name);

      // Create style tag to head tag
      domMethods.setCssStyle(props.id, [createListCss.cssBorderWrapper()]);

      createResizeObserver(true, null, () => {
        if (props.options?.reSize) {
          watchDomResize();
        } else {
          removeObserver();
          watchDomResize();
        }
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
