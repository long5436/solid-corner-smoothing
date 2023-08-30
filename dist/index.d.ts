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
type BorderOption = {
    size: number;
    color: string;
    fitBorderSize?: number;
};
type OtherOption = {
    cornerSmoothing?: number;
    width?: number;
    height?: number;
    reSize?: boolean;
    debounce?: number;
    backgroundColor?: string;
    border?: BorderOption;
};
type Options = Omit<FigmaSquircleParams, 'height' | 'width' | 'cornerSmoothing'> & OtherOption;

interface Props {
    children?: JSXElement;
    class?: string;
    classList?: {
        [k: string]: boolean;
    };
    wrapper?: Component | string;
    options: Options;
}
declare const SolidCornerSmoothing: Component<Props>;

export { Options, SolidCornerSmoothing as default };
