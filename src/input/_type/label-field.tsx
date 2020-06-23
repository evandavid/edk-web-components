import { flowRight } from 'lodash';
import React, { memo } from 'react';
import styled from 'styled-components';

import { CustomInputProps } from '../';

const LabelContainer = styled.div`
  margin-top: -20px;
`

function _LabelField(props: CustomInputProps) {
  return (
    <LabelContainer dangerouslySetInnerHTML={{ __html: props.label || '' }} />
  )
}

export const EDKLabelField = flowRight([memo])(_LabelField)
