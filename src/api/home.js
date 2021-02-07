import Axios from 'axios'

export const getHomeData = () => {
  return Axios.get(`/admin/home`)
}
