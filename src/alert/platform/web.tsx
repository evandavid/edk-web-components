import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import MaterialIcon from '@material/react-material-icon';

import { BasicBtn } from '../../button/basic';
import { FlexOne, FlexRow } from '../../flex';
import { useIsMounted } from '../../hooks/use-is-mounted';

export interface IAlertShow {
  id?: string
  title: string
  subtitle?: string
  type?: 'warning' | 'success' | 'info'
  timeout?: number
}

const styleColor = {
  info: '#197EC8',
  warning: '#fcb023',
  success: '#22A976'
}

const Container = styled.div<any>`
  background: #fff;
  padding: 18px 24px;
  position: absolute;
  bottom: 24px;
  right: ${(props) => (props.visible === 'yes' ? 36 : -460)}px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  border-radius: 3px;
  max-width: 460px;
  z-index: 16;
  transition: 0.5s right ease;
`

const Line = styled.div<any>`
  width: 0;
  &:before {
    background: ${(props) => styleColor[props.type]};
    display: block;
    content: '';
    position: absolute;
    left: 8px;
    top: 8px;
    bottom: 8px;
    width: 3px;
    border-radius: 4px;
  }
`

const Icon = styled(MaterialIcon)`
  margin-left: 12px;
  color: #757575;
`

const Title = styled.div``
const Subtitle = styled.div`
  margin-top: 6px;
  font-size: 14px;
  color: #757575;
  line-height: 18px;
`

function _ModAlertWeb(props: IAlertShow) {
  const { title = '', type = 'warning', subtitle, timeout = 5000 } = props
  const timeoutInstance: any = useRef()
  const eligibleToDismiss = useRef<boolean>(false)

  const [ready, setReady] = useState(true)
  const [visible, setVisible] = useState(false)
  const isMounted = useIsMounted()

  const clickDismiss = useCallback(() => {
    timeoutInstance.current && clearTimeout(timeoutInstance.current)
    isMounted.current && setVisible(false)
  }, [isMounted])

  useEffect(() => {
    setTimeout(() => {
      setVisible(true)
      timeoutInstance.current = setTimeout(() => {
        isMounted.current && setVisible(false)
      }, timeout + 1000)
      setTimeout(() => {
        eligibleToDismiss.current = true
      }, 100)
    }, 500)
  }, [])

  useEffect(() => {
    eligibleToDismiss.current &&
      !visible &&
      setTimeout(() => {
        isMounted.current && setReady(false)
      }, 1000)
  }, [visible])

  return ready ? (
    <Container visible={visible ? 'yes' : 'no'}>
      <FlexRow>
        <Line type={type} />
        <FlexOne>
          <Title dangerouslySetInnerHTML={{ __html: title }} />
          {subtitle ? (
            <Subtitle dangerouslySetInnerHTML={{ __html: subtitle }} />
          ) : null}
        </FlexOne>
        <BasicBtn
          onClick={() => {
            clickDismiss()
          }}
        >
          <Icon role={'button'} icon={'clear'} />
        </BasicBtn>
      </FlexRow>
    </Container>
  ) : null
}

export const ModAlertWeb = memo(_ModAlertWeb)
