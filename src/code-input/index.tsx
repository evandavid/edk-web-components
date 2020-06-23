import { clone, compact, last, map, range, times } from 'lodash';
import React, {
    ChangeEvent,
    ClipboardEvent,
    KeyboardEvent,
    memo,
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';
import styled from 'styled-components';

import { FlexRowCenter } from '../flex';

const Item = styled.input<any>`
  box-shadow: 2px 1px 6px 0px rgba(217, 232, 255, 0.7);
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  width: ${(props) => props.dimension}px;
  height: ${(props) => props.dimension}px;
  margin: 6px 2px 12px;
  outline: none;
  line-height: ${(props) => props.dimension}px;
  text-align: center;
  font-size: 16px;
  color: ${(props) => (props.error === 'yes' ? '#b00020' : '#555')};
  &:disabled {
    background: #f5f5f5;
  }
`

function _CodeInput(props: {
  onComplete(code: any): void
  onCodeChanged(code: any): void
  size?: number
  dimension?: number
  handleRef?: any
  disabled?: boolean
}) {
  const {
    size = 6,
    dimension = 22,
    onComplete = () => {},
    onCodeChanged = () => {}
  } = props
  const codeInstance = props.handleRef || useRef()
  const inputRefs: { current: HTMLInputElement }[] = map(range(size), () =>
    useRef<any>()
  )
  const [inputValue, setInputValue] = useState(times(size, () => ''))
  const isPasted = useRef(false)
  const [isError, setIsError] = useState(false)

  const clearCode = useCallback(() => {
    setInputValue(times(size, () => ''))
    inputRefs[0] && inputRefs[0].current && inputRefs[0].current.focus()
  }, [inputRefs, size])

  const setError = useCallback(() => {
    setIsError(true)

    let found = false
    map(range(size), (s) => {
      const itemText = inputValue[s] || ''
      itemText === '' &&
        s &&
        inputRefs[s] &&
        !found &&
        (() => {
          inputRefs[s].current.focus()
          found = true
        })()
    })
  }, [inputValue, size, inputRefs])

  const onKeyDown = useCallback(
    (evt: KeyboardEvent<HTMLInputElement>, i: number) => {
      const key = evt.keyCode || evt.charCode
      ;(key === 8 || key === 46) &&
        inputRefs[i - 1] &&
        i &&
        (() => {
          setTimeout(() => {
            inputRefs[i - 1].current.focus()
          }, 0)
        })()
    },
    [inputRefs]
  )

  const onPaste = useCallback(
    (evt: ClipboardEvent<HTMLInputElement>) => {
      !props.disabled &&
        (() => {
          isPasted.current = true
          const pastedText = evt.clipboardData.getData('text/plain')

          let data: any = []
          let lastIndexWithData = 0

          map(range(size), (s) => {
            const itemText = pastedText[s] || ''
            data[s] = itemText
            itemText !== '' &&
              (() => {
                lastIndexWithData = s
              })()
          })
          setInputValue(data)
          inputRefs[lastIndexWithData].current.focus()
          setTimeout(() => {
            isPasted.current = false
          }, 10)
        })()
    },
    [inputRefs, inputValue, size, props]
  )

  const onChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>, i: number) => {
      !props.disabled &&
        (() => {
          !isPasted.current &&
            (() => {
              let cloned: any = clone(inputValue)
              cloned[i] = last(evt.target.value) || ''
              setInputValue(cloned)
              cloned[i] && inputRefs[i + 1] && inputRefs[i + 1].current.focus()
            })()
        })()
    },
    [inputRefs, inputValue, isPasted]
  )

  useEffect(() => {
    // check if complete
    const compactValue = compact(inputValue)
    const inputLength = compactValue.length
    inputLength && onCodeChanged(compactValue.join(''))
    inputLength === size && onComplete(inputValue.join(''))
    setIsError(false)
  }, [inputValue])

  useEffect(() => {
    codeInstance.current = {
      clear: () => {
        clearCode()
      },
      setError: () => {
        setError()
      }
    }
  }, [inputValue, isError])

  useEffect(() => {
    inputRefs[0] && inputRefs[0].current.focus()
  }, [])

  return (
    <FlexRowCenter>
      {map(range(size), (i) => (
        <div key={`input-code-${i}`}>
          <Item
            dimension={dimension}
            disabled={props.disabled}
            ref={inputRefs[i]}
            onChange={(evt: any) => {
              onChange(evt, i)
            }}
            onKeyDown={(evt: any) => {
              onKeyDown(evt, i)
            }}
            onPaste={(evt: any) => {
              onPaste(evt)
            }}
            value={inputValue[i]}
            error={isError ? 'yes' : 'no'}
          />
        </div>
      ))}
    </FlexRowCenter>
  )
}

export const CodeInput = memo(_CodeInput)
