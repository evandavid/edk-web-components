import { arc, pie } from 'd3-shape';
import { filter, map, sumBy } from 'lodash';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { numberFormat } from '../functions';
import { Slice } from './slice';

const InnerContentContainer = styled.div<any>`
  pointer-events: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: ${(props) => props.opacity};
`

const InnerContentContainerInside = styled.div<any>`
  width: ${(props) => props.width}px;
  transform: translate(-50%, -50%);
  left: 50%;
  position: relative;
  top: 50%;
  text-lign: center;
`

interface IDonutData {
  percentage: number
  label: string
  color?: string
  typeId?: number
  value?: any
}

function _DonutChart(props: {
  data?: IDonutData[]
  defaultSelected?: number
  language?: string
  size: number
  providedInnerText?: string
  providedInnerValue?: string
  hideCenter?: boolean
  small?: boolean
  onSelectedSlice?(index: number): void
}) {
  const {
    size,
    defaultSelected = 0,
    language = 'idn',
    providedInnerValue,
    providedInnerText,
    hideCenter = false,
    small = false
  } = props
  const availableSize = size - 10

  const colors = useMemo(
    () => [
      {
        colorStart: '#fdeb71',
        colorEnd: '#f8d800'
      },
      {
        colorStart: '#abdcff',
        colorEnd: '#0396ff'
      },
      {
        colorStart: '#feb692',
        colorEnd: '#ea5455'
      },
      {
        colorStart: '#ce9ffc',
        colorEnd: '#7367f0'
      },
      {
        colorStart: '#90f7ec',
        colorEnd: '#32ccbc'
      },
      {
        colorStart: '#fff6b7',
        colorEnd: '#f6416c'
      },
      {
        colorStart: '#81fbb8',
        colorEnd: '#28c76f'
      },
      {
        colorStart: '#e2b0ff',
        colorEnd: '#9f44d3'
      }
    ],
    []
  )

  const initialData: any = useMemo(
    () => [
      {
        value: 0,
        display: `${numberFormat(0, language, 2)}%`,
        label: ''
      },
      {
        value: 0,
        display: `${numberFormat(0, language, 2)}%`,
        label: ''
      },
      {
        value: 0,
        display: `${numberFormat(0, language, 2)}%`,
        label: ''
      },
      {
        value: 0,
        display: `${numberFormat(0, language, 2)}%`,
        label: ''
      }
    ],
    []
  )

  const [paths, setPaths] = useState<any>({ activePath: [], path: [] })
  const [baseURL, setBaseURL] = useState('')
  const [data, setData] = useState(initialData)
  const [selected, setSelected] = useState(defaultSelected)

  const drawCircle = useCallback(() => {
    const dataWithValue = filter(data, (o) => o.value)
    if (dataWithValue.length) {
      const arcs = pie()
        .startAngle(-0.3)
        .sort((d: any) => d.label)
        .padAngle(0.05)
        .value((d: any) => d.value)(dataWithValue)

      const pths: any = { activePath: [], path: [] }
      const sliceWidth = small ? 14 : 25
      const smallSliceWidth = small ? 4 : 7
      const outerRadius = availableSize / 2
      const innerRadius = outerRadius - sliceWidth
      map(arcs, (a: any, index: number) => {
        pths.activePath[index] = arc()
          .outerRadius(outerRadius)
          .innerRadius(innerRadius)(a)
        pths.path[index] = arc()
          .outerRadius(outerRadius - smallSliceWidth)
          .innerRadius(innerRadius + smallSliceWidth)(a)
      })

      setPaths(pths)
    }
  }, [defaultSelected, data, availableSize, selected, props])

  const setSelectedSlice = useCallback(
    (nextSelected: number) => {
      setSelected(nextSelected)
      props.onSelectedSlice && props.onSelectedSlice(nextSelected)
    },
    [props]
  )

  const getBaseURL = useCallback((): string => {
    return typeof window !== 'undefined' ? `${window.location.href}` : ''
  }, [])

  useEffect(() => {
    drawCircle()
  }, [selected, data, props.language])

  useEffect(() => {
    setTimeout(() => {
      const _baseURL = getBaseURL()
      setBaseURL(_baseURL)
    }, 100)
  }, [props.language])

  useEffect(() => {
    if (props.data) setData(props.data)
  }, [props.data])

  const dataWithValue = filter(data, (o) => o.value)
  const selectedSlice = dataWithValue[selected] || {}
  const totalScore = sumBy(data, 'value')

  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg {...{ width: size, height: size }}>
        <defs>
          <filter id={'dropshadow'} height={'130%'} width={'130%'}>
            <feGaussianBlur in='SourceAlpha' stdDeviation='3' />
            <feOffset dx='2' dy='2' result='offsetblur' />
            <feComponentTransfer>
              <feFuncA type='linear' slope='0.14'></feFuncA>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in='SourceGraphic'></feMergeNode>
            </feMerge>
          </filter>
          {map(
            colors,
            (
              color: { colorStart: string; colorEnd: string },
              index: number
            ) => (
              <linearGradient
                key={`style-${index}`}
                id={`gradient-${index}`}
                x1='0%'
                y1='0%'
                x2='100%'
                y2='0%'
              >
                <stop offset='0%' stopColor={color.colorStart} />
                <stop offset='100%' stopColor={color.colorEnd} />
              </linearGradient>
            )
          )}
        </defs>
        <g
          style={{
            transform: `translate(${size / 2}px, ${size / 2}px)`
          }}
        >
          {map(paths.activePath, (p, index: number) => (
            <Slice
              key={`slice-border-${index}`}
              path={paths.path[index]}
              activepath={p}
              sliceactive={index === selected}
              filter={`url(${baseURL}#dropshadow)`}
              fill={
                dataWithValue[index]
                  ? `url(${baseURL}#gradient-${index})`
                  : undefined
              }
              style={{ cursor: 'pointer' }}
              onClick={(e: Event) => {
                setSelectedSlice(index)
                e.stopPropagation()
              }}
            />
          ))}
          <circle
            x={availableSize / 2}
            y={availableSize / 2}
            r={availableSize / 2 - 37}
            fill={totalScore ? '#F6FAFF' : 'rgba(0,0,0,0)'}
          />
        </g>
      </svg>
      {hideCenter ? null : (
        <InnerContentContainer opacity={totalScore ? 1 : 0}>
          <InnerContentContainerInside width={availableSize - 37 * 2}>
            <div style={{ fontSize: 11, color: '#757575', marginBottom: 6 }}>
              <span
                dangerouslySetInnerHTML={{
                  __html: providedInnerText
                    ? providedInnerText
                    : selectedSlice.label
                }}
              />
            </div>
            <div>
              <span
                dangerouslySetInnerHTML={{
                  __html: providedInnerValue
                    ? providedInnerValue
                    : numberFormat(selectedSlice.value, language, 2)
                }}
              />
              %
            </div>
          </InnerContentContainerInside>
        </InnerContentContainer>
      )}
    </div>
  )
}

export const DonutChart = memo(_DonutChart)
