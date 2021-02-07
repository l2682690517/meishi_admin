import Axios from 'axios'
import * as ProductService from 'src/service/product'

export const getList = (params) => {
  return Axios.get('/admin/product', {
    params: params
  })
}

export const checkExist = (params) => {
  return Axios.head('/admin/product', {
    params: params,
    ignoreError: true
  })
}

export const getItem = (id) => {
  return Axios.get(`/admin/product/s/${id}`)
}

export const create = (form) => {
  const params = ProductService.convertFormToParam(form)
  return Axios.post('/admin/product', params)
}

export const update = (id, form) => {
  const params = ProductService.convertFormToParam(form)
  return Axios.post(`/admin/product/s/${id}`, params)
}
export const shelveUp = (id) => {
  return Axios.post(`/admin/product/s/${id}/up`)
}
export const shelveDown = (id) => {
  return Axios.delete(`/admin/product/s/${id}/up`)
}
export const top = (id) => {
  return Axios.post(`/admin/product/s/${id}/top`)
}
export const cancelTop = (id) => {
  return Axios.delete(`/admin/product/s/${id}/top`)
}
export const deleteProduct = (id) => {
  return Axios.post(`/admin/product/s/${id}/trash`)
}
export const cancelDeleteProduct = (id) => {
  return Axios.delete(`/admin/product/s/${id}/trash`)
}
export const batchCategory = (formData) => {
  return Axios.post(`/admin/batch/product/category`, formData)
}
export const batchChangeTags = (fomData) => {
  return Axios.post(`/admin/batch/product/tags`, fomData)
}
export const batchShelveDown = (arr) => {
  let formData = {
    pids: arr
  }
  return Axios.delete(`/admin/batch/product/up`, formData)
}
export const getTenantSelectList = (id) => {
  let params = {
    page: 1,
    limit: 50
  }
  return Axios.get(`/admin/product/s/${id}/tenant/selected/sold`, {params: params})
}
export const getRecycleList = (params) => {
  return Axios.get('/admin/product', {
    params: params
  })
}
