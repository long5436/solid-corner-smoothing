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

export type EachCornerEadius = {
  topLeftCornerRadius?: number;
  topRightCornerRadius?: number;
  bottomRightCornerRadius?: number;
  bottomLeftCornerRadius?: number;
};

export interface Props {
  children?: JSXElement;
  class?: string;
  classList?: {
    [key: string]: boolean;
  };
  wrapper?: Component | string;
  options: Options;
  // parent: HTMLElement;
  // parentClone: HTMLElement;
  randomId: string;
}

export type BorderOption = {
  size: number;
  color: string;
  fitBorderSize?: number;
};

export type OtherOption = {
  cornerSmoothing?: number;
  width?: number;
  height?: number;
  reSize?: boolean;
  debounce?: number;
  backgroundColor?: string;
  border?: BorderOption;
};

export type Options = Omit<FigmaSquircleParams, 'height' | 'width' | 'cornerSmoothing'> &
  OtherOption;

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

export type CreateCorner = (skipCheck?: boolean) => void;
export type TimeoutCallback = (func: CreateCorner) => void;

export type { CSS, Component, FigmaSquircleParams, JSXElement };
