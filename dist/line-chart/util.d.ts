export declare type Point = {
    x: any;
    y: number;
};
export declare type MinMax = {
    max: number | null;
    min: number | null;
};
export declare type FirstLast = {
    first: any;
    last: any;
};
export declare const ChartColors: string[];
export declare const SoftChartColors: string[];
export declare const HideLeft = 1000000;
export declare const lineChartAction: (language: string, data: Point[][], madeUpScale: boolean, containerRef: {
    current: any;
}, cursorContainerRef: {
    current: any;
}[], verticalCursorRef: {
    current: any;
}, selectedDateDetailRef: {
    current: any;
}, detailTextRef: {
    current: any;
}[], detailItemContainerRef: {
    current: any;
}[], detailContainerRef: {
    current: any;
}, formattedValue: ((val: any) => any)[], readyToProcess: boolean) => {
    verticalMaxMin: MinMax;
    firstAndLastDate: FirstLast;
    lines: any[] | undefined;
    getLabel: (position: number) => void;
};
export declare const twoYAxisLineChartAction: (language: string, data: number[][], date: string[], containerRef: {
    current: any;
}, cursorContainerRef: {
    current: any;
}[], verticalCursorRef: {
    current: any;
}, selectedDateDetailRef: {
    current: any;
}, detailTextRef: {
    current: any;
}[], detailItemContainerRef: {
    current: any;
}[], detailContainerRef: {
    current: any;
}, formattedValue: ((val: any) => any)[], readyToProcess: boolean) => {
    verticalMaxMin: MinMax[];
    firstAndLastDate: FirstLast;
    lines: string[] | undefined;
    getLabel: (listIndex: number, position: number) => void;
};
