import { Component, createSignal } from 'solid-js';
import SolidCornerSmoothing from '../dist';
// import SolidCornerSmoothing from './package';
import './app.css';

const App: Component = () => {
  const [enable, setEnable] = createSignal<boolean>(true);

  return (
    <div>
      <button onClick={(e) => setEnable(!enable())}>Test</button>
      <SolidCornerSmoothing
        class="box"
        classList={{ test: enable() }}
        cornerRadius={30}
        cornerSmoothing={0.8}
        wrapper="button"
        borderWidth={2}
        preserveSmoothing
        fixRenderChromium
      >
        This is button
      </SolidCornerSmoothing>
    </div>
  );
};

export default App;
