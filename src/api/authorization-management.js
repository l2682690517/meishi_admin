import Axios from 'axios'
// import qs from 'qs'

export const getAuthGroupList = (tp) => {
  return Axios.get(`/admin/auth_group`, {
    params: {
      tp: tp
    }
  })
}
export const getAuthList = (tp) => {
  return Axios.get(`/admin/auth`, {
    params: {
      tp: tp
    }
  })
}
export const createAuthGroup = (formData) => {
  return Axios.post(`/admin/auth_group`, formData)
}
export const editAuthGroup = (formData) => {
  return Axios.post(`/admin/auth_group/s/${formData.id}`, formData)
}
export const deleteAuthGroup = (id) => {
  return Axios.delete(`/admin/auth_group/s/${id}`)
}
export const getAuthItem = (id) => {
  return Axios.get(`/admin/auth/s/${id}`)
}
export const createAuth = (formData) => {
  return Axios.post(`/admin/auth/`, formData)
}
export const editAuth = (formData) => {
  return Axios.post(`/admin/auth/s/${formData.id}`, formData)
}
export const deleteAuth = (id) => {
  return Axios.delete(`/admin/auth/s/${id}`)
}
