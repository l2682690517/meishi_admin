import { UPDATE_ME } from '../types'

const state = {
  me: null
}

const getters = {
  isLogin: state => {
    if (state.me && state.me.id) {
      return true
    }
    return false
  }
}

const mutations = {

  /**
   * 更新ME
   * @param state
   * @param me
   */
  [UPDATE_ME] (state, me) {
    state.me = me
  }
}

export default {
  state,
  getters,
  mutations
}
