import { forEach, identity, isEqual, isNull, isObject, isUndefined, pickBy } from 'lodash';

import { numberFormat } from '../../functions';

export function validate(
  type: string | undefined,
  value: string,
  language: string,
  validation?: any
): string | undefined {
  const errEmail = {
    false: `err_Email`,
    true: undefined
  }

  const errPassword = {
    false: `err_Password`,
    true: undefined
  }

  const errRequired = {
    false: `err_Required`,
    true: undefined
  }

  const errLength = {
    'false-false-false-false': undefined,
    'true-true-true-false': `err_Length~${validation.minLength}-${validation.maxLength}`,
    'true-false-true-true': `err_Length~${validation.minLength}-${validation.maxLength}`,
    'true-true-false-false': `err_Length~gt-${validation.minLength}`,
    'false-false-true-true': `err_Length~lt-${validation.maxLength}`
  }

  const errMinMax = {
    'false-false-false-false': undefined,
    'true-true-true-false': `err_MinMax~${numberFormat(
      validation.min,
      language
    )}-${numberFormat(validation.max, language)}`,
    'true-false-true-true': `err_MinMax~${numberFormat(
      validation.min,
      language
    )}-${numberFormat(validation.max, language)}`,
    'true-true-false-false': `err_MinMax~gt-${numberFormat(
      validation.min,
      language
    )}`,
    'false-false-true-true': `err_MinMax~lt-${numberFormat(
      validation.max,
      language
    )}`
  }

  const _validation = pickBy(validation, identity)
  switch (
    isUndefined(_validation) ||
    !isObject(_validation) ||
    isEqual(_validation, {})
  ) {
    case true:
      let genericErr = undefined
      switch (type) {
        case 'email':
          const checkEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          const isValid = checkEmail.test(String(value).toLowerCase())
          genericErr = errEmail[String(isValid)]
          break
        case 'password':
          const strongPassword = (str: any) =>
            str && /[A-Z]/.test(str) && /[0-9]/.test(str) && str.length >= 6
          const isPassValid = strongPassword(value)
          genericErr = errPassword[String(isPassValid)]
          break
      }
      return genericErr
    case false:
      const validationKeys = Object.keys(validation)
      const isEmptyValue =
        isEqual(value, '') || isUndefined(value) || isNull(value)
      let errorMsg = undefined

      forEach(validationKeys, (vKeys) => {
        let _continue = true
        switch (vKeys) {
          case 'hide':
            _continue = !validation.hide
            break
          case 'required':
            /// extra

            _continue = validation.required ? !isEmptyValue : true // catch in required, exit loop
            errorMsg = errRequired[String(_continue)]
            break
          case 'minLength':
          case 'maxLength':
            !isEmptyValue &&
              (validation.maxLength || validation.minLength) &&
              (() => {
                const minLengthError = validation.minLength
                  ? value.length < validation.minLength
                  : false
                const maxLengthError = validation.maxLength
                  ? value.length > validation.maxLength
                  : false

                _continue =
                  (validation.maxLength && maxLengthError) ||
                  (validation.minLength && minLengthError)
                errorMsg =
                  errLength[
                    `${!isUndefined(
                      validation.minLength
                    )}-${minLengthError}-${!isUndefined(
                      validation.maxLength
                    )}-${maxLengthError}`
                  ]
              })()
            break
          case 'min':
          case 'max':
            !isEmptyValue &&
              (validation.min || validation.max) &&
              (() => {
                const minError = validation.min
                  ? parseFloat(value) < parseFloat(validation.min)
                  : false
                const maxError = validation.max
                  ? parseFloat(value) > parseFloat(validation.max)
                  : false

                _continue =
                  (validation.min && minError) || (validation.max && maxError)
                errorMsg =
                  errMinMax[
                    `${!isUndefined(validation.min)}-${minError}-${!isUndefined(
                      validation.max
                    )}-${maxError}`
                  ]
              })()
            break
        }

        return _continue
      })

      return errorMsg
  }

  return undefined
}
