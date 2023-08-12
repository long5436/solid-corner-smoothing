import {
  Component,
  createEffect,
  createSignal,
  on,
  onCleanup,
  onMount,
} from 'solid-js';
import { FigmaSquircleParams, Options, Props, Size } from '../type';
import {
  createCss,
  createOnlyPath,
  createSvgPath,
  createUUID,
  getPositionProperty,
  getSize,
  setCssStyle,
} from '../utils';
import CornerSvg, { OptionsSvg } from './CornerSvg';

interface PropsCornerClient {
  class?: string;
  classList?: {
    [key: string]: boolean;
  };
  wrapper?: Component | string;
  cornerRadius?: number;
  cornerSmoothing?: number;
  topLeftCornerRadius?: number;
  topRightCornerRadius?: number;
  bottomRightCornerRadius?: number;
  bottomLeftCornerRadius?: number;
  preserveSmoothing?: boolean;
  borderWidth?: number;
  borderColor?: string;
  backgroundColor?: string;
  reSize?: boolean;
  cornerClass?: string;
  debounce?: number;
  fitBorderWidth?: number;
  parentRef: HTMLElement | null;
}

const CornerClient: Component<PropsCornerClient> = (props) => {
  const [propRefs, setPropRefs] = createSignal<Props>({});

  const randomId: string = 'id' + createUUID();
  const randomClassname: string = 'corner' + createUUID();
  const regex =
    /cornerRadius|cornerSmoothing|topLeftCornerRadius|topRightCornerRadius|bottomRightCornerRadius|bottomLeftCornerRadius|preserveSmoothing/;
  const keyReRenderCorner =
    /wrapper|borderWidth|borderColor|backgroundColor|reSize/;

  // refs
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  let resizeObserver: ResizeObserver | null = null;
  let timeoutDebounce: ReturnType<typeof setTimeout> | null = null;

  //  moi
  const [svgPathValue, setSvgpathValue] = createSignal<string[]>([]);
  const [fill, setFill] = createSignal<string | undefined>('');
  const [size, setSize] = createSignal<Size>({ height: 0, width: 0 });
  const [options, setOptions] = createSignal<OptionsSvg>({});

  const setCorner = (pathSvg: string, pathIncludeBorderSvg: string): void => {
    if (props.parentRef) {
      const size: Size = getSize(props.parentRef); // width and height of the component

      props.parentRef.classList.remove(props.cornerClass || randomClassname);

      if (props.borderWidth) {
        const transform = `translate(${props.borderWidth},${props.borderWidth})`;

        const pathBackground: string = createSvgPath(
          pathIncludeBorderSvg,
          transform
        );

        setFill(props.borderColor);
        setSize(size);
        setSvgpathValue([pathSvg, pathBackground]);
        setOptions({ squircle: 'border' });

        setCssStyle(
          randomId,
          createCss({
            class: props.cornerClass || randomClassname,
            properies: {
              position: getPositionProperty(props.parentRef as HTMLElement),
              'background-color': 'transparent',
              'border-color': 'transparent',
              'border-radius': props.cornerRadius + 'px',
            },
          }) +
            createCss({
              class: randomId,
              properies: {
                position: 'absolute',
                inset: 0,
                'z-index': -1,
              },
            })
        );
      } else {
        setFill(props.backgroundColor || '');
        setSize(size);
        setSvgpathValue([pathSvg]);
        setOptions({ squircle: 'background' });

        setCssStyle(
          randomId,
          createCss({
            class: props.cornerClass || randomClassname,
            properies: {
              position: getPositionProperty(props.parentRef as HTMLElement),
              'background-color': 'transparent',
              'border-radius': props.cornerRadius + 'px',
            },
          }) +
            createCss({
              class: randomId,
              properies: {
                position: 'absolute',
                inset: 0,
                'z-index': -1,
              },
            })
        );

        //   setCssStyle(randomId, () => {
        //     return `
        //   .${props.cornerClass || randomClassname} {
        //     position: ${getPositionProperty(componentRef as HTMLElement)};
        //     background-color: transparent;
        //     border-radius: ${props.cornerRadius}px;
        //   }

        //   .${randomId} {
        //     position: absolute;
        //     inset: 0;
        //     z-index: -1;
        //   }
        // `;
        //   });
      }

      // re-add class to set background color
      props.parentRef.classList.add(props.cornerClass || randomClassname);
    }
  };

  const changeValueProps = ({
    key,
    value,
  }: {
    [key: string]: number | boolean | string | symbol;
  }): void => {
    if (regex.test(key as string)) {
      setPropRefs({ ...propRefs(), [key as string]: value });
    }
  };

  const getOptions = (border?: boolean): Options => {
    if (border) {
      const cornerRadius: number = propRefs().cornerRadius || 0;
      const borderWidth: number = props.borderWidth ? props.borderWidth : 0;
      const fitBorderWidth: number = props.fitBorderWidth || 0;

      const editProps: { cornerRadius: number } = {
        cornerRadius:
          cornerRadius - borderWidth + borderWidth / 5 + fitBorderWidth,
      };

      return {
        ...getSize(props.parentRef as HTMLElement, borderWidth),
        ...propRefs(),
        ...editProps,
      } as Options;
    }

    return {
      ...getSize(props.parentRef as HTMLElement),
      ...propRefs(),
    } as Options;
  };

  const renderPathSvg = (): { path: string; pathIncludeBorder: string } => {
    const path: string = createOnlyPath(getOptions() as FigmaSquircleParams);

    // with border
    if (props.borderWidth) {
      const pathIncludeBorder: string = createOnlyPath(
        getOptions(true /*include border*/) as FigmaSquircleParams
      );

      return { path, pathIncludeBorder };
    }

    return { path, pathIncludeBorder: '' };
  };

  const callRenderCorner = (): void => {
    const { path, pathIncludeBorder } = renderPathSvg();
    setCorner(path, pathIncludeBorder);
  };

  const renderCorner = (): void => {
    if (props.parentRef) {
      if (props.reSize) {
        if (props.debounce) {
          resizeObserver = new ResizeObserver(() => {
            if (timeoutDebounce) clearTimeout(timeoutDebounce);

            timeoutDebounce = setTimeout(() => {
              callRenderCorner();
            }, props.debounce) as unknown as ReturnType<typeof setTimeout>;
          });
        } else {
          resizeObserver = new ResizeObserver(() => {
            callRenderCorner();
          });
        }
        resizeObserver.observe(props.parentRef as unknown as HTMLElement);
      } else {
        callRenderCorner();
      }
    }
  };

  for (const key in props) {
    createEffect(
      on(
        () => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore;
          return { key, value: props[key] };
        },
        (obj: { key: string; value: number | string | boolean }) => {
          changeValueProps(obj);
          if (keyReRenderCorner.test(obj.key)) {
            renderCorner();
          }
        },
        { defer: true }
      )
    );
  }

  createEffect(
    on(
      propRefs,
      () => {
        if (props.reSize) {
          if (props.debounce) {
            if (timeoutDebounce) clearTimeout(timeoutDebounce);

            timeoutDebounce = setTimeout(() => {
              renderCorner();
            }, props.debounce);
          } else {
            renderCorner();
          }
        }
      },
      { defer: true }
    )
  );

  // call cleanup
  const clean = (): void => {
    const el: HTMLElement | null = document.getElementById(randomId);

    if (el) el.remove();
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  };

  onMount(() => {
    setPropRefs({ ...props });
    const rendered = { value: false };

    for (const key in props) {
      if (keyReRenderCorner.test(key)) {
        rendered.value = true;
        break;
      }
    }

    if (!props.reSize) {
      callRenderCorner();
    }

    !rendered.value && callRenderCorner();
  });

  onCleanup(() => {
    clean();
    if (timeoutDebounce) clearTimeout(timeoutDebounce);
  });

  return (
    <>
      <CornerSvg
        class={randomId}
        size={size()}
        svgPaths={svgPathValue()}
        options={options()}
      />
    </>
  );
};

export default CornerClient;
