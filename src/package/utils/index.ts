import type { OptionsCreateSVG } from '../type';
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
  if (options.path) {
    const pathElement = createSvgPath(options.path);
    pathElement.setAttribute('fill', options.fill || '');
    squircle.appendChild(pathElement);
  }

  return squircle;
};
