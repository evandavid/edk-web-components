import { isNull, isUndefined } from 'lodash';

export const numberFormat = (value: any, lang: string, fraction?: number) => {
  if (isNaN(parseFloat(value))) value = 0.0
  return String(
    new Intl.NumberFormat(lang === 'en' ? 'en-EN' : 'id-ID', {
      maximumFractionDigits: fraction || 2,
      minimumFractionDigits: fraction || 0
    }).format(parseFloat(value))
  )
}

export const moneyFormat = (
  value: any,
  lang: string,
  fraction?: number,
  _currency?: string
) => {
  let currency =
    _currency === 'USD' ? _currency + ' ' : lang === 'en' ? 'IDR ' : 'Rp. '
  return currency + numberFormat(value, lang, fraction)
}
export const formattedDate = (
  _date: any,
  lang: string,
  withTime?: boolean,
  short?: boolean,
  withoutYear?: boolean
) => {
  const date = new Date(_date)

  const months: any = {
    idn: [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember'
    ],
    en: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
  }

  const monthsShort: any = {
    idn: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'Mei',
      'Jun',
      'Jul',
      'Agu',
      'Sep',
      'Okt',
      'Nov',
      'Des'
    ],
    en: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ]
  }

  if (!isNaN(date.getTime())) {
    let year: any = date.getFullYear(),
      month = date.getMonth(),
      day = date.getDate(),
      hour = date.getHours(),
      minute = date.getMinutes()

    if (String(minute).length < 2) (minute as any) = '0' + minute

    let monthName = months[lang][month]
    if (short) monthName = monthsShort[lang][month]
    if (lang === 'idn')
      return `${day < 10 ? '0' + day : day} ${monthName} ${
        withoutYear ? '' : year
      } ${withTime ? hour + ':' + minute : ''}`
    else
      return `${monthName} ${day < 10 ? '0' + day : day}${
        withoutYear ? ' ' : ', ' + year
      } ${withTime ? hour + ':' + minute : ''}`
  }
  return undefined
}

export const shortNumberFormat = (
  param: any,
  language: string,
  precision?: number
): any => {
  let num = parseFloat(param)
  let _precision = precision || 0
  if (typeof num !== 'number') {
    return 0
  }

  if (num > 1e19) {
    return numberFormat(num, language)
  }

  if (num < -1e19) {
    return numberFormat(num, language)
  }

  if (Math.abs(num) < 0) {
    return numberFormat(num, language, precision === undefined ? 4 : precision)
  }

  if (Math.abs(num) < 1000000) {
    return numberFormat(num, language)
  }

  let shortNumber
  let exponent
  let size
  let sign = num < 0 ? '-' : ''
  let suffixes: any = {
    idn: {
      ' Jt': 9,
      ' M': 12,
      ' T': 16
    },
    en: {
      ' Mio': 9,
      ' Bio': 12,
      ' Trn': 16
    }
  }

  num = Math.abs(num)
  size = Math.floor(num).toString().length

  exponent = size % 3 === 0 ? size - 3 : size - (size % 3)
  shortNumber = Math.round(10 * (num / Math.pow(10, exponent))) / 10

  for (let suffix in suffixes[language]) {
    if (exponent < suffixes[language][suffix]) {
      shortNumber =
        numberFormat(shortNumber, language, _precision) +
        `<small style="color: #757575; font-size: 12px">${suffix}</small>`
      break
    }
  }
  return sign + shortNumber
}

export const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(min, val), max)

export const randomChar = () =>
  (Math.random().toString(36) + '00000000000000000').slice(2, 10)

export const isBlank = (str: string) => {
  return isUndefined(str) || isNull(str) || str === ''
}
