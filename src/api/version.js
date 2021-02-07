import Axios from 'axios'
import { dateFormat } from 'src/util/format'

export const getList = () => {
  return Axios.get(`/admin/version`)
}

export const deleteItem = (id) => {
  return Axios.delete(`/admin/version/s/${id}`)
}

export const create = (formData) => {
  formData.update_time = dateFormat(formData.update_time, 'YYYY-MM-DD HH:mm:ss')
  return Axios.post('/admin/version', formData)
}

export const update = (id, formData) => {
  formData.update_time = dateFormat(formData.update_time, 'YYYY-MM-DD HH:mm:ss')
  return Axios.post(`/admin/version/s/${id}`, formData)
}

export const getItem = (id) => {
  return Axios.get(`/admin/version/s/${id}`)
}
