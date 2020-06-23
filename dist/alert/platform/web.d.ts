import React from 'react';
export interface IAlertShow {
    id?: string;
    title: string;
    subtitle?: string;
    type?: 'warning' | 'success' | 'info';
    timeout?: number;
}
declare function _ModAlertWeb(props: IAlertShow): JSX.Element | null;
export declare const ModAlertWeb: React.MemoExoticComponent<typeof _ModAlertWeb>;
export {};
