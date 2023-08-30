import { CSS, CreateCss, Size } from '../type';
import { attrs } from './domAttr';

class DomMethods {
  container: Document;

  constructor(container: Document) {
    this.container = container;
  }

  getSize(element: HTMLElement, borderWidth?: number): Size {
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
  }

  getPositionProperty(element: HTMLElement): CSS.Property.Position {
    const currentPosition = getComputedStyle(element).position as CSS.Property.Position;

    if (currentPosition === 'static' || (currentPosition as string) === '') {
      return 'relative';
    }

    return currentPosition;
  }

  setCssStyle(id: string, rawCss: (string | undefined)[]): void {
    let styleTag: HTMLElement | null = this.getElement(id);
    const check = !!styleTag;

    if (this.container) {
      if (!styleTag) {
        styleTag = this.container.createElement('style');
        styleTag.setAttribute('type', 'text/css');
        styleTag.dataset[attrs.style.camel] = id;
      }

      styleTag.innerHTML = rawCss.reduce((prev, current) => {
        if (current) {
          return prev + current;
        }
      }, '') as string;

      if (!check) {
        this.container.head.appendChild(styleTag);
      }
    }
  }

  createCss(data: CreateCss): string {
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
  }

  getElement(id: string, name?: string): HTMLElement | null {
    const attrName = name || attrs.style.name;
    return this.container.querySelector('[' + attrName + '=' + id.toString() + ']');
  }
}

export default DomMethods;
