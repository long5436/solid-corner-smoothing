import { Component, JSXElement, Show, createSignal, onMount, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { Options } from '../type';
import { attrs } from '../utils/domAttr';
import { createUUID } from '../utils/generalMethods';
import CornerClient from './CornerClient';

interface Props {
  children?: JSXElement;
  class?: string;
  classList?: { [k: string]: boolean };
  wrapper?: Component | string;
  options: Options;
  [other: string]: any;
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

  onMount(() => {
    if (!isClient()) {
      setIsClient(true);
    }
  });

  const ContentComponent: Component<Props & PropsContent> = (props) => {
    const [localProps, otherProps] = splitProps(props, ['clone', 'wrapper', 'options', 'children']);

    return (
      <Dynamic
        // class={props?.class}
        // classList={props?.classList}
        {...otherProps}
        component={localProps?.wrapper || componentDefault}
        {...{ [props?.clone ? attrs.cloneContentElement.name : attrs.content.name]: randomId() }}
        style={
          !isClient()
            ? localProps?.clone
              ? {
                  position: 'absolute',
                  opacity: 0,
                }
              : {
                  'border-radius': localProps.options?.cornerRadius + 'px',
                  border:
                    localProps?.options?.border?.size +
                    'px solid ' +
                    localProps?.options?.border?.color,
                }
            : {}
        }
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
        <Dynamic component="div" {...{ [attrs.wrapperBorder.name]: randomId() }}>
          <Dynamic component="span" {...{ [attrs.border.name]: isClient() ? randomId() : '' }} />
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
