# Solid corner smoothoing

This is a component package used to create smooth curved corners for solidJS, if you use react there is a similar package ([https://www.npmjs.com/package/corner-smoothing](https://www.npmjs.com/package/corner-smoothing)). You can use it easily for basic tags or a solid-styled-components.

![demo image](./preview//img1.png)
![demo image](./preview//img2.png)

## Installation

```bash sh
npm install solid-corner-smoothing
pnpm install solid-corner-smoothing
yarn add solid-corner-smoothing
```

## Usage

### Import

```js
import SolidCornerSmoothing from 'solid-corner-smoothing';
```

### Basic

```jsx
const App = () => {
  return (
    <div>
      <SolidCornerSmoothing
        class="box"
        cornerRadius={40}
        cornerSmoothing={0.7}
        reSize
        preserveSmoothing
        debounce={100}
      >
        box
      </SolidCornerSmoothing>
    </div>
  );
};

export default App;
```

![demo image](./preview//img1.png)

### Using with reactivity

you can use react and have to enable 'reSize' prop to be able to change element state according to it

```jsx
const [radius, setRadius] = createSignal(60);
const [smoothing, setSmoothing] = createSignal(0.7);

return (
  <div>
    <SolidCornerSmoothing
      class="box"
      cornerRadius={radius()}
      cornerSmoothing={smoothing()}
      reSize
      preserveSmoothing
      debounce={100}
    >
      This is box
    </SolidCornerSmoothing>
  </div>
);
```

### Wrapper

pass the tag name as a string to the `wrapper` prop that will be used as the root tag

```jsx
return (
  <div>
    <SolidCornerSmoothing 
        class="box" 
        wrapper="form" 
        cornerRadius={60} 
        cornerSmoothing={0.7}
    >
      This is box
    </SolidCornerSmoothing>
  </div>
);
```

### Solid-styled-components

You can also pass a style-components to the wrapper prop to generate the root tag

```jsx
const Btn = styled('button')`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 100px;
  border: none;
`;

return (
  <div>
    <SolidCornerSmoothing
      cornerRadius={30}
      cornerSmoothing={0.8}
      wrapper={Btn}
      backgroundColor="#ddd"
      borderColor="tomato"
      borderWidth={2}
      preserveSmoothing
      fixRenderChromium
    >
      This is button
    </SolidCornerSmoothing>
  </div>
);
```

![demo image](./preview//img2.png)


### Use css with border
You can also use css if you don't use color props, if you don't have border then no css for ::after

```jsx
return (
  <div>
    <SolidCornerSmoothing
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
```

```css
.box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 100px;
  border: none;
  background-color: tomato;
}

.box::after {
  background-color: #ddd;
}


```

## Props

| Prop name               | Type value             | Description                                                                                                                                                      |
| ----------------------- | :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| wrapper                 | string, Styled Element | Root tag (default is `div`), can also be a `solid-styled-components`                                                                                             |
| cornerRadius            | number                 | Similar to the CSS property border-radius.                                                                                                                       |
| topLeftCornerRadius     | number                 | Radius each corner                                                                                                                                               |
| topRightCornerRadius    | number                 | Radius each corner                                                                                                                                               |
| bottomRightCornerRadius | number                 | Radius each corner                                                                                                                                               |
| bottomLeftCornerRadius  | number                 | Radius each corner                                                                                                                                               |
| cornerSmoothing         | number                 | The degree of corner smoothing as a number in the range 0–1. 0 is equivalent to no smoothing and looks like normal border-radius. 1 indicates maximal smoothing. |
| preserveSmoothing       | boolean                | Allow corner smoothing to work better on large rounded corners.                                                                                                  |
| reSize                  | boolean                | Allows resizing and corners, (disabled by default to improve performance, can be used with the `deboune` prop)                                                   |
| borderWidth             | number                 | When this prop has a value, it will turn into border mode (need to change the css according to the instructions or use prop `borderColor` and `backgroundColor`) |
| borderColor             | string                 | Border color (can still use css if not using this prop)                                                                                                          |
| backgroundColor         | string                 | Background color (can still use css if not using this prop)                                                                                                      |
| cornerClass             | string                 | Use class name for element (class name will be auto generated by default)                                                                                        |
| debounce                | number                 | (improved performance) delay the re-rendering of corners when doing a resize, radius and smoothing. (This prop only works when it comes with the `reSize` prop)  |
| fitBorderWidth          | number                 | Add custom angle width parameter to fix visual effects                                                                                                           |
| fixRenderChromium       | boolean                | fix rendering of incorrect angles on chromium browser                                                                                                            |
