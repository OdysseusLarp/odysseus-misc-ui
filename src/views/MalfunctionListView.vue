<template>
  <b-container fluid class="bv-example-row">
    <b-row>
      <b-col>
        <div class="column-container">
          <div class="item">
            <div class="title">This is a pretty long text to be on one line</div>
            <div class="important"></div>
            <div class="calibration">Calibration: 3⨉10min</div>
          </div>
          <div class="item">Two</div>
          <div class="item">Three</div>
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
