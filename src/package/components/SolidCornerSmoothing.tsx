import {
  Component,
  JSX,
  JSXElement,
  Show,
  children,
  createResource,
  createSignal,
  splitProps,
} from 'solid-js';
import { Dynamic, isServer } from 'solid-js/web';
import { CSS, Options } from '../type';
import { attrs } from '../utils/domAttr';
import { createRandomId } from '../utils/generalMethods';
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
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

const SolidCornerSmoothing: Component<Props> = (props) => {
  const [isClient, setIsClient] = createSignal<boolean>(false);
  // const [id] = createSignal<string>(createRandomId());
  const [id] = createResource<string>(() => createRandomId());
  const { wrapperBorder, border, cloneContentElement, content } = attrs;
  const resolved = children(() => props.children);
  const resolvedClone = children(() => props.children);

  // onMount(() => {
  //   if (!isClient()) {
  //     setIsClient(true);
  //   }
  // });

  const ContentComponent: Component<Props & PropsContent> = (props) => {
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
        class={localProps?.class}
        // classList={localProps?.classList}
        component={localProps?.wrapper || componentDefault}
        {...otherProps}
        {...{ [localProps?.clone ? cloneContentElement.name : content.name]: id() }}
        style={styles()}
      >
        <Show when={localProps?.clone} fallback={resolvedClone()}>
          {resolved()}
        </Show>
        <Show when={!isServer}>
          <CornerClient
            options={localProps.options}
            id={id() as string}
            onCallBack={() => {
              setIsClient(true);
            }}
          />
        </Show>
      </Dynamic>
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
        <ContentComponent {...props} />
      )}
    </>
  );
};

export default SolidCornerSmoothing;
