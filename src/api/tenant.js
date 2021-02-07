import Axios from 'axios'
import qs from 'qs'
export const getList = (params) => {
  return Axios.get('/admin/tenant', {
    params: params
  })
}
export const getListAll = () => {
  return Axios.get(`/admin/tenant/all/name`)
}
export const getDetail = (id) => {
  return Axios.get(`/admin/tenant/s/${id}`)
}
export const disableTenant = (id) => {
  return Axios.post(`/admin/tenant/s/${id}/disable`)
}
export const enableTenant = (id) => {
  return Axios.post(`/admin/tenant/s/${id}/enable`)
}
export const refundAuthAgree = (id) => {
  return Axios.post(`/admin/tenant/s/${id}/refund/auth/agree`)
}
export const getTenantProductList = (id, params) => {
  return Axios.get(`/admin/tenant/s/${id}/product`, {
    params: params
  })
}
export const getTenantProductDetail = (tid, pid) => {
  return Axios.get(`/admin/tenant/s/${tid}/product/ps/${pid}`)
}
export const bindChildTenant = (formData) => {
  return Axios.post(`/admin/tenant/s/${formData.id}/mch/bind`, formData)
}
export const changeProductAuth = (tid, formData) => {
  return Axios.post(`/admin/tenant/s/${tid}/product/auth`, qs.stringify(formData))
}
