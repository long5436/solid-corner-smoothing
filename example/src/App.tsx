import SolidCornerSmoothing, { Options } from '../../src/package';
// import { Options } from 'lib';
import { createSignal, type Component } from 'solid-js';
import image from './assets/image.jpg';
import Code from './components/Code';
import Control from './components/Control';
import Nav from './components/Nav';
// import SolidCornerSmoothing from 'C:/Users/Long/Desktop/solid-corner-smoothing/src/package';

const App: Component = () => {
  const [options, setOptions] = createSignal<Options>({
    cornerSmoothing: 0,
  });
  const handleOptions = (data: Options) => {
    // data.cornerRadius = undefined;
    // data.bottomLeftCornerRadius = 12;
    // data.bottomRightCornerRadius = 42;
    // data.topLeftCornerRadius = 24;
    // data.topRightCornerRadius = 12;
    setOptions(data);
  };

  return (
    <>
      <Nav />
      <div class="container">
        <div class="content">
          <div class="item">
            <Control callback={handleOptions} />
            <div>
              <div class="flex">
                <div class="content">
                  <div
                    class="box"
                    style={{
                      'border-radius': options().cornerRadius + 'px',

                      border: options().border
                        ? options().border?.size + 'px solid ' + options().border?.color
                        : 'none',
                    }}
                  >
                    <img src={image} alt="" />
                  </div>
                  <h3>Default radius</h3>
                </div>
                <div class="content">
                  <SolidCornerSmoothing class="box" options={options()}>
                    <img src={image} alt="" />
                  </SolidCornerSmoothing>
                  <h3>Smooth radius</h3>
                </div>
              </div>
              <hr />
              <div class="resize">
                <h3>
                  Resize div (
                  {options().reSize + '' !== 'undefined' ? options().reSize + '' : 'false'})
                </h3>
                <p>
                  This element represents resizing when the window resizes or the element itself
                  resizes
                </p>
                <SolidCornerSmoothing class="box2" options={options()}>
                  <h2>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste quia consequatur
                    maxime magni amet repudiandae iusto inventore facere nostrum provident, hic
                    rerum perspiciatis quibusdam, deserunt tenetur ad cupiditate, eligendi
                    doloribus!
                  </h2>
                </SolidCornerSmoothing>
              </div>
            </div>
          </div>
          <div class="item">
            <Code options={options()} />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
