import { capitalize, flowRight, isUndefined, omit, startCase, toUpper } from 'lodash';
import React, { memo, useCallback, useRef } from 'react';

import Inputs, { CustomInputProps } from '../';
import { validate } from '../_validation';

interface ITextFieldProps extends CustomInputProps {
  t(key: string): any
}

function _TextField(props: ITextFieldProps) {
  const { language = 'en' } = props
  const isDirty = useRef<boolean>(!isUndefined(props.value))

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

  const displayText = useCallback((text: string) => {
    if (!text) return text
    return text
      .split(' ')
      .map((s) => (s.length < 4 ? s : capitalize(s)))
      .join(' ')
  }, [])

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
            _value = displayText(value)
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

  return <Inputs {...inputProps} onChange={onChange} onBlur={onBlur} />
}

export const EDKTextField = flowRight([memo])(_TextField)
