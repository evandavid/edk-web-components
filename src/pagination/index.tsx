import { map, range } from 'lodash';
import React, { memo, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { MDCMenu } from '@material/menu';

import { BasicButton } from '../button/basic';
import { FlexRow } from '../flex';

const AsBtn = styled.div`
  cursor: pointer;
  outline: none;
`

function _Pagination(props: {
  page: number
  totalPage: number
  onSelectedPage?(number: any): void
  onNextClicked?(): void
  onPrevClicked?(): void
}) {
  const pageRef = useRef<any>()
  const pageRefHandle: any = useRef<any>()

  const openPageList = useCallback(() => {
    if (pageRefHandle.current) pageRefHandle.current.open = true
  }, [pageRefHandle])

  useEffect(() => {
    if (!pageRefHandle.current && pageRef.current) {
      pageRefHandle.current = new MDCMenu(pageRef.current)
    }
  }, [])

  return (
    <FlexRow>
      <BasicButton
        onClick={() => {
          props.onPrevClicked && props.onPrevClicked()
        }}
      >
        <img src={'/static/images/prev.svg'} />
      </BasicButton>
      <AsBtn
        className='mdc-menu-surface--anchor'
        style={{
          color: '#888888',
          fontSize: 12,
          height: 25,
          lineHeight: '22px'
        }}
      >
        <span onClick={openPageList}>
          &nbsp;&nbsp;Page {props.page}&nbsp;&nbsp;
        </span>
        <div
          className={`mdc-menu mdc-menu-surface mdc-menu-auto`}
          ref={pageRef}
        >
          <ul className='mdc-list'>
            {map(range(props.totalPage), (_, mIndex) => (
              <li
                key={`option-${mIndex}`}
                onClick={() => {
                  props.onSelectedPage && props.onSelectedPage(mIndex + 1)
                }}
                className='mdc-list-item'
                role='menuitem'
              >
                <span className='mdc-list-item__text'>Page {mIndex + 1}</span>
              </li>
            ))}
          </ul>
        </div>
      </AsBtn>
      <BasicButton
        onClick={() => {
          props.onNextClicked && props.onNextClicked()
        }}
      >
        <img src={'/static/images/next.svg'} />
      </BasicButton>
    </FlexRow>
  )
}

export const Pagination = memo(_Pagination)
