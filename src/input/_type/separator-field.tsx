import { flowRight } from 'lodash';
import React, { memo } from 'react';
import styled from 'styled-components';

const SeparatorContainer = styled.div`
  background: #ccc;
  width: 100%;
  height: 1px;
  display: block;
  margin: 12px 0 24px;
`

function _SeparatorField() {
  return <SeparatorContainer />
}

export const EDKSeparatorField = flowRight([memo])(_SeparatorField)
