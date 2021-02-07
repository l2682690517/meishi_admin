import R_ from 'src/util/R_'
import { convertFenToYuan } from 'src/util/moneyUtil'

export const price = (val, showSymbol = true) => {
  const lessZero = val < 0
  return `${lessZero ? '-' : ''}${showSymbol ? '¥' : ''}${R_.convertFenToYuan(Math.abs(val))}`
}
export const friendlyPrice = (val, showSymbol = true) => {
  let yuan = convertFenToYuan(val)
  if (yuan < 10000) {
    return `${showSymbol ? '¥' : ''}${yuan}`
  } else if (yuan > 100000000) {
    return `${showSymbol ? '¥' : ''}${(yuan / 100000000).toFixed(2)}亿`
  } else {
    return `¥${(yuan / 10000).toFixed(2)}万`
  }
}
