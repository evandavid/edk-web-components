import { endOfDay, isAfter, isBefore, isSameDay, startOfDay } from 'date-fns';
import { debounce, find, isUndefined, map } from 'lodash';
import React, { memo, useCallback, useMemo } from 'react';
import styled, { css } from 'styled-components';

import { FlexOne, FlexRow } from '../../flex';
import { Day } from './day';

const Hovering = styled.div<any>`
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: ${(props) => (props.hoverStart ? '10' : '1')}px;
  right: ${(props) => (props.hoverEnd ? '10' : '1')}px;
  border-top: 1px dashed #cbddff;
  border-bottom: 1px dashed #cbddff;
  border-left: ${(props) => (props.first ? '1' : '0')}px dashed #cbddff;
  border-right: ${(props) => (props.last ? '1' : '0')}px dashed #cbddff;
  border-bottom-left-radius: ${(props) => (props.first ? '15' : '0')}px;
  border-top-left-radius: ${(props) => (props.first ? '15' : '0')}px;
  border-bottom-right-radius: ${(props) => (props.last ? '15' : '0')}px;
  border-top-right-radius: ${(props) => (props.last ? '15' : '0')}px;
  content: ' ';
  display: block;
`

const InBeetween = styled.div<any>`
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: ${(props) => (props.selectedStart ? '2' : '0')}px;
  right: ${(props) => (props.selectedEnd ? '2' : '0')}px;
  background: #cbddff;
  border-bottom-left-radius: ${(props) =>
    props.first || props.selectedStart ? '15' : '0'}px;
  border-top-left-radius: ${(props) =>
    props.first || props.selectedStart ? '15' : '0'}px;
  border-bottom-right-radius: ${(props) =>
    props.last || props.selectedEnd ? '15' : '0'}px;
  border-top-right-radius: ${(props) =>
    props.last || props.selectedEnd ? '15' : '0'}px;
  content: ' ';
  display: block;
`

const DayContainer = styled(FlexOne)<any>`
    position: relative;
    cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
    outline: none;
    :hover {
        & > div:last-child > div {
            background: ${(props) =>
              props.disabled
                ? '#fff'
                : props.selected
                ? '#4A87F2'
                : props.hasEvents === 'yes'
                ? '#77bafe'
                : '#e5f0ff'};
        }
    }
    ${(props) =>
      props.hasEvents === 'yes' &&
      props.disabled &&
      css`
        & > div:last-child > div {
          background: #fff;
        }
      `}
    ${(props) =>
      props.hasEvents === 'yes' &&
      !props.disabled &&
      props.selected &&
      css`
        & > div:last-child > div {
          background: #4a87f2;
        }
      `}
    ${(props) =>
      props.hasEvents === 'yes' &&
      !props.disabled &&
      !props.selected &&
      css`
        & > div:last-child > div {
          background: #77bafe;
        }
      `}
`

function _Days(props: {
  dates: Date[][]
  selectedMonth: number
  selectedYear: number
  selectedDate: Date | string | number
  minDate?: Date | string
  maxDate?: Date | string
  disabled?: boolean

  hoverStart?: any
  hoverEnd?: any
  selectedStart?: any
  selectedEnd?: any

  onDateSelected(date: Date): void
  onHoverDate?(date: any): void
  events?: string[] | Date[] | number[]
}) {
  const {
    selectedMonth,
    selectedYear,
    minDate,
    maxDate,
    selectedDate,
    onDateSelected
  } = props

  const onHoverDate = debounce(
    (date) => (props.onHoverDate ? props.onHoverDate(date) : {}),
    10
  )

  const hoverStartInstance = useMemo(() => new Date(props.hoverStart), [props])
  const hoverEndInstance = useMemo(() => new Date(props.hoverEnd), [props])
  const selectedStartInstance = useMemo(() => new Date(props.selectedStart), [
    props
  ])
  const selectedEndInstance = useMemo(() => new Date(props.selectedEnd), [
    props
  ])
  const selectedDateObj = useMemo(() => new Date(props.selectedDate), [props])

  const hoverStartInstanceMinOne = new Date(props.hoverStart)
  hoverStartInstanceMinOne.setDate(hoverStartInstanceMinOne.getDate() - 1)
  const hoverEndInstancePlusOne = new Date(props.hoverEnd)
  hoverEndInstancePlusOne.setDate(hoverEndInstancePlusOne.getDate() + 1)
  const selectedStartInstanceMinOne = new Date(props.selectedStart)
  selectedStartInstanceMinOne.setDate(selectedStartInstanceMinOne.getDate() - 1)
  const selectedEndInstancePlusOne = new Date(props.selectedEnd)
  selectedEndInstancePlusOne.setDate(selectedEndInstancePlusOne.getDate() + 1)

  const isDisabled = useCallback(
    (date: Date): boolean => {
      const selectedDate = endOfDay(new Date(date))
      if (minDate) {
        const _asDate = new Date(minDate)
        const minDateObj = endOfDay(_asDate as any)
        return selectedDate < minDateObj
      }
      if (maxDate) {
        const _asDate = new Date(maxDate)
        const maxDateObj = endOfDay(_asDate as any)
        return selectedDate > maxDateObj
      }
      return false
    },
    [props]
  )

  const isInHoverMode = useCallback(
    (date: any) => {
      if (props.hoverStart && props.hoverEnd) {
        const thisDate = new Date(date)

        return (
          isAfter(thisDate, endOfDay(hoverStartInstanceMinOne)) &&
          isBefore(thisDate, startOfDay(hoverEndInstancePlusOne))
        )
      }
      return false
    },
    [props]
  )

  const isInBeetween = useCallback(
    (date: any) => {
      if (props.selectedStart && props.selectedEnd) {
        const thisDate = new Date(date)

        return (
          isAfter(thisDate, endOfDay(selectedStartInstanceMinOne)) &&
          isBefore(thisDate, startOfDay(selectedEndInstancePlusOne))
        )
      }
      return false
    },
    [props]
  )

  const ifExistInArray = useCallback((d: any, list: any) => {
    switch (list) {
      case null:
      case undefined:
        return 'no'
      default:
        return !isUndefined(
          find(list, (o) => isSameDay(new Date(d), new Date(o)))
        )
          ? 'yes'
          : 'no'
    }
  }, [])

  return (
    <div style={{ paddingBottom: 12 }}>
      {map(props.dates, (row, rIndex) => (
        <FlexRow key={`date-row-${rIndex}`}>
          {map(row, (date, dIndex) => (
            <DayContainer
              key={`date-${rIndex}-${dIndex}`}
              onMouseOver={() => {
                onHoverDate(date)
              }}
              onMouseOut={() => {
                onHoverDate(undefined)
              }}
              onClick={() => {
                if (!(isDisabled(date) || props.disabled)) {
                  props.onDateSelected(new Date(date))
                }
              }}
              disabled={isDisabled(date) || props.disabled}
              selected={isSameDay(selectedDateObj, new Date(date))}
              hasEvents={ifExistInArray(date, props.events)}
            >
              {isInHoverMode(date) ? (
                <Hovering
                  last={dIndex === 6}
                  first={dIndex === 0}
                  hoverStart={isSameDay(new Date(date), hoverStartInstance)}
                  hoverEnd={isSameDay(new Date(date), hoverEndInstance)}
                />
              ) : null}
              {isInBeetween(date) ? (
                <InBeetween
                  last={dIndex === 6}
                  first={dIndex === 0}
                  selectedStart={isSameDay(
                    new Date(date),
                    selectedStartInstance
                  )}
                  selectedEnd={isSameDay(new Date(date), selectedEndInstance)}
                />
              ) : null}
              <Day
                {...{
                  date,
                  selectedMonth,
                  selectedYear,
                  selectedDate,
                  onDateSelected,
                  disabled: isDisabled(date) || props.disabled
                }}
              />
            </DayContainer>
          ))}
        </FlexRow>
      ))}
    </div>
  )
}

export const Days = memo(_Days)
