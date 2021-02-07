import Axios from 'axios'

export const getIncomeList = (params) => {
  return Axios.get(`/admin/bill`, {params: params})
}
export const getProfitOverview = () => {
  return Axios.get(`/admin/bill/overview`)
}
