import Axios from 'axios'

export const getUserList = (params) => {
  return Axios.get(`/admin/user`, {
    params: params
  })
}
export const getUserDetail = (id) => {
  return Axios.get(`/admin/user/s/${id}`)
}
