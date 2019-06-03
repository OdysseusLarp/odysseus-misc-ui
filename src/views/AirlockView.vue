<template>
  <div class="airlock-ui">
    <div class="edge left"></div>
    <div class="sections">

      <div class="section">
        <div class="header orbitron-bold">Pressure</div>
        <div class="content orbitron-black">{{box.pressure}}</div>
      </div>

      <div class="action orbitron-black"><< Open door >></div>

      <div class="section">
        <div class="header orbitron-bold">Condition</div>
        <div class="content orbitron-black">STATUS MESSAGE</div>
      </div>

      <div class="section">
        <div class="header orbitron-bold">Time</div>
        <div class="content orbitron-black">00:00:00</div>
      </div>

    </div>
    <div class="edge right"></div>
  </div>
</template>

<style lang="scss" scoped>
.airlock-ui {
  width: 100%;
  height: 100%;
  background-color: #231f20;
  text-align: center;
  text-transform: uppercase;
  display: flex;
  flex-direction: row;
}

.edge {
  height: 100%;
  width: 10px;
  background-color: #0ae4b4;
  flex-grow: 0;
}
.edge.left { margin-left: 30px; }
.edge.right { margin-right: 30px; }

.sections {
  flex-grow: 1;
}

.action {
  margin: 15px -40px 0px -40px;
  background-color: #0ae4b4;
  height: 100px;
  line-height: 100px;
  font-size: 40px;
}

.header {
  margin-top: 15px;
  border: 3px solid #808285;
  height: 35px;
  line-height: 35px;
  font-size: 20px;
  background-color: #414042;
}
.content {
  height: 60px;
  line-height: 60px;
  font-size: 40px;
  background-color: #808285;
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
    startDataBlobSync('box', this.$store.state.boxId)
  },
}
</script>
