/* eslint-disable prefer-const */
import { createEffect, on, createSignal, onCleanup, onMount } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import {
  createUUID,
  createSvg,
  createSvgPath,
  createOnlyPath,
  getSize,
  getPositionProperty,
  computedBorderSize,
  setCssStyle,
} from '../utils';
import type { Component, Props, Options, FigmaSquircleParams, Size } from '../type';

const SolidCornerSmoothing: Component<Props> = (props) => {
  const [propRefs, setPropRefs] = createSignal<Props>({});
  const [svg, setSvg] = createSignal<SVGSVGElement>();
  const componentDefault = 'div';
  const randomId: string = 'id' + createUUID();
  const randomClassname: string = 'corner' + createUUID();
  const regex =
    /cornerRadius|cornerSmoothing|topLeftCornerRadius|topRightCornerRadius|bottomRightCornerRadius|bottomLeftCornerRadius|preserveSmoothing/;
  const keyReRenderCorner = /wrapper|borderWidth|borderColor|backgroundColor/;

  // refs
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  let componentRef: HTMLElement | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let timeoutDebounce: ReturnType<typeof setTimeout> | null = null;

  const setCorner = (pathSvg: string, pathIncludeBorderSvg: string): void => {
    if (componentRef) {
      const size: Size = getSize(componentRef); // width and height of the component

      // set corner (css, fill)
      // remove class to get background color
      componentRef.classList.remove(props.cornerClass || randomClassname);

      if (props.borderWidth) {
        const pathBorder: SVGSVGElement = createSvg({
          ...size,
          path: pathSvg,
          classname: randomId,
          fill: props.borderColor || 'currentColor',
          attr: 'border',
        });

        const pathBackground: SVGPathElement = createSvgPath(pathIncludeBorderSvg);
        const fitBorderSize: number = computedBorderSize(props.borderWidth);

        pathBackground.setAttribute('transform', `translate(${fitBorderSize},${fitBorderSize})`);
        pathBackground.setAttribute('fill', props.backgroundColor || 'currentColor');
        pathBackground.setAttribute('squircle', 'background');
        pathBorder.appendChild(pathBackground);

        setSvg(pathBorder);

        setCssStyle(randomId, () => {
          return `
          .${props.cornerClass || randomClassname} {
            position: ${getPositionProperty(componentRef as HTMLElement)}; 
            background-color: transparent;
            border-color: transparent;  
            border-radius: ${props.cornerRadius}px;
          }
  
          .${randomId} {
            position: absolute;
            inset: 0;
            z-index: -1; 
          }
        `;
        });
      } else {
        setSvg(
          createSvg({
            ...size,
            path: pathSvg,
            classname: randomId,
            fill: props.backgroundColor || 'currentColor',
            attr: 'background',
          })
        );

        setCssStyle(randomId, () => {
          return `
        .${props.cornerClass || randomClassname} {
          position: ${getPositionProperty(componentRef as HTMLElement)};
          background-color: transparent;
          border-radius: ${props.cornerRadius}px;
        }

        .${randomId} {
          position: absolute;
          inset: 0;
          z-index: -1;
        }
      `;
        });
      }

      // re-add class to set background color
      componentRef.classList.add(props.cornerClass || randomClassname);
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
      const borderWidth: number = props.borderWidth ? computedBorderSize(props.borderWidth) : 0;
      const fitBorderWidth: number = props.fitBorderWidth || 0;

      const editProps: { cornerRadius: number } = {
        cornerRadius: cornerRadius - borderWidth + borderWidth / 10 + fitBorderWidth,
      };

      return {
        ...getSize(componentRef as HTMLElement, borderWidth),
        ...propRefs(),
        ...editProps,
      } as Options;
    }

    return { ...getSize(componentRef as HTMLElement), ...propRefs() } as Options;
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
      resizeObserver.observe(componentRef as unknown as HTMLElement);
    } else {
      callRenderCorner();
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
  });

  onCleanup(() => {
    clean();
    if (timeoutDebounce) clearTimeout(timeoutDebounce);
  });

  return (
    <Dynamic
      component={props.wrapper || componentDefault}
      class={props.class}
      classList={{ [randomClassname]: !props.cornerClass, ...props.classList }}
      ref={componentRef}
    >
      {props.children || <></>}
      {svg()}
    </Dynamic>
  );
};

export default SolidCornerSmoothing;
