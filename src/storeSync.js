import store from './store'
import io from 'socket.io-client'
import axios from 'axios'

/*
 * Usage example:
 *   startDataBlobSync()               - sync everything
 *   startDataBlobSync('box')          -  sync all 'box' types
 *   startDataBlobSync('box','myid')   -  sync single data blob
 */
export function startDataBlobSync(type, id) {
  let path
  if (type && id) {
    path = `/data/${type}/${id}`
  } else if (type) {
    path = `/data/${type}`
  } else {
    path = '/data'
  }
  console.log("Initializing data blob syncing from " + store.state.backend.uri + " with path " + path)

  store.dispatch('syncDataBlobs', {type, id})

  const socket = io(`${store.state.backend.uri}/data?data=${path}`, {})
  socket.on('dataUpdate', (type, id, value) => {
    console.log('dataUpdate: ' + type + ' ' + id, value)
    store.commit('setDataBlob', value)
  });
  socket.on('dataDelete', (type, id) => {
    console.log('dataDelete: ' + type + ' ' + id)
    store.commit('deleteDataBlob', {type, id})
  });
}
