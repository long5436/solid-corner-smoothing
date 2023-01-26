## Installation

```bash sh
npm install solid-corner-smoothing
pnpm install solid-corner-smoothing
yarn add solid-corner-smoothing
```

## Usage

```jsx
import SolidCornerSmoothing from 'solid-corner-smoothing';
import './app.css';

const App = () => {
  return (
    <div>
      <SolidCornerSmoothing
        class="box"
        cornerRadius={40}
        cornerSmoothing={0.7}
        reSize
        debounce={100}
      >
        box
      </SolidCornerSmoothing>
    </div>
  );
};

export default App;
```
