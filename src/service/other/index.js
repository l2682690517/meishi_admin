export const getTenantNameId = (arr) => {
  let resArr = arr.map((i) => {
    let merge = []
    merge.push(i.id)
    merge.push(i.nick_name)
    let str = merge.join('--')
    let data = {
      id: String(i.id),
      principal_name_id: str
    }
    return data
  })
  return resArr
}
export const getUserShowData = (data) => {
  let resData = {}
  if (data.user) {
    resData.id = data.user.id ? data.user.id : ''
    resData.logo = data.user.logo ? data.user.logo : ''
    resData.nickname = data.user.nickname ? data.user.nickname : ''
    resData.tenantNickName = data.user.tenant && data.user.tenant.nick_name ? data.user.tenant.nick_name : ''
    resData.mobile = data.user.mobile ? data.user.mobile : ''
    resData.ct = data.user.ct ? data.user.ct : ''
    resData.tid = data.user.tenant_id ? data.user.tenant_id : ''
  } else {
    resData.id = ''
    resData.logo = ''
    resData.nickname = ''
    resData.tenantNickName = ''
    resData.mobile = ''
    resData.ct = ''
    resData.tid = ''
  }
  return resData
}
export const getUserOrderDataList = (data) => {
  let arr = []
  if (data.order_stat) {
    let item = {
      recent_pay_tick: data.order_stat.recent_pay_tick ? data.order_stat.recent_pay_tick : '',
      total_amount: data.order_stat.total_amount ? data.order_stat.total_amount : '',
      total_count: data.order_stat.total_count ? data.order_stat.total_count : ''
    }
    arr = [item]
    return arr
  } else {
    return []
  }
}
export const showAppStatus = (row) => {
  let text = ''
  switch (row) {
    case 1:
      text = '审核中'
      break
    case 2:
      text = '已上线'
      break
    case 3:
      text = '已下线'
      break
    case 4:
      text = '解除授权'
      break
  }
  return text
}
export const showTenantStatus = (row) => {
  if (row === 1) {
    return '正常'
  }
  return '禁用'
}
export const showProductAuth = (row) => {
  let text = ''
  switch (row.product_auth) {
    case 1:
      text = '自营'
      break
    case 2:
      text = '选货'
      break
    case 3:
      text = '选货/自营'
  }
  return text
}
