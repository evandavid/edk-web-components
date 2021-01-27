import {
  clone,
  debounce,
  dropWhile,
  isString,
  map,
  omit,
  pick,
  range,
  remove
} from 'lodash'
import format from 'number-format.js'
import React, {
  ChangeEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import styled from 'styled-components'

import { HelperText } from '@material/react-text-field'

import { randomChar } from '../functions'
import { EDKNativeInput } from './native/edk-input'
import EDKTextField from './native/edk-text-field'

const formatting: any = {
  en: '#,##0.####',
  idn: '#.##0,####'
}

export const StringTrailingIcon = styled.div<any>`
  color: ${(props) =>
    props.disabled ? 'rgba(0, 0, 0, 0.37)' : 'rgba(0, 0, 0, 0.87)'} !important;
  font-size: 16px !important;
  line-height: 26px !important;
  padding-right: 12px !important;
  transform: none !important;
  top: 11px !important;
`

const decimalChar: any = { en: '.', idn: ',' }

export type HideOnOperator = 'equals' | 'notEquals'
export type Operators = 'or' | 'and'

export interface IOption {
  code: any
  value: any
  icon?: any
}

export interface ICriteria {
  fieldId: string
  operator: HideOnOperator
  operand: any
}

export interface IBehaviour {
  type: 'hide' | 'value' | 'option' | 'required'
  blocks: {
    blockCriteria: [
      {
        criteria: ICriteria[]
        operators: Operators[]
      },
      {
        criteria: ICriteria[]
        operators: Operators[]
      }
    ]
    operators: Operators[]
  }
  value?: any
  option?: IOption[]
}

export interface CustomInputProps
  extends Omit<React.HTMLProps<HTMLInputElement>, 'onChange'> {
  language?: string
  fieldId: string
  label?: string
  ref?: any
  textarea?: boolean
  onChange(fieldId: string, value: any, error?: string, extraData?: any): void
  onUpload?(fieldId: string, fieldType: string, file: any, cb: any): void
  onGetImage?(fileId: string, onSuccess: any): void
  info?: string
  error?: string
  skipValidation?: boolean
  numeric?: boolean
  currency?: boolean

  inputType?: any
  options?: IOption[]

  leadingIcon?: any
  trailingIcon?: any
  trailingText?: any
  onTrailingIconSelect?: () => any
  onLeadingIconSelect?: () => any
  inputClassName?: string
  floatingLabelClassName?: string

  textStyle?: 'uppercase' | 'capitalize' | 'startCase'
  regex?: any
  masking?: any
  maxLength?: number
  fileType?: any
  value?: any

  isAnchor?: boolean
  anchorOptions?: any
  hide?: boolean
  isArray?: boolean
  multiple?: boolean

  behaviour?: IBehaviour

  parentStyle?: any
  id?: string
  disableChange?: boolean
  preventDebounce?: boolean
}

const StyledTextField: any = styled(EDKTextField)`
  width: 100%;
`

const StyledInput: any = styled(EDKNativeInput)<any>`
  color: ${(props) =>
    props.originaltype === 'password'
      ? 'transparent'
      : 'rgba(0, 0, 0, 0.87)'} !important;
  font-size: ${(props) =>
    props.originaltype === 'password' ? '16px' : '1rem'};
  font-family: ${(props) =>
    props.originaltype === 'password'
      ? 'monospace'
      : "'Open Sans', sans-serif"};
  &::selection {
    color: ${(props) =>
      props.originaltype === 'password' ? 'transparent' : 'auto'};
    background-color: #b3d6fe;
  }
`

const MaxChar = styled.div<any>`
  position: absolute;
  top: ${(props) => (props.textArea === 'yes' ? '96px' : '19px')};
  right: 12px;
  font-size: 12px;
  color: #757575;
`

const DotContainer = styled.div`
  position: absolute;
  top: 15px;
  left: 24px;
  right: 20px;
  overflow: hidden;
  pointer-events: none;
`

const DotInnerContainer = styled.div`
  white-space: nowrap;
`

const Dot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 6px;
  margin-right: 3.5px;
  background-color: rgba(0, 0, 0, 0.72);
  display: inline-block;
`

function Inputs(props: CustomInputProps) {
  const inputProps = omit(props, [
    'label',
    'fieldId',
    'onChange',
    'id',
    'skipValidation',
    't',
    'labelKey',
    'rangeOptions',
    'rangeFieldId',
    'rangeValue',
    'value',
    'numeric',
    'currency',
    'trailingIcon',
    'textarea',
    'toValue',
    'toFieldId',
    'textStyle',
    'min',
    'max',
    'leadingIcon',
    'inputClassName',
    'floatingLabelClassName',
    'regex',
    'masking',
    'email',
    'infoLabel',
    'fileType',
    'serviceFuncName',
    'optionsTag',
    'forceDisabled',
    'isSelfie',
    'dateType',
    'maxLength',
    'onUpload',
    'fileType',
    'onGetImage',
    'isAnchor',
    'anchorOptions',
    'dateType',
    'hide',
    'multiline',
    'groupLabel',
    'isArray',
    'multiple',
    'onTrailingIconSelect',
    'onLeadingIconSelect',
    'trailingText',
    'behaviour',
    'modalStyle',
    'parentStyle',
    'maxDate',
    'id',
    'disableChange',
    'minDate',
    'preventDebounce',
    'hideBackdrop',
    'trailingIconName'
  ])

  const textFieldProps = pick(props, [
    'onTrailingIconSelect',
    'onLeadingIconSelect',
    'label',
    'textarea',
    'trailingIcon',
    'leadingIcon',
    'floatingLabelClassName'
  ])

  const { parentStyle = {}, language = 'en' } = props || {}

  const [formatConfig, setFormatConfig] = useState(formatting[language])
  const maxCharRef = useRef<any>()
  const currentCharLength = useRef(
    props.value ? (props.value as any).length : 0
  )

  const transformToCurrency = useCallback(
    (val: any, _formatConfig?: string): any => {
      const __formatConfig = _formatConfig ? _formatConfig : formatConfig
      return isNaN(parseFloat(val))
        ? undefined
        : format(__formatConfig, parseFloat(val))
    },
    [formatConfig]
  )

  const getIntegerOnly = useCallback((val: any) => {
    if (val != null) {
      return String(val).replace(/[^\d.]/g, '')
    }
    return undefined
  }, [])

  const [maskedValue, setMaskedValue] = useState<any>(
    props.currency
      ? props.value
        ? transformToCurrency(props.value)
        : undefined
      : props.numeric
      ? getIntegerOnly(props.value)
      : undefined
  )

  const unMasking = useCallback(
    (val: any): any => {
      let sentence: any = String(val)
      if (language === 'idn') {
        sentence = sentence.replace(/\./g, '|')
        sentence = sentence.replace(/\,/g, '.')
      }

      if (val) {
        const matches = Number(sentence.replace(/[^0-9.-]+/g, '')).toFixed(4)
        return isNaN(parseFloat(matches)) ? undefined : parseFloat(matches)
      }
      return null
    },
    [language]
  )

  const maskingFromProps = useCallback(
    (str: any) => {
      if (props.masking) {
        let _str = getIntegerOnly(str)
        let rExp = ``
        let keys: any = []

        props.masking.split(' ').map((s: any, idx: number) => {
          rExp += `(\\d{0,${s.length}})`
          keys.push(idx + 1)
        })

        const rg = new RegExp(rExp)
        const escaped = String(_str).match(rg)
        const strReturn = dropWhile(escaped, (_: any, i) => keys.indexOf(i) < 0)
        remove(strReturn, (o) => o === '' || !o)
        return strReturn.join(' ')
      }
      return str
    },
    [props]
  )

  const getLastCharacter = useCallback((sentence: string) => {
    if (sentence) return sentence[sentence.length - 1]
    return null
  }, [])

  const maskedRegex = useCallback(
    (str: any) => {
      if (str) {
        const escapeRegexRegex = new RegExp(props.regex)
        const escaped = str.match(escapeRegexRegex)
        if (escaped && escaped.length) {
          return escaped[0]
        }
      }
    },
    [props]
  )

  const sendToParent: any = debounce(props.onChange, 200)

  const onChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      if (props.disabled) return

      let _value = evt.target.value
      let unmaskedValue: any = evt.target.value
      // if currency //
      if (props.currency) {
        const forMaskingValue = clone(_value)
        const decSeparator = [decimalChar[language]]
        let isReadyForDecimal = false

        // handle decimal if any
        const lastChar = getLastCharacter(forMaskingValue)
        if (decSeparator.indexOf(lastChar) > -1) isReadyForDecimal = true

        unmaskedValue = unMasking(_value)
        if (unmaskedValue === null) unmaskedValue = undefined

        let newMasking = transformToCurrency(unmaskedValue)
        if (isReadyForDecimal)
          newMasking = `${newMasking}${decimalChar[language]}`

        // use
        setMaskedValue(newMasking)
      } else if (props.numeric) {
        unmaskedValue = getIntegerOnly(_value)
      } else if (props.regex) {
        unmaskedValue = maskedRegex(_value)
        setMaskedValue(unmaskedValue)
      } else if (props.masking) {
        unmaskedValue = unMasking(_value)
        setMaskedValue(maskingFromProps(_value))
      } else {
        setMaskedValue(_value)
      }

      if (props.maxLength) {
        currentCharLength.current = unmaskedValue ? unmaskedValue.length : 0
        maxCharRef.current.innerHTML = `${currentCharLength.current}/${props.maxLength}`
      }
      if (props.type === 'password' || props.numeric || props.preventDebounce)
        props.onChange(props.fieldId, unmaskedValue)
      else sendToParent(props.fieldId, unmaskedValue)
    },
    [props, language]
  )

  useEffect(() => {
    if (props.value !== undefined) {
      if (props.currency) {
        const _masked = transformToCurrency(props.value)
        if (_masked !== maskedValue) {
          setMaskedValue(transformToCurrency(props.value))
        }
      } else if (props.numeric) {
        if (maskedValue !== props.value)
          setMaskedValue(getIntegerOnly(props.value))
      } else if (props.masking) {
        const _masked = maskingFromProps(props.value)
        if (_masked !== maskedValue) {
          setMaskedValue(maskingFromProps(props.value))
        }
      } else {
        if (maskedValue !== props.value) setMaskedValue(props.value)
      }
    } else {
      setMaskedValue('')
    }

    if (
      props.value &&
      currentCharLength.current !== (props.value as any).length
    ) {
      currentCharLength.current = props.value ? (props.value as any).length : 0
      if (props.maxLength) {
        maxCharRef.current.innerHTML = `${currentCharLength.current}/${props.maxLength}`
      }
    }
  }, [props.value])

  useEffect(() => {
    if (formatConfig !== formatting[language]) {
      setFormatConfig(formatting[language])
      if (props.value !== undefined) {
        setMaskedValue(transformToCurrency(props.value, formatting[language]))
      }
    }
  }, [language])

  let fieldType = props.type
  if (fieldType === 'password') fieldType = 'text'

  return (
    <div
      style={{ position: 'relative', marginBottom: 24, ...parentStyle }}
      className={props.isAnchor ? 'mdc-menu-surface--anchor' : ''}
    >
      <StyledTextField
        {...textFieldProps}
        required={props.required}
        outlined
        dense
        helperText={
          props.error || props.info ? (
            <HelperText
              validation={props.error !== undefined}
              persistent={true}
            >
              {props.info
                ? props.error
                  ? props.error
                  : props.info
                : props.error
                ? props.error
                : null}
            </HelperText>
          ) : undefined
        }
        className={props.className}
        trailingIcon={
          props.trailingIcon ? (
            props.trailingIcon
          ) : props.trailingText ? (
            <StringTrailingIcon>{props.trailingText}</StringTrailingIcon>
          ) : null
        }
      >
        <StyledInput
          {...inputProps}
          value={maskedValue}
          isValid={props.error === undefined}
          onChange={onChange}
          id={props.id || `${randomChar()}-${props.fieldId}`}
          type={fieldType}
          originaltype={props.type}
          spellCheck={'false'}
          className={props.inputClassName}
          aria-placeholder={props.placeholder}
        />
      </StyledTextField>

      {props.maxLength ? (
        <MaxChar textArea={props.textarea ? 'yes' : 'no'} ref={maxCharRef}>
          {currentCharLength.current}/{props.maxLength}
        </MaxChar>
      ) : null}

      {props.type === 'password' && props.value && isString(props.value) ? (
        <DotContainer>
          <DotInnerContainer>
            {map(range(props.value.length), (i) => (
              <Dot key={`dot-${i}`} />
            ))}
          </DotInnerContainer>
        </DotContainer>
      ) : (
        <div />
      )}

      {props.anchorOptions ? props.anchorOptions : null}
    </div>
  )
}

export default memo(Inputs)

export const EDKInput = Inputs
