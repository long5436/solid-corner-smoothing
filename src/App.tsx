import { Component, createSignal } from 'solid-js';
// import SolidCornerSmoothing from "../dist";
import SolidCornerSmoothing from './package';
import './app.css';

const App: Component = () => {
  const [enable, setEnable] = createSignal<boolean>(false);

  return (
    <div>
      <button onClick={() => setEnable(!enable())}>Test</button>
      <SolidCornerSmoothing
        class="box"
        classList={{ test: enable() }}
        cornerRadius={30}
        cornerSmoothing={0.8}
        wrapper="button"
        reSize
        // borderWidth={1}
        // borderColor={'green'}
        // backgroundColor="var(--bg-color)"
        // style={{ 'background-color': 'yellow', 'border-color': 'tomato' }}
        // preserveSmoothing
        cornerClass="box"
        // fixRenderChromium
      >
        This is button
      </SolidCornerSmoothing>
    </div>
  );
};

export default App;
