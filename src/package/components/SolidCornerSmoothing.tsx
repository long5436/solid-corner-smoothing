/* eslint-disable prefer-const */
import { createEffect, on, createSignal, onMount, onCleanup } from 'solid-js';
import { Dynamic, Portal } from 'solid-js/web';
import { getSvgPath } from 'figma-squircle';
import { createUUID, createSvg, createSvgPath } from '../utils';
import type { Component, Props, Options, Size, FigmaSquircleParams } from '../type';

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

  const getSize = (): Size => {
    if (componentRef) {
      const s: HTMLElement = componentRef;
      const { width, height }: Size = {
        width: s.clientWidth,
        height: s.clientHeight,
      };
      return { width, height };
    }
    return { width: 0, height: 0 };
  };

  const getSizeIncludeBorder = (): Size => {
    if (componentRef) {
      const s: HTMLElement = componentRef;
      const { width, height }: Size = {
        width: s.clientWidth,
        height: s.clientHeight,
      };

      const borderWidth: number = props.borderWidth || 0;

      return {
        width: width - borderWidth * 2 || 0,
        height: height - borderWidth * 2 || 0,
      };
    }
    return { width: 0, height: 0 };
  };

  const createOnlyPath = (options: FigmaSquircleParams) => {
    const path: string = getSvgPath(options);
    // console.log("rerender");

    return path;
  };

  const setCorner = (pathSvg: string, pathIncludeBorderSvg: string): void => {
    if (componentRef) {
      let styleTag: HTMLElement | null = document.getElementById(randomId);
      const check = !!styleTag;

      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.setAttribute('type', 'text/css');
        styleTag.id = randomId;
      }

      if (props.borderWidth) {
        const svg: SVGSVGElement = createSvg({
          ...getSize(),
          path: pathSvg,
          classname: randomId,
          // fill: getComputedStyle(componentRef).backgroundColor,
          fill: 'tomato',
        });

        const svg2: SVGPathElement = createSvgPath(pathIncludeBorderSvg);

        svg2.setAttribute('transform', `translate(${props.borderWidth},${props.borderWidth})`);
        svg.appendChild(svg2);

        setSvg(svg);

        styleTag.innerHTML = `
        .${props.cornerClass || randomClassname} {
          position: relative;
          background-color: transparent;
        }

        .${randomId} {
          position: absolute;
          inset: 0;
          z-index: -1; 
        }
      `;
      } else {
        const svg: SVGSVGElement = createSvg({
          // height: 100,
          // width: 200,
          ...getSize(),
          path: pathSvg,
          classname: randomId,
          // fill: getComputedStyle(componentRef).backgroundColor,
          fill: 'tomato',
        });
        setSvg(svg);

        styleTag.innerHTML = `
        .${props.cornerClass || randomClassname} {
          position: relative;
          background-color: transparent;
        }

        .${randomId} {
          position: absolute;
          inset: 0;
          z-index: -1;
        }
      `;
      }

      if (!check) {
        document.head.appendChild(styleTag);
      }
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
    // else {
    //   switch (key) {
    //   }
    // }
  };

  const getOptions = (): Options => {
    return { ...getSize(), ...propRefs() } as Options;
  };

  const getOptionsIncludeBorder = (): Options => {
    const cornerRadius: number = propRefs().cornerRadius || 0;
    const borderWidth: number = props.borderWidth || 0;
    const fitBorderWidth: number = props.fitBorderWidth || 0;

    const editProps: { cornerRadius: number } = {
      cornerRadius: cornerRadius - borderWidth + borderWidth / 5 + fitBorderWidth,
    };

    return { ...getSizeIncludeBorder(), ...propRefs(), ...editProps } as Options;
  };

  const renderPathSvg = (): { path: string; pathIncludeBorder: string } => {
    const path: string = createOnlyPath(getOptions() as FigmaSquircleParams);

    // with border
    if (props.borderWidth) {
      const pathIncludeBorder: string = createOnlyPath(
        getOptionsIncludeBorder() as FigmaSquircleParams
      );

      return { path, pathIncludeBorder };
    }

    return { path, pathIncludeBorder: '' };
  };

  const renderCorner = (): void => {
    if (props.reSize) {
      if (props.debounce) {
        resizeObserver = new ResizeObserver(() => {
          if (timeoutDebounce) clearTimeout(timeoutDebounce);

          timeoutDebounce = setTimeout(() => {
            const { path, pathIncludeBorder } = renderPathSvg();
            setCorner(path, pathIncludeBorder);
          }, props.debounce) as unknown as ReturnType<typeof setTimeout>;
        });

        resizeObserver.observe(componentRef as unknown as HTMLElement);
      } else {
        resizeObserver = new ResizeObserver(() => {
          const { path, pathIncludeBorder } = renderPathSvg();
          setCorner(path, pathIncludeBorder);
        });

        resizeObserver.observe(componentRef as unknown as HTMLElement);
      }
    } else {
      const { path, pathIncludeBorder } = renderPathSvg();
      setCorner(path, pathIncludeBorder);
    }
  };

  const clean = (): void => {
    const el: HTMLElement | null = document.getElementById(randomId);

    if (el) el.remove();
    if (resizeObserver) {
      resizeObserver.disconnect();
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
        }
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

  onMount(() => {
    renderCorner();
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
