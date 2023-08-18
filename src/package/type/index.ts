import type * as CSS from 'csstype';
// import { FigmaSquircleParams } from 'figma-squircle';
import { Component, JSXElement } from 'solid-js';

interface FigmaSquircleParams {
  cornerRadius?: number;
  topLeftCornerRadius?: number;
  topRightCornerRadius?: number;
  bottomRightCornerRadius?: number;
  bottomLeftCornerRadius?: number;
  cornerSmoothing: number;
  width: number;
  height: number;
  preserveSmoothing?: boolean;
}

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
    fitBorderSize?: number;
  };
};

type OtherOption = {
  width?: number;
  height?: number;
  reSize?: boolean;
  debounce?: number;
  backgroundColor?: string;
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
  selector?: string;
  properies: CSS.PropertiesHyphen;
};

export type ArrayClasses = {
  contentClass: string;
  // borderClass: string;
};

export type { CSS, Component, FigmaSquircleParams, JSXElement };
