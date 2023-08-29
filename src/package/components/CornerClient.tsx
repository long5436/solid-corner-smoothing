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
  let domMethods: DomMethods | null = null;

  const localFigmaSquircleOptions = createMemo(() => {
    const obj = props.options;
    // obj.preserveSmoothing = props.options?.preserveSmoothing || true;
    return obj;
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
        selector: '[' + attrs.content.name + '="' + props.randomId + '"]',
        properies: {
          'clip-path': "path('" + pathSvg + "')",
          overflow: 'hidden',
          ...propertiesWithBorder,
        },
      });
    },
    cssBorderWrapper: () =>
      domMethods?.createCss({
        selector: '[' + attrs.wrapperBorder.name + '="' + props.randomId + '"]',
        properies: {
          position: 'relative', // getPositionProperty(props.parent as HTMLElement),
          'box-sizing': 'border-box',
          'border-width': 0 + ' !important',
        },
      }),
    cssBorder: (pathSvgBorder: string, borderColor: string) =>
      domMethods?.createCss({
        selector: '[' + attrs.border.name + '="' + props.randomId + '"]',
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
        selector: '[' + attrs.cloneContentElement.name + '="' + props.randomId + '"]',
        properies: {
          opacity: 0,
        },
      }),
  };

  const createCorner: CreateCorner = (skipCheck?: boolean): void => {
    console.log(props.randomId);
    if (contentElement) {
      const borderOption: BorderOption | undefined = props.options?.border;

      // https://stackoverflow.com/questions/32438642/clientwidth-and-clientheight-report-zero-while-getboundingclientrect-is-correct
      const checkEmementSize: Size = domMethods?.getSize(
        domMethods?.getElement(
          props.randomId,
          borderOption ? attrs.cloneContentElement.name : attrs.content.name
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
          domMethods?.setCssStyle(props.randomId, [createListCss.cssContent(pathSvg)]);
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
          domMethods?.setCssStyle(props.randomId, [
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
      console.log('da vao daay');

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
      props.randomId,
      props.options?.border ? attrs.cloneContentElement.name : attrs.content.name
    ) as HTMLElement;

    // if (!el) {
    //   el = (
    //     props.options?.border ? props.componentRefs.contentClone : props.componentRefs.content
    //   ) as HTMLElement;
    // }

    console.log({ el });
    // console.log(props.componentRefs);

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
    const el = domMethods?.getElement(props.randomId);

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

  createEffect(() => {
    console.log({ props });
  });

  onMount(() => {
    // Create domMethods with document
    domMethods = new DomMethods(document);

    // This is currently only for the purpose of checking if the content exists or not
    contentElement = domMethods.getElement(props.randomId, attrs.content.name);

    // Create style tag to head tag
    domMethods.setCssStyle(props.randomId, [createListCss.cssBorderWrapper()]);

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

  onCleanup(() => {
    clean();
  });

  return <></>;
};

export default CornerClient;
