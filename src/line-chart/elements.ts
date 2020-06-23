import styled from 'styled-components';

import Flex, { FlexOne, FlexRow, FlexRowCenter } from '../flex';
import { HideLeft } from './util';

export const VerticalContainer = styled(Flex)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`

export const DottedLine = styled(FlexOne)`
  border-top: 1px dashed #eaeaea;
`

export const Container = styled(FlexRow)`
  margin-top: 24px;
`

export const HorizontalLine = styled.div`
  height: 2px;
  background: #e5f0ff;
  width: 100%;
  content: ' ';
  display: block;
`

export const LineChartContainer = styled.div`
  height: 200px;
  position: relative;
`

export const VerticalLine = styled(LineChartContainer)<any>`
  width: ${(props) => props.width || 2}px;
  background: ${(props) => props.background || '#e5f0ff'};
  margin-top: -16px;
  height: 202px;
`

export const VerticalLabelContainer = styled(LineChartContainer)<any>`
  width: ${(props) => props.width || 60}px;
  margin-left: ${(props) => props.marginLeft || 0}px;
  margin-right: ${(props) => props.marginRight || 0}px;
`

export const HorizontalLabel = styled(FlexOne)`
  color: #757575;
  margin-top: -14px;
`

export const ZeroLabel = styled.div`
  position: absolute;
  bottom: 2px;
`

export const Label = styled.div<any>`
  color: #757575;
  font-size: 12px;
  margin-left: 6px;
  opacity: ${(props) => (props.hide === 'yes' ? 0 : 1)};
`

export const LabelTitle = styled(Label)`
  font-size: 14px;
  color: #424242;
  font-weight: 500;
`

export const DateLabel = styled(Label)<any>`
  margin-left: 0px;
  margin-top: 3px;
`

export const LineInnerContainer = styled.div`
  width: 100%;
  height: 100%;
  z-index: 2;
  position: relative;
  // overflow: hidden;
`

export const CursorContainer = styled.div`
  position: absolute;
  z-index: 2;
  left: -${HideLeft}px;
  pointer-events: none;
`

export const CursorElement = styled(FlexRowCenter)<any>`
  width: 8px;
  height: 8px;
  border-radius: 8px;
  content: '';
  position: relative;
  background: ${(props) => props.color};
  pointer-events: none;
  &:after {
    content: '';
    display: block;
    height: 14px;
    width: 14px;
    background: ${(props) => props.color};
    opacity: 0.4;
    border-radius: 10px;
    position: absolute;
    top: -3px;
    left: -3px;
  }
  &:before {
    content: '';
    display: block;
    height: 24px;
    width: 24px;
    background: ${(props) => props.color};
    opacity: 0.1;
    border-radius: 12px;
    position: absolute;
    top: -8px;
    left: -8px;
  }
`

export const VerticalCursor = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  border-left: 1px dashed rgba(73, 135, 243, 0.4);
  left: -${HideLeft}px;
  pointer-events: none;
`

export const WhiteCursor = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 3px;
  background: #fff;
  z-index: 10;
  position: relative;
  pointer-events: none;
`

export const DetailContainer = styled(CursorContainer)`
  display: inline-block;
  left: -${HideLeft}px;
`

export const DateDetailContainer = styled.div`
  width: 100%;
  min-width: 150px;
  background: #0886cf;
  padding: 8px 18px 12px;
  color: #fff;
  white-space: nowrap;
  font-size: 10px;
  font-weight: 500;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  text-align: center;
  box-shadow: 0px 0 15px 0 rgba(0, 0, 0, 0.18);
  position: relative;
  &:after {
    position: absolute;
    content: '';
    display: block;
    height: 4px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
  }
`

export const DetailTextContainer = styled.div`
  opacity: 0.85;
  background: #fff;
  padding: 8px 18px;
  border-radius: 6px;
  margin-top: -4px;
  font-size: 12px;
  box-shadow: 0px 0 15px 0 rgba(0, 0, 0, 0.18);
`

export const DetailLabelText = styled.div`
  color: #757575;
  font-size: 11px;
`

export const DetailTextInnerContainer = styled.div`
  max-width: 230px;
  &:not(:last-child) {
    margin-bottom: 6px;
  }
`

export const LegendElement = styled.div<any>`
  width: 8px;
  height: 8px;
  content: '';
  position: relative;
  background: ${(props) => props.color};
  margin-right: 6px;
  margin-top: 2px;
`
