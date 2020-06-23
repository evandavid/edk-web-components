import React, { memo } from 'react';
import styled from 'styled-components';

export const BasicBtn = styled.button`
    cursor: pointer;
    outline: none;
    text-decoration: none;
    user-select: none;
    border: none;
    background: transparent;
    margin: 0;
    padding: 0;
`;

export interface IBtnProps extends React.HTMLProps<HTMLButtonElement> {}

function _BasicButton(props: IBtnProps) {
    const { style = {}, id } = props;
    return (
        <BasicBtn id={id} onClick={props.onClick} style={style}>
            {props.children}
        </BasicBtn>
    );
}

export const BasicButton = memo(_BasicButton);
