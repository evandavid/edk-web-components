import React from 'react';
export declare const StringTrailingIcon: import("styled-components").StyledComponent<"div", any, any, never>;
export declare type HideOnOperator = 'equals' | 'notEquals';
export declare type Operators = 'or' | 'and';
export interface IOption {
    code: any;
    value: any;
    icon?: any;
}
export interface ICriteria {
    fieldId: string;
    operator: HideOnOperator;
    operand: any;
}
export interface IBehaviour {
    type: 'hide' | 'value' | 'option' | 'required';
    blocks: {
        blockCriteria: [{
            criteria: ICriteria[];
            operators: Operators[];
        }, {
            criteria: ICriteria[];
            operators: Operators[];
        }];
        operators: Operators[];
    };
    value?: any;
    option?: IOption[];
}
export interface CustomInputProps extends Omit<React.HTMLProps<HTMLInputElement>, 'onChange'> {
    language?: string;
    fieldId: string;
    label?: string;
    ref?: any;
    textarea?: boolean;
    onChange(fieldId: string, value: any, error?: string, extraData?: any): void;
    onUpload?(fieldId: string, fieldType: string, file: any, cb: any): void;
    onGetImage?(fileId: string, onSuccess: any): void;
    info?: string;
    error?: string;
    skipValidation?: boolean;
    numeric?: boolean;
    currency?: boolean;
    inputType?: any;
    options?: IOption[];
    leadingIcon?: any;
    trailingIcon?: any;
    trailingText?: any;
    onTrailingIconSelect?: () => any;
    onLeadingIconSelect?: () => any;
    inputClassName?: string;
    floatingLabelClassName?: string;
    textStyle?: 'uppercase' | 'capitalize' | 'startCase';
    regex?: any;
    masking?: any;
    maxLength?: number;
    fileType?: any;
    value?: any;
    isAnchor?: boolean;
    anchorOptions?: any;
    hide?: boolean;
    isArray?: boolean;
    multiple?: boolean;
    behaviour?: IBehaviour;
    parentStyle?: any;
    id?: string;
    disableChange?: boolean;
    preventDebounce?: boolean;
}
declare function Inputs(props: CustomInputProps): JSX.Element;
declare const _default: React.MemoExoticComponent<typeof Inputs>;
export default _default;
export declare const EDKInput: typeof Inputs;
