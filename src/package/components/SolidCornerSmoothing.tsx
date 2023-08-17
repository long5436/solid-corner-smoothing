import { Component, JSXElement, Show, createSignal, onMount, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { Options } from '../type';
import { createUUID } from '../utils';
import CornerClient from './CornerClient';

interface Props {
  children?: JSXElement;
  wrapper?: Component | string;
  class?: string;
  options: Options;
}

const SolidCornerSmoothing: Component<Props> = (props) => {
  const componentDefault = 'div';
  const [isClient, setIsClient] = createSignal<boolean>(false);
  const [parentRef, setParentRef] = createSignal<HTMLElement>();
  const [local, other] = splitProps(props, ['children', 'wrapper', 'class']);
  const arrayClasses = {
    contentClass: /* local?.class || */ createUUID(),
    borderClass: createUUID(),
  };
  // eslint-disable-next-line prefer-const
  let componentRef: HTMLElement | null = null;
  // eslint-disable-next-line prefer-const
  let componentWrapperBorderRef: HTMLElement | null = null;

  // createEffect(() => {
  //   setOptionsProps(other.options);
  // });

  onMount(() => {
    setParentRef(componentRef as unknown as HTMLElement);
    if (componentWrapperBorderRef) {
      componentWrapperBorderRef.dataset.solidCornerWrapperBorder = arrayClasses.contentClass;
    }
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
        <div
          // classList={{ /*[props.class as any]: !!props.class,*/ [arrayClasses.contentClass]: true }}
          class={props.class}
          //  classList={props.classList}
          ref={componentRef as unknown as HTMLDivElement}
        >
          {local.children}
        </div>
      </>
    );
  };

  return (
    <Show when={props?.options?.border} fallback={<ContentComponent />}>
      <Dynamic
        classList={
          {
            // [arrayClasses.borderClass]: props?.options?.border,
            // [local?.class || '']: !props?.options?.border,
            // [arrayClasses.contentClass]: !props?.options?.border,
          }
        }
        component={local.wrapper || componentDefault}
        ref={componentWrapperBorderRef}
      >
        <ContentComponent />
      </Dynamic>
    </Show>
  );
};

export default SolidCornerSmoothing;
