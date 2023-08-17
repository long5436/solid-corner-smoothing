import { Component, createSignal } from 'solid-js';
// import SolidCornerSmoothing from "../dist/server";
import './app.css';
import Soundcloud from './assets/Danleech-Simple-Soundcloud.1024.png';
import SolidCornerSmoothing from './package';

const App: Component = () => {
  const [enable, setEnable] = createSignal<boolean>(false);
  const [borderW, setBorderW] = createSignal<number>(10);

  return (
    <div>
      <button onClick={() => setEnable(!enable())} style={{ 'margin-bottom': '10px' }}>
        Test
      </button>
      <label>
        border width:
        <input type="number" value={borderW()} onInput={(e: any) => setBorderW(e.target.value)} />
      </label>
      <SolidCornerSmoothing
        class="icon icon1"
        classList={{ test: enable() }}
        options={{
          cornerSmoothing: 1,
          cornerRadius: 60,
          reSize: true,
        }}
        // cornerRadius={60}
        // cornerSmoothing={0.8}
        // wrapper="form"
        // reSize
        // debounce={200}
        // borderWidth={borderW()}
        // borderColor={'green'}
        // backgroundColor="var(--bg-color)"
        // preserveSmoothing
        // cornerClass="box"
      >
        <img src={Soundcloud} />
      </SolidCornerSmoothing>
      <br />
      <SolidCornerSmoothing
        class="box"
        classList={{ test: enable() }}
        options={{
          cornerSmoothing: 1,
          cornerRadius: 60,
          // reSize: true,
          border: {
            size: borderW(),
            color: 'gold',
          },
        }}
        // cornerRadius={55}
        // cornerSmoothing={1}
        // wrapper="form"
        // reSize
        // debounce={200}
        // borderWidth={borderW()}
        // borderColor={'green'}
        // backgroundColor="var(--bg-color)"
        // preserveSmoothing
        // cornerClass="box"
      >
        <img src={Soundcloud} alt="" />
      </SolidCornerSmoothing>

      <br />
      <div class="boxtest">
        <img src={Soundcloud} alt="" />
      </div>
    </div>
  );
};

export default App;
