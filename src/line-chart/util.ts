import { scaleLinear, scaleTime } from 'd3-scale';
import * as shape from 'd3-shape';
import { isAfter, isBefore, isSameDay } from 'date-fns';
import { head, indexOf, isUndefined, last, map, max, maxBy, min, minBy, sortBy } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { svgPathProperties } from 'svg-path-properties';

import { formattedDate } from '../functions';

const d3 = { shape }

export type Point = { x: any; y: number }
export type MinMax = { max: number | null; min: number | null }
export type FirstLast = { first: any; last: any }
export const ChartColors = [
  '#28b4c8',
  '#ffd246',
  '#29CB97',
  '#aa46be',
  '#ff6358'
]
export const SoftChartColors = [
  '#edf9ff',
  '#effff9',
  '#fffaed',
  '#f5f4ff',
  '#fdf4ff'
]
export const HideLeft = 1000000

export const lineChartAction = (
  language: string,
  data: Point[][],
  madeUpScale: boolean,
  containerRef: { current: any },
  cursorContainerRef: { current: any }[],
  verticalCursorRef: { current: any },
  selectedDateDetailRef: { current: any },
  detailTextRef: { current: any }[],
  detailItemContainerRef: { current: any }[],
  detailContainerRef: { current: any },
  formattedValue: ((val: any) => any)[]
): {
  verticalMaxMin: MinMax
  firstAndLastDate: FirstLast
  lines: any[] | undefined
  getLabel: (position: number) => void
} => {
  const [lines, setLines] = useState<any[]>()
  const pathProperties = useRef<any>([])
  const scaleXs = useRef<any>([])

  const [verticalMaxMin, setVerticalMaxMin] = useState<MinMax>({
    min: null,
    max: null
  })

  const [firstAndLastDate, setFirstAndLastDate] = useState<FirstLast>({
    first: null,
    last: null
  })

  const findClosestIndex = useCallback((list, ValueDate) => {
    return (
      list &&
      (() => {
        const asDate = (d: any): any => new Date(d).getTime()
        const closestData = list.reduce((a: Point, b: Point) =>
          Math.abs(asDate(a.x) - asDate(ValueDate)) <
          Math.abs(asDate(b.x) - asDate(ValueDate))
            ? a
            : b
        )

        return closestData
      })()
    )
  }, [])

  const findXY = useCallback((x: number, properties: any) => {
    let pathLength = properties.getTotalLength()
    let start = 0
    let end = pathLength
    let target = (start + end) / 2
    x = Math.max(x, properties.getPointAtLength(0).x)
    x = Math.min(x, properties.getPointAtLength(pathLength).x)

    while (target >= start && target <= end) {
      let pos = properties.getPointAtLength(target)
      if (Math.abs(pos.x - x) < 0.1) {
        return pos
      } else if (pos.x > x) {
        end = target
      } else {
        start = target
      }
      target = (start + end) / 2
    }
  }, [])

  const getLabel = useCallback(
    (position: number) => {
      if (verticalMaxMin.max === null || verticalMaxMin.min === null)
        return null
      switch (position) {
        case 1:
          return (
            verticalMaxMin.min + (verticalMaxMin.max - verticalMaxMin.min) / 4
          )
        case 2:
          return (
            verticalMaxMin.min + (verticalMaxMin.max - verticalMaxMin.min) / 2
          )
        case 3:
          return (
            verticalMaxMin.min +
            ((verticalMaxMin.max - verticalMaxMin.min) / 4) * 3
          )
      }
      return undefined
    },
    [verticalMaxMin]
  )

  const numberScale = useCallback((data: number): number => {
    let absNumber = Math.round(Math.abs(Number(data))),
      actAsNumber = '1',
      numberAsString = isNaN(absNumber) ? '' : String(absNumber)
    for (let i = 1; i < numberAsString.length; i++) actAsNumber += '0'
    return parseInt(actAsNumber)
  }, [])

  const getNumberInBetween = useCallback((data: number): number => {
    let absNumber = Math.abs(Number(data)),
      numberAsString = isNaN(absNumber) ? '0' : String(absNumber).substr(1)
    return parseFloat(numberAsString)
  }, [])

  const prepareMinMax = useCallback(() => {
    let maxData: any = maxBy(
      map(data, (area) => maxBy(area, 'y')),
      'y'
    )
    let minData: any = minBy(
      map(data, (area) => minBy(area, 'y')),
      'y'
    )

    madeUpScale &&
      (() => {
        let scaleUp =
          parseFloat(String(maxData.y)) +
          (numberScale(maxData.y) - getNumberInBetween(maxData.y))
        let scaleDown =
          parseFloat(String(minData.y)) -
          (numberScale(minData.y) + getNumberInBetween(minData.y))
        scaleDown = isNaN(scaleDown) ? 0 : scaleDown

        maxData.y = isNaN(scaleUp) ? 5 : scaleUp
        minData.y = scaleDown < 0 ? minData.y : scaleDown
      })()

    minData && maxData && setVerticalMaxMin({ min: minData.y, max: maxData.y })
    return { minY: minData, maxY: maxData }
  }, [data])

  const prepareFirstLast = useCallback(() => {
    let lastData: any = maxBy(
      map(data, (area) => maxBy(area, 'x')),
      'x'
    )
    let firstData: any = minBy(
      map(data, (area) => minBy(area, 'x')),
      'x'
    )

    firstData &&
      lastData &&
      setFirstAndLastDate({ first: firstData.x, last: lastData.x })
    return { minX: firstData, maxX: lastData }
  }, [data])

  const prepareChart = useCallback(() => {
    const { minY, maxY } = prepareMinMax()
    const { minX, maxX } = prepareFirstLast()

    !isUndefined(minY) &&
    !isUndefined(maxY) &&
    !isUndefined(minX) &&
    !isUndefined(maxX)
      ? (() => {
          const _lines: any = []
          map(data, (datum: any, idx) => {
            const verticalPadding = 2
            const chartHeight = 200
            const width = containerRef.current.clientWidth

            const scaleX = scaleTime()
              .domain([minX.x, maxX.x])
              .range([0, width])

            const scaleY = scaleLinear()
              .domain([minY.y, maxY.y])
              .range([chartHeight - verticalPadding, verticalPadding])

            _lines[idx] = d3.shape
              .line()
              .x((d: any) => scaleX(d.x))
              .y((d: any) => scaleY(d.y))
              .curve(d3.shape.curveBasis)(datum)

            scaleXs.current[idx] = scaleX
            if (_lines[idx])
              pathProperties.current[idx] = new svgPathProperties(_lines[idx])
          })

          setLines(_lines)
        })()
      : setLines(undefined)
  }, [data])

  const onCursorMove = useCallback(
    (event: MouseEvent) => {
      !isUndefined(lines) &&
        (() => {
          const { clientX } = event
          const { left } = containerRef.current.getBoundingClientRect()
          const positionLeft = clientX - left
          const chartHeight = containerRef.current.clientHeight
          let detailHeight = 0

          // parent detail move
          detailContainerRef.current &&
            (() => {
              const padd = 12
              const detailWidth = detailContainerRef.current.clientWidth
              const chartWidth = containerRef.current.clientWidth
              detailHeight = detailContainerRef.current.clientHeight
              const mostRight = chartWidth - detailWidth

              const detailLeft =
                positionLeft + padd < mostRight
                  ? positionLeft + padd
                  : positionLeft - detailWidth - padd

              detailContainerRef.current.style.left = `${detailLeft}px`
            })()
          // end parent detail move

          // vertical dashed line move
          verticalCursorRef.current &&
            (() => {
              verticalCursorRef.current.style.left = `${positionLeft}px`
            })()
          // end vertical dashed line move
          let mostTop = 0
          let mostBottom = 1000

          cursorContainerRef.length &&
            (() => {
              map(cursorContainerRef, (curContainer, idx) => {
                curContainer.current &&
                  positionLeft >= 0 &&
                  (() => {
                    const scaleX = scaleXs.current[idx]
                    const x0 = scaleX.invert(positionLeft)
                    const x0AsDate = new Date(x0)

                    const list = sortBy(data[idx], 'x')
                    const firstDate = new Date(list[0].x)
                    const lastDate = new Date(list[list.length - 1].x)

                    const validDate: any =
                      (isBefore(x0AsDate, lastDate) &&
                        isAfter(x0AsDate, firstDate)) ||
                      isSameDay(x0AsDate, lastDate) ||
                      isSameDay(x0AsDate, firstDate)

                    switch (validDate) {
                      case false:
                        curContainer.current.style.left = `${-HideLeft}px`
                        curContainer.current.style.top = `${-HideLeft}px`

                        detailItemContainerRef[idx].current &&
                          (() =>
                            (detailItemContainerRef[idx].current.style.display =
                              'none'))()
                        break
                      default:
                        const selectedData: any = findClosestIndex(
                          data[idx],
                          x0AsDate
                        )
                        selectedData &&
                          (() => {
                            const { x, y } = findXY(
                              positionLeft,
                              pathProperties.current[idx]
                            )

                            mostTop = Math.max(mostTop, y)
                            mostBottom = Math.min(mostBottom, y)

                            curContainer.current.style.left = `${x - 4}px`
                            curContainer.current.style.top = `${y - 4}px`

                            // detail text
                            detailTextRef[idx].current &&
                              (() =>
                                (detailTextRef[
                                  idx
                                ].current.innerHTML = formattedValue[idx](
                                  selectedData.y
                                )))()

                            detailItemContainerRef[idx].current &&
                              (() =>
                                (detailItemContainerRef[
                                  idx
                                ].current.style.display = 'block'))()

                            selectedDateDetailRef.current &&
                              (() => {
                                selectedDateDetailRef.current.innerHTML = formattedDate(
                                  selectedData.x,
                                  language
                                )
                              })()
                            // end of detail text
                          })()
                        break
                    }
                  })()
              })
            })()

          detailContainerRef.current &&
            (() => {
              const middlePosition = (mostTop + mostBottom) / 2
              const halfHeight = detailHeight / 2
              const topPosition = Math.min(
                Math.max(0, middlePosition - halfHeight),
                chartHeight - detailHeight
              )

              detailContainerRef.current.style.top = `${topPosition}px`
            })()
        })()
    },
    [
      lines,
      data,
      containerRef,
      cursorContainerRef,
      pathProperties,
      scaleXs,
      verticalCursorRef,
      formattedValue,
      detailTextRef,
      detailContainerRef
    ]
  )

  const hideCursor = useCallback(() => {
    cursorContainerRef.length &&
      verticalCursorRef.current &&
      detailContainerRef.current &&
      (() => {
        map(cursorContainerRef, (curContainer) => {
          curContainer.current &&
            (() => {
              curContainer.current.style.left = `${-HideLeft}px`
              curContainer.current.style.top = `${-HideLeft}px`
              verticalCursorRef.current.style.left = `${-HideLeft}px`
              detailContainerRef.current.style.left = `${-HideLeft}px`
            })()
        })
      })()
  }, [containerRef, cursorContainerRef, verticalCursorRef, detailContainerRef])

  useEffect(() => {
    prepareChart()
  }, [data])

  useEffect(() => {
    containerRef.current &&
      (() => {
        containerRef.current.addEventListener('mousemove', onCursorMove, false)
        containerRef.current.addEventListener('mouseleave', hideCursor, false)
      })()
    return () => {
      containerRef.current.removeEventListener('mousemove', onCursorMove, false)
      containerRef.current.removeEventListener('mouseleave', hideCursor, false)
    }
  }, [containerRef, data])

  return {
    verticalMaxMin,
    firstAndLastDate,
    getLabel,
    lines
  }
}

export const twoYAxisLineChartAction = (
  language: string,
  data: number[][],
  date: string[],
  containerRef: { current: any },
  cursorContainerRef: { current: any }[],
  verticalCursorRef: { current: any },
  selectedDateDetailRef: { current: any },
  detailTextRef: { current: any }[],
  detailItemContainerRef: { current: any }[],
  detailContainerRef: { current: any },
  formattedValue: ((val: any) => any)[]
): {
  verticalMaxMin: MinMax[]
  firstAndLastDate: FirstLast
  lines: string[] | undefined
  getLabel: (listIndex: number, position: number) => void
} => {
  const [lines, setLines] = useState<string[]>()
  const pathProperties = useRef<any>([])
  const scaleXs = useRef<any>([])

  const [verticalMaxMin, setVerticalMaxMin] = useState<any[]>([
    {
      min: null,
      max: null
    },
    {
      min: null,
      max: null
    }
  ])

  const [firstAndLastDate, setFirstAndLastDate] = useState<FirstLast>({
    first: null,
    last: null
  })

  const findClosestIndex = useCallback((list, ValueDate) => {
    return (
      list &&
      (() => {
        const asDate = (d: any): any => new Date(d).getTime()
        const closestData = list.reduce((a: Point, b: Point) =>
          Math.abs(asDate(a) - asDate(ValueDate)) <
          Math.abs(asDate(b) - asDate(ValueDate))
            ? a
            : b
        )

        return closestData
      })()
    )
  }, [])

  const findXY = useCallback((x: number, properties: any) => {
    let pathLength = properties.getTotalLength()
    let start = 0
    let end = pathLength
    let target = (start + end) / 2
    x = Math.max(x, properties.getPointAtLength(0).x)
    x = Math.min(x, properties.getPointAtLength(pathLength).x)

    while (target >= start && target <= end) {
      let pos = properties.getPointAtLength(target)
      if (Math.abs(pos.x - x) < 0.1) {
        return pos
      } else if (pos.x > x) {
        end = target
      } else {
        start = target
      }
      target = (start + end) / 2
    }
  }, [])

  const getLabel = useCallback(
    (listIndex: number, position: number) => {
      if (
        verticalMaxMin[listIndex].max === null ||
        verticalMaxMin[listIndex].min === null
      )
        return null
      switch (position) {
        case 1:
          return (
            verticalMaxMin[listIndex].min +
            (verticalMaxMin[listIndex].max - verticalMaxMin[listIndex].min) / 4
          )
        case 2:
          return (
            verticalMaxMin[listIndex].min +
            (verticalMaxMin[listIndex].max - verticalMaxMin[listIndex].min) / 2
          )
        case 3:
          return (
            verticalMaxMin[listIndex].min +
            ((verticalMaxMin[listIndex].max - verticalMaxMin[listIndex].min) /
              4) *
              3
          )
      }

      return null
    },
    [verticalMaxMin]
  )

  const prepareMinMax = useCallback(() => {
    const firstList = { min: min(data[0]), max: max(data[0]) }
    const secondList = { min: min(data[1]), max: max(data[1]) }

    data[0] &&
      data[1] &&
      data[0].length &&
      data[1].length &&
      setVerticalMaxMin([firstList, secondList])
    return [firstList, secondList]
  }, [data])

  const prepareFirstLast = useCallback(() => {
    const sorted = sortBy(date, (o) => new Date(o))

    let lastData: any = last(sorted)
    let firstData: any = head(sorted)

    firstData &&
      lastData &&
      setFirstAndLastDate({ first: firstData, last: lastData })
    return { minX: firstData, maxX: lastData }
  }, [date])

  const prepareChart = useCallback(() => {
    setLines(undefined)
    const minMaxY = prepareMinMax()
    const {
      minX,
      maxX
    }: { minX: number | string; maxX: number | string } = prepareFirstLast()

    data[0] &&
      data[1] &&
      data[0].length &&
      data[1].length &&
      !isUndefined(minX) &&
      !isUndefined(maxX) &&
      (() => {
        const _lines: any = []
        map(data, (datum: any, idx) => {
          const verticalPadding = 2
          const chartHeight = 200
          const width = containerRef.current.clientWidth

          const minAsTime = new Date(minX).getTime()
          const maxAsTime = new Date(maxX).getTime()
          const scaleX = scaleTime()
            .domain([minAsTime, maxAsTime])
            .range([0, width])

          const scaleY = scaleLinear()
            .domain([minMaxY[idx].min, minMaxY[idx].max])
            .range([chartHeight - verticalPadding, verticalPadding])

          _lines[idx] = d3.shape
            .line()
            .x((_: any, i: number) => scaleX(new Date(date[i]).getTime()))
            .y((d: any) => scaleY(d))
            .curve(d3.shape.curveBasis)(datum)

          scaleXs.current[idx] = scaleX
          if (_lines[idx])
            pathProperties.current[idx] = new svgPathProperties(_lines[idx])
        })

        setLines(_lines)
      })()
  }, [data])

  const onCursorMove = useCallback(
    (event: MouseEvent) => {
      !isUndefined(lines) &&
        (() => {
          const { clientX } = event
          const { left } = containerRef.current.getBoundingClientRect()
          const positionLeft = clientX - left
          const chartHeight = containerRef.current.clientHeight
          let detailHeight = 0

          // parent detail move
          detailContainerRef.current &&
            (() => {
              const padd = 12
              const detailWidth = detailContainerRef.current.clientWidth
              const chartWidth = containerRef.current.clientWidth
              detailHeight = detailContainerRef.current.clientHeight
              const mostRight = chartWidth - detailWidth

              const detailLeft =
                positionLeft + padd < mostRight
                  ? positionLeft + padd
                  : positionLeft - detailWidth - padd

              detailContainerRef.current.style.left = `${detailLeft}px`
            })()
          // end parent detail move

          // vertical dashed line move
          verticalCursorRef.current &&
            (() => {
              verticalCursorRef.current.style.left = `${positionLeft}px`
            })()
          // end vertical dashed line move
          let mostTop = 0
          let mostBottom = 1000

          cursorContainerRef.length &&
            (() => {
              map(cursorContainerRef, (curContainer, idx) => {
                curContainer.current &&
                  positionLeft >= 0 &&
                  (() => {
                    const scaleX = scaleXs.current[idx]
                    const x0 = scaleX.invert(positionLeft)
                    const x0AsDate = new Date(x0)

                    const firstDate = new Date(date[0])
                    const lastDate = new Date(date[date.length - 1])

                    const validDate: any =
                      (isBefore(x0AsDate, lastDate) &&
                        isAfter(x0AsDate, firstDate)) ||
                      isSameDay(x0AsDate, lastDate) ||
                      isSameDay(x0AsDate, firstDate)

                    switch (validDate) {
                      case false:
                        curContainer.current.style.left = `${-HideLeft}px`
                        curContainer.current.style.top = `${-HideLeft}px`

                        detailItemContainerRef[idx].current &&
                          (() =>
                            (detailItemContainerRef[idx].current.style.display =
                              'none'))()
                        break
                      default:
                        const findClosestDate = findClosestIndex(date, x0AsDate)
                        const dateIndex = indexOf(date, findClosestDate)
                        const selectedData: any = data[idx][dateIndex]

                        selectedData &&
                          (() => {
                            const { x, y } = findXY(
                              positionLeft,
                              pathProperties.current[idx]
                            )

                            mostTop = Math.max(mostTop, y)
                            mostBottom = Math.min(mostBottom, y)

                            curContainer.current.style.left = `${x - 4}px`
                            curContainer.current.style.top = `${y - 4}px`

                            // detail text
                            detailTextRef[idx].current &&
                              (() =>
                                (detailTextRef[
                                  idx
                                ].current.innerHTML = formattedValue[idx](
                                  selectedData
                                )))()

                            detailItemContainerRef[idx].current &&
                              (() =>
                                (detailItemContainerRef[
                                  idx
                                ].current.style.display = 'block'))()

                            selectedDateDetailRef.current.innerHTML = formattedDate(
                              findClosestDate,
                              language
                            )
                            // end of detail text
                          })()
                        break
                    }
                  })()
              })
            })()

          detailContainerRef.current &&
            (() => {
              const middlePosition = (mostTop + mostBottom) / 2
              const halfHeight = detailHeight / 2
              const topPosition = Math.min(
                Math.max(0, middlePosition - halfHeight),
                chartHeight - detailHeight
              )

              detailContainerRef.current.style.top = `${topPosition}px`
            })()
        })()
    },
    [
      lines,
      data,
      date,
      containerRef,
      cursorContainerRef,
      pathProperties,
      scaleXs,
      verticalCursorRef,
      formattedValue,
      detailTextRef,
      detailContainerRef
    ]
  )

  const hideCursor = useCallback(() => {
    cursorContainerRef.length &&
      verticalCursorRef.current &&
      detailContainerRef.current &&
      (() => {
        map(cursorContainerRef, (curContainer) => {
          curContainer.current &&
            (() => {
              curContainer.current.style.left = `${-HideLeft}px`
              curContainer.current.style.top = `${-HideLeft}px`
              verticalCursorRef.current.style.left = `${-HideLeft}px`
              detailContainerRef.current.style.left = `${-HideLeft}px`
            })()
        })
      })()
  }, [containerRef, cursorContainerRef, verticalCursorRef, detailContainerRef])

  useEffect(() => {
    prepareChart()
  }, [data])

  useEffect(() => {
    !(data[0] && data[1] && data[0].length && data[1].length) &&
      (() => {
        setTimeout(() => {
          detailContainerRef.current &&
            verticalCursorRef.current &&
            (() => {
              detailContainerRef.current.style.left = `${-HideLeft}px`
              verticalCursorRef.current.style.left = `${-HideLeft}px`
            })()
        }, 100)
      })()
  }, [data])

  useEffect(() => {
    containerRef.current &&
      (() => {
        containerRef.current.addEventListener('mousemove', onCursorMove, false)
        containerRef.current.addEventListener('mouseleave', hideCursor, false)
      })()
    return () => {
      containerRef.current.removeEventListener('mousemove', onCursorMove, false)
      containerRef.current.removeEventListener('mouseleave', hideCursor, false)
    }
  }, [containerRef, data])

  return {
    verticalMaxMin,
    firstAndLastDate,
    getLabel,
    lines
  }
}
