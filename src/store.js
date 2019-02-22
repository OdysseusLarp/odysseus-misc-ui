import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist'
import axios from 'axios'

Vue.use(Vuex);

const vuexPersist = new VuexPersist({
  key: 'odysseus-misc-ui',
  storage: localStorage
})

const store = new Vuex.Store({
  state: {
    dataBlobs: [],
    boxId: "",
    backend: {
      uri: "http://localhost:8888",
      username: "",
      password: "",
    }
  },
  mutations: {
    setBackend (state, backend) {
      state.backend = backend
    },
    setBoxId (state, boxId) {
      state.boxId = boxId
    },
    setDataBlob (state, data) {
      let found = false
      state.dataBlobs = state.dataBlobs.map(e => {
        if (e.type === data.type && e.id == data.id) {
          found = true
          return data
        } else {
          return e
        }
      })
      if (!found) {
        state.dataBlobs.push(data)
      }
    },
    deleteDataBlob (state, data) {
      state.dataBlobs = state.dataBlobs.filter(e => e.type !== data.type || e.id !== data.id)
    },
  },
  actions: {
    saveDataBlob ({ commit, dispatch, state }, data) {
      const type = data.type
      const id = data.id
      commit('setDataBlob', data)

      axios.post(`/data/${type}/${id}`, data)
      .then(response => {
        commit('setDataBlob', response.data)
      })
      .catch(e => {
        console.error("Error saving data blob, fetching back from server", e)
        dispatch('fetchDataBlob', data)
      })
    },
    fetchDataBlob ({ commit, state }, data) {
      const type = data.type
      const id = data.id

      axios.get(`/data/${type}/${id}`)
      .then(response => {
        commit('setDataBlob', response.data)
      })
      .catch(e => {
        console.error("Error fetching data blob: ", e)
      })
    }

  },
  plugins: [ vuexPersist.plugin ],
})


// DEBUGGING: Allow accessing store from global scope:
window.debug_store = store

export default store
