import Fuse from 'fuse.js'
import {
  capitalize,
  clone,
  filter,
  find,
  flowRight,
  isArray,
  isEqual,
  map,
  omit,
  pick
} from 'lodash'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { MDCMenu } from '@material/menu'
import MaterialIcon from '@material/react-material-icon'
import { HelperText } from '@material/react-text-field'

import { FlexOne, FlexRow } from '../flex'
import { CustomInputProps } from './'
import { EDKNativeInput } from './native/edk-input'
import EDKTextField from './native/edk-text-field'
import { ModuitMenuFoundation } from './native/menu-foundation'

const StyledTextField: any = styled(EDKTextField)`
  width: 100%;
`

const StyledInput: any = styled(EDKNativeInput)<any>`
  color: ${(props) =>
    props.originaltype === 'yes'
      ? 'transparent'
      : 'rgba(0, 0, 0, 0.87)'} !important;
  font-size: ${(props) => (props.originaltype === 'yes' ? '16px' : '1rem')};
  font-family: ${(props) =>
    props.originaltype === 'yes' ? 'monospace' : "'Open Sans', sans-serif"};
  &::selection {
    color: ${(props) =>
      props.originaltype === 'yes' ? 'transparent' : 'auto'};
    background-color: #b3d6fe;
  }
`

const IconContainer = styled.div`
  width: 100%;
  overflow: hidden;
  height: 36px;
  position: absolute;
  top: 6px;
  left: 8px;
  pointer-events: none;
  padding-right: 36px;
`

const OptionIcon = styled.img`
  width: 34px;
  height: 34px;
  border-radius: 20px;
  border: 1px solid #ddd;
`

const SearchInput = styled.input`
  padding: 12px 20px;
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  font-size: 16px;
`

const SearchContainer = styled.div`
  border-bottom: 1px solid #ddd;
  width: 100%;
`

interface ISelectProps extends CustomInputProps {
  menuClassName?: any
}

function Selects(props: ISelectProps) {
  const selectRef = useRef<any>()
  const menuRef: any = useRef<any>()
  const inputSearch: any = useRef<any>()
  const inputRef = useRef<{ inputElement: HTMLInputElement }>()
  const { menuClassName = {} } = props

  const inputProps = omit(props, [
    'label',
    'fieldId',
    'onChange',
    'id',
    'skipValidation',
    't',
    'labelKey',
    'value',
    'menuClassName',
    'rangeOptions',
    'rangeFieldId',
    'rangeValue',
    'textStyle',
    'optionTag',
    'onChange',
    'optionsTag',
    'onUpload',
    'onGetImage',
    'hide',
    'groupLabel',
    'isArray',
    'multiple',
    'trailingText',
    'behaviour',
    'parentStyle',
    'disableChange',
    'minDate',
    'onTrailingIconSelect',
    'trailingIcon'
  ])

  const textFieldProps = pick(props, ['label', 'onTrailingIconSelect'])
  const { parentStyle = {} } = props

  const [maskedValue, setMasked] = useState<any>()
  const [isIcon, setIsIcon] = useState<boolean>(false)
  const [icons, setIcons] = useState<string[]>()
  const [searchQuery, setQuery] = useState<any>()
  const [masterOptions, setMasterOptions] = useState<
    { code: any; value: any }[]
  >([])
  const [options, setOptions] = useState<{ code: any; value: any }[]>([])

  const onSearchChanged = useCallback(
    (e: any) => {
      const { value } = e.target

      const options: any = {
        keys: ['value'],
        tokenize: true,
        matchAllTokens: true,
        findAllMatches: true,
        threshold: 0.3,
        location: 0,
        distance: 100,
        maxPatternLength: 100,
        minMatchCharLength: 1
      }
      const newQuery = value ? value.replace(/\s+$/, '') : null
      const fuse = new Fuse(masterOptions, options)
      let _newOptions = []
      if (newQuery === '' || !newQuery) _newOptions = masterOptions
      else
        _newOptions = fuse.search(newQuery || '').map((i: any) => i.item) || []

      console.log(_newOptions, fuse.search(newQuery || ''))
      setOptions(_newOptions)
      setQuery(value)
    },
    [masterOptions]
  )

  const onSelect = useCallback(
    (evt: { code: any; value: any }) => {
      inputRef.current && inputRef.current.inputElement.blur()

      switch (props.multiple) {
        case true:
          let cloned =
              props.value && isArray(props.value) ? clone(props.value) : [],
            idx = cloned.indexOf(evt.code)
          idx > -1 ? cloned.splice(idx, 1) : cloned.push(evt.code)

          props.onChange(props.fieldId, cloned)
          break
        default:
          menuRef.current.open = false
          props.onChange(props.fieldId, evt.code)
          break
      }
    },
    [props]
  )

  const clearSearchquery = useCallback(() => {
    setOptions(masterOptions)
    setQuery(undefined)
  }, [masterOptions])

  const onClickParent = useCallback(() => {
    if (!props.disabled && !props.readOnly) {
      setQuery(undefined)
      setOptions(masterOptions)
      menuRef.current.open = true
      setTimeout(() => {
        inputSearch.current && inputSearch.current.focus()
      }, 100)
    }
  }, [menuRef, props, masterOptions, inputSearch])

  const onFocusParent = useCallback(() => {
    if (typeof document !== undefined) {
      document.onkeyup = (e: any) => {
        const code = e.keyCode ? e.keyCode : e.which
        if (
          code === 9 &&
          inputRef.current &&
          isEqual(inputRef.current.inputElement, e.target)
        ) {
          // come from tab
          if (!props.disabled) {
            setQuery(undefined)
            setOptions(masterOptions)
            menuRef.current.open = true
            setTimeout(() => {
              inputSearch.current && inputSearch.current.focus()
            }, 100)
          }
        }
      }
    }
  }, [menuRef, inputRef, masterOptions, inputSearch])

  const displayText = useCallback((text: string) => {
    let _text: any = text
    switch (typeof document !== undefined) {
      case true:
        const div = document.createElement('div')
        div.innerHTML = text
        _text = div.textContent || div.innerText || ''
      default:
        _text = _text
          ? _text
              .split(' ')
              .map((s: any) => (s.length < 4 ? s : capitalize(s)))
              .join(' ')
          : undefined
    }
    return _text
  }, [])

  const checkActive = useCallback(
    (code: any) => {
      switch (props.multiple) {
        case true:
          return props.value && props.value.indexOf(code) > -1
        case false:
          return code === props.value
      }
      return undefined
    },
    [props]
  )

  useEffect(() => {
    if (!menuRef.current && selectRef.current) {
      const _foundation = new ModuitMenuFoundation()
      menuRef.current = new MDCMenu(selectRef.current, _foundation)
    }
  }, [])

  useEffect(() => {
    if (props) {
      switch (isArray(props.value)) {
        case true:
          // act as multiple select
          const _isIcon: any =
            props.options &&
            props.options[0] &&
            props.options[0].icon !== undefined
          setIsIcon(_isIcon)
          switch (props.value.length !== 0) {
            case true:
              const firstOptions: any = props.options ? props.options[0] : {}

              switch (firstOptions.icon) {
                case undefined:
                case null:
                  const values = map(
                    filter(
                      props.options,
                      (_) => props.value.indexOf(_.code) > -1
                    ),
                    (o) => o.value
                  )
                  setMasked(values.join(', '))
                  break
                default:
                  setMasked('exist')
                  const _icons = map(
                    filter(
                      props.options,
                      (_) => props.value.indexOf(_.code) > -1
                    ),
                    (o) => o.icon
                  )
                  setIcons(_icons)
                  break
              }

              break
            case false:
              setMasked(undefined)
              setIcons(undefined)
              break
          }
          break
        case false:
          const selected = find(
            props.options,
            (o) => String(o.code) === String(props.value)
          )
          const displayValue = selected ? selected.value : null
          displayValue !== maskedValue &&
            flowRight([setMasked, displayText])(displayValue)
          break
      }
    }
  }, [props.value, props.options, props])

  useEffect(() => {
    setMasterOptions(props.options || [])
    setOptions(props.options || [])
  }, [props.options])

  return (
    <div
      style={{ position: 'relative', marginBottom: 24, ...parentStyle }}
      className='mdc-menu-surface--anchor'
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
          props.trailingIcon || (
            <MaterialIcon role={'button'} icon={'arrow_drop_down'} />
          )
        }
      >
        <StyledInput
          {...inputProps}
          ref={inputRef}
          value={maskedValue}
          isValid={props.error === undefined}
          id={props.fieldId}
          type={'text'}
          originaltype={isIcon ? 'yes' : 'no'}
          spellCheck={'false'}
          onClick={onClickParent}
          onFocus={onFocusParent}
          autoComplete={'off'}
          readOnly={true}
          aria-placeholder={props.placeholder}
        />
      </StyledTextField>

      {icons ? (
        <IconContainer>
          {map(icons, (icon: string, i: number) => (
            <OptionIcon key={`icon-option-${i}`} src={icon} />
          ))}
        </IconContainer>
      ) : null}

      <div
        className={`mdc-menu mdc-menu-surface ${menuClassName}`}
        ref={selectRef}
      >
        <ul className='mdc-list'>
          <li onClick={() => {}} className='mdc-list-item' role='menuitem'>
            <SearchContainer>
              <FlexRow>
                <FlexOne>
                  <SearchInput
                    ref={inputSearch}
                    placeholder={'Search'}
                    value={searchQuery || ''}
                    onChange={onSearchChanged}
                  />
                </FlexOne>
                <MaterialIcon
                  onClick={(e: any) => {
                    clearSearchquery()
                    e.stopPropagation()
                  }}
                  style={{
                    color: '#757575',
                    fontSize: 22,
                    marginLeft: 6
                  }}
                  icon={searchQuery ? 'clear' : 'search'}
                />
              </FlexRow>
            </SearchContainer>
          </li>
          {map(options, (option, index) => (
            <li
              key={`option-${index}`}
              onClick={() => {
                onSelect(option)
              }}
              className='mdc-list-item'
              role='menuitem'
            >
              <MaterialIcon
                style={{
                  color: checkActive(option.code) ? '#4987f3' : 'transparent',
                  fontSize: 14,
                  marginRight: 6
                }}
                icon={'check'}
              />{' '}
              <span
                className='mdc-list-item__text'
                dangerouslySetInnerHTML={{ __html: option.value }}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default memo(Selects)

export const EDKSelect = Selects
