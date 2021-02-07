import Axios from 'axios'
import * as R from 'ramda'

export const getList = (params) => {
  return Axios.get('/admin/sysuser', {
    params: params
  })
}

export const checkExist = (params) => {
  return Axios.head('/admin/sysuser', {
    params: params,
    ignoreError: true
  })
}

export const getItem = (id) => {
  return Axios.get(`/admin/sysuser/s/${id}`)
}

export const create = (form) => {
  return Axios.post('/admin/sysuser', R.pickAll(['name', 'mobile', 'passwd', 'roles'])(form))
}

export const update = (id, form) => {
  return Axios.post(`/admin/sysuser/s/${id}`, R.pickAll(['name', 'mobile', 'passwd', 'roles'])(form))
}

export const enable = (id) => {
  return Axios.post(`/admin/sysuser/s/${id}/enable`)
}

export const disable = (id) => {
  return Axios.post(`/admin/sysuser/s/${id}/disable`)
}
