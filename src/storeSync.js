import store from './store'
import io from 'socket.io-client'

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

  store.dispatch('syncDataBlobs', { type, id })

  const socket = io(`${store.state.backend.uri}/data?data=${path}`, {})
  socket.on('dataUpdate', (type, id, value) => {
    //console.log('dataUpdate: ' + type + ' ' + id, value)
    store.commit('setDataBlob', value)
  });
  socket.on('dataDelete', (type, id) => {
    console.log('dataDelete: ' + type + ' ' + id)
    store.commit('deleteDataBlob', { type, id })
  });
}

export function startFleetBlobSync() {
  let path = '/fleet'

  console.log("### Initializing fleet blob syncing from " + store.state.backend.uri + " with path " + path)

  store.dispatch('syncFleetBlobs')

  const socket = io(`${store.state.backend.uri}/${path}`, {})
  socket.on('fleetUpdate', (value) => {
    console.log('fleetUpdate: ' + value)
    store.commit('setFleetBlob', value)
  });
  socket.on('fleetDelete', (id) => {
    console.log('fleetDelete: ' + id)
    store.commit('deleteFleetBlob', { id })
  });
}