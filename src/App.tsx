import { Component, createSignal } from 'solid-js';
// import SolidCornerSmoothing from "../dist/server";
import Package from '../dist/server';
import './app.css';
import SolidCornerSmoothing from './package';

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
        // cornerSmoothing={0.8}
        // wrapper="form"
        reSize
        // debounce={200}
        borderWidth={borderW()}
        borderColor={'green'}
        // backgroundColor="var(--bg-color)"
        preserveSmoothing
        // cornerClass="box"
      >
        This is button
      </SolidCornerSmoothing>
      <Package
        class="box"
        classList={{ test: enable() }}
        cornerRadius={25}
        // cornerSmoothing={0.8}
        // wrapper="form"
        // reSize
        // debounce={200}
        borderWidth={borderW()}
        borderColor={'green'}
        // backgroundColor="var(--bg-color)"
        preserveSmoothing
        // cornerClass="box"
      >
        This is button
      </Package>
    </div>
  );
};

export default App;
