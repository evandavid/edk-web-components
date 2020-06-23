import DotObject from 'dot-object';
import { chain, concat, filter, find, flatMap, isEmpty, map, reject, uniq } from 'lodash';
import React, { memo } from 'react';

import { CustomInputProps, IBehaviour, Operators } from '../';
import { EDKCheckboxField } from '../_type/checkbox-field';
import { EDKDatepickerField } from '../_type/datepicker-field';
import { EDKDatepickerRangeField } from '../_type/datepicker-range-field';
import { EDKFileField } from '../_type/file-field';
import { EDKLabelField } from '../_type/label-field';
import { EDKPhoneField } from '../_type/phone-field';
import { EDKRadioField } from '../_type/radio-field';
import { EDKSelectField } from '../_type/select-field';
import { EDKSeparatorField } from '../_type/separator-field';
import { EDKSingleCheckbox } from '../_type/single-checkbox-field';
import { EDKSubTitleField } from '../_type/subtitle-field';
import { EDKTextField } from '../_type/text-field';
import { EDKTitleField } from '../_type/title-field';
import { validate } from '../_validation';

export interface IRemoteFormDefinition {
  rows: number
  fields: CustomInputProps[]
}

export const getFormValue = (flattenForm: CustomInputProps[]): object => {
  return chain(flattenForm).keyBy('fieldId').mapValues('value').value()
}

export const getFormError = (
  flattenForm: CustomInputProps[],
  language: string
): { fieldId: string; error: string }[] => {
  let errors: { fieldId: string; error: string }[] = []

  map(flattenForm, (f) => {
    !f.hide &&
      !f.disabled &&
      (() => {
        const validation: any = {
          hide: f.hide,
          required: f.required,
          maxLength: f.maxLength,
          minLength: f.minLength,
          max: f.max,
          min: f.min,
          inputType: f.inputType
        }

        const error = validate(f.type, f.value, language, validation)
        error &&
          (() => {
            errors.push({ fieldId: f.fieldId, error })
          })()
      })()
  })
  return errors
}

export const getFlattenForm = (
  formDefinition: IRemoteFormDefinition[]
): CustomInputProps[] => {
  const notField = ['title', 'label', 'subtitle', 'separator']
  return filter(
    flatMap(formDefinition, (fd) => fd.fields),
    (o) => notField.indexOf(o.inputType) < 0
  )
}

export const getAllAffectedFields = (
  fieldAffectedOther: { fieldId: string; target: string[] }[],
  fieldId: string,
  result: String[]
): String[] => {
  const otherAffected = find(fieldAffectedOther, { fieldId })
  switch (otherAffected) {
    case null:
    case undefined:
      break
    default:
      result = concat(result, otherAffected.target)
      map(otherAffected.target, (t) => {
        result = getAllAffectedFields(fieldAffectedOther, t, result)
      })
      break
  }

  return uniq(reject(result, isEmpty))
}

export const processBehaviour = (
  type: any,
  operand: any,
  value?: any,
  option?: any
) => {
  let obj: any = {}
  switch (type) {
    case 'value':
      obj['value'] = value
      break
    case 'option':
      obj['option'] = option
      break
    default:
      obj[type] = operand
      break
  }
  return obj
}

export const evalBehaviour = (vals: boolean[], oprt: Operators[]) => {
  let result
  for (let i = 1; i < vals.length; i++) {
    switch (oprt[i - 1]) {
      case 'and':
        result = vals[i - 1] && vals[i]
        break
      case 'or':
        result = vals[i - 1] || vals[i]
        break
    }
  }
  return result
}

export const behaviourCheck = (
  formDefinition: IRemoteFormDefinition[],
  fieldAffectedOther: { fieldId: string; target: string[] }[],
  fieldId: string,
  target: string[],
  formPath: any
): object => {
  const collectedTarget = getAllAffectedFields(
    fieldAffectedOther,
    fieldId,
    target
  )

  //do heavy lifting process
  const query: any = {}

  map(collectedTarget, (targetFieldId: string) => {
    const path = formPath[targetFieldId]
    const targetField = DotObject.pick(path, formDefinition)

    targetField.behaviour &&
      targetField.behaviour.blocks &&
      (() => {
        const { behaviour }: { behaviour: IBehaviour } = targetField
        let valuesCheck: any = []

        map(behaviour.blocks.blockCriteria, (bcriteria, b: number) => {
          let values: any = []
          const { operators } = bcriteria

          map(bcriteria.criteria, (criteria, i: number) => {
            const cpath = formPath[criteria.fieldId]
            const criteriaField = DotObject.pick(cpath, formDefinition)

            switch (criteria.operator) {
              case 'equals':
                values[i] = criteria.operand === criteriaField.value
                break
              case 'notEquals':
                values[i] = criteria.operand !== criteriaField.value
                break
            }
          })

          bcriteria.operators && bcriteria.operators.length
            ? (() => {
                valuesCheck[b] = evalBehaviour(values, operators)
              })()
            : (() => {
                valuesCheck[b] = values[0]
              })()
        })

        const hasOperator =
          behaviour.blocks.operators && behaviour.blocks.operators.length

        if (!query[path]) query[path] = { $merge: {} }
        query[path].$merge = processBehaviour(
          behaviour.type,
          hasOperator
            ? evalBehaviour(valuesCheck, behaviour.blocks.operators)
            : valuesCheck[0],
          behaviour.value,
          behaviour.option
        )
      })()
  })

  return DotObject.object(query)
}

function _Field(props: CustomInputProps) {
  const { inputType = 'text', hide } = props

  if (hide) return null

  switch (inputType) {
    case 'select':
      return <EDKSelectField {...props} />
    case 'datepicker':
      return <EDKDatepickerField {...props} />
    case 'datepicker-range':
      return <EDKDatepickerRangeField {...props} />
    case 'phone':
      return <EDKPhoneField {...props} />
    case 'singleCheckbox':
      return <EDKSingleCheckbox {...props} />
    case 'file':
      return <EDKFileField {...props} />
    case 'radio':
      return <EDKRadioField {...props} />
    case 'checkbox':
      return <EDKCheckboxField {...props} />
    case 'title':
      return <EDKTitleField {...props} />
    case 'subtitle':
      return <EDKSubTitleField {...props} />
    case 'label':
      return <EDKLabelField {...props} />
    case 'separator':
      return <EDKSeparatorField {...props} />
    default:
      return <EDKTextField {...props} />
  }
}

export const EDKInputField = memo(_Field)
