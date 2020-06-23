import { capitalize, flowRight, isUndefined, omit, startCase, toUpper } from 'lodash';
import React, { memo, useCallback, useRef } from 'react';
import styled from 'styled-components';

import Inputs, { CustomInputProps } from '../';
import { validate } from '../_validation';

export const StringIcon = styled.div<any>`
  color: ${(props) =>
    props.disabled ? 'rgba(0, 0, 0, 0.37)' : 'rgba(0, 0, 0, 0.87)'} !important;
  font-size: 16px !important;
  line-height: 26px !important;
  padding-left: 12px !important;
  transform: none !important;
  top: 11px !important;
`

interface IPhoneFieldProps extends CustomInputProps {
  t(key: string): any
}

function _PhoneField(props: IPhoneFieldProps) {
  const isDirty = useRef<boolean>(!isUndefined(props.value))
  const { language = 'en ' } = props

  const inputProps: any = omit(props, ['rangeValue'])
  const validation: any = {
    hide: props.hide,
    required: props.required,
    maxLength: props.maxLength,
    minLength: props.minLength,
    max: props.max,
    min: props.min,
    inputType: props.inputType
  }

  const onBlur = useCallback(() => {
    if (!isDirty.current) {
      isDirty.current = true
      onChange(props.fieldId, props.value)
    }
  }, [props])

  const onChange = useCallback(
    (fieldId: string, value: any) => {
      let _value = value
      // transform text;
      if (props.textStyle) {
        switch (props.textStyle) {
          case 'uppercase':
            _value = toUpper(value)
            break
          case 'capitalize':
            _value = capitalize(value)
            break
          case 'startCase':
            _value = startCase(value)
            break
        }
      }

      // basic validation
      let error = undefined
      if (!props.skipValidation && isDirty.current)
        error = validate(props.type, _value, language, validation)
      props.onChange(fieldId, _value, error)
    },
    [props]
  )

  return (
    <Inputs
      {...inputProps}
      onChange={onChange}
      onBlur={onBlur}
      inputClassName={'phone-input'}
      leadingIcon={<StringIcon>+62</StringIcon>}
      floatingLabelClassName={'floatingLabelClassName'}
    />
  )
}

export const EDKPhoneField = flowRight([memo])(_PhoneField)
