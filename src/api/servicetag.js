import Axios from 'axios'

export const getTagList = () => {
  return Axios.get(`/admin/service_tag`)
}
export const getTagItem = (id) => {
  return Axios.get(`/admin/service_tag/s/${id}`)
}
export const createTagItem = (formData) => {
  return Axios.post(`/admin/service_tag`, formData)
}
export const editTagItem = (formData) => {
  return Axios.post(`/admin/service_tag/s/${formData.id}`, formData)
}
export const deleteTagItem = (id) => {
  return Axios.delete(`/admin/service_tag/s/${id}`)
}
export const getTagGroupList = () => {
  return Axios.get(`/admin/service_tag_group`)
}
export const getTagGroupItem = (id) => {
  return Axios.get(`/admin/service_tag_group/s/${id}`)
}
export const createTagGroupItem = (formData) => {
  return Axios.post(`/admin/service_tag_group`, formData)
}
export const editTagGroupItem = (formData) => {
  return Axios.post(`/admin/service_tag_group/s/${formData.id}`, formData)
}
export const deleteTagGroupItem = (id) => {
  return Axios.delete(`/admin/service_tag_group/s/${id}`)
}
