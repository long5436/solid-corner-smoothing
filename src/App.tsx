import { Component, createSignal } from 'solid-js';
// import SolidCornerSmoothing from "../dist/server";
import './app.css';
import Soundcloud from './assets/Danleech-Simple-Soundcloud.1024.png';
import SolidCornerSmoothing from './package';

const App: Component = () => {
  const [enable, setEnable] = createSignal<boolean>(false);
  const [borderW, setBorderW] = createSignal<number>(10);
  const [show, setShow] = createSignal<boolean>(true);

  return (
    <div>
      <button onClick={() => setEnable(!enable())} style={{ 'margin-bottom': '10px' }}>
        Test
      </button>
      <button onClick={() => setShow(!show())}>Hide</button>
      <label>
        border width:
        <input type="number" value={borderW()} onInput={(e: any) => setBorderW(e.target.value)} />
      </label>

      <br />
      <SolidCornerSmoothing
        class="box"
        classList={{ test: enable() }}
        wrapper={'form'}
        options={{
          cornerSmoothing: 1,
          // cornerRadius: 60,
          topLeftCornerRadius: 50,
          topRightCornerRadius: 40,
          bottomRightCornerRadius: 30,
          bottomLeftCornerRadius: 10,
          reSize: true,
          debounce: 100,
        }}
      >
        <img src={Soundcloud} alt="" />
      </SolidCornerSmoothing>

      <br />
      {show() && (
        <SolidCornerSmoothing
          class="boxtest"
          options={{
            cornerSmoothing: 1,
            cornerRadius: 60,
            // reSize: true,
            border: {
              size: borderW(),
              color: enable() ? 'pink' : 'gold',
            },
            // backgroundColor: 'pink',
          }}
        ></SolidCornerSmoothing>
      )}
    </div>
  );
};

export default App;
