import { getSvgPath } from 'figma-squircle';
import type {
  OptionsCreateSVG,
  FigmaSquircleParams,
  Size,
  StyleProp,
  CssStyle,
  Color,
} from '../type';
const defaultLength = 5;

export const createUUID = (length?: number): string => {
  return crypto
    .randomUUID()
    .replaceAll('-', '')
    .substring(0, length || defaultLength);
};

export const createSvgPath = (path: string): SVGPathElement => {
  const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  if (path) {
    pathElement.setAttribute('d', path);
  }

  return pathElement;
};

export const createSvg = (options: OptionsCreateSVG): SVGSVGElement => {
  const squircle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  squircle.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  squircle.setAttribute('width', options.width as unknown as string);
  squircle.setAttribute('height', options.height as unknown as string);
  squircle.classList.add(options.classname);

  // test
  // const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
  // clipPath.setAttribute('clipPathUnits', 'objectBoundingBox');
  // squircle.appendChild(clipPath);
  // squircle.setAttribute('viewBox', '0 0 10 20');

  //
  if (options.path) {
    const pathElement = createSvgPath(options.path);
    if (options.fill) {
      pathElement.setAttribute('fill', options.fill);
    } else {
      pathElement.setAttribute('fill', 'currentColor');
    }

    if (options.attr) {
      pathElement.setAttribute('squircle', options.attr);
    }

    squircle.appendChild(pathElement);
  }

  return squircle;
};

export const createOnlyPath = (options: FigmaSquircleParams) => {
  const path: string = getSvgPath(options);
  return path;
};

export const getSize = (element: HTMLElement, borderWidth?: number): Size => {
  if (element) {
    const { width, height }: Size = {
      width: element.clientWidth,
      height: element.clientHeight,
    };

    const resultBorderWidth: number = borderWidth ? borderWidth * 2 : 0;

    return { width: width - resultBorderWidth, height: height - resultBorderWidth };
  }
  return { width: 0, height: 0 };
};

export const createCssFromPropStyle = (data: StyleProp): CssStyle => {
  const css: { value: string } = { value: '' };
  const color: Color = {
    backgroundColor: '',
    borderColor: '',
  };
  for (const key in data) {
    if (/background-color|background/.test(key)) {
      color.backgroundColor = data[key] as string;
    } else if (/border-color/.test(key)) {
      color.borderColor = data[key] as string;
    } else css.value += `${key}: ${data[key]};`;
  }
  return { css, color };
};

export const getPositionProperty = (element: HTMLElement): string => {
  const currentPosition: string = getComputedStyle(element).position;

  return currentPosition === 'static' ? 'relative' : currentPosition;
};
