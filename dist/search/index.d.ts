import React from 'react';
interface ISearchProps {
    width: number;
    onSearch(query?: string): void;
    defaultValue?: string;
}
declare function Search(props: ISearchProps): JSX.Element;
export declare const EDKSearch: React.MemoExoticComponent<typeof Search>;
export {};
