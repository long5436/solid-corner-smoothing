import { Component, JSXElement } from 'solid-js';
import { FigmaSquircleParams } from 'figma-squircle';

export interface Props {
  children?: JSXElement;
  class?: string;
  classList?: {
    [key: string]: boolean;
  };
  wrapper?: Component | string;
  cornerRadius?: number;
  cornerSmoothing?: number;
  topLeftCornerRadius?: number;
  topRightCornerRadius?: number;
  bottomRightCornerRadius?: number;
  bottomLeftCornerRadius?: number;
  preserveSmoothing?: boolean;
  borderWidth?: number;
  borderColor?: string;
  backgroundColor?: string;
  reSize?: boolean;
  cornerClass?: string;
  debounce?: number;
  fitBorderWidth?: number;
  fixRenderChromium?: boolean;
  style?: StyleProp;
}

export interface OptionsCreateSVG {
  width: number;
  height: number;
  fill?: string;
  path?: string;
  classname: string;
  attr?: string;
}

export type Options = FigmaSquircleParams;

export type Size = {
  width: number;
  height: number;
};

export type StyleProp = { [key: string]: string | number };
export type Color = { backgroundColor: string; borderColor: string };

export type CssStyle = {
  css: { value: string };
  color: Color;
};

export type { Component, JSXElement, FigmaSquircleParams };
