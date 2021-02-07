export const getList = (data) => {
  let arr = []
  let sales = {
    name: '销售额',
    today_data: getShowPrice(data.today_self + data.today_platform),
    yesterday_data: getShowPrice(data.yesterday_self + data.yesterday_platform),
    month_data: getShowPrice(data.month_self + data.month_platform),
    pre_month_data: getShowPrice(data.pre_month_self + data.pre_month_platform),
    all_data: getShowPrice(data.all_self + data.all_platform)
  }
  let platformProportion = {
    name: '平台供货比',
    today_data: getShowPercentage(data.today_platform / (data.today_self + data.today_platform)),
    yesterday_data: getShowPercentage(data.yesterday_platform / (data.yesterday_self + data.yesterday_platform)),
    month_data: getShowPercentage(data.month_platform / (data.month_self + data.month_platform)),
    pre_month_data: getShowPercentage(data.pre_month_platform / (data.pre_month_self + data.pre_month_platform)),
    all_data: getShowPercentage(data.all_platform / (data.all_self + data.all_platform))
  }
  let platform = {
    name: '平台供货款',
    today_data: getShowPrice(data.today_platform),
    yesterday_data: getShowPrice(data.yesterday_platform),
    month_data: getShowPrice(data.month_platform),
    pre_month_data: getShowPrice(data.pre_month_platform),
    all_data: getShowPrice(data.all_platform)
  }
  let user = {
    name: '交易用户数',
    today_data: getShowCount(data.today_pay_user_count),
    yesterday_data: getShowCount(data.yesterday_pay_use_count),
    month_data: getShowCount(data.month_pay_user_count),
    pre_month_data: getShowCount(data.pre_month_pay_user_count),
    all_data: getShowCount(data.all_pay_user_count)
  }
  arr = [sales, platformProportion, platform, user]
  return arr
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

export const getShowPrice = (num) => {
  let val = num * 1.0 / 100
  if (val < 10000) {
    return `¥${val}`
  } else if (val > 100000000) {
    return `¥${(val / 100000000).toFixed(2)}亿`
  } else {
    return `¥${(val / 10000).toFixed(2)}万`
  }
}
export const getShowPercentage = (num) => {
  if (num) {
    return `${num * 100}%`
  }
  return ''
}
