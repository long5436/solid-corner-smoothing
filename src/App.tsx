import { Component } from 'solid-js';
import SolidCornerSmoothing from '../dist';
import './app.css';

const App: Component = () => {
  return (
    <div>
      <SolidCornerSmoothing
        class="box"
        cornerRadius={40}
        cornerSmoothing={0.7}
        reSize
        debounce={100}
      >
        dsdsdfsdf
      </SolidCornerSmoothing>
    </div>
  );
};

export default App;
