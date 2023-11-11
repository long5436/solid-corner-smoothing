import { Component, children } from 'solid-js';
import { Props } from '../type';

const WrapperCorner: Component<Props> = (props) => {
  //   const [local, other] = splitProps(props, [
  //     'children',
  //     'class',
  //     'classList',
  //     'id',
  //     'options',
  //     'wrapper',
  //   ]);

  const resolved = children(() => props.children);

  return <div>{resolved()}</div>;
};

export default WrapperCorner;
