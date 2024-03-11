import { getSvgPath } from 'figma-squircle';
import { minifyPath } from 'mz-svg';

import type { EachCornerEadius, FigmaSquircleParams, OptionsDefault } from '../type';

const cornerDefault: OptionsDefault = { cornerSmoothing: 1, cornerRadius: 10 };

const createPath = (options: FigmaSquircleParams) => {
  const rawPath: string = getSvgPath({ ...cornerDefault, ...options });
  const path = minifyPath(rawPath);
  return path || '';
};

const fitBorderSize = (borderSize: number, fitBorderSize: number): number => {
  return borderSize + borderSize / 5 + fitBorderSize;
};

const calculateEachCornerEadius = (
  borderSize: number,
  options: FigmaSquircleParams
): EachCornerEadius => {
  const {
    topLeftCornerRadius,
    topRightCornerRadius,
    bottomRightCornerRadius,
    bottomLeftCornerRadius,
  } = options;

  const result = {
    topLeftCornerRadius,
    topRightCornerRadius,
    bottomRightCornerRadius,
    bottomLeftCornerRadius,
  };

  const entries = Object.entries(result);

  entries.forEach((e) => {
    const key = e[0];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (result[key]) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const newSize = result[key] - borderSize;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      result[key] = newSize >= 1 ? newSize : 1;
    }
  });

  return result;
};

const createInlineSvg = (path: string): string => {
  return `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' ><path d='${path}'/></svg>")`;
};

export { calculateEachCornerEadius, createInlineSvg, createPath, fitBorderSize };
