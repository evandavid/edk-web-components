import React from 'react';
interface IDatepickerProps {
    language?: string;
    defaultDate?: Date | string | number;
    maxDate?: any;
    minDate?: any;
    type?: 'datepicker' | 'datetimepiker';
    selectedMonth?: number;
    selectedYear?: number;
    onDateChanged(date: Date): void;
    disabled?: boolean;
    hoverStart?: any;
    hoverEnd?: any;
    selectedStart?: any;
    selectedEnd?: any;
    onHoverDate?(date: any): void;
    style?: any;
    events?: string[] | Date[] | number[];
    onChangeDisplay?: (month: number, year: number) => void;
    disabledSelect?: boolean;
}
declare function _Datepicker(props: IDatepickerProps): JSX.Element;
export declare const Datepicker: React.MemoExoticComponent<typeof _Datepicker>;
export {};
