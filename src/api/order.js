import Axios from 'axios'
import { date } from '../filter/datetime'

export const orderList = (params) => {
  let myParams = {}
  if (parseInt(params.start_time) > 0) {
    myParams.start_time = date(parseInt(params.start_time))
  } else {
    myParams.start_time = ''
  }
  if (parseInt(params.end_time) > 0) {
    myParams.end_time = date(parseInt(params.end_time))
  } else {
    myParams.end_time = ''
  }
  myParams.status = params.status
  myParams[params.searchType] = params.searchKey
  myParams.page = params.page
  myParams.tenant_id = params.tenant_id
  myParams.limit = params.limit
  return Axios.get(`/admin/order`, {params: myParams})
}

export const orderDetail = (oid) => {
  return Axios.get(`/admin/order/s/${oid}`)
}

export const orderItems = (oid) => {
  return Axios.get(`/admin/oi/s/${oid}`)
}

export const getExpress = (oid) => {
  return Axios.get(`/admin/order/s/${oid}/express`)
}

export const getOiExpress = (oiid) => {
  return Axios.get(`/admin/oi/s/${oiid}/express`)
}
