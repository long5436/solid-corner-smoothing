import type { Options } from 'lib';
import { Component, createEffect, createSignal } from 'solid-js';

interface Props {
  callback: (op: Options) => void;
}

const Control: Component<Props> = (props) => {
  const [border, setBorder] = createSignal<boolean>(true);
  const [borderWidth, setBorderWidth] = createSignal<number>(10);
  const [borderColor, setBorderColor] = createSignal<string>('#f6b73c');
  const [radius, setRadius] = createSignal<number>(40);
  const [cornerSmoothing, setCornerSmoothing] = createSignal<number>(0.8);
  const [reSize, setResize] = createSignal<boolean>(true);
  const [debounce, setDebounce] = createSignal<boolean>(false);
  const [debounceTime, setDebounceTime] = createSignal<number>(100);

  const [options, setOptions] = createSignal<Options>({
    cornerSmoothing: 0,
  });

  createEffect(() => {
    const op: Options = {
      cornerSmoothing: cornerSmoothing(),
      cornerRadius: radius(),
      // reSize: reSize(),
      // debounce: debounceTime(),
      // border: {
      //   size: borderWidth(),
      //   color: borderColor(),
      // },
    };

    if (debounce()) {
      op.debounce = debounceTime();
    }

    if (border()) {
      op.border = {
        size: borderWidth(),
        color: borderColor(),
      };
    }

    if (reSize()) {
      op.reSize = reSize();
    }

    setOptions(op);

    if (!!props.callback) {
      props.callback(options());
    }
  });

  return (
    <div class="control">
      <table class="table">
        <tbody>
          <tr>
            <td>
              Radius (0-100): <span class="current-value">({radius()})</span>
            </td>
            <td>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={radius()}
                onInput={(e) => setRadius(Number(e.target.value))}
              />
            </td>
          </tr>
          <tr>
            <td>
              cornerSmoothing (0-1):{' '}
              <span class="current-value">({cornerSmoothing()})</span>
            </td>
            <td>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={cornerSmoothing()}
                onInput={(e) => setCornerSmoothing(Number(e.target.value))}
              />
            </td>
          </tr>
          <tr>
            <td>Border: </td>
            <td>
              <label>
                <input
                  type="checkbox"
                  checked={border()}
                  onInput={(e) => setBorder(e.target.checked)}
                />
                <span></span>
              </label>
            </td>
          </tr>
          <tr>
            <td classList={{ diabled: !border() }}>
              Border Size (0-20):{' '}
              <span class="current-value">({borderWidth()})</span>
            </td>
            <td>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                disabled={!border()}
                value={borderWidth()}
                onInput={(e) => setBorderWidth(Number(e.target.value))}
              />
            </td>
          </tr>

          <tr>
            <td classList={{ diabled: !border() }}>
              Border Color: <span class="current-value">({borderColor()})</span>
            </td>
            <td>
              <input
                type="color"
                value="#f6b73c"
                disabled={!border()}
                onInput={(e) => setBorderColor(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>ReSize:</td>
            <td>
              <label>
                <input
                  type="checkbox"
                  checked={reSize()}
                  onInput={(e) => setResize(e.target.checked)}
                />
                <span></span>
              </label>
            </td>
          </tr>

          <tr>
            <td>Debounce:</td>
            <td>
              <label>
                <input
                  type="checkbox"
                  checked={debounce()}
                  onInput={(e) => setDebounce(e.target.checked)}
                />
                <span></span>
              </label>
            </td>
          </tr>

          <tr>
            <td classList={{ diabled: !debounce() }}>
              Debounce Timeout (0-1000):{' '}
              <span class="current-value">({debounceTime()}ms)</span>
            </td>
            <td>
              <input
                type="range"
                min="0"
                max="1000"
                step="1"
                disabled={!debounce()}
                value={debounceTime()}
                onInput={(e) => setDebounceTime(Number(e.target.value))}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        (Only some basic options are demoed here, see docs for full options at{' '}
        <a
          class="link-document"
          href="https://www.npmjs.com/package/solid-corner-smoothing"
        >
          Document)
        </a>
      </p>
    </div>
  );
};

export default Control;
