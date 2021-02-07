import Vue from 'vue'
import Axios from 'axios'
import { UPDATE_ME } from 'src/store/types'
import { clearAuthCookie } from 'src/service/auth/index'

export const login = (params) => {
  return Axios.post('/admin/pub/login', params)
    .then(res => {
      Vue.$store.commit(UPDATE_ME, res.data)
      return res
    })
}

export const logout = () => {
  return Axios.get('/admin/pub/logout', {
    ignoreError: true
  }).then(res => {
    Vue.$store.commit(UPDATE_ME, null)
    Vue.$router.replace({
      name: 'Login'
    })
    return res
  }).catch((err) => {
    Vue.$store.commit(UPDATE_ME, null)
    clearAuthCookie()
    Vue.$router.replace({
      name: 'Login'
    })
    return err
  })
}

export const getCaptcha = () => {
  return Axios.get(`/admin/pub/captcha`)
}
