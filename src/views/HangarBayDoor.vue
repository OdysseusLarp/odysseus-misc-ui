<template>
  <div class="about">
    <h1>Pressure:</h1>
    <h2>{{box.pressure}}</h2>
  </div>
</template>

<script>
import { startDataBlobSync } from '../storeSync'

const DEFAULT_BOX = {}

export default {
  computed: {
    box () {
      return this.$store.state.dataBlobs.find(e => e.type === 'box' && e.id === this.$store.state.boxId) || DEFAULT_BOX
    }
  },
  created () {
    startDataBlobSync(`/box/${this.$store.state.boxId}`)
  },
}
</script>
