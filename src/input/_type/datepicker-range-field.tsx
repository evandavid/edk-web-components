import { getMonth, getYear } from 'date-fns';
import { clone, flowRight } from 'lodash';
import React, { memo, useCallback, useEffect, useState } from 'react';

import MaterialIcon from '@material/react-material-icon';

import Inputs from '../';
import { Datepicker } from '../../datepicker';
import { formattedDate } from '../../functions';
import {
    AsModal,
    AsShadow,
    Container,
    DateContainer,
    IDatepickerFieldProps
} from './datepicker-field';

function _DatepickerRangeField(props: IDatepickerFieldProps) {
  const { language = 'en' } = props
  let displayed: any = props.value ? new Date(props.value as any) : new Date()
  if (props.toValue) {
    displayed = new Date(props.toValue)
  } else {
    displayed.setMonth(displayed.getMonth() + 1)
  }

  const fromDisplayed = formattedDate(props.value, language)
  const toDisplayed = formattedDate(props.toValue, language)

  const [isShow, setIsShow] = useState(false)
  const [maskedValue, setMaskedValue] = useState(
    fromDisplayed ? `${fromDisplayed} - ${toDisplayed}` : undefined
  )
  const [selectedMonth] = useState(getMonth(displayed))
  const [selectedYear] = useState(getYear(displayed))
  const [hoverDate, setHoverDate] = useState<any>()

  const formatDateForBackend = useCallback((date) => {
    if (date) {
      const dateInstance = new Date(date)
      return `${dateInstance.getFullYear()}-${
        dateInstance.getMonth() + 1
      }-${dateInstance.getDate()}`
    }
    return date
  }, [])

  const onDateFromChanged = useCallback(
    (date: any) => {
      let toValue = props.toValue
      if (!toValue) {
        toValue = clone(new Date(date))
        toValue.setMonth(toValue.getMonth() + 1)
      }

      props.onChange(props.fieldId, formatDateForBackend(date), undefined, {
        toFieldId: props.toFieldId,
        toValue: formatDateForBackend(toValue)
      })

      setMaskedValue(
        `${formattedDate(date, language)} - ${formattedDate(toValue, language)}`
      )
    },
    [props]
  )

  const onDateToChanged = useCallback(
    (date: any) => {
      props.onChange(
        props.fieldId,
        formatDateForBackend(props.value),
        undefined,
        {
          toFieldId: props.toFieldId,
          toValue: formatDateForBackend(date)
        }
      )
      setMaskedValue(
        `${formattedDate(props.value, language)} - ${formattedDate(
          date,
          language
        )}`
      )
    },
    [props]
  )

  const clearDate = useCallback(() => {
    props.onChange(props.fieldId, undefined, undefined, {
      toFieldId: props.toFieldId,
      toValue: undefined
    })
    setMaskedValue(undefined)
  }, [props])

  const onHoverDate = useCallback(
    (date: any) => {
      if (date) setHoverDate(new Date(date))
      else setHoverDate(undefined)
    },
    [props]
  )

  useEffect(() => {
    const _fromDisplayed = formattedDate(props.value, language)
    const _toDisplayed = formattedDate(props.toValue, language)

    if (_toDisplayed && _toDisplayed)
      setMaskedValue(`${_fromDisplayed} - ${_toDisplayed}`)
  }, [language])

  return (
    <Container style={props.style || {}}>
      <Inputs
        {...props}
        onChange={() => {}}
        readOnly={true}
        trailingIcon={
          <MaterialIcon
            role={'button'}
            icon={maskedValue ? 'clear' : 'date_range'}
          />
        }
        onTrailingIconSelect={
          maskedValue
            ? () => {
                clearDate()
              }
            : undefined
        }
        value={maskedValue}
        onClick={() => {
          if (!props.disabled && !props.readOnly) setIsShow(true)
        }}
      />
      <AsModal opened={isShow} style={props.modalStyle || {}}>
        <AsShadow
          onClick={() => {
            setIsShow(false)
          }}
        />
        <DateContainer>
          <Datepicker
            defaultDate={props.value as any}
            minDate={props.minDate}
            maxDate={props.toValue ? props.toValue : undefined}
            onDateChanged={onDateFromChanged}
            onHoverDate={onHoverDate}
            {...{
              hoverStart: props.value,
              hoverEnd: hoverDate,
              selectedStart: props.value,
              selectedEnd: props.toValue
            }}
          />
          <Datepicker
            defaultDate={props.toValue as any}
            minDate={props.value ? props.value : undefined}
            maxDate={props.maxDate}
            disabled={!props.value}
            onHoverDate={onHoverDate}
            {...{
              selectedMonth,
              selectedYear,
              onDateChanged: onDateToChanged,

              hoverStart: props.value,
              hoverEnd: hoverDate,
              selectedStart: props.value,
              selectedEnd: props.toValue
            }}
          />
        </DateContainer>
      </AsModal>
    </Container>
  )
}

export const EDKDatepickerRangeField = flowRight([memo])(_DatepickerRangeField)
