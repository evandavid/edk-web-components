import React from 'react';
import { Point } from './util';
declare function _LineChart(props: {
    language: string;
    data: Point[][];
    labels: string[];
    formattedValue?: ((val: any) => void)[];
}): JSX.Element;
export declare const LineChart: React.MemoExoticComponent<typeof _LineChart>;
export {};
