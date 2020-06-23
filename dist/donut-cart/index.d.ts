import React from 'react';
interface IDonutData {
    percentage: number;
    label: string;
    color?: string;
    typeId?: number;
    value?: any;
}
declare function _DonutChart(props: {
    data?: IDonutData[];
    defaultSelected?: number;
    language?: string;
    size: number;
    providedInnerText?: string;
    providedInnerValue?: string;
    hideCenter?: boolean;
    small?: boolean;
    onSelectedSlice?(index: number): void;
}): JSX.Element;
export declare const DonutChart: React.MemoExoticComponent<typeof _DonutChart>;
export {};
