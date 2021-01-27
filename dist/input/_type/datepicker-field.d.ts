import { CustomInputProps } from '../';
export declare const AsShadow: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const DateContainer: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const Container: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const AsModal: import("styled-components").StyledComponent<"div", any, any, never>;
export interface IDatepickerFieldProps extends CustomInputProps {
    minDate?: Date;
    maxDate?: Date;
    toFieldId?: string;
    toValue?: any;
    dateType?: any;
    modalStyle?: any;
    hideBackdrop?: boolean;
    trailingIconName?: string;
}
export declare const EDKDatepickerField: any;
