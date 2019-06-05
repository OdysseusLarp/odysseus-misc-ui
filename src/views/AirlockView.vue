<template>
  <div class="airlock-ui">
    <div class="edge left" :class="airlockState"></div>
    <div class="sections">

      <div class="section">
        <div class="header">{{box.name || "Airlock"}}</div>
        <div class="splitpane">
          <div class="content" :class="[doorState == 'open' ? 'ok' : 'error']">{{doorState}}</div>
          <div class="content">Pressure {{box.pressure}}</div>
        </div>
      </div>

      <div class="section">
        <div class="action" :class="airlockState" v-on:click="openDoor"><< Open door >></div>
      </div>

      <div class="section">
        <div class="header">Condition</div>
        <div class="content">{{box.status || "nominal"}}</div>
      </div>

      <div class="section">
        <div class="header">Time</div>
        <div class="content" :class="airlockState">{{time}}</div>
      </div>

    </div>
    <div class="edge right" :class="airlockState"></div>
  </div>
</template>

<style lang="scss" scoped>
/* color palette */
$bg-green: #0ae4b4;     /* content/action ok */
$bg-gray: #808285;      /* content neutral / action disabled */
$bg-red: #ec4705;       /* content error */
$bg-darkgreen: #506b6a; /* header ok / content ok de-emhasized */
$bg-darkgray: #414042;  /* header neutral */
$bg-darkred: #891300;   /* header with error */
$bg-blackish: #231f20;  /* gaps and sidebars */

/* FIXME: The pixel measurements below assume an 800x480 screen size. */

.airlock-ui {
  width: 100%;
  height: 100%;
  font-family: Orbitron;
  font-weight: normal;
  text-align: center;
  text-transform: uppercase;
  display: flex;
  flex-direction: row;
  color: black;
  background-color: $bg-blackish;
}

.edge {
  height: 100%;
  width: 10px;
  flex-grow: 0;
  background-color: $bg-gray;
}
.edge.left { margin-left: 30px; }
.edge.right { margin-right: 30px; }

.sections { flex-grow: 1; }
.section { margin-top: 15px; }

.action {
  margin-left: -40px;
  margin-right: -40px;
  height: 100px;
  line-height: 100px;
  font-size: 40px;
  font-weight: 900;
  background-color: $bg-gray;
}
.header {
  border: 3px solid $bg-gray;
  height: 35px;
  line-height: 35px;
  font-size: 20px;
  font-weight: bold;
  background-color: $bg-darkgray;
}
.content {
  height: 60px;
  line-height: 60px;
  font-size: 40px;
  font-weight: 900;
  background-color: $bg-gray;
}

.splitpane {
  display: flex;
  flex-direction: row;
}
.splitpane .content {
  flex-basis: 50%;
  font-size: 30px;
}

.action.ok, .content.ok, .edge.ok { background-color: $bg-green; }
.header.ok { background-color: $bg-darkgreen; border-color: $bg-green; }

.action.error, .content.error, .edge.error { background-color: $bg-red; }
.header.error { background-color: $bg-darkred; border-color: $bg-red; }
</style>

<script>
import { startDataBlobSync } from '../storeSync'

const DEFAULT_BOX = {}

export default {
  data() {
    return {
      timeCounter: 0
    }
  },
  computed: {
    box () {
      return this.$store.state.dataBlobs.find(e => e.type === 'box' && e.id === this.$store.state.boxId) || DEFAULT_BOX
    },
    airlockState () {
      return 'ok'
    },
    doorState () {
      return 'open'
    },
    time () {
      var t = this.timeCounter, h = Math.floor(t / 3600), m = Math.floor(t / 60) % 60, s = Math.floor(t % 60)
      if (h < 10) h = "0" + h
      if (m < 10) m = "0" + m
      if (s < 10) s = "0" + s
      return h + ":" + m + ":" + s
    }
  },
  methods: {
    incrementTime () {
      this.timeCounter = this.timeCounter + 1
    },
    openDoor () {
      // TODO
    }
  },
  created () {
    startDataBlobSync('box', this.$store.state.boxId)
    setInterval(this.incrementTime, 1000)
  },
}
</script>
