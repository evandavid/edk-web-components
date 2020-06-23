import React from 'react';
import { CustomInputProps } from './';
interface ISelectProps extends CustomInputProps {
    menuClassName?: any;
}
declare function Selects(props: ISelectProps): JSX.Element;
declare const _default: React.MemoExoticComponent<typeof Selects>;
export default _default;
export declare const EDKSelect: typeof Selects;
