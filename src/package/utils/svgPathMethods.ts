import { getSvgPath } from 'figma-squircle';
import svgpath from 'svgpath';

import type { FigmaSquircleParams, OptionsDefault } from '../type';

const defaultLength = 5; // length of uuid string
const cornerDefault: OptionsDefault = { cornerSmoothing: 1, cornerRadius: 10 };

const createUUID = (length?: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let className = '';

  for (let i = 0; i < (length || defaultLength); i++) {
    className += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return className;
};

const createSvgPath = (path: string, transform?: string): string => {
  if (path) {
    const resultPath: string = svgpath(path)
      .rel()
      .transform(transform || '')
      .round(1)
      .toString();

    return resultPath;
  }

  return '';
};

const createOnlyPath = (options: FigmaSquircleParams) => {
  const path: string = getSvgPath({ ...cornerDefault, ...options });
  return createSvgPath(path);
};

const fitBorderSize = (borderSize: number, fitBorderSize: number): number => {
  return borderSize + borderSize / 5 + fitBorderSize;
};

export { createOnlyPath, createUUID, fitBorderSize };
