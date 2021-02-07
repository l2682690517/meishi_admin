import Cookies from 'js-cookie'

export const clearAuthCookie = () => {
  try {
    Cookies.remove('web-session', {path: '/'})
  } catch (e) {
    console.log('clear cookie fail')
  }
}
