export const isNumber = (val) => {
  if (!val) {
    return false
  }
  const result = parseInt(val)
  if (isNaN(result)) {
    return false
  }
  return true
}

export const getShowCount = (num) => {
  if (num < 10000) {
    return `${num}`
  } else if (num > 100000000) {
    return `${(num / 100000000).toFixed(2)}亿`
  } else {
    return `${(num / 10000).toFixed(2)}万`
  }
}
