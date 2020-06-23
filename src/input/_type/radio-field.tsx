import { filter, flowRight, map } from 'lodash';
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
  text-align: justify;
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

interface IRadioFieldProps extends CustomInputProps {
  t(key: string): any
}

function _RadioField(props: IRadioFieldProps) {
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
            style={{ alignItems: 'flex-start' }}
            onClick={() => {
              onChange(props.fieldId, option.code)
            }}
          >
            <Checkbox
              controlled
              active={props.value === option.code}
              round={true}
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

export const EDKRadioField = flowRight([memo])(_RadioField)
