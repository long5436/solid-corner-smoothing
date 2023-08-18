import { Component, JSXElement, Show, createSignal, onMount, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { Options } from '../type';
import { attrs } from '../utils/domAttr';
import { createUUID } from '../utils/svgPathMethods';
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
  const [local, other] = splitProps(props, ['children', 'wrapper', 'class']);
  const arrayClasses = {
    contentClass: createUUID(),
    // borderClass: createUUID(),
  };
  // eslint-disable-next-line prefer-const
  let componentRef: HTMLElement | null = null;

  onMount(() => {
    setParentRef(componentRef as unknown as HTMLElement);
    if (!isClient()) setIsClient(true);
  });

  const ContentComponent = () => {
    return (
      <>
        <Show when={isClient()}>
          <CornerClient
            {...other}
            parent={parentRef() as HTMLElement}
            arrayClasses={arrayClasses}
          />
        </Show>
        <Dynamic
          // classList={{ /*[props.class as any]: !!props.class,*/ [arrayClasses.contentClass]: true }}
          class={props.class}
          classList={props.classList}
          ref={componentRef as unknown as HTMLDivElement}
          component={local.wrapper || componentDefault}
          {...{ [attrs.content.name]: arrayClasses.contentClass }}
        >
          {local.children}
        </Dynamic>
      </>
    );
  };

  return (
    <Show when={props?.options?.border} fallback={<ContentComponent />}>
      <div {...{ [attrs.wrapperBorder.name]: arrayClasses.contentClass }}>
        <ContentComponent />
      </div>
    </Show>
  );
};

export default SolidCornerSmoothing;
