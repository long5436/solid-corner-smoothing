import { Component, JSXElement, createSignal, onMount } from 'solid-js';
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
    return (
      <Dynamic
        // ref={(props?.clone ? componentRefs.contentClone : componentRefs.content) as HTMLElement}
        class={props?.class}
        classList={props?.classList}
        component={props?.wrapper || componentDefault}
        {...{ [props?.clone ? attrs.cloneContentElement.name : attrs.content.name]: randomId() }}
        style={
          !isClient()
            ? props?.clone
              ? {
                  position: 'absolute',
                  opacity: 0,
                }
              : {
                  'border-radius': props.options?.cornerRadius + 'px',
                  border:
                    props?.options?.border?.size + 'px solid ' + props?.options?.border?.color,
                }
            : {}
        }
      >
        {props.children}
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
          <CornerClient
            options={props?.options}
            randomId={randomId()}
            // componentRefs={componentRefs}
          />
        </Dynamic>
      ) : (
        <>
          <ContentComponent {...props} />
          <CornerClient
            options={props?.options}
            randomId={randomId()}
            // componentRefs={componentRefs}
          />
        </>
      )}
    </>
  );
};

export default SolidCornerSmoothing;
