<template>
  <div class="airlock-ui"  :class="airlockState">
    <div class="edge left"></div>
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
        <div class="content" :class="airlockState">
          <timer :target="testTarget"></timer>
        </div>
      </div>

    </div>
    <div class="edge right"></div>
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

.action.ok, .content.ok, .ok > .edge { background-color: $bg-green; }
.header.ok { background-color: $bg-darkgreen; border-color: $bg-green; }

.action.error, .content.error, .error > .edge { background-color: $bg-red; }
.header.error { background-color: $bg-darkred; border-color: $bg-red; }
</style>

<script>
import Timer from '@/components/Timer.vue';
import { startDataBlobSync } from '../storeSync'

const DEFAULT_BOX = {}

export default {
  components: {
    Timer,
  },
  data: () => ({
    testTarget: new Date(new Date().getTime() + 15*60*1000)
  }),
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
  },
  methods: {
    openDoor () {
      // TODO
    }
  },
  created () {
    startDataBlobSync('box', this.$store.state.boxId)
  },
}
</script>
