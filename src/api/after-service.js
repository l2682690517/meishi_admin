import Axios from 'axios'

export const getList = () => {
  return Axios.get(`/admin/after_service`)
}
export const deleteItem = (id) => {
  return Axios.delete(`/admin/after_service/s/${id}`)
}
export const getEditItem = (id) => {
  return Axios.get(`/admin/after_service/s/${id}`)
}
export const createItem = (formData) => {
  return Axios.post(`/admin/after_service/`, formData)
}
export const editItem = (formData) => {
  return Axios.post(`/admin/after_service/s/${formData.id}`, formData)
}
