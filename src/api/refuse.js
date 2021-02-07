import Axios from 'axios'
import qs from 'qs'
import {date} from '../filter/datetime'

export const refuseList = (params) => {
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
  myParams.prod = params.prod
  myParams.prod_tp = params.prod_tp
  myParams.refund_status = params.refund_status
  myParams.tenant_id = params.tenant_id
  myParams.page = params.page
  myParams.limit = params.limit
  return Axios.get(`/admin/oi/refund`, {params: myParams})
}

export const agree = (id, amount, txt, total, remark) => {
  return Axios.post(`/admin/oi/s/${id}/agree`,
    qs.stringify({txt: txt, amount: amount, total: total, remark: remark}))
}

export const reject = (id, txt, remark) => {
  return Axios.post(`/admin/oi/s/${id}/refuse`,
    qs.stringify({txt: txt, remark: remark}))
}

export const reply = (id, txt, remark) => {
  return Axios.post(`/admin/oi/s/${id}/reply`,
    qs.stringify({txt: txt, remark: remark}))
}

export const refuseCount = () => {
  return Axios.get('/admin/oi/refund/count')
}

export const refundToWx = (id) => {
  return Axios.post(`/admin/oi/s/${id}/refund/to/weixin`)
}
