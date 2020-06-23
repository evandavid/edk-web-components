import React, { memo, useEffect } from 'react';
import { animated, useSpring } from 'react-spring';
import styled from 'styled-components';

const Container = styled(animated.div)<any>`
  height: ${(props) => props.height}px;
  background-color: #f2f2f2;
  border-radius: ${(props) => props.height / 2}px;
  position: relative;
  overflow: hidden;
`

const ActiveLine = styled(Container)<any>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  border-radius: 0;
  background-color: ${(props) => props.color};
`

function _ProgressLine(props: {
  percent: number
  color?: string
  height?: number
}) {
  const { color = '#29cb97', percent = 0, height = 8 } = props

  const [activeWidth, setActiveWidth] = useSpring(() => ({
    width: '0%',
    from: { width: '0%' }
  }))

  useEffect(() => {
    setActiveWidth({ width: `${percent}%` })
  }, [percent])

  return (
    <Container height={height}>
      <ActiveLine color={color} style={activeWidth} />
    </Container>
  )
}

export const ProgressLine = memo(_ProgressLine)
