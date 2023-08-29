import { Component } from 'solid-js';
import './app.css';
import SolidCornerSmoothing from './package';

const App: Component = () => {
  return (
    <div>
      <SolidCornerSmoothing
        class="box"
        options={{
          cornerRadius: 40,
          cornerSmoothing: 0.8,
          border: {
            size: 10,
            color: 'skyblue',
          },
        }}
      >
        <h1>Hello</h1>
      </SolidCornerSmoothing>
    </div>
  );
};

export default App;
