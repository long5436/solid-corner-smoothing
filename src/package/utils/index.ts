import { getSvgPath } from 'figma-squircle';
import svgpath from 'svgpath';

import type { CSS, CreateCss, FigmaSquircleParams, OptionsDefault, Size } from '../type';

const defaultLength = 5; // length of uuid string
const cornerDefault: OptionsDefault = { cornerSmoothing: 1, cornerRadius: 10 };

export const createUUID = (length?: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let className = '';

  for (let i = 0; i < (length || defaultLength); i++) {
    className += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return className;
};

export const createSvgPath = (path: string, transform?: string): string => {
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

export const createOnlyPath = (options: FigmaSquircleParams) => {
  const path: string = getSvgPath({ ...cornerDefault, ...options });
  return createSvgPath(path);
};

export const getSize = (element: HTMLElement, borderWidth?: number): Size => {
  if (element) {
    const { width, height }: Size = {
      width: element.clientWidth,
      height: element.clientHeight,
    };

    const resultBorderWidth: number = borderWidth ? borderWidth * 2 : 0;

    return {
      width: width - resultBorderWidth,
      height: height - resultBorderWidth,
    };
  }

  return { width: 0, height: 0 };
};

export const getPositionProperty = (element: HTMLElement): CSS.Property.Position => {
  const currentPosition = getComputedStyle(element).position as CSS.Property.Position;

  return currentPosition === 'static' ? 'relative' : currentPosition;
};

export const setCssStyle = (id: string, rawCss: string[]): void => {
  let styleTag: HTMLElement | null = document.getElementById(id);
  const check = !!styleTag;

  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.setAttribute('type', 'text/css');
    styleTag.dataset.solidCornerId = id;
  }

  styleTag.innerHTML = rawCss.reduce((prev: string, e: string) => prev + e, '');

  if (!check) {
    document.head.appendChild(styleTag);
  }
};

export const createCss = (data: CreateCss): string => {
  let properiesString = '';
  if (data.id || data.class) {
    for (const key in data.properies) {
      if (Object.prototype.hasOwnProperty.call(data.properies, key)) {
        properiesString += key + ':' + (data.properies as string)[key as any] + ';';
      }
    }

    return data.id ? '#' + data.id : (('.' + data.class + '{' + properiesString + '}') as string);
  }

  return '';
};

export const getElementStyle = (id: string): HTMLElement | null => {
  return document.querySelector('[data-solid-corner-id=' + id + ']');
};
