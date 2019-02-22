import store from './store'
import io from 'socket.io-client'
import axios from 'axios'

export function fetchDataBlobs(path) {
  axios.get(path)
  .then(response => {
    if (Array.isArray(response.data)) {
      response.data.forEach(e => store.commit('setDataBlob', e))
    } else {
      store.commit('setDataBlob', response.data)
    }
  })
  .catch(e => {
    console.error("Error fetching data blobs (retrying in 5 secs): ", e)
    setTimeout(() => fetchDataBlobs(path), 5000)
  })
}

/*
 * Usage example:
 *   startDataBlobSync('/box')        -  sync all 'box' types
 *   startDataBlobSync('/box/myid')   -  sync single data blob
 */
export function startDataBlobSync(path) {
  path = `/data${path || ''}`
  console.log("Initializing data blob syncing from " + store.state.backend.uri + " with path " + path)

  fetchDataBlobs(path)

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
