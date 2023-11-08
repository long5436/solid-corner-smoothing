import { Component, JSX, JSXElement, Show, createSignal, onMount, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { CSS, Options } from '../type';
import { attrs } from '../utils/domAttr';
import { createUUID } from '../utils/generalMethods';
import CornerClient from './CornerClient';

interface Props {
  children?: JSXElement;
  class?: string;
  classList?: { [k: string]: boolean };
  wrapper?: Component | string;
  options: Options;
  style?: JSX.CSSProperties;
  [other: string]: unknown;
}

interface PropsContent {
  clone?: boolean;
}

const componentDefault = 'div';
// const componentRefs: ComponentRefs = {
//   content: null,
//   contentClone: null,
// };
// const randomId = createUUID();

const SolidCornerSmoothing: Component<Props> = (props) => {
  const [isClient, setIsClient] = createSignal<boolean>(false);
  const [randomId] = createSignal<string>(createUUID());
  const { wrapperBorder, border, cloneContentElement, content } = attrs;

  onMount(() => {
    if (!isClient()) {
      setIsClient(true);
    }
  });

  const ContentComponent: Component<Props & PropsContent> = (props) => {
    const [localProps, otherProps] = splitProps(props, [
      'clone',
      'wrapper',
      'options',
      'children',
      'style',
    ]);

    // create styles inline for SSR
    const styles = (): CSS.PropertiesHyphen => {
      const { options, style } = localProps;
      const { cornerRadius, border } = options;

      const result: CSS.PropertiesHyphen = { ...(style || {}) };

      if (!isClient()) {
        if (localProps?.clone) {
          result.position = 'absolute';
          result.opacity = 0;
        } else {
          result['border-radius'] = cornerRadius + 'px';
          result.border = border?.size + 'px solid ' + border?.color;
        }
      }

      // delete result.height;
      // delete result.width;

      return result;
    };

    // const styles = createMemo<CSS.PropertiesHyphen>(() => {
    //   const { options } = localProps;
    //   const { cornerRadius, border } = options;

    //   if (!isClient()) {
    //     const result: CSS.PropertiesHyphen = {};
    //     if (localProps?.clone) {
    //       result.position = 'absolute';
    //       result.opacity = 0;
    //     } else {
    //       result['border-radius'] = cornerRadius + 'px';
    //       result.border = border?.size + 'px solid ' + border?.color;
    //     }

    //     return { ...result, ...localProps?.style };
    //   } else {
    //     return localProps?.style || {};
    //   }
    // });

    return (
      <Dynamic
        // class={props?.class}
        // classList={props?.classList}
        component={localProps?.wrapper || componentDefault}
        {...otherProps}
        {...{ [props?.clone ? cloneContentElement.name : content.name]: randomId() }}
        style={styles()}
      >
        {localProps.children}
        <Show when={!localProps?.clone}>
          <CornerClient options={localProps?.options} randomId={randomId()} />
        </Show>
      </Dynamic>
    );
  };

  return (
    <>
      {props.options?.border ? (
        <Dynamic component="div" {...{ [wrapperBorder.name]: randomId() }}>
          <Dynamic component="span" {...{ [border.name]: isClient() ? randomId() : '' }} />
          <ContentComponent {...props} clone={true} />
          <ContentComponent {...props} />
        </Dynamic>
      ) : (
        <>
          <ContentComponent {...props} />
        </>
      )}
    </>
  );
};

export default SolidCornerSmoothing;
