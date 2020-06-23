import { flowRight } from 'lodash';
import React, { memo } from 'react';
import styled from 'styled-components';

import { CustomInputProps } from '../';

const SubTitleContainer = styled.div`
  margin: 0 0 24px;
  font-size: 18px;
  font-weight: 500;
`

function _SubTitleField(props: CustomInputProps) {
  return (
    <SubTitleContainer
      dangerouslySetInnerHTML={{ __html: props.label || '' }}
    />
  )
}

export const EDKSubTitleField = flowRight([memo])(_SubTitleField)
