import { showSuggestPriceInterval, showPriceInterval, showProfit } from 'src/service/product/index'

export const productProfit = (val, showSymbol = true) => {
  return ` ${showSymbol ? '¥' : ''}${showProfit(val)}`
}
export const productSuggestPrice = (val, showSymbol = true) => {
  return `${showSymbol ? '¥' : ''}${showSuggestPriceInterval(val)}`
}
export const productPrice = (val, showSymbol = true) => {
  return `${showSymbol ? '¥' : ''}${showPriceInterval(val)}`
}
