import React from 'react';
import { CustomInputProps, Operators } from '../';
export interface IRemoteFormDefinition {
    rows: number;
    fields: CustomInputProps[];
}
export declare const getFormValue: (flattenForm: CustomInputProps[]) => object;
export declare const getFormError: (flattenForm: CustomInputProps[], language: string) => {
    fieldId: string;
    error: string;
}[];
export declare const getFlattenForm: (formDefinition: IRemoteFormDefinition[]) => CustomInputProps[];
export declare const getAllAffectedFields: (fieldAffectedOther: {
    fieldId: string;
    target: string[];
}[], fieldId: string, result: String[]) => String[];
export declare const processBehaviour: (type: any, operand: any, value?: any, option?: any) => any;
export declare const evalBehaviour: (vals: boolean[], oprt: Operators[]) => boolean | undefined;
export declare const behaviourCheck: (formDefinition: IRemoteFormDefinition[], fieldAffectedOther: {
    fieldId: string;
    target: string[];
}[], fieldId: string, target: string[], formPath: any) => object;
declare function _Field(props: CustomInputProps): JSX.Element | null;
export declare const EDKInputField: React.MemoExoticComponent<typeof _Field>;
export {};
