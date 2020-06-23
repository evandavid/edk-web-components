import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { animated, config, useChain, useSpring } from 'react-spring';
import styled from 'styled-components';

import { BasicBtn } from '../button/basic';

const Base = styled(animated.div)<any>`
  width: 18px;
  height: 18px;
  border-radius: ${(props) => (props.round === 'yes' ? '9' : '3')}px;
  border: 2px solid #888;
  -js-display: flex;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Check = styled.div`
  width: 10px;
  height: 6px;
  border: 2px solid #fff;
  border-top: none;
  border-right: none;
  content: ' ';
  transform: rotate(-45deg);
  margin-bottom: 2px;
`

function _Checkbox(props: {
  active?: boolean
  controlled?: boolean
  onToggle?(nextActive: boolean): void
  round?: boolean
}) {
  const {
    active = false,
    controlled = false,
    onToggle = (nextActive: boolean) => {
      console.log(nextActive)
    }
  } = props

  const [checkboxStatus, setCheckboxStatus] = useState(active)
  const ACTIVE_COLOR = '#71D456'
  const INACTIVE_COLOR = '#888'
  const ACTIVE_BORDER_WIDTH = 9
  const INACTIVE_BORDER_WIDTH = 2

  const baseRef = useRef()
  const checkboxRef = useRef()

  const baseStyle = useSpring({
    to: {
      borderColor: checkboxStatus ? ACTIVE_COLOR : INACTIVE_COLOR,
      borderWidth: checkboxStatus ? ACTIVE_BORDER_WIDTH : INACTIVE_BORDER_WIDTH
    },
    from: {
      borderColor: INACTIVE_COLOR,
      borderWidth: INACTIVE_BORDER_WIDTH
    },
    config: { duration: 100 },
    ref: baseRef
  })

  const checkStyle = useSpring({
    transform: checkboxStatus ? 'scale(0.9)' : 'scale(0)',
    from: { transform: 'scale(0)' },
    ref: checkboxRef,
    config: config.wobbly
  })

  useChain(checkboxStatus ? [baseRef, checkboxRef] : [checkboxRef, baseRef], [
    0,
    checkboxStatus ? 0.1 : 0.25
  ])

  const toggleChecked = useCallback(
    (_nextActive?: boolean) => {
      const nextActive =
        _nextActive === undefined ? !checkboxStatus : _nextActive
      setCheckboxStatus(nextActive)
      onToggle(nextActive)
    },
    [checkboxStatus]
  )

  useEffect(() => {
    toggleChecked(active)
  }, [active])

  return (
    <BasicBtn
      onClick={() => {
        if (!controlled) toggleChecked()
      }}
    >
      <Base style={baseStyle} round={props.round ? 'yes' : 'no'}>
        <animated.div style={checkStyle}>
          <Check />
        </animated.div>
      </Base>
    </BasicBtn>
  )
}

export const Checkbox = memo(_Checkbox)
