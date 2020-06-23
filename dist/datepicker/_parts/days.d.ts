import React from 'react';
declare function _Days(props: {
    dates: Date[][];
    selectedMonth: number;
    selectedYear: number;
    selectedDate: Date | string | number;
    minDate?: Date | string;
    maxDate?: Date | string;
    disabled?: boolean;
    hoverStart?: any;
    hoverEnd?: any;
    selectedStart?: any;
    selectedEnd?: any;
    onDateSelected(date: Date): void;
    onHoverDate?(date: any): void;
    events?: string[] | Date[] | number[];
}): JSX.Element;
export declare const Days: React.MemoExoticComponent<typeof _Days>;
export {};
