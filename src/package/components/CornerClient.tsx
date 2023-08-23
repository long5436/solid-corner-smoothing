import { Component, Show, createEffect, createSignal, on, onCleanup, onMount } from 'solid-js';
import {
  BorderOption,
  CSS,
  CreateCorner,
  FigmaSquircleParams,
  Options,
  Props,
  Size,
  TimeoutCallback,
} from '../type';
import { attrs } from '../utils/domAttr';
import { createCss, getElementStyle, getSize, setCssStyle } from '../utils/domMethods';
import { calculateEachCornerEadius, createPath, fitBorderSize } from '../utils/svgPathMethods';

const CornerClient: Component<Props> = (props) => {
  const [localFigmaSquircleOptions, setLocalFigmaSquircleOptions] = createSignal<Options>({});

  // eslint-disable-next-line prefer-const
  let resizeObserver: ResizeObserver | null = null;
  // eslint-disable-next-line prefer-const
  let timeoutDebounce: ReturnType<typeof setTimeout> | null = null;
  // eslint-disable-next-line prefer-const
  let oldSizeElment: Size = { width: 0, height: 0 };

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
      }

      if (props.options?.backgroundColor) {
        propertiesWithBorder['background-color'] = props.options?.backgroundColor;
      }

      return createCss({
        selector: '[' + attrs.content.name + '="' + props.randomId + '"]',
        properies: {
          // 'border-radius': localFigmaSquircleOptions().cornerRadius + 'px',
          'clip-path': "path('" + pathSvg + "')",
          overflow: 'hidden',
          // 'background-color': borderOption?.color,
          // border: localFigmaSquircleOptions().border?.size + 'px solid transparent',
          // padding: localFigmaSquircleOptions()?.border?.size + 'px',
          ...propertiesWithBorder,
        },
      });
    },
    cssBorderWrapper: () =>
      createCss({
        selector: '[' + attrs.wrapperBorder.name + '="' + props.randomId + '"]',
        properies: {
          position: 'relative', // getPositionProperty(props.parent as HTMLElement),
          // padding: localFigmaSquircleOptions()?.border?.size + 'px',
          'box-sizing': 'border-box',
        },
      }),
    cssBorder: (pathSvgBorder: string, borderColor: string) =>
      createCss({
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
      createCss({
        selector: '[' + attrs.CloneContentement.name + '="' + props.randomId + '"]',
        properies: {
          // position: 'absolute',
          opacity: 0,
          // inset: 0,
        },
      }),
  };

  const createCorner: CreateCorner = (skipCheck?: boolean): void => {
    if (props.parent) {
      // const sizeElement: Size = getSize(props.parent);
      const borderOption: BorderOption | undefined = props.options?.border;
      const checkEmement: Size = getSize(borderOption ? props.parentClone : props.parent); // the element being tracked changes size

      if (
        skipCheck ||
        checkEmement.height !== oldSizeElment.height ||
        checkEmement.width !== oldSizeElment.width
      ) {
        // the function will be called twice so need to save the value to check if it is necessary to run the content in the function
        oldSizeElment = checkEmement;

        if (!borderOption) {
          const pathSvg = createPath({
            ...checkEmement,
            ...(localFigmaSquircleOptions() as FigmaSquircleParams),
          });

          // create style tag to head tag
          setCssStyle(props.randomId, [createListCss.cssContent(pathSvg)]);
        } else {
          const pathSvg = createPath({
            // ...sizeElement,
            ...(localFigmaSquircleOptions() as FigmaSquircleParams),
            height: checkEmement.height - borderOption.size * 2,
            width: checkEmement.width - borderOption.size * 2,
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
            ...checkEmement,
            ...(localFigmaSquircleOptions() as FigmaSquircleParams),
            cornerRadius: borderCornerRadius,
          });

          // create style tag to head tag
          setCssStyle(props.randomId, [
            createListCss.cssCloneContent(),
            createListCss.cssContent(pathSvg, checkEmement, borderOption),
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

    if (props.parent) {
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
        resizeObserver?.observe(props.options?.border ? props.parentClone : props.parent);
      } else {
        createCorner(skipCheck);
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
    const el = getElementStyle(props.randomId);

    if (el) el.remove();
    removeObserver();
  };

  createEffect(() => {
    setLocalFigmaSquircleOptions({
      ...props.options,
      preserveSmoothing: props.options?.preserveSmoothing || true,
    });
  });

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
    // create attr unique id
    // props.parent.dataset.solidCornerContent = attrId;

    // create style tag to head tag
    setCssStyle(props.randomId, [createListCss.cssBorderWrapper()]);

    // resizeObserver = new ResizeObserver(() => {
    //   createCorner();
    //   removeObserver();

    //   if (props.options?.reSize) {
    //     watchDomResize();
    //   }
    // });

    createResizeObserver(true, null, () => {
      // removeObserver();

      if (props.options?.reSize) {
        watchDomResize();
      }
    });

    resizeObserver?.observe(props.options?.border ? props.parentClone : props.parent);
  });

  onCleanup(() => {
    clean();
  });

  return (
    <>
      <Show when={!!localFigmaSquircleOptions().border}>
        <span {...{ [attrs.border.name]: props.randomId }} />
      </Show>
    </>
  );
};

export default CornerClient;
