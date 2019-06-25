<template>
  <div class="airlock-ui" :class="mainUIColor">
    <div class="edge left"></div>
    <div class="sections">

      <div class="section">
        <div class="splitpane">
          <div class="header">Inner door</div>
          <div class="header">Pressure</div>
        </div>
        <div class="splitpane">
          <div class="content">{{doorState}}</div>
          <div class="content"><counter :value="Math.round(this.pressure * 100, 2) + '%'"></counter></div>
        </div>
      </div>

      <div class="section">
        <div v-if="buttonAction === 'pressurize'" class="action" :class="{ green: canPressurize }" v-on:click="pressurize">
          << Pressurize >>
        </div>
        <div v-else-if="buttonAction === 'open'" class="action" :class="{ green: canOpen, red: !canOpen }"  v-on:click="openDoor">
          << Open door >>
        </div>
        <div v-else-if="buttonAction === 'depressurize'" class="action" :class="{ green: canDepressurize }" v-on:click="depressurize">
          >> Depressurize <<
        </div>
        <div v-else-if="buttonAction === 'cancel'" class="action" :class="{ green: canCancel }" v-on:click="cancel">
          !! Cancel !!
        </div>
        <div v-else class="action">Out of order</div>
      </div>

      <div class="section">
        <div class="header">Condition</div>
        <div class="content">{{statusMessage}}</div>
      </div>

      <div class="section">
        <div class="header">Countdown</div>
        <div class="content">
          <timer :target="countdown"></timer>
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
  position: relative;
  z-index: 1;
  background-color: $bg-gray;
}
.header {
  border: 3px 0px solid $bg-gray;
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
.splitpane > div {
  flex-basis: 50%;
}

.green .content, .green .edge, .action.green { background-color: $bg-green; }
.green .header{ background-color: $bg-darkgreen; border-color: $bg-green; }

.red .content, .red .edge, .action.red { background-color: $bg-red; }
.red .header { background-color: $bg-darkred; border-color: $bg-red; }
</style>

<script>
import Counter from '@/components/Counter.vue';
import Timer from '@/components/Timer.vue';
import { startDataBlobSync } from '../storeSync';
import axios from 'axios';

const DEFAULT_BOX = {}

export default {
  components: {
    Counter,
    Timer,
  },
  computed: {
    box () {
      return this.$store.state.dataBlobs.find(e => e.type === 'box' && e.id === this.$store.state.boxId) || DEFAULT_BOX
    },
    countdown () {
      return new Date(this.box.countdown_to)
    },
    pressure () {
      return this.box.pressure || 0
    },
    location () {
      return 'airlock'  // FIXME: how to customize this???
    },
    mainUIColor () {
      return this.box.status === 'open' ? 'green' : 'red'
    },
    canPressurize () {
      return this.box.status === 'vacuum' && this.location !== 'outside'
    },
    canDepressurize () {
      return this.box.status === 'open' && this.location !== 'inside'
    },
    canOpen () {
      return this.box.status !== 'open' && this.pressure >= 1 && !this.box.malfunction
    },
    canCancel () {
      if (this.box.status === 'pressurizing' && this.pressure <= 0) return true;
      if (this.box.status === 'depressurizing' && this.pressure >= 1) return true;
      return false;
    },
    buttonAction () {
      if (this.box.status === 'pressurizing') return 'cancel'
      if (this.box.status === 'depressurizing') return 'cancel'
      if (this.pressure >= 1 && this.box.status !== 'open') return 'open'
      if (this.location === 'inside' || this.pressure <= 0) return 'pressurize'
      if (this.location === 'outside' || this.pressure >= 1) return 'depressurize'
      return 'error'
    },
    statusMessage () {
      const messages = this.box.config.status_messages || {};
      let msg = this.box.transition_status && messages[this.box.transition_status]
      if (!msg) msg = messages[this.box.status || 'default']
      if (!msg) msg = 'Error'
      return msg
    },
    doorState () {
      const messages = this.box.config.door_states || {};
      let msg = this.box.transition_status && messages[this.box.transition_status]
      if (!msg) msg = messages[this.box.status || 'default']
      if (!msg) msg = 'Error'
      return msg
    }
  },
  methods: {
    pressurize () {
      if (this.canPressurize) this.setStatus('pressurizing')  // backend does the rest
    },
    depressurize () {
      if (this.canDepressurize) this.setStatus('depressurizing')  // backend does the rest
    },
    openDoor () {
      if (this.canOpen) this.setStatus('pressurizing')  // backend does the rest (yes, we use the same status)
    },
    cancel () {
      if (!this.canCancel) return;
      else if (this.pressure <= 0) this.setStatus('vacuum')
      else if (this.pressure >= 1) this.setStatus('pressurizing')
      else this.setStatus('error')  // can't happen?
    },
    setStatus (status) {
      console.log(`Setting status to ${status}...`)
      axios.patch(`/data/box/${this.$store.state.boxId}`, {status: status, version: this.box.version})
        .then(() => console.log(`Status set to ${status}`))
        .catch((err) => console.log(`Failed to set status to ${status}:`, err))
    }
  },
  created () {
    startDataBlobSync('box', this.$store.state.boxId)
  },
}
</script>
