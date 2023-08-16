import { Accessor, Component, For, splitProps } from 'solid-js';
import { Size } from '../type';

type DefaultOptions = {
  fill: string;
};

export type OptionsSvg = {
  squircle?: string;
};

interface Props {
  // width: number;
  // height: number;
  size: Size;
  fill?: string;
  //   squircle?: string;
  svgPaths: string[];
  class: string;
  options: OptionsSvg;
}

const defaultOptions: DefaultOptions = {
  fill: 'currentColor',
};

const CornerSvg: Component<Props> = (props) => {
  const [local, others] = splitProps(props, ['svgPaths', 'fill', 'size', 'options']);

  return (
    <svg
      //   xmlns="http://www.w3.org/2000/svg"
      // width={props.width}
      // height={props.height}
      fill={local.fill || defaultOptions.fill}
      //   squircle={props.attr || ''}
      {...local.size}
      {...others}
    >
      <For each={local.svgPaths}>
        {(path: string, index: Accessor<number>) => {
          const value: string =
            local.svgPaths.length === 1 ? 'background' : index() === 1 ? 'background' : 'border';

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return <path d={path} squircle={value} />;
        }}
      </For>
    </svg>
  );
};

export default CornerSvg;
