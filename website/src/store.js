import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    events: [],
    loading: true,
    error: null,
    admin: !!localStorage.calendarAdmin
  },
  mutations: {
    eventsLoaded(state, { events }) {
      state.events = events
      state.loading = false
    },
    eventsFailedToLoad(state, { error }) {
      state.error = error
      state.loading = false
    },
    adminModeSet(state, { admin }) {
      state.admin = admin
    }
  },
  actions: {
    async load({ commit }) {
      try {
        const events = await window
          .fetch('/calendar.json')
          .then(response => response.json())
        commit('eventsLoaded', { events })
      } catch (error) {
        commit('eventsFailedToLoad', { error })
      }
    },
    toggleAdminMode({ commit, state }) {
      const admin = !state.admin
      localStorage.calendarAdmin = admin ? '1' : ''
      commit('adminModeSet', { admin })
    }
  },
  getters: {
    topics(state) {
      return [
        ...new Set([].concat(...state.events.map(e => e.topics || [])))
      ].sort()
    },
    locations(state) {
      const map = new Map()
      for (const event of state.events) {
        map.set(event.location.title, event.location)
      }
      return [...map.values()]
    }
  }
})

export default store
