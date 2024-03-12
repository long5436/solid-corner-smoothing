import { CSS, CreateCss, Size } from '../type';
import { attrs } from './domAttr';

const { style } = attrs;

class DomMethods {
  container: Document;
  id: string;

  constructor(container: Document, id: string) {
    this.container = container;
    this.id = id;
  }

  getSize(element: HTMLElement, borderWidth?: number): Size {
    const size: Size = { width: 0, height: 0 };

    if (element) {
      const resultBorderWidth: number = borderWidth ? borderWidth * 2 : 0;
      const { clientHeight, clientWidth } = element;

      size.height = clientHeight - resultBorderWidth;
      size.width = clientWidth - resultBorderWidth;
    }

    return size;
  }

  getPositionProperty(element: HTMLElement): CSS.Property.Position {
    const currentPosition = getComputedStyle(element).position as CSS.Property.Position;

    switch (currentPosition) {
      case '' as string:
      case 'static':
        return 'relative';
      default:
        return currentPosition;
    }
  }

  setCssStyle(id: string, rawCss: (string | undefined)[]): void {
    let styleTag: HTMLElement | null = this.getElement(id);

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

    this.container.head.appendChild(styleTag);
  }

  createCss(data: CreateCss): string {
    let cssName = '';
    const { id, class: className, selector, properies } = data;
    const entries = Object.entries(properies);
    const properiesString = entries
      .map((e) => {
        return e[0] + ':' + e[1] + ';';
      })
      .join('');

    if (id) {
      cssName = '#' + id;
    } else if (className) {
      cssName = '.' + className;
    } else {
      cssName = selector || '';
    }

    return cssName + '{' + properiesString + '}';
  }

  getElement(id: string, name?: string): HTMLElement | null {
    if (!id) return null;
    const attrName = name || style.name;
    const selector = '[' + attrName + '=' + id.toString() + ']';
    return this.container.querySelector(selector);
  }

  createSelector(name: string) {
    return '[' + name + '="' + this.id + '"]';
  }
}

export default DomMethods;
