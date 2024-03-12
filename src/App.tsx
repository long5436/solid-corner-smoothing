import { Component, createSignal } from 'solid-js';
import './app.css';
import SolidCornerSmoothing from './package';

const App: Component = () => {
  const [radius, setRadius] = createSignal<number>(40);

  return (
    <div>
      <SolidCornerSmoothing
        class="box"
        src="https://images.squarespace-cdn.com/content/v1/527b0fb8e4b05821d4d1961d/e121938e-5d78-4719-9bf8-a8e109c1a2be/03F499C4-930A-4B26-BB26-CB1722425426.jpg"
        wrapper="img"
        options={{
          cornerRadius: 40,
          cornerSmoothing: 0.8,
          // border: {
          // size: 10,
          // color: 'skyblue',
          // },
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
