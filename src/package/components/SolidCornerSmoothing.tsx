import {
  Component,
  JSX,
  JSXElement,
  Show,
  children,
  createResource,
  createSignal,
  onMount,
  splitProps,
} from 'solid-js';
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

const SolidCornerSmoothing: Component<Props> = (props) => {
  const [isClient, setIsClient] = createSignal<boolean>(false);
  // const [id] = createSignal<string>(createUUID());
  const [id] = createResource<string>(() => createUUID());
  const { wrapperBorder, border, cloneContentElement, content } = attrs;
  const resolved = children(() => props.children);

  onMount(() => {
    if (!isClient()) {
      setIsClient(true);
    }
  });

  const DynamicContent: Component<Props> = (props) => {
    const [localProps, otherProps] = splitProps(props, [
      'clone',
      'wrapper',
      'options',
      'children',
      'style',
      'class',
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
          border ? (result.border = border?.size + 'px solid ' + border?.color) : '';
        }
      }

      return result;
    };

    return (
      <Dynamic
        class={props?.class}
        classList={props?.classList}
        component={props?.wrapper || componentDefault}
        {...otherProps}
        {...{ [props?.clone ? cloneContentElement.name : content.name]: id() }}
        style={styles()}
      >
        {resolved()}
        <Show when={isClient()}>
          <CornerClient options={localProps.options} id={id() as string} />
        </Show>
      </Dynamic>
    );
  };

  const ContentComponent: Component<Props & PropsContent> = (props) => {
    return (
      <>
        <DynamicContent {...props} />
      </>
    );
  };

  return (
    <>
      {props.options?.border ? (
        <div {...{ [wrapperBorder.name]: id() }}>
          <span {...{ [border.name]: id() }} />
          <ContentComponent {...props} clone={true} />
          <ContentComponent {...props} />
        </div>
      ) : (
        <>
          <ContentComponent {...props} />
        </>
      )}
    </>
  );
};

export default SolidCornerSmoothing;
