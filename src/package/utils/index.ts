import { getSvgPath } from 'figma-squircle';
import type { OptionsCreateSVG, FigmaSquircleParams, Size } from '../type';

const defaultLength = 5; // length of uuid string

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

export const getPositionProperty = (element: HTMLElement): string => {
  const currentPosition: string = getComputedStyle(element).position;

  return currentPosition === 'static' ? 'relative' : currentPosition;
};

// test
export const computedBorderSize = (rawWidth: number): number => {
  // 0.2 => adjust the parameter by 1px
  return rawWidth - rawWidth * 0.2;
};

export const setCssStyle = (id: string, callback: () => string): void => {
  let styleTag: HTMLElement | null = document.getElementById(id);
  const check = !!styleTag;

  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.setAttribute('type', 'text/css');
    styleTag.id = id;
  }

  styleTag.innerHTML = callback();

  if (!check) {
    document.head.appendChild(styleTag);
  }
};
