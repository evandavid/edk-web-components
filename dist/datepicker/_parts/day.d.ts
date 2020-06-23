import React from 'react';
declare function _Day(props: {
    date: Date;
    selectedDate: Date | string | number;
    selectedMonth: number;
    selectedYear: number;
    disabled?: boolean;
    onDateSelected(date: Date): void;
}): JSX.Element;
export declare const Day: React.MemoExoticComponent<typeof _Day>;
export {};
