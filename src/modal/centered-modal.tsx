import React, {
    cloneElement,
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import ReactResizeDetector from 'react-resize-detector';
import styled from 'styled-components';

import Flex from '../flex';
import { randomChar } from '../functions';
import { Modal } from './';

const Container = styled.div<any>`
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  position: absolute;
`

const InnerContainer = styled.div<any>`
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow-x: auto;
`

const Content = styled(Flex)<any>`
  pointer-events: ${(props) => (props.isShow ? 'all' : 'none')};
  padding: 12px 0;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  align-items: ${(props) => (props.isLongModal ? 'flex-start' : 'center')};
  height: ${(props) => (props.isLongModal ? 'auto' : '100%')};
  display: ${(props) => (props.isShow ? 'flex' : 'none')};
`

function _CenteredModal(props: {
  isShow: boolean
  style?: any
  onCloseRequested?(): void
  children: any
  ignoreResize?: boolean

  handleResize?: any
}) {
  const childrenElement = useRef<any>()
  const contentRef = useMemo(() => randomChar(), [])
  const screenHeight =
    typeof document !== undefined ? document.body.clientHeight : 0
  const [isLongModal, setIsLongModal] = useState(false)
  const [ready, setReady] = useState(false)

  const _handleResize = props.handleResize || useRef()

  const onResize = useCallback(
    (_, height: number) => {
      if (!props.ignoreResize) setIsLongModal(screenHeight <= height)
    },
    [screenHeight, props]
  )

  const calulateResize = useCallback(() => {
    props.isShow &&
      !props.ignoreResize &&
      childrenElement.current &&
      (() => {
        const height = childrenElement.current.clientHeight
        setIsLongModal(screenHeight <= height)
      })()
  }, [props, childrenElement])

  useEffect(() => {
    calulateResize()
  }, [props.isShow, childrenElement.current])

  useEffect(() => {
    if (typeof window !== undefined) {
      const intervalInstance = setInterval(() => {
        try {
          const content = childrenElement.current
          if (content) {
            const height = childrenElement.current.clientHeight
            setIsLongModal(screenHeight <= height)
            clearInterval(intervalInstance)
          }
        } catch (e) {}
      }, 100)

      if (!props.ignoreResize) {
        const intervalInstance2 = setInterval(() => {
          try {
            const content = document.querySelector(`#${contentRef}`)
            if (content) {
              clearInterval(intervalInstance2)
              setReady(true)
            }
          } catch (e) {}
        }, 100)
      }
    }
  }, [])

  useEffect(() => {
    _handleResize.current = {
      calculate: () => {
        calulateResize()
      }
    }
  })

  return (
    <Modal isShow={props.isShow} onCloseRequested={props.onCloseRequested}>
      <Container>
        <InnerContainer>
          <Content
            isShow={props.isShow}
            isLongModal={isLongModal}
            onClick={(evt: Event) => {
              props.onCloseRequested && props.onCloseRequested()
              evt.stopPropagation()
            }}
          >
            <div
              // id={contentRef}
              onClick={(evt) => {
                evt.stopPropagation()
              }}
              ref={childrenElement}
            >
              {cloneElement(props.children, { id: contentRef })}
            </div>
          </Content>
        </InnerContainer>
      </Container>
      {ready && !props.ignoreResize ? (
        <ReactResizeDetector
          handleHeight
          onResize={onResize}
          querySelector={`#${contentRef}`}
        />
      ) : null}
    </Modal>
  )
}

export const CenteredModal = memo(_CenteredModal)
