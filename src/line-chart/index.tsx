import { map, range } from 'lodash';
import React, { memo, useRef } from 'react';

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
import { ChartColors, lineChartAction, Point } from './util';

function _LineChart(props: {
  language: string
  data: Point[][]
  labels: string[]
  formattedValue?: ((val: any) => void)[]
}) {
  const format = (val: any) => numberFormat(val, props.language)

  const {
    language,
    data,
    labels,
    formattedValue = [format, format, format, format, format]
  } = props
  const ContainerRef = useRef<any>()
  const CursorContainerRef: any = map(range(10), (_) => useRef<any>(null))
  const DetailItemContainerRef = map(range(10), (_) => useRef<any>(null))
  const DetailTextRef = map(range(10), (_) => useRef<any>(null))
  const VerticalCursorRef = useRef<any>()
  const SelectedDateDetailRef = useRef<any>()
  const DetailContainerRef = useRef<any>()

  const { verticalMaxMin, firstAndLastDate, getLabel, lines } = lineChartAction(
    language,
    data,
    false,
    ContainerRef,
    CursorContainerRef,
    VerticalCursorRef,
    SelectedDateDetailRef,
    DetailTextRef,
    DetailItemContainerRef,
    DetailContainerRef,
    formattedValue
  )

  return (
    <div>
      <Container>
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
        <VerticalLine />
        <VerticalLabelContainer>
          <VerticalContainer>
            <HorizontalLabel>
              <Label
                hide={verticalMaxMin.max === null ? 'yes' : 'no'}
                dangerouslySetInnerHTML={{
                  __html: shortNumberFormat(verticalMaxMin.max, language)
                }}
              />
            </HorizontalLabel>
            <HorizontalLabel>
              <Label
                hide={getLabel(3) === null ? 'yes' : 'no'}
                dangerouslySetInnerHTML={{
                  __html: shortNumberFormat(getLabel(3), language)
                }}
              />
            </HorizontalLabel>
            <HorizontalLabel>
              <Label
                hide={getLabel(2) === null ? 'yes' : 'no'}
                dangerouslySetInnerHTML={{
                  __html: shortNumberFormat(getLabel(2), language)
                }}
              />
            </HorizontalLabel>
            <HorizontalLabel>
              <Label
                hide={getLabel(1) === null ? 'yes' : 'no'}
                dangerouslySetInnerHTML={{
                  __html: shortNumberFormat(getLabel(1), language)
                }}
              />
            </HorizontalLabel>
          </VerticalContainer>
          <ZeroLabel>
            <Label
              hide={verticalMaxMin.min === null ? 'yes' : 'no'}
              dangerouslySetInnerHTML={{
                __html: shortNumberFormat(verticalMaxMin.min, language)
              }}
            />
          </ZeroLabel>
        </VerticalLabelContainer>
      </Container>
    </div>
  )
}

export const LineChart = memo(_LineChart)
