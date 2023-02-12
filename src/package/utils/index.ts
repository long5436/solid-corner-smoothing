import { getSvgPath } from 'figma-squircle';
import svgpath from 'svgpath';
import type { OptionsCreateSVG, FigmaSquircleParams, Size, OptionsDefault } from '../type';

const defaultLength = 5; // length of uuid string
const cornerDefault: OptionsDefault = { cornerSmoothing: 1, cornerRadius: 10 };

export const createUUID = (length?: number): string => {
  function generateNumber(limit: number): number {
    const value: number = limit * Math.random();
    return value | 0;
  }
  function generateX(): string {
    const value = generateNumber(16);
    return value.toString(16);
  }
  function generateXes(count: number): string {
    let result = '';
    for (let i = 0; i < count; ++i) {
      result += generateX();
    }
    return result;
  }
  return generateXes(length || defaultLength);
};

// const  isInvalidD = (s:string) :boolean=>{
//   const reEverythingAllowed = /[MmZzLlHhVvCcSsQqTtAa0-9-,.\s]/g;

//   const bContainsIllegalCharacter = !!s.replace(reEverythingAllowed,'').length;
//   const bContainsAdjacentLetters = /[a-zA-Z][a-zA-Z]/.test(s);
//   const bInvalidStart = /^[0-9-,.]/.test(s);
//   const bInvalidEnd = /.*[-,.]$/.test(s.trim());

//   return bContainsIllegalCharacter || bContainsAdjacentLetters || bInvalidStart || bInvalidEnd;
// }

export const createSvgPath = (path: string, transform?: string): SVGPathElement => {
  const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  if (path) {
    const resultPath: string = svgpath(path)
      .rel()
      .transform(transform || '')
      .round(1)
      .toString();

    pathElement.setAttribute('d', resultPath);
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
  const path: string = getSvgPath({ ...cornerDefault, ...options });
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
// export const computedBorderSize = (rawWidth: number): number => {
//   // 0.2 => adjust the parameter by 1px
//   // return rawWidth - rawWidth * 0.2;
//   return rawWidth;
// };

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
