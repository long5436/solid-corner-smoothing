import { CSS, CreateCss, Size } from '../type';
import { attrs } from './domAttr';

const { style } = attrs;

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
        styleTag.dataset[style.camel] = id;
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
    let cssName = '';
    const { id, class: className, selector } = data;

    for (const key in data.properies) {
      const { properies } = data;

      if (Object.prototype.hasOwnProperty.call(properies, key)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (properies[key] !== undefined || null) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          properiesString += key + ':' + properies[key] + ';';
        }
      }
    }

    if (id) {
      cssName = '#' + id;
    } else if (className) {
      cssName = '.' + className;
    } else {
      cssName = selector || '';
    }

    return (cssName + '{' + properiesString + '}') as string;
  }

  getElement(id: string, name?: string): HTMLElement | null {
    const attrName = name || style.name;
    return this.container.querySelector('[' + attrName + '=' + id.toString() + ']');
  }
}

export default DomMethods;
