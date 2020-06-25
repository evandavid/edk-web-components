import React from 'react';

import { Input } from '@material/react-text-field';

export class EDKNativeInput extends Input {
  render() {
    const {
      inputType,
      disabled,
      /* eslint-disable @typescript-eslint/no-unused-vars */
      className,
      foundation,
      syncInput,
      isValid,
      value,
      handleFocusChange,
      setDisabled,
      setInputId,
      onFocus,
      onBlur,
      onMouseDown,
      onTouchStart,
      onChange,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...otherProps
    } = this.props

    const props: any = Object.assign(
      {},
      {
        onFocus: this.handleFocus,
        onBlur: this.handleBlur,
        onMouseDown: this.handleMouseDown,
        onTouchStart: this.handleTouchStart,
        onChange: this.handleChange,
        disabled: disabled,
        value: value,
        ref: this.inputElement_,
        className: this.classes
      },
      otherProps,
      { placeholder: this.props['aria-placeholder'] }
    )

    if (inputType === 'input') {
      return <input {...props} />
    }
    return <textarea {...props} />
  }
}
