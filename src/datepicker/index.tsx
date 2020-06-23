import {
    getMonth,
    getYear,
    isDate,
    isSameDay,
    isSameMonth,
    lastDayOfMonth,
    startOfMonth,
    startOfWeek
} from 'date-fns';
import { chunk, clone } from 'lodash';
import React, { memo, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Days } from './_parts/days';
import { DatepickerHeader } from './_parts/header';

const Container = styled.div`
  width: 260px;
  box-shadow: 6px 0 14px 0 rgba(217, 232, 255, 0.5);
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 0 12px;
`

interface IDatepickerProps {
  language?: string
  defaultDate?: Date | string | number
  maxDate?: any
  minDate?: any
  type?: 'datepicker' | 'datetimepiker'
  selectedMonth?: number
  selectedYear?: number
  onDateChanged(date: Date): void
  disabled?: boolean

  hoverStart?: any
  hoverEnd?: any
  selectedStart?: any
  selectedEnd?: any
  onHoverDate?(date: any): void

  style?: any
  events?: string[] | Date[] | number[]
  onChangeDisplay?: (month: number, year: number) => void
  disabledSelect?: boolean
}

function _Datepicker(props: IDatepickerProps) {
  const {
    defaultDate = new Date(),
    onHoverDate,
    hoverStart,
    hoverEnd,
    selectedStart,
    selectedEnd,
    style = {},
    events,
    language = 'en'
  } = props
  const _selectedDate: any = clone(props.defaultDate)

  const calculateProperties = useCallback((date: Date | string | number): {
    lastDateOfMonth?: Date
    firstDateOfMonth?: Date
    firstDateForDisplay?: Date
    lastDateForDisplay?: Date
    dates?: Date[][]
  } => {
    if (!isDate(date)) return {}

    const asDateObj = new Date(date)

    const _firstDateOfMonth = startOfMonth(asDateObj)
    const _lastDateOfMonth = lastDayOfMonth(asDateObj)
    const _firstDateForDisplay = startOfWeek(_firstDateOfMonth)

    const actAsLastDateForDisplay = clone(_firstDateForDisplay)
    const _dates = [_firstDateForDisplay]
    for (let i = 0; i < 41; i++) {
      actAsLastDateForDisplay.setDate(actAsLastDateForDisplay.getDate() + 1)
      _dates.push(new Date(actAsLastDateForDisplay))
    }

    const _lastDateForDisplay = clone(actAsLastDateForDisplay)

    return {
      lastDateOfMonth: _lastDateOfMonth,
      firstDateOfMonth: _firstDateOfMonth,
      firstDateForDisplay: _firstDateForDisplay,
      lastDateForDisplay: _lastDateForDisplay,
      dates: chunk(_dates, 7)
    }
  }, [])

  const [selectedDate, setSelectedDate] = useState<any>(
    _selectedDate ? new Date(_selectedDate) : undefined
  )
  const [properties, setProperties] = useState<any>(
    calculateProperties(defaultDate)
  )
  const [selectedMonth, setSelectedMonth] = useState(
    props.selectedMonth
      ? props.selectedMonth
      : getMonth(new Date(defaultDate as any))
  )
  const [selectedYear, setSelectedYear] = useState(
    props.selectedYear
      ? props.selectedYear
      : getYear(new Date(defaultDate as any))
  )

  const changeDisplay = useCallback(
    (month: number, year: number) => {
      setSelectedMonth(month)
      setSelectedYear(year)

      props.onChangeDisplay && props.onChangeDisplay(month, year)
    },
    [props]
  )

  const onDateSelected = useCallback(
    (date: Date) => {
      !props.disabledSelect &&
        (() => {
          setSelectedDate(date)
          props.onDateChanged(date)
        })()
    },
    [props]
  )

  useEffect(() => {
    if (selectedMonth && selectedYear && props.defaultDate) {
      const currentSelectedMonth = new Date(selectedYear, selectedMonth, 1)
      const defaultAsObject = new Date(props.defaultDate)

      if (!isSameMonth(currentSelectedMonth, defaultAsObject)) {
        setProperties(calculateProperties(defaultAsObject))
        setSelectedMonth(getMonth(defaultAsObject))
        setSelectedYear(getYear(defaultAsObject))
      }
    }
  }, [props.defaultDate])

  useEffect(() => {
    if (selectedMonth !== undefined && selectedYear !== undefined) {
      const currentSelectedMonth = new Date(selectedYear, selectedMonth, 1)
      setProperties(calculateProperties(currentSelectedMonth))
    }
  }, [selectedMonth, selectedYear])

  useEffect(() => {
    const currentSelectedMonth = new Date(selectedYear, selectedMonth, 1)

    if (
      !isSameMonth(currentSelectedMonth, selectedDate) &&
      isDate(selectedDate)
    ) {
      setProperties(calculateProperties(selectedDate))
      setSelectedMonth(getMonth(selectedDate))
      setSelectedYear(getYear(selectedDate))
    }
  }, [selectedDate])

  useEffect(() => {
    const _selectedObj = new Date(_selectedDate)
    if (!isSameDay(_selectedObj, selectedDate) && isDate(_selectedDate)) {
      setSelectedDate(_selectedObj)
    }
  }, [_selectedDate])

  useEffect(() => {
    !props.defaultDate &&
      (() => {
        setSelectedDate(undefined)
      })()
  }, [props.defaultDate])

  return (
    <Container style={style}>
      <DatepickerHeader
        {...{ selectedMonth, selectedYear, language, changeDisplay }}
      />
      <Days
        {...{
          dates: properties.dates,
          disabled: props.disabled,
          onHoverDate,
          selectedDate,
          selectedMonth,
          selectedYear,
          onDateSelected,
          minDate: props.minDate,
          maxDate: props.maxDate,

          hoverStart,
          hoverEnd,
          selectedStart,
          selectedEnd,
          events
        }}
      />
    </Container>
  )
}

export const Datepicker = memo(_Datepicker)
