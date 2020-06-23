import React from 'react';
export declare class Portal extends React.Component<{
    selector: string;
}> {
    private element;
    componentDidMount(): void;
    render(): React.ReactPortal | null;
}
