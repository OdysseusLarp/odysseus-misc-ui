<template>
  <div>
        <div class="column-container col1">
          <div class="col-title">Malfunctioning:</div>
          <div class="col-note">&nbsp;</div>
          <draggable v-model="broken" @end="end">
            <div v-for="element in broken" :key="element.id" class="item draggable">
              <div class="title">{{element.title}}</div>
              <font-awesome-icon icon="exclamation-triangle" :class="element.important ? 'important active' : 'important'" @click="toggleImportant(element)" />
              <div class="calibration">Calibration: 3⨉10min</div>
            </div>
          </draggable>
        </div>
        <div class="column-container col2">
          <div class="col-title">Calibrating:</div>
          <div class="col-note">Current calibration capacity: 3</div>
          <div v-for="element in calibrating" :key="element.id" class="item">
            <div class="title">{{element.title}}</div>
            <font-awesome-icon icon="exclamation-triangle" :class="element.important ? 'important active' : 'important'" @click="toggleImportant(element)" />
            <div class="calibration">Calibration: 3⨉10min</div>
          </div>
        </div>
        <div class="column-container col3">
          <div class="col-title">Fixed:</div>
          <div class="col-note">&nbsp;</div>
          <div v-for="element in fixed" :key="element.id" class="item">
            <div class="title">{{element.title}}</div>
            <font-awesome-icon icon="exclamation-triangle" :class="element.important ? 'important active' : 'important'" @click="toggleImportant(element)" />
            <div class="calibration">Calibration: 3⨉10min</div>
          </div>
        </div>
  </div>
</template>

<style lang="scss" scoped>
$icon-size: 2em;
$vmargin: 5%;
$hmargin: 3%;
$width: (100% - 4*$hmargin)/3;

.column-container {
  position: absolute;
  top: $vmargin;
  bottom: $vmargin;
  width: $width;

  background-color: #aaa;
  padding: 1em;
  overflow-y: auto;

  &.col1 {
    left: $hmargin;
  }
  &.col2 {
    left: (2*$hmargin + $width);
  }
  &.col3 {
    left: (3*$hmargin + 2*$width);
  }

  .col-title {
    font-size: 120%;
    font-weight: 500;
  }
  .col-note {
    font-size: 70%;
    margin-bottom: 1em;
  }
}
.item {
  margin-bottom: 1em;
  background-color: #bbb;
  position: relative;
  .title {
    margin-left: 0.5em;
    margin-right: ($icon-size + 0.5em);
    font-size: 90%;
  }
  .important {
    position: absolute;
    top: 0;
    right: 0;
    width: $icon-size;
    height: $icon-size;
    padding: 0.3em;
    color: rgba(0,0,0,0.15);
    cursor: pointer;
    &.active {
      color: #dc3545;
    }
  }
  .calibration {
    margin-left: 0.5em;
    margin-right: ($icon-size + 0.5em);
    font-size: 70%;
  }
}

.draggable {
  cursor: grab;
}
</style>


<script>
import { startDataBlobSync } from '../storeSync'
import draggable from 'vuedraggable'

export default {
  data() {
    return {
    }
  },
  computed: {
    broken: {
      get() {
        return this.sort(this.$store.state.dataBlobs.filter(t => t.type === 'task' && t.state === 'broken'))
      },
      set() {
        // no-op, handled in end()
      }
    },
    calibrating () {
      return this.sort(this.$store.state.dataBlobs.filter(t => t.type === 'task' && t.state === 'calibrating'))
    },
    fixed () {
      return this.sort(this.$store.state.dataBlobs.filter(t => t.type === 'task' && t.state === 'fixed'))
    },
  },
  created () {
    startDataBlobSync('task')
  },
  components: {
      draggable,
  },
  methods: {
    end (evt) {
      const oldIndex = evt.oldIndex
      const newIndex = evt.newIndex
      const item = {...this.broken[oldIndex]}
      console.log(oldIndex  + " -> " + newIndex)

      if (oldIndex === newIndex) {
        // Drop on self, no-op
      } else if (newIndex === 0) {
        // First item in list
        item.sort = this.broken[0].sort - 1
      } else if (newIndex === this.broken.length - 1) {
        // Last item in list
        item.sort = this.broken[this.broken.length-1].sort + 1
      } else if (newIndex < oldIndex) {
        // Move between items above
        item.sort = (this.broken[newIndex-1].sort + this.broken[newIndex].sort) / 2
      } else {
        // Move between items below
        item.sort = (this.broken[newIndex].sort + this.broken[newIndex+1].sort) / 2
      }
      this.$store.dispatch('saveDataBlob', item)
    },
    sort (array) {
      return array.slice().sort((a, b) => a.sort - b.sort)
    },
    toggleImportant (item) {
      item = {...item, important: !item.important}
      this.$store.dispatch('saveDataBlob', item)
    }
  }
}
</script>
