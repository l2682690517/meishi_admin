import Axios from 'axios'
// import qs from 'qs'

export const getList = (params) => {
  return Axios.get('/admin/tenant_user', {
    params: params
  })
}
export const createTenantUser = (formData) => {
  return Axios.post('/admin/tenant_user', formData)
}
export const editTenantUser = (id, formData) => {
  return Axios.post('/admin/tenant_user/s' + `/${id}`, formData)
}
export const getTenantUserItem = (id) => {
  return Axios.get('/admin/tenant_user/s' + `/${id}`)
}
