import { IDatepickerFieldProps } from './datepicker-field';
export interface ITenorFieldProps extends IDatepickerFieldProps {
    t?(key: string): any;
    rangeFieldId?: string;
    rangeValue?: any;
    rangeOptions?: {
        code: any;
        value: any;
    }[];
    toFieldId?: string;
    toValue?: any;
}
export declare const MDTTenorField: any;
