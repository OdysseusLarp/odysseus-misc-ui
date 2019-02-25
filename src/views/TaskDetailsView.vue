<template>
  <div class="main">
    <div v-if="item.title">
      <div class="title">{{item.title}}</div>
      <div class="description">{{item.description}}</div>
      <div v-if="item.calibrationCount > 1" class="calibration">Estimated calibration time: {{item.calibrationCount}} ⨉ {{formatDuration(item.calibrationTime)}}</div>
      <div v-else-if="item.calibrationCount === 1" class="calibration">Estimated calibration time: {{formatDuration(item.calibrationTime)}}</div>
      <div v-else class="calibration">Estimated calibration time: None</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main {
  background-color: #aaa;
  padding: 1em;
  height: 100%;
}
.title {
  font-size: 120%;
  font-weight: 500;
  margin-bottom: 0.5em;
}
.description {
  font-size: 80%;
  background-color: #bbb;
  margin: 0 -5px;
  padding: 0 5px;
  border-radius: 3px;
}
.calibration {
  font-size: 70%;
  margin-top: 1em;
}
</style>


<script>
const KEY = "odysseus.selectedTask"

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
  }
}
</script>
