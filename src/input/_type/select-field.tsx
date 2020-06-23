import { flowRight, isUndefined } from 'lodash';
import React, { memo, useCallback, useRef } from 'react';

import { CustomInputProps } from '../';
import { validate } from '../_validation';
import Selects from '../select';

interface ISelectFieldProps extends CustomInputProps {
  t(key: string): any
}

function _SelectField(props: ISelectFieldProps) {
  const { language = 'en ' } = props
  const isDirty = useRef<boolean>(!isUndefined(props.value))
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
      // basic validation
      let error = undefined
      if (!props.skipValidation && isDirty.current)
        error = validate(props.type, value, language, validation)
      props.onChange(fieldId, value, error)
    },
    [props]
  )

  return <Selects {...props} onChange={onChange} />
}

export const EDKSelectField = flowRight([memo])(_SelectField)
