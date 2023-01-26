import { Component, createSignal } from 'solid-js';
import SolidCornerSmoothing from '../dist';
import './app.css';

const App: Component = () => {
  const [radius, setRadius] = createSignal(60);
  const [smoothing, setSmoothing] = createSignal(0.7);

  return (
    <div>
      <SolidCornerSmoothing
        class="box"
        cornerRadius={30}
        cornerSmoothing={0.8}
        wrapper='button'
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
