import Axios from 'axios'

export const getList = (params) => {
  return Axios.get('/admin/category')
}

export const checkExist = (params) => {
  return Axios.head('/admin/category', {
    params: params,
    ignoreError: true
  })
}

export const getItem = (id) => {
  return Axios.get(`/admin/category/s/${id}`)
}

export const create = (form) => {
  return Axios.post('/admin/category', {...form})
}

export const update = (id, form) => {
  return Axios.post(`/admin/category/s/${id}`, {...form})
}

export const deleteItem = (id) => {
  return Axios.delete(`/admin/category/s/${id}`)
}

export const sortCategory = (parentId, categoryIds) => {
  return Axios.post(`/admin/sort/category/${parentId}`, {
    val: categoryIds || []
  })
}
