import React from 'react';
declare function _Pagination(props: {
    page: number;
    totalPage: number;
    onSelectedPage?(number: any): void;
    onNextClicked?(): void;
    onPrevClicked?(): void;
}): JSX.Element;
export declare const Pagination: React.MemoExoticComponent<typeof _Pagination>;
export {};
