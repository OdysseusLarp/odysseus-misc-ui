import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist'

Vue.use(Vuex);

const vuexPersist = new VuexPersist({
  key: 'odysseus-misc-ui',
  storage: localStorage
})

const store = new Vuex.Store({
  state: {
    dataBlobs: [],
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

  },
  plugins: [ vuexPersist.plugin ],
})


// DEBUGGING: Allow accessing store from global scope:
// declare global {
//   interface Window { store: any; }
// }
// window.store = store

export default store
