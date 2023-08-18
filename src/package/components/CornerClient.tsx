import { Component, Show, createEffect, createSignal, on, onCleanup, onMount } from 'solid-js';
import { FigmaSquircleParams, Options, Props, Size } from '../type';
import { attrs } from '../utils/domAttr';
import {
  createCss,
  getElementStyle,
  getPositionProperty,
  getSize,
  setCssStyle,
} from '../utils/domMethods';
import { createOnlyPath, fitBorderSize } from '../utils/svgPathMethods';

const CornerClient: Component<Props> = (props) => {
  const [localFigmaSquircleOptions, setLocalFigmaSquircleOptions] = createSignal<Options>({
    cornerSmoothing: 1,
  });

  // const attrId = props.arrayClasses.contentClass.split(' ')[0];

  let resizeObserver: ResizeObserver | null = null;
  let timeoutDebounce: ReturnType<typeof setTimeout> | null = null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, prefer-const
  const oldSizeElment: Size = { width: 0, height: 0 };

  const createListCss = {
    cssContent: (pathSvg: string) =>
      createCss({
        selector: '[' + attrs.content.name + '="' + props.arrayClasses.contentClass + '"]',
        properies: {
          // 'border-radius': localFigmaSquircleOptions().cornerRadius + 'px',
          'clip-path': "path('" + pathSvg + "')",
          overflow: 'hidden',
          'background-color': localFigmaSquircleOptions()?.backgroundColor,
        },
      }),
    cssBorderWrapper: () =>
      createCss({
        selector: '[' + attrs.wrapperBorder.name + '="' + props.arrayClasses.contentClass + '"]',
        properies: {
          position: getPositionProperty(props.parent as HTMLElement),
          padding: localFigmaSquircleOptions()?.border?.size + 'px',
          'box-sizing': 'border-box',
        },
      }),
    cssBorder: (pathSvgBorder: string) =>
      createCss({
        selector: '[' + attrs.border.name + '="' + props.arrayClasses.contentClass + '"]',
        properies: {
          position: 'absolute',
          inset: 0,
          'background-color': localFigmaSquircleOptions()?.border?.color,
          'clip-path': "path('" + pathSvgBorder + "')",
          overflow: 'hidden',
        },
      }),
  };

  const createCorner = (): void => {
    if (props.parent) {
      const sizeElement: Size = getSize(props.parent);

      if (
        sizeElement.height !== oldSizeElment.height ||
        sizeElement.width !== oldSizeElment.width
      ) {
        oldSizeElment.height = sizeElement.height;
        oldSizeElment.width = sizeElement.width;
        // console.log(sizeElement, oldSizeElment);
        // console.log('create');

        if (!props.options?.border) {
          const pathSvg = createOnlyPath({
            ...sizeElement,
            ...(localFigmaSquircleOptions() as FigmaSquircleParams),
          });

          // create style tag to head tag
          setCssStyle(props.arrayClasses.contentClass, [createListCss.cssContent(pathSvg)]);
        } else {
          const pathSvg = createOnlyPath({
            ...sizeElement,
            ...(localFigmaSquircleOptions() as FigmaSquircleParams),
          });

          const sizeElementWithBorder: Size = {
            width: sizeElement.width + props.options.border.size * 2,
            height: sizeElement.height + props.options.border.size * 2,
          };

          // copy localFigmaSquircleOptions so the old value is not overwritten
          const localFigmaSquircleOptionsWithBorder = Object.assign(
            {},
            localFigmaSquircleOptions()
          );
          localFigmaSquircleOptionsWithBorder.cornerRadius =
            Number(localFigmaSquircleOptions().cornerRadius) +
            Number(localFigmaSquircleOptions().border?.size);

          if (props.options?.border?.fitBorderSize) {
            localFigmaSquircleOptionsWithBorder.cornerRadius =
              localFigmaSquircleOptionsWithBorder.cornerRadius -
              fitBorderSize(props.options?.border?.size, props.options?.border?.fitBorderSize);
          }

          const pathSvgBorder = createOnlyPath({
            ...sizeElementWithBorder,
            ...(localFigmaSquircleOptionsWithBorder as FigmaSquircleParams),
          });

          // create style tag to head tag
          setCssStyle(props.arrayClasses.contentClass, [
            createListCss.cssContent(pathSvg),
            createListCss.cssBorderWrapper(),
            createListCss.cssBorder(pathSvgBorder),
          ]);
        }
      }
    }
  };

  // Watch for resizing changes in the DOM and do svgpath regeneration
  const watchDomResize = (): void => {
    if (props.parent) {
      if (props.options?.reSize) {
        if (props.options?.debounce) {
          resizeObserver = new ResizeObserver(() => {
            if (timeoutDebounce) clearTimeout(timeoutDebounce);

            timeoutDebounce = setTimeout(() => {
              createCorner();
            }, props.options?.debounce) as unknown as ReturnType<typeof setTimeout>;
          });
        } else {
          resizeObserver = new ResizeObserver(() => {
            createCorner();
          });
        }
        resizeObserver.observe(props.parent);
      } else {
        createCorner();
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
    const el = getElementStyle(props.arrayClasses.contentClass);

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
          watchDomResize();
        } else {
          removeObserver();
          createCorner();
        }
      },
      { defer: true }
    )
  );

  onMount(() => {
    // create attr unique id
    // props.parent.dataset.solidCornerContent = attrId;

    // create style tag to head tag
    setCssStyle(props.arrayClasses.contentClass, [createListCss.cssBorderWrapper()]);

    resizeObserver = new ResizeObserver(() => {
      createCorner();
      removeObserver();

      if (props.options?.reSize) {
        watchDomResize();
      }
    });
    resizeObserver.observe(props.parent);
  });

  onCleanup(() => {
    clean();
  });

  return (
    <>
      <Show when={!!localFigmaSquircleOptions().border}>
        <span {...{ [attrs.border.name]: props.arrayClasses.contentClass }} />
      </Show>
    </>
  );
};

export default CornerClient;
