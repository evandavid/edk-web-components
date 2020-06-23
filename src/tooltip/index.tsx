import React, { memo } from 'react';
import styled from 'styled-components';

const TooltipContainer = styled.div`
  position: relative;
  & > div:first-child {
    display: none;
  }
  &:hover > div:first-child {
    display: block;
  }
`
const Title = styled.div`
  position: absolute;
  background-color: #555;
  color: #fff;
  text-align: center;
  padding: 5px 12px;
  border-radius: 6px;
  z-index: 1;
  transition: opacity 0.6s;
  bottom: -6px;
  right: 0;
  transform: translateY(100%);
  max-width: 300px;
  white-space: initial;
  line-height: 16px;
`

function _Tooltip(props: { children: any; title?: string; className?: any }) {
  const { title = '', className } = props

  return (
    <TooltipContainer className={className}>
      <Title dangerouslySetInnerHTML={{ __html: title }} />
      {props.children}
    </TooltipContainer>
  )
}

export const Tooltip = memo(_Tooltip)
