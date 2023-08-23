import { Component, JSXElement, Show, createSignal, onMount, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { Options } from '../type';
import { attrs } from '../utils/domAttr';
import { createUUID } from '../utils/generalMethods';
import CornerClient from './CornerClient';

interface Props {
  children?: JSXElement;
  wrapper?: Component | string;
  class?: string;
  options: Options;
  classList?: {
    [key: string]: boolean;
  };
}

const SolidCornerSmoothing: Component<Props> = (props) => {
  const componentDefault = 'div';
  const [isClient, setIsClient] = createSignal<boolean>(false);
  const [parentRef, setParentRef] = createSignal<HTMLElement>();
  const [parentCloneRef, setParentCloneRef] = createSignal<HTMLElement>();
  const [local, other] = splitProps(props, ['children', 'wrapper', 'class']);
  const randomId: string = createUUID();
  // eslint-disable-next-line prefer-const
  let componentRef: HTMLElement | null = null;
  // eslint-disable-next-line prefer-const
  let componentCloneRef: HTMLElement | null = null;

  onMount(() => {
    setParentRef(componentRef as unknown as HTMLElement);
    if (!isClient()) setIsClient(true);
  });

  const ContentComponent = () => {
    onMount(() => {
      setParentRef(componentRef as unknown as HTMLElement);
      setParentCloneRef(componentCloneRef as unknown as HTMLElement);
    });
    return (
      <>
        <Show when={isClient()}>
          <CornerClient
            {...other}
            parent={parentRef() as HTMLElement}
            parentClone={parentCloneRef() as HTMLElement}
            randomId={randomId}
          />
        </Show>
        <Show when={props.options?.border}>
          <div
            ref={componentCloneRef as unknown as HTMLDivElement}
            class={props.class}
            classList={props.classList}
            {...{ [attrs.CloneContentement.name]: randomId }}
          >
            {local.children}
          </div>
        </Show>
        <Dynamic
          // classList={{ /*[props.class as any]: !!props.class,*/ [randomId]: true }}
          class={props.class}
          classList={props.classList}
          ref={componentRef as unknown as HTMLDivElement}
          component={local.wrapper || componentDefault}
          {...{ [attrs.content.name]: randomId }}
        >
          {local.children}
        </Dynamic>
      </>
    );
  };

  return (
    <Show when={props?.options?.border} fallback={<ContentComponent />}>
      <div {...{ [attrs.wrapperBorder.name]: randomId }}>
        <ContentComponent />
      </div>
    </Show>
  );
};

export default SolidCornerSmoothing;
