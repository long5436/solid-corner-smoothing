import { FigmaSquircleParams } from 'figma-squircle';
import { Component, JSXElement } from 'solid-js';

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

export type OptionsDefault = { cornerSmoothing: number; cornerRadius: number };

export type Size = {
  width: number;
  height: number;
};

export type { Component, FigmaSquircleParams, JSXElement };
