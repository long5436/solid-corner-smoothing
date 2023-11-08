import { Component, createSignal } from 'solid-js';
import './app.css';
import SolidCornerSmoothing from './package';

const App: Component = () => {
  const [radius, setRadius] = createSignal<number>(40);

  return (
    <div>
      <SolidCornerSmoothing
        class="box"
        src="https://source.unsplash.com/featured/300x201"
        wrapper="img"
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
      <SolidCornerSmoothing
        style={{
          background: 'tan',
          width: '200px',
          height: '200px',
        }}
        options={{
          cornerRadius: radius(),
          cornerSmoothing: 0.8,
          border: {
            size: 10,
            color: 'skyblue',
          },
        }}
      >
        <h1>Hello</h1>
      </SolidCornerSmoothing>
      <input
        type="number"
        value={radius()}
        style={{
          'font-size': '40px',
        }}
        onInput={(e) => setRadius(+e.target.value)}
      />
    </div>
  );
};

export default App;
