import { flowRight } from 'lodash'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import MaterialIcon from '@material/react-material-icon'

import Inputs, { CustomInputProps } from '../'
import { Datepicker } from '../../datepicker'
import { FlexRow } from '../../flex'
import { formattedDate, randomChar } from '../../functions'

export const AsShadow = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  content: ' ';
  display: block;
`

export const DateContainer = styled(FlexRow)`
  z-index: 12;
  position: relative;
`

export const Container = styled.div`
  position: relative;
`

export const AsModal = styled.div<any>`
  position: absolute;
  left: 18px;
  top: 48px;
  z-index: 10;
  display: ${(props) => (props.opened ? 'block' : 'none')};
`

export interface IDatepickerFieldProps extends CustomInputProps {
  minDate?: Date
  maxDate?: Date
  toFieldId?: string
  toValue?: any
  dateType?: any

  modalStyle?: any
  hideBackdrop?: boolean
  trailingIconName?: string
}

function _DatepickerField(props: IDatepickerFieldProps) {
  const {
    language = 'en ',
    hideBackdrop = false,
    trailingIconName = 'date_range'
  } = props

  const modalRef = useRef<any>(randomChar())

  const [isShow, setIsShow] = useState(false)
  const [maskedValue, setMaskedValue] = useState(
    formattedDate(props.value, language)
  )

  const formatDateForBackend = useCallback((date) => {
    if (date) {
      const dateInstance = new Date(date)
      return `${dateInstance.getFullYear()}-${
        dateInstance.getMonth() + 1
      }-${dateInstance.getDate()}`
    }
    return date
  }, [])

  const onDateChanged = useCallback(
    (date: any) => {
      props.onChange(props.fieldId, formatDateForBackend(date), undefined)
      setMaskedValue(formattedDate(date, language))
      setIsShow(false)
    },
    [props]
  )

  useEffect(() => {
    setMaskedValue(formattedDate(props.value, language))
  }, [language])

  useEffect(() => {
    if (props.value) {
      const _formatted = formattedDate(props.value, language)
      if (_formatted !== maskedValue) {
        setMaskedValue(_formatted)
      }
    }
  }, [props.value])

  const manipulate = () => {
    if (!hideBackdrop) return

    // look for other datepicker and close it
    const modals = document.getElementsByClassName('modal')
    if (modals.length) {
      Array.from(modals).forEach((modal: any) => {
        modal.style.display = 'none'
      })
    }

    // open this intansance forcefully
    const currentElement: any = document.getElementById(modalRef.current)

    setTimeout(() => {
      if (currentElement) {
        console.log(currentElement)
        if (currentElement.style.removeProperty) {
          currentElement.style.removeProperty('display')
        } else if (currentElement.style.removeAttribute) {
          currentElement.style.removeAttribute('display')
        } else {
          currentElement.style.display = 'block'
        }
      }
    }, 100)
  }

  let minDate = props.minDate
  let maxDate = props.maxDate
  let defaultDate = new Date()
  if (props.dateType && props.dateType === 'birthday') {
    defaultDate.setFullYear(defaultDate.getFullYear() - 17)
    maxDate = defaultDate
  }

  return (
    <Container>
      <Inputs
        {...props}
        onChange={() => {}}
        readOnly={true}
        trailingIcon={<MaterialIcon role={'button'} icon={trailingIconName} />}
        value={maskedValue}
        onClick={() => {
          if (!props.disabled && !props.readOnly) {
            manipulate()
            setTimeout(
              () => {
                setIsShow(true)
              },
              hideBackdrop ? 200 : 10
            )
          }
        }}
      />
      <AsModal
        id={modalRef.current}
        opened={isShow}
        className={`modal ${isShow ? 'show' : ''}`}
      >
        {!hideBackdrop && (
          <AsShadow
            onClick={() => {
              setIsShow(false)
            }}
          />
        )}
        <DateContainer>
          <Datepicker
            defaultDate={props.value ? (props.value as any) : defaultDate}
            minDate={minDate}
            maxDate={maxDate}
            onDateChanged={onDateChanged}
          />
        </DateContainer>
      </AsModal>
    </Container>
  )
}

export const EDKDatepickerField = flowRight([memo])(_DatepickerField)
