import { flowRight } from 'lodash';
import React, { memo, useCallback } from 'react';
import styled from 'styled-components';

import { CustomInputProps } from '../';
import { Checkbox } from '../../checkbox';
import { FlexOne, FlexRow } from '../../flex';
import { validate } from '../_validation';

const Label = styled.div<any>`
  margin-left: 8px;
  color: ${(props) => (props.error ? 'rgb(176, 0, 32)' : '#757575')};
`

const Container = styled.div<any>`
  margin-bottom: 24px;
  cursor: pointer;
  outline: none;
`

const Error = styled.div`
  color: rgb(176, 0, 32);
  font-size: 12px;
  margin-top: 6px;
  margin-left: 27px;
`

interface ISingleCheckboxProps extends CustomInputProps {
  t(key: string): any
}

function _SingleCheckbox(props: ISingleCheckboxProps) {
  const { language = 'en ' } = props
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

  return (
    <Container>
      <FlexRow
        onClick={() => {
          onChange(props.fieldId, !props.value)
        }}
      >
        <Checkbox controlled active={props.value as any} />
        <FlexOne>
          <Label error={props.error != null}>{props.label}</Label>
        </FlexOne>
      </FlexRow>
      {props.error ? <Error>{props.error}</Error> : null}
    </Container>
  )
}

export const EDKSingleCheckbox = flowRight([memo])(_SingleCheckbox)
