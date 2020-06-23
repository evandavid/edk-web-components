import { clone, filter, flowRight, isArray, isString, map, xor } from 'lodash';
import React, { memo, useCallback } from 'react';
import styled from 'styled-components';

import { CustomInputProps } from '../';
import { Checkbox } from '../../checkbox';
import { FlexOne, FlexRow } from '../../flex';
import { validate } from '../_validation';

const Label = styled.div<any>`
  margin-left: 24px;
  color: #757575;
  line-height: 18px;
  user-select: none;
`

const Container = styled.div<any>`
  margin-bottom: 24px;
  cursor: pointer;
  outline: none;
`

const Error = styled.div`
  color: rgb(176, 0, 32);
  font-size: 12px;
  margin-top: 12px;
  margin-left: 48px;
`

const Item = styled.div`
  margin-top: 12px;
  margin-left: 6px;
  margin-right: 6px;
`

const LabelText = styled.div<any>`
  font-size: 14px;
  margin-top: 12px;
  line-height: 18px;
  color: ${(props) => (props.error ? 'rgb(176, 0, 32)' : '#212121')};
`

interface ICheckboxFieldProps extends CustomInputProps {
  t(key: string): any
}

function _CheckboxField(props: ICheckboxFieldProps) {
  const { language = 'en' } = props
  const validation: any = {
    hide: props.hide,
    required: props.required,
    maxLength: props.maxLength,
    minLength: props.minLength,
    max: props.max,
    min: props.min,
    inputType: props.inputType
  }

  const onChange = useCallback(
    (fieldId: string, value: any) => {
      let error = undefined
      if (!props.skipValidation)
        error = validate(props.type, value, language, validation)
      if (!props.disabled && !props.readOnly)
        props.onChange(fieldId, value, error)
    },
    [props]
  )

  const toggleValue = useCallback(
    (list, value) => {
      if ((props as any).isArray) {
        let cloned = list ? clone(list) : [],
          idx = cloned.indexOf(value)
        idx > -1 ? cloned.splice(idx, 1) : cloned.push(value)
        return cloned
      } else {
        let clonedList = clone(list),
          newValue = [String(value)],
          values = (clonedList && clonedList.split(',')) || [],
          calculated = xor(values, newValue)
        return calculated.length ? calculated.join(',') : ''
      }
    },
    [props]
  )

  const getValue = (data: any) => {
    if (data.code !== undefined) return data.code
    return data.value
  }

  const options = filter(props.options, (o: any) => !o.hide)
  if (!options.length) return null

  return (
    <Container>
      {props.label && props.label !== '' ? (
        <LabelText
          error={props.error != null}
          dangerouslySetInnerHTML={{ __html: props.label }}
        />
      ) : null}
      {map(options, (option) => (
        <Item key={`option-${props.fieldId}-${option.code}`}>
          <FlexRow
            onClick={() => {
              onChange(
                props.fieldId,
                toggleValue(props.value, getValue(option))
              )
            }}
          >
            <Checkbox
              controlled
              active={
                isArray(props.value)
                  ? props.value.indexOf(option.code) > -1
                  : isString(props.value)
                  ? props.value.indexOf(String(option.code)) > -1
                  : false
              }
            />
            <FlexOne>
              <Label>{option.value}</Label>
            </FlexOne>
          </FlexRow>
        </Item>
      ))}
      {props.error ? <Error>{props.error}</Error> : null}
    </Container>
  )
}

export const EDKCheckboxField = flowRight([memo])(_CheckboxField)
