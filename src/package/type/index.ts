import type * as CSS from 'csstype';
import { FigmaSquircleParams } from 'figma-squircle';
import { Component, JSXElement } from 'solid-js';

export interface Props {
  children?: JSXElement;
  class?: string;
  classList?: {
    [key: string]: boolean;
  };
  wrapper?: Component | string;
  options: Options;
  parent: HTMLElement;
  arrayClasses: ArrayClasses;
}

type BorderOption = {
  border?: {
    size: number;
    color: string;
  };
};

type OtherOption = {
  width?: number;
  height?: number;
  reSize?: boolean;
  debounce?: number;
  fitBorderWidth?: number;
};

export type Options = Omit<FigmaSquircleParams, 'height' | 'width'> & BorderOption & OtherOption;

export type OptionsDefault = { cornerSmoothing: number; cornerRadius: number };

export type Size = {
  width: number;
  height: number;
};

export type CreateCss = {
  class?: string;
  id?: string;
  properies: CSS.PropertiesHyphen;
};

export type ArrayClasses = {
  contentClass: string;
  borderClass: string;
};

export type { CSS, Component, FigmaSquircleParams, JSXElement };
