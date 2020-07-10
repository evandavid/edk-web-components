import { isEqual, map, range, sortBy } from 'lodash';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';

import { FlexOne, FlexRow } from '../flex';
import { formattedDate, numberFormat, shortNumberFormat } from '../functions';
import {
  Container,
  CursorContainer,
  CursorElement,
  DateDetailContainer,
  DateLabel,
  DetailContainer,
  DetailLabelText,
  DetailTextContainer,
  DetailTextInnerContainer,
  DottedLine,
  HorizontalLabel,
  HorizontalLine,
  Label,
  LabelTitle,
  LegendElement,
  LineChartContainer,
  LineInnerContainer,
  VerticalContainer,
  VerticalCursor,
  VerticalLabelContainer,
  VerticalLine,
  WhiteCursor,
  ZeroLabel
} from './elements';
import { ChartColors, twoYAxisLineChartAction } from './util';

function _TwoYAxisLineChart(props: {
  language: string
  data: number[][]
  labels: string[]
  date: string[]
  formattedValue?: ((val: any) => void)[]
}) {
  const format = (val: any) => numberFormat(val, props.language)

  const {
    language,
    data,
    date,
    labels,
    formattedValue = [format, format, format, format, format]
  } = props
  const ContainerRef = useRef<any>()
  const CursorContainerRef = map(range(10), (_) => useRef<any>(null))
  const DetailItemContainerRef = map(range(10), (_) => useRef<any>(null))
  const DetailTextRef = map(range(10), (_) => useRef<any>(null))
  const VerticalCursorRef = useRef<any>()
  const SelectedDateDetailRef = useRef<any>()
  const DetailContainerRef = useRef<any>()
  const holderData = useRef<any>()

  const [readyToProcess, setReadyToProcess] = useState<boolean>(false)
  const [lineData, setLineData] = useState<number[][]>(data)
  const [lineDate, setLineDate] = useState<string[]>(date)

  // preprocessing sort date
  const preprocessing = useCallback(() => {
    !isEqual(holderData.current, props.data) &&
      (() => {
        setReadyToProcess(false)
        const combined = map(date, (_, i) => ({
          date: date[i],
          1: data[0][i],
          2: data[1][i]
        }))

        const sorted: any = sortBy(combined, ['date'], ['asc'])
        let _date: any = [],
          _data = [[], []]
        map(sorted, (_, i) => {
          _date[i] = sorted[i]['date']
          _data[0][i] = sorted[i]['1']
          _data[1][i] = sorted[i]['2']
        })

        setLineData(_data)
        setLineDate(_date)
        setReadyToProcess(true)
        holderData.current = props.data
      })()
  }, [props])

  const {
    verticalMaxMin,
    firstAndLastDate,
    getLabel,
    lines
  } = twoYAxisLineChartAction(
    language,
    lineData,
    lineDate,
    ContainerRef,
    CursorContainerRef,
    VerticalCursorRef,
    SelectedDateDetailRef,
    DetailTextRef,
    DetailItemContainerRef,
    DetailContainerRef,
    formattedValue,
    readyToProcess
  )

  useEffect(() => {
    preprocessing()
  }, [props.data])

  return (
    <div>
      <Container>
        <React.Fragment>
          {/* right vertical line */}
          <VerticalLabelContainer width={100} marginRight={6}>
            <VerticalContainer>
              <HorizontalLabel>
                <LabelTitle
                  style={{ textAlign: 'right' }}
                  // hide={verticalMaxMin.max === null ? 'yes' : 'no'}
                  dangerouslySetInnerHTML={{
                    __html: props.labels[0]
                  }}
                />
              </HorizontalLabel>
              <HorizontalLabel>
                <Label
                  style={{ textAlign: 'right' }}
                  hide={getLabel(0, 3) === null ? 'yes' : 'no'}
                  dangerouslySetInnerHTML={{
                    __html: shortNumberFormat(getLabel(0, 3), language)
                  }}
                />
              </HorizontalLabel>
              <HorizontalLabel>
                <Label
                  style={{ textAlign: 'right' }}
                  hide={getLabel(0, 2) === null ? 'yes' : 'no'}
                  dangerouslySetInnerHTML={{
                    __html: shortNumberFormat(getLabel(0, 2), language)
                  }}
                />
              </HorizontalLabel>
              <HorizontalLabel>
                <Label
                  style={{ textAlign: 'right' }}
                  hide={getLabel(0, 1) === null ? 'yes' : 'no'}
                  dangerouslySetInnerHTML={{
                    __html: shortNumberFormat(getLabel(0, 1), language)
                  }}
                />
              </HorizontalLabel>
            </VerticalContainer>
            <ZeroLabel
              style={{
                width: '100%'
              }}
            >
              <Label
                style={{ textAlign: 'right' }}
                hide={verticalMaxMin[0].min === null ? 'yes' : 'no'}
                dangerouslySetInnerHTML={{
                  __html: shortNumberFormat(verticalMaxMin[0].min, language)
                }}
              />
            </ZeroLabel>
          </VerticalLabelContainer>
          <VerticalLine width={4} background={ChartColors[0]} />
          {/* end of right vertical line */}
        </React.Fragment>
        <FlexOne>
          <LineChartContainer>
            <VerticalContainer>
              <DottedLine />
              <DottedLine />
              <DottedLine />
              <DottedLine />
            </VerticalContainer>
            {/* chart here */}

            <LineInnerContainer ref={ContainerRef}>
              <svg
                width={'100%'}
                height={'100%'}
                style={{ overflow: 'inherit', pointerEvents: 'none' }}
              >
                <g>
                  {map(lines, (line, idx) => (
                    <path
                      key={`line-${idx}`}
                      d={line}
                      fill={'transparent'}
                      stroke={ChartColors[idx]}
                      strokeWidth={3}
                    />
                  ))}
                </g>
              </svg>

              {map(lines, (_, i) => (
                <CursorContainer
                  key={`cursor-${i}`}
                  ref={CursorContainerRef[i]}
                >
                  <CursorElement color={ChartColors[i]}>
                    <WhiteCursor />
                  </CursorElement>
                </CursorContainer>
              ))}
              <VerticalCursor ref={VerticalCursorRef} />

              {/* chart label */}
              <DetailContainer ref={DetailContainerRef}>
                <DateDetailContainer ref={SelectedDateDetailRef} />
                <DetailTextContainer>
                  {map(labels, (label, i) => (
                    <DetailTextInnerContainer
                      key={`label-${i}`}
                      ref={DetailItemContainerRef[i]}
                    >
                      <FlexRow style={{ alignItems: 'flex-start' }}>
                        <LegendElement color={ChartColors[i]} />
                        <FlexOne>
                          <div ref={DetailTextRef[i]} />
                          <DetailLabelText>{label}</DetailLabelText>
                        </FlexOne>
                      </FlexRow>
                    </DetailTextInnerContainer>
                  ))}
                </DetailTextContainer>
              </DetailContainer>

              {/* chart label end here */}
            </LineInnerContainer>
            {/* chart end here */}
          </LineChartContainer>
          <HorizontalLine />
          <FlexRow>
            <FlexOne>
              <DateLabel hide={firstAndLastDate.first === null ? 'yes' : 'no'}>
                {formattedDate(firstAndLastDate.first, language)}
              </DateLabel>
            </FlexOne>
            <FlexOne>
              <DateLabel
                hide={firstAndLastDate.last === null ? 'yes' : 'no'}
                style={{ textAlign: 'right' }}
              >
                {formattedDate(firstAndLastDate.last, language)}
              </DateLabel>
            </FlexOne>
          </FlexRow>
        </FlexOne>
        <React.Fragment>
          {/* left vertical line */}
          <VerticalLine width={4} background={ChartColors[1]} />
          <VerticalLabelContainer width={100} marginLeft={6}>
            <VerticalContainer>
              <HorizontalLabel>
                <LabelTitle
                  // hide={verticalMaxMin.max === null ? 'yes' : 'no'}
                  dangerouslySetInnerHTML={{
                    __html: props.labels[1]
                  }}
                />
              </HorizontalLabel>
              <HorizontalLabel>
                <Label
                  hide={getLabel(1, 3) === null ? 'yes' : 'no'}
                  dangerouslySetInnerHTML={{
                    __html: shortNumberFormat(getLabel(1, 3), language)
                  }}
                />
              </HorizontalLabel>
              <HorizontalLabel>
                <Label
                  hide={getLabel(1, 2) === null ? 'yes' : 'no'}
                  dangerouslySetInnerHTML={{
                    __html: shortNumberFormat(getLabel(1, 2), language)
                  }}
                />
              </HorizontalLabel>
              <HorizontalLabel>
                <Label
                  hide={getLabel(1, 1) === null ? 'yes' : 'no'}
                  dangerouslySetInnerHTML={{
                    __html: shortNumberFormat(getLabel(1, 1), language)
                  }}
                />
              </HorizontalLabel>
            </VerticalContainer>
            <ZeroLabel>
              <Label
                hide={verticalMaxMin[1].min === null ? 'yes' : 'no'}
                dangerouslySetInnerHTML={{
                  __html: shortNumberFormat(verticalMaxMin[1].min, language)
                }}
              />
            </ZeroLabel>
          </VerticalLabelContainer>
          {/* end of left vertical line */}
        </React.Fragment>
      </Container>
    </div>
  )
}

export const TwoYAxisLineChart = memo(_TwoYAxisLineChart)
