/* eslint-disable prefer-const */
import { Show, createSignal, onMount } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import type { Component, Props } from '../type';
import { createUUID } from '../utils';
import CornerClient from './CornerClient';

const SolidCornerSmoothing: Component<Props> = (props) => {
  const componentDefault = 'div';
  const randomClassname: string = /* 'corner' +*/ createUUID();
  const borderClassname: string = createUUID();
  const [parentRef, setParentRef] = createSignal<HTMLElement>();
  const [isClient, setIsClient] = createSignal<boolean>(false);

  // refs
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  let componentRef: HTMLElement | null = null;

  onMount(() => {
    setParentRef(componentRef as HTMLElement);
    if (!isClient()) setIsClient(true);

    // console.log(isClient(), componentRef);
    console.clear();

    if (props.borderWidth) {
      console.log(borderClassname);
    }
  });

  return (
    <div classList={{ [borderClassname]: !!props.borderWidth }}>
      <Dynamic
        component={props.wrapper || componentDefault}
        class={props.class}
        classList={{ [randomClassname]: !props.cornerClass, ...props.classList }}
        ref={componentRef}
      >
        {props.children || <></>}
        <Show when={isClient()}>
          <CornerClient {...props} parentRef={parentRef() as HTMLElement} />
        </Show>
      </Dynamic>
    </div>
  );
};

export default SolidCornerSmoothing;
