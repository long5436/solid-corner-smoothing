import { getSvgPath } from 'figma-squircle';
import { minifyPath } from 'mz-svg';

import type { EachCornerEadius, FigmaSquircleParams, OptionsDefault } from '../type';

const cornerDefault: OptionsDefault = { cornerSmoothing: 1, cornerRadius: 10 };

const createPath = (options: FigmaSquircleParams, transform?: string) => {
  const rawPath: string = getSvgPath({ ...cornerDefault, ...options });
  // const path: string = svgpath(rawPath)
  //   .rel()
  //   .transform(transform || '')
  //   .round(1)
  //   .toString();

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
  for (const key in result) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const newSize = result[key] - borderSize;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      result[key] = newSize >= 0 ? newSize : null;
    }
  }

  return result;
};

export { calculateEachCornerEadius, createPath, fitBorderSize };
