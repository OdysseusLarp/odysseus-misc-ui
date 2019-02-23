<template>
  <b-container fluid class="bv-example-row">
    <b-row>
      <b-col>
        <div class="column-container">
          <draggable v-model="malfunctions" @end="end">
            <div v-for="element in malfunctions" :key="element.id" class="item">
              <div class="title">{{element.title}}</div>
              <div class="important"></div>
              <div class="calibration">Calibration: 3⨉10min</div>
            </div>
          </draggable>
        </div>
      </b-col>
      <b-col>2 of 3</b-col>
      <b-col>3 of 3</b-col>
    </b-row>
  </b-container> 
</template>

<style lang="scss" scoped>
$icon-size: 2em;

.column-container {
  background-color: #aaa;
  padding: 1em;
  margin: 1em;
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
    background-color: #faa;
    position: absolute;
    top: 0;
    right: 0;
    width: $icon-size;
    height: $icon-size;
  }
  .calibration {
    margin-left: 0.5em;
    margin-right: ($icon-size + 0.5em);
    font-size: 70%;
  }
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
    malfunctions: {
      get() {
        return this.sort(this.$store.state.dataBlobs.filter(t => t.type === 'task' && t.state === 'broken'))
      },
      set() {
        // no-op, handled in end()
      }
    }
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
      const item = {...this.malfunctions[oldIndex]}
      console.log(oldIndex  + " -> " + newIndex)

      if (oldIndex === newIndex) {
        // Drop on self, no-op
      } else if (newIndex === 0) {
        // First item in list
        item.sort = this.malfunctions[0].sort - 1
      } else if (newIndex === this.malfunctions.length - 1) {
        // Last item in list
        item.sort = this.malfunctions[this.malfunctions.length-1].sort + 1
      } else if (newIndex < oldIndex) {
        // Move between items above
        item.sort = (this.malfunctions[newIndex-1].sort + this.malfunctions[newIndex].sort) / 2
      } else {
        // Move between items below
        item.sort = (this.malfunctions[newIndex].sort + this.malfunctions[newIndex+1].sort) / 2
      }
      this.$store.dispatch('saveDataBlob', item)
    },
    sort (array) {
      return array.slice().sort((a, b) => a.sort - b.sort)
    },
  }
}
</script>
