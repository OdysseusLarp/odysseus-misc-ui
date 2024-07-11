<template>
  <Box :title="item.title" color="yellow" style="height: 100%">
    <div v-if="item.title">
      <div class="description">{{item.description}}</div>
      <div v-if="item.calibrationCount > 1" class="calibration">Estimated calibration time: {{item.calibrationCount}} ⨉ {{formatDuration(item.calibrationTime)}}</div>
      <div v-else-if="item.calibrationCount === 1" class="calibration">Estimated calibration time: {{formatDuration(item.calibrationTime)}}</div>
      <div v-else class="calibration">Estimated calibration time: None</div>
      <div v-if="item.hasOwnProperty('eeHealth')  > 0" class="calibration">Fixes {{formatEEType(item.eeType)}} by {{Math.round((item.eeHealth * 100 + Number.EPSILON) * 100) / 100}} %</div>
      <div v-if="item.hasOwnProperty('lifesupportHealth') > 0" class="calibration">Fixes life support by {{Math.round((item.lifesupportHealth * 100 + Number.EPSILON) * 100) / 100}} %</div>
    </div>
  </Box>
</template>

<style lang="scss" scoped>
.description {
  // font-size: 80%;
  // background-color: #bbb;
  margin: 0 -5px;
  padding: 0 5px;
  border-radius: 3px;
  white-space: pre-line;
}
.calibration {
  font-size: 80%;
  margin-top: 1em;
  font-style: italic;
}
</style>


<script>
const KEY = "odysseus.selectedTask"
import Box from '../components/Box'

export default {
  data() {
    return {
      item: {
      }
    }
  },
  created () {
    window.addEventListener('storage', () => this.update())
    this.update()
  },
  methods: {
    update () {
      this.item = JSON.parse(localStorage.getItem(KEY) || '{}')
    },
    toggleImportant (item) {
      item = {...item, important: !item.important}
      this.$store.dispatch('saveDataBlob', item)
    },
    formatDuration (time) {
      if (time >= 45) {
        return Math.round(time/60) + " min"
      } else {
        return Math.ceil(time/10)*10 + " s"
      }
    },
    formatEEType (type) {
      const eeTypeMapping = {
        "rearshield": "rear shields",
        "frontshield": "front shields",
        "impulse": "impulse engine",
        "maneuver": "maneuvering",
        "missilesystem": "missile system",
        "beamweapons": "beam weapons",
      }
      return eeTypeMapping[type] ?? type;
    },
  },
  components: {
    Box,
  },
}
</script>
