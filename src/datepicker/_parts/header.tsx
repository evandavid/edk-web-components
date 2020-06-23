import { map, range } from 'lodash';
import React, { memo, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { MDCMenu } from '@material/menu';
import MaterialIcon from '@material/react-material-icon';

import { FlexOne, FlexRow } from '../../flex';
import { DAY_NAMES, MONTH_NAMES } from '../util';

const AsBtn = styled.div`
  cursor: pointer;
  outline: none;
`

const ActionButton = styled(AsBtn)`
  padding: 0 6px;
`

const DisplayMonthYearContainer = styled(FlexOne)`
  padding: 0 12px;
`

const HeaderContainer = styled(FlexRow)`
  padding: 12px 0;
`

const DaysContainer = styled(HeaderContainer)`
  margin: 0 0 6px;
`

const DayContainer = styled.div`
  text-align: center;
  font-size: 12px;
`

const Separator = styled.div`
  margin-right: 6px;
`

function _DatepickerHeader(props: {
  selectedMonth: number
  selectedYear: number
  language: string
  changeDisplay(month: number, year: number): void
}) {
  const { selectedMonth, selectedYear, language, changeDisplay } = props

  const monthRef = useRef<any>()
  const monthRefHandle: any = useRef<any>()
  const yearRef = useRef<any>()
  const yearRefHandle: any = useRef<any>()

  const onMonthOpen = useCallback(() => {
    if (monthRefHandle.current) monthRefHandle.current.open = true
  }, [monthRefHandle])

  const onMonthSelect = useCallback(
    (_month: number) => {
      changeDisplay(_month, selectedYear)
    },
    [selectedYear]
  )

  const onYearOpen = useCallback(() => {
    if (yearRefHandle.current) yearRefHandle.current.open = true
  }, [yearRefHandle])

  const onYearOpenSelect = useCallback(
    (_year: number) => {
      changeDisplay(selectedMonth, _year)
    },
    [selectedMonth]
  )

  const onBackPressed = useCallback(() => {
    if (selectedMonth === 0)
      changeDisplay(11, parseInt(String(selectedYear)) - 1)
    else changeDisplay(parseInt(String(selectedMonth)) - 1, selectedYear)
  }, [selectedMonth, selectedYear])

  const onForwardPressed = useCallback(() => {
    if (selectedMonth === 11)
      changeDisplay(0, parseInt(String(selectedYear)) + 1)
    else changeDisplay(parseInt(String(selectedMonth)) + 1, selectedYear)
  }, [selectedMonth, selectedYear])

  useEffect(() => {
    if (!monthRefHandle.current && monthRef.current) {
      monthRefHandle.current = new MDCMenu(monthRef.current)
    }
    if (!yearRefHandle.current && yearRef.current) {
      yearRefHandle.current = new MDCMenu(yearRef.current)
    }
  }, [])

  const YEAR_RANGE = 80
  const CURRENT_YEAR = new Date().getFullYear()

  return (
    <div>
      <HeaderContainer>
        <DisplayMonthYearContainer>
          <FlexRow>
            <AsBtn className='mdc-menu-surface--anchor'>
              <span onClick={onMonthOpen}>
                {MONTH_NAMES[language][selectedMonth]}
              </span>
              <div
                className={`mdc-menu mdc-menu-surface mdc-menu-auto`}
                ref={monthRef}
              >
                <ul className='mdc-list'>
                  {map(range(12), (_, mIndex) => (
                    <li
                      key={`option-${mIndex}`}
                      onClick={() => {
                        onMonthSelect(mIndex)
                      }}
                      className='mdc-list-item'
                      role='menuitem'
                    >
                      <span className='mdc-list-item__text'>
                        {MONTH_NAMES[language][mIndex]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </AsBtn>
            <Separator />
            <AsBtn className='mdc-menu-surface--anchor'>
              <span onClick={onYearOpen}>
                {isNaN(selectedYear) ? '' : selectedYear}
              </span>
              <div
                className={`mdc-menu mdc-menu-surface mdc-menu-auto`}
                ref={yearRef}
              >
                <ul className='mdc-list'>
                  {map(range(YEAR_RANGE), (__, yIndex) => (
                    <li
                      key={`option-${yIndex}`}
                      onClick={() => {
                        onYearOpenSelect(CURRENT_YEAR - YEAR_RANGE + 8 + yIndex)
                      }}
                      className='mdc-list-item'
                      role='menuitem'
                    >
                      <span className='mdc-list-item__text'>
                        {CURRENT_YEAR - YEAR_RANGE + 8 + yIndex}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </AsBtn>
          </FlexRow>
        </DisplayMonthYearContainer>
        <ActionButton onClick={onBackPressed}>
          <MaterialIcon role={'button'} icon={'keyboard_arrow_left'} />
        </ActionButton>
        <ActionButton onClick={onForwardPressed}>
          <MaterialIcon role={'button'} icon={'keyboard_arrow_right'} />
        </ActionButton>
      </HeaderContainer>
      <DaysContainer>
        <FlexOne>
          <DayContainer>{DAY_NAMES[language][0]}</DayContainer>
        </FlexOne>
        <FlexOne>
          <DayContainer>{DAY_NAMES[language][1]}</DayContainer>
        </FlexOne>
        <FlexOne>
          <DayContainer>{DAY_NAMES[language][2]}</DayContainer>
        </FlexOne>
        <FlexOne>
          <DayContainer>{DAY_NAMES[language][3]}</DayContainer>
        </FlexOne>
        <FlexOne>
          <DayContainer>{DAY_NAMES[language][4]}</DayContainer>
        </FlexOne>
        <FlexOne>
          <DayContainer>{DAY_NAMES[language][5]}</DayContainer>
        </FlexOne>
        <FlexOne>
          <DayContainer>{DAY_NAMES[language][6]}</DayContainer>
        </FlexOne>
      </DaysContainer>
    </div>
  )
}

export const DatepickerHeader = memo(_DatepickerHeader)
