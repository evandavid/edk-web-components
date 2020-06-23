import { isUndefined } from 'lodash';
import Lottie from 'lottie-web';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { animated, useSpring } from 'react-spring';
import styled from 'styled-components';

import { isBlank } from '../functions';
import animationData from './searchIcon.json';

interface ISearchProps {
  width: number
  onSearch(query?: string): void
  defaultValue?: string
}

const Container = styled.div`
  position: relative;
  height: 36px;
`

const AnimatedInput = styled(animated.input)`
  position: absolute;
  line-height: 36px;
  top: 0;
  right: 0;
  outline: none;
  font-size: 16px;
  padding: 0 18px;
  background-color: #e5f0ff;
  border: none;
  border-radius: 18px;
  &::placeholder {
    color: #b2d0fa;
  }
`

const LogoContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  cursor: pointer;
  outline: none;
  height: 36px;
`

const LottieContainer = styled.div`
  width: 26px;
  height: 26px;
  margin-top: 5px;
  margin-right: 5px;
  background-color: #e5f0ff;
  border-radius: 18px;
`

function Search(props: ISearchProps) {
  const [query, setQuery] = useState(props.defaultValue)
  const animatedElement = useRef<any>()
  const animatedRef = useRef<any>()
  const inputRef = useRef<HTMLInputElement>()
  const isOpen = useRef<boolean>(!isUndefined(props.defaultValue))
  const mouseDown = useRef(false)

  const availableWidth = props.width - (36 + 18)
  const [animatedStyle, set] = useSpring(() => ({
    width: isOpen.current ? availableWidth : 0,
    paddingRight: isOpen.current ? 36 : 18,
    from: { width: 0, paddingRight: 18 }
  }))

  const animateInputSearch = useCallback((nextOpen: boolean) => {
    if (animatedRef.current) {
      animatedRef.current.playSegments(nextOpen ? [0, 30] : [30, 60], true)
    }
    set({
      width: nextOpen ? availableWidth : 0,
      paddingRight: nextOpen ? 36 : 18
    })

    isOpen.current = nextOpen
    mouseDown.current = false
  }, [])

  const clearInput = useCallback(() => {
    mouseDown.current = false
    if (inputRef.current) {
      if (inputRef.current.value === '') {
        animateInputSearch(false)
      }
      inputRef.current.value = ''
      inputRef.current.focus()
    }
    props.onSearch(undefined)
    setQuery(undefined)
  }, [inputRef, props])

  const onLogoClicked = useCallback(() => {
    if (inputRef.current) inputRef.current.focus()
    if (mouseDown.current) {
      if (!isOpen.current) {
        animateInputSearch(true)
      } else {
        clearInput()
      }
    }
  }, [query, isOpen, mouseDown, props])

  const onBlur = useCallback(
    (evt) => {
      if (mouseDown.current && isOpen.current) {
        clearInput()
      } else {
        if (isOpen.current && isBlank(evt.target.value)) {
          animateInputSearch(false)
        }
      }
    },
    [mouseDown, isOpen, props]
  )

  const onChange = useCallback(
    (evt) => {
      props.onSearch(evt.target.value)
      setQuery(evt.target.value)
    },
    [props.onSearch]
  )

  useEffect(() => {
    if (animatedElement.current) {
      animatedRef.current = Lottie.loadAnimation({
        container: animatedElement.current,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData
      })
    }
  }, [])

  return (
    <Container>
      <AnimatedInput
        ref={inputRef}
        placeholder={'Search...'}
        onBlur={onBlur}
        onChange={onChange}
        style={animatedStyle}
        defaultValue={props.defaultValue}
      />
      <LogoContainer
        onClick={() => {
          onLogoClicked()
        }}
        onMouseDown={() => {
          mouseDown.current = true
        }}
      >
        <LottieContainer ref={animatedElement} />
      </LogoContainer>
    </Container>
  )
}

export const EDKSearch = memo(Search)
