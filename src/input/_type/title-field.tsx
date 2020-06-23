import { flowRight } from 'lodash';
import React, { memo } from 'react';
import styled from 'styled-components';

import { CustomInputProps } from '../';

const TitleContainer = styled.div`
  margin: 12px 0 36px;
  font-size: 20px;
  font-weight: 500;
`

function _TitleField(props: CustomInputProps) {
  return (
    <TitleContainer dangerouslySetInnerHTML={{ __html: props.label || '' }} />
  )
}

export const EDKTitleField = flowRight([memo])(_TitleField)
