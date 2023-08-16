import { Component, Show, createEffect, createSignal } from 'solid-js';
import { FigmaSquircleParams, Options, Props, Size } from '../type';
import {
  createCss,
  createOnlyPath,
  createUUID,
  getElementStyle,
  getPositionProperty,
  getSize,
  setCssStyle,
} from '../utils';

const CornerClient: Component<Props> = (props) => {
  const [localFigmaSquircleOptions, setLocalFigmaSquircleOptions] = createSignal<Options>({
    cornerSmoothing: 0,
    width: 0,
    height: 0,
  });
  const randomId: string = createUUID();
  const classBorder: string = createUUID();
  const classBorderContent: string = createUUID();
  const classCloneContent: string = createUUID();

  let resizeObserver: ResizeObserver | null = null;
  let timeoutDebounce: ReturnType<typeof setTimeout> | null = null;

  createEffect(() => {
    setLocalFigmaSquircleOptions({
      ...props.options,
      preserveSmoothing: props.options?.preserveSmoothing || true,
    });

    if (props.options?.reSize) {
      watchDomResize();
    } else {
      clean();
      createCorner();
    }
  });

  const createCorner = (): void => {
    if (props.parent) {
      const sizeElement: Size = getSize(props.parent);

      if (!props.options?.border) {
        const pathSvg = createOnlyPath({
          ...sizeElement,
          ...(localFigmaSquircleOptions() as FigmaSquircleParams),
        });

        // create style tag to head tag
        setCssStyle(props.arrayClasses.contentClass, [
          createCss({
            class: props.arrayClasses.contentClass,
            properies: {
              'border-radius': localFigmaSquircleOptions().cornerRadius + 'px',
              'clip-path': "path('" + pathSvg + "')",
              overflow: 'hidden',
            },
          }),
        ]);
      } else {
        // This check is a must for border use case otherwise width size will be incorrect on first render
        if (!getElementStyle(props.arrayClasses.contentClass)) {
          sizeElement.width -= props.options.border.size * 2;
        }

        const pathSvg = createOnlyPath({
          ...sizeElement,
          ...(localFigmaSquircleOptions() as FigmaSquircleParams),
        });

        const sizeElementWithBorder: Size = {
          width: sizeElement.width + props.options.border.size * 2,
          height: sizeElement.height + props.options.border.size * 2,
        };

        // copy localFigmaSquircleOptions so the old value is not overwritten
        const localFigmaSquircleOptionsWithBorder = Object.assign({}, localFigmaSquircleOptions());
        localFigmaSquircleOptionsWithBorder.cornerRadius =
          Number(localFigmaSquircleOptions().cornerRadius) +
          Number(localFigmaSquircleOptions().border?.size);

        const pathSvgBorder = createOnlyPath({
          ...sizeElementWithBorder,
          ...(localFigmaSquircleOptionsWithBorder as FigmaSquircleParams),
        });

        // create style tag to head tag
        setCssStyle(props.arrayClasses.contentClass, [
          createCss({
            class: props.arrayClasses.contentClass,
            properies: {
              'border-radius': localFigmaSquircleOptions().cornerRadius + 'px',
              'clip-path': "path('" + pathSvg + "')",
              overflow: 'hidden',
            },
          }),
          createCss({
            class: props.arrayClasses.borderClass,
            properies: {
              position: getPositionProperty(props.parent as HTMLElement),
              // | undefined,
              // padding: props.options.border.width + 'px',
              // height:
              //   'calc(' + sizeElement.height + 'px + ' + props.options.border.size * 2 + 'px)',
              // width: 'calc(' + sizeElement.width + 'px + ' + props.options.border.size * 2 + 'px)',
              // display: 'flex',
              // 'align-items': 'center',
              // 'justify-content': 'center',
              padding: props.options.border.size + 'px',
              'box-sizing': 'border-box',
            },
          }),
          createCss({
            class: classBorder,
            properies: {
              position: 'absolute',
              inset: 0,
              'background-color': props.options.border.color,
              'clip-path': "path('" + pathSvgBorder + "')",
              overflow: 'hidden',
            },
          }),
        ]);
      }
    }
  };

  // Watch for resizing changes in the DOM and do svgpath regeneration
  const watchDomResize = (): void => {
    if (props.parent) {
      if (props.options?.reSize) {
        console.log('vao');
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
        resizeObserver.observe(props.parent as unknown as HTMLElement);
      } else {
        createCorner();
      }
    }
  };

  // call cleanup when component unmout
  const clean = (): void => {
    const el = getElementStyle(props.arrayClasses.contentClass);

    if (el) el.remove();
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  };

  return (
    <>
      <Show when={!!localFigmaSquircleOptions().border}>
        {/* <div class={props.arrayClasses.contentClass + ' ' + classCloneContent}> </div> */}
        <span class={classBorder}>{/* <span class={classBorderContent}></span> */}</span>
      </Show>
    </>
  );
};

export default CornerClient;
