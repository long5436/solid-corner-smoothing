/* eslint-disable prefer-const */
import { createEffect, on, createSignal, onMount, onCleanup } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import {
  createUUID,
  createSvg,
  createSvgPath,
  createOnlyPath,
  getSize,
  createCssFromPropStyle,
  getPositionProperty,
} from '../utils';
import type {
  Component,
  Props,
  Options,
  FigmaSquircleParams,
  CssStyle,
  StyleProp,
  Size,
} from '../type';

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
  // let mutationObserver: MutationObserver | null = null;
  let timeoutDebounce: ReturnType<typeof setTimeout> | null = null;

  const setCorner = (pathSvg: string, pathIncludeBorderSvg: string): void => {
    if (componentRef) {
      let styleTag: HTMLElement | null = document.getElementById(randomId);
      const check = !!styleTag;
      const resultCssStyle: CssStyle = createCssFromPropStyle(props.style as StyleProp);
      const size: Size = getSize(componentRef);

      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.setAttribute('type', 'text/css');
        styleTag.id = randomId;
      }

      // set corner (css, fill)
      // remove class to get background color
      componentRef.classList.remove(props.cornerClass || randomClassname);

      if (props.borderWidth) {
        const svg: SVGSVGElement = createSvg({
          ...size,
          path: pathSvg,
          classname: randomId,
          fill: props.borderColor || resultCssStyle.color.borderColor,
          attr: 'border',
        });

        const svg2: SVGPathElement = createSvgPath(pathIncludeBorderSvg);

        svg2.setAttribute('transform', `translate(${props.borderWidth},${props.borderWidth})`);
        svg2.setAttribute('fill', props.backgroundColor || resultCssStyle.color.backgroundColor);
        svg2.setAttribute('squircle', 'background');
        svg.appendChild(svg2);

        setSvg(svg);

        styleTag.innerHTML = `
        .${props.cornerClass || randomClassname} {
          position: ${getPositionProperty(componentRef)}; 
          background-color: transparent;
          border-color: transparent;  
          ${resultCssStyle.css.value}  
          border-radius: ${props.cornerRadius}px;
        }

        .${randomId} {
          position: absolute;
          inset: 0;
          z-index: -1; 
        }
      `;
      } else {
        const svg: SVGSVGElement = createSvg({
          ...size,
          path: pathSvg,
          classname: randomId,
          fill: props.backgroundColor || resultCssStyle.color.backgroundColor,
          attr: 'background',
        });
        setSvg(svg);

        styleTag.innerHTML = `
        .${props.cornerClass || randomClassname} {
          position: ${getPositionProperty(componentRef)};
          background-color: transparent;
          ${resultCssStyle.css.value}
          border-radius: ${props.cornerRadius}px;
        }

        .${randomId} {
          position: absolute;
          inset: 0;
          z-index: -1;
        }
      `;
      }

      // re-add class to set background color
      componentRef.classList.add(props.cornerClass || randomClassname);
      // const count: string = componentRef.dataset.count || '';
      // componentRef.setAttribute('data-count', !!count ? Number(count) + 1 : 0);

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
  };

  const getOptions = (border?: boolean): Options => {
    if (border) {
      const cornerRadius: number = propRefs().cornerRadius || 0;
      const borderWidth: number = props.borderWidth || 0;
      const fitBorderWidth: number = props.fitBorderWidth || 0;

      const editProps: { cornerRadius: number } = {
        cornerRadius: cornerRadius - borderWidth + borderWidth / 5 + fitBorderWidth,
      };

      return {
        ...getSize(componentRef as HTMLElement, props.borderWidth),
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

    // if (mutationObserver) {
    //   mutationObserver.disconnect();
    // }
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

  // const watchClassChange = () => {
  //   const prevCount = { value: 0 };
  //   mutationObserver = new MutationObserver(function callback(mutationList: any) {
  //     mutationList.forEach(function (mutation: any) {
  //       if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
  //         // handle class change
  //         if (prevCount.value !== Number(componentRef?.dataset.count)) {
  //           console.log('vo');
  //           prevCount.value = Number(componentRef?.dataset.count);
  //           renderCorner();
  //         }
  //       }
  //     });
  //   });

  //   mutationObserver.observe(componentRef as HTMLElement, {
  //     attributes: true,
  //   });
  // };

  onMount(() => {
    // renderCorner();
    // test
    // watchClassChange();
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
