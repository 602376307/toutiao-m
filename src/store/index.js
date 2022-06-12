import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userPhoto: '',
    nickName: '13'
  },
  mutations: {
    SET_USERPHOTO (state, value) {
      state.userPhoto = value
    },
    SET_NICKNAME (state, value) {
      state.nickName = value
    }
  },
  actions: {
  },
  modules: {
  }
})
