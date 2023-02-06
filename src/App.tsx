import { Component, createSignal } from 'solid-js';
// import SolidCornerSmoothing from "../dist";
import SolidCornerSmoothing from './package';
import './app.css';

const App: Component = () => {
  const [enable, setEnable] = createSignal<boolean>(false);
  const [borderW, setBorderW] = createSignal<number>(1);

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
        class="box"
        classList={{ test: enable() }}
        cornerRadius={25}
        cornerSmoothing={0.8}
        // wrapper="form"
        reSize
        // debounce={200}
        borderWidth={borderW()}
        // borderColor={'green'}
        // backgroundColor="var(--bg-color)"
        preserveSmoothing
        // cornerClass="box"
      >
        This is button
      </SolidCornerSmoothing>
    </div>
  );
};

export default App;
