import { debounce } from 'lodash';
import React, { memo, useCallback, useEffect, useRef } from 'react';
import { animated, useSpring } from 'react-spring';
import styled from 'styled-components';

// import { FlexCenter } from '../basic-element/flex';
import { Portal } from '../portal';

const Base = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 12;
  pointer-events: none;
`

const Backdrop = styled(animated.div)<any>`
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 5;
  top: 0;
  left: 0;
  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
  background-color: rgba(73, 135, 243, 0.48);
  opacity: 0;
`

const ModalContent = styled(animated.div)<any>`
  z-index: 6;
  position: relative;
  height: 100%;
  overflow: auto;
`

function _Modal(props: {
  isShow: boolean
  style?: any
  onCloseRequested?(): void
  children: any
}) {
  const isShow = useRef(props.isShow)

  const [backdropStyle, setBackdropStyle] = useSpring(() => ({
    to: {
      opacity: isShow.current ? 1 : 0,
      pointerEvents: isShow.current ? 'all' : 'none'
    },
    from: { opacity: 0, pointerEvents: 'none' },
    config: { duration: 50 }
  }))

  const [containerStyle, setContainerStyle] = useSpring(() => ({
    to: {
      opacity: isShow.current ? 1 : 0
    },
    from: { opacity: 0 },
    config: { duration: 50 }
  }))

  const animateBackdrop = useCallback(
    debounce(() => {
      if (props.isShow !== isShow.current) {
        isShow.current = props.isShow
        setBackdropStyle({
          to: {
            opacity: props.isShow ? 1 : 0,
            pointerEvents: props.isShow ? 'all' : 'none'
          }
        })

        setContainerStyle({
          to: {
            opacity: props.isShow ? 1 : 0
          }
        })
      }
    }, 1),
    [props, isShow]
  )

  useEffect(() => {
    animateBackdrop()
  }, [props.isShow])

  return (
    <Portal selector={'#portals'}>
      <Base>
        <Backdrop
          style={backdropStyle}
          onClick={() => {
            props.onCloseRequested && props.onCloseRequested()
            // evt.stopPropagation();
          }}
        />
        <ModalContent style={containerStyle}>
          {props.isShow ? (
            <div style={{ pointerEvents: 'all' }}>{props.children}</div>
          ) : null}
        </ModalContent>
      </Base>
    </Portal>
  )
}

export const Modal = memo(_Modal)
