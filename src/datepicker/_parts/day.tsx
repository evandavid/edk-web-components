import { isSameDay, isSameMonth, isToday } from 'date-fns';
import React, { memo } from 'react';
import styled from 'styled-components';

import { FlexRowCenter } from '../../flex';

const Container = styled(FlexRowCenter)`
  width: 100%;
  height: 30px;
`

const InnerConteainer = styled.div<any>`
  position: relative;
  overflow: hidden;
  display: block;
  border: none;
  width: 28px;
  height: 28px;
  text-align: center;
  line-height: 28px;
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  outline: none;
  font-size: 13px;
  border-radius: 15px;
  border: ${(props) => (props.today ? '1' : '0')}px solid #aecbfa;
  background: ${(props) =>
    props.selected ? '#4A87F2' : props.today ? '#fff' : 'transparent'};
  color: ${(props) =>
    props.disabled
      ? '#ddd'
      : props.selected
      ? '#fff'
      : props.outside
      ? '#757575'
      : '#212121'};
`

function _Day(props: {
  date: Date
  selectedDate: Date | string | number
  selectedMonth: number
  selectedYear: number
  disabled?: boolean

  onDateSelected(date: Date): void
}) {
  const thisDate = new Date(props.date)
  const day = thisDate.getDate()
  const selectedMonth = new Date(props.selectedYear, props.selectedMonth, 1)
  const selectedDateObj = new Date(props.selectedDate)

  return (
    <Container>
      <InnerConteainer
        outside={!isSameMonth(selectedMonth, thisDate)}
        disabled={props.disabled}
        selected={isSameDay(selectedDateObj, thisDate)}
        today={isToday(thisDate)}
      >
        {day}
      </InnerConteainer>
    </Container>
  )
}

export const Day = memo(_Day)
