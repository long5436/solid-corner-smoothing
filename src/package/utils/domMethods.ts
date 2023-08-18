import { CSS, CreateCss, Size } from '../type';
import { attrs } from './domAttr';

const getSize = (element: HTMLElement, borderWidth?: number): Size => {
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

const getPositionProperty = (element: HTMLElement): CSS.Property.Position => {
  const currentPosition = getComputedStyle(element).position as CSS.Property.Position;

  return currentPosition === 'static' ? 'relative' : currentPosition;
};

const setCssStyle = (id: string, rawCss: string[]): void => {
  let styleTag: HTMLElement | null = getElementStyle(id);
  const check = !!styleTag;

  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.setAttribute('type', 'text/css');
    styleTag.dataset[attrs.style.camel] = id;
  }

  styleTag.innerHTML = rawCss.reduce((prev: string, e: string) => prev + e, '');

  if (!check) {
    document.head.appendChild(styleTag);
  }
};

const createCss = (data: CreateCss): string => {
  let properiesString = '';
  let cssNamme = '';

  for (const key in data.properies) {
    data.properies as string;

    if (Object.prototype.hasOwnProperty.call(data.properies, key)) {
      if ((data.properies as string)[key as any] !== undefined || null) {
        properiesString += key + ':' + (data.properies as string)[key as any] + ';';
      }
    }
  }

  if (data.id) {
    cssNamme = '#' + data.id;
  } else if (data.class) {
    cssNamme = '.' + data.class;
  } else {
    cssNamme = data.selector || '';
  }

  return (cssNamme + '{' + properiesString + '}') as string;
};

const getElementStyle = (id: string): HTMLElement | null => {
  return document.querySelector('[' + attrs.style.name + '=' + id + ']');
};

export { createCss, getElementStyle, getPositionProperty, getSize, setCssStyle };
