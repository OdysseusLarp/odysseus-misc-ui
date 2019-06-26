<template>
  <div class="airlock-ui">
    <div class="edge left" :class="mainUIColor"></div>
    <div class="sections">

      <div class="section">
        <div class="splitpane">
          <div class="header" :class="doorColor">Inner door</div>
          <div class="header" :class="pressureColor">Pressure</div>
        </div>
        <div class="splitpane">
          <div class="content" :class="doorColor">{{doorState}}</div>
          <div class="content" :class="pressureColor"><counter :value="pressurePercent"></counter></div>
        </div>
      </div>

      <div class="section">
        <div v-if="buttonAction === 'open'" class="action" :class="{ green: canOpen, red: !canOpen }"  v-on:click="openDoor">
          << Open door >>
        </div>
        <div v-else-if="buttonAction === 'pressurize'" class="action" :class="{ green: canPressurize }" v-on:click="pressurize">
          << Pressurize >>
        </div>
        <div v-else-if="buttonAction === 'depressurize'" class="action" :class="{ green: canDepressurize }" v-on:click="depressurize">
          >> Depressurize <<
        </div>
        <div v-else-if="buttonAction === 'cancel'" class="action" :class="{ darkgreen: canCancel }" v-on:click="cancel">
          !! Cancel !!
        </div>
        <div v-else class="action">Out of order</div>
      </div>

      <div class="section">
        <div class="header" :class="mainUIColor">Condition</div>
        <div class="content" :class="mainUIColor">{{statusMessage}}</div>
      </div>

      <div class="section">
        <div class="header" :class="mainUIColor">{{countdownTitle}}</div>
        <div class="content" :class="countdownColor">
          <timer :target="countdown"></timer>
        </div>
      </div>

    </div>
    <div class="edge right" :class="mainUIColor"></div>
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

.header, .content, .action {
  white-space: nowrap;
  overflow: hidden;
}

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

.content.green, .edge.green, .action.green { background-color: $bg-green; }
.header.green  { background-color: $bg-darkgreen; border-color: $bg-green; }

.content.red, .edge.red, .action.red { background-color: $bg-red; }
.header.red  { background-color: $bg-darkred; border-color: $bg-red; }

.content.darkgreen, .header.darkgreen, .action.darkgreen { background-color: $bg-darkgreen; }
</style>

<script>
import Counter from '@/components/Counter.vue';
import Timer from '@/components/Timer.vue';
import { startDataBlobSync } from '../storeSync';
import axios from 'axios';

const DEFAULT_BOX = {}

// apply a non-linear function to the pressure
function sigmoid (x) {
  return 3 * x**2 - 2 * x**3
}

export default {
  components: {
    Counter,
    Timer,
  },
  props: {
    location: String
  },
  data: () => 1 && {
    pressure: 0,  // updated via timer
    pressureUpdateTimer: undefined,
  },
  computed: {
    box () {
      return this.$store.state.dataBlobs.find(e => e.type === 'box' && e.id === this.$store.state.boxId) || DEFAULT_BOX
    },
    countdown () {
      return new Date(this.box.countdown_to)
    },
    pressureRamp () {
      const pressure = this.box.pressure
      if (typeof pressure === 'number') return { t0: 0, p0: pressure, t1: 0, p1: pressure }
      else return pressure  // assume it's already in the format above!
    },
    pressurePercent () {
      return Math.round(sigmoid(this.pressure) * 100, 2) + '%'
    },
    mainUIColor () {
      if (this.box.status === 'open') return 'green'
      if (this.box.status === 'vacuum') return 'green'
      return 'red'
    },
    doorColor () {
      if (this.box.status === 'open') return 'green'
      if (this.box.transition_status === 'depressurize_start') return 'darkgreen'
      return 'red'
    },
    pressureColor () {
      if (this.pressure >= 1) return 'green'
      return 'red'
    },
    countdownColor () {
      // if (this.mainUIColor === 'green' && this.box.countdown_to == 0) return 'gray'
      return this.mainUIColor
    },
    canPressurize () {
      return this.box.status === 'vacuum' && this.location !== 'outside'
    },
    canDepressurize () {
      return this.box.status === 'open' && this.location !== 'inside'
    },
    canOpen () {
      if (this.pressure < 1 || this.box.malfunction) return false
      if (this.box.status === 'closed' || this.box.status === 'malfunction') return true
      if (this.box.status === 'open' && this.location === 'inside') return true
      return false
    },
    canCancel () {
      if (this.box.status === 'pressurizing') return true
      if (this.box.status === 'depressurizing') return true
      return false
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
      if (!msg) msg = messages[this.box.status]
      if (!msg) msg = messages.default || 'Nominal'
      return msg
    },
    doorState () {
      const messages = this.box.config.door_states || {};
      let msg = this.box.transition_status && messages[this.box.transition_status]
      if (!msg) msg = messages[this.box.status]
      if (!msg) msg = messages.default || 'Nominal'
      return msg
    },
    countdownTitle () {
      const messages = this.box.config.countdown_titles || {};
      let msg = this.box.transition_status && messages[this.box.transition_status]
      if (!msg) msg = messages[this.box.status]
      if (!msg) msg = messages.default || 'Timer'
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
      else if (this.box.status === 'pressurizing') this.setStatus('depressurizing')
      else if (this.box.status === 'depressurizing') this.setStatus('pressurizing')
      else this.setStatus('error')  // can't happen?
    },
    setStatus (status) {
      console.log(`Setting status to ${status}...`)
      axios.patch(`/data/box/${this.$store.state.boxId}?force=true`, {status: status, version: this.box.version})
        .then(() => console.log(`Status set to ${status}`))
        .catch((err) => console.log(`Failed to set status to ${status}:`, err))
    },
    updatePressure () {
      const ramp = this.pressureRamp
      const now = new Date().getTime()
      if (now < ramp.t0) {
        this.pressure = ramp.p0
        this.pressureUpdateTimer = setTimeout(() => this.updatePressure(), Math.max(ramp.t0 - now, 100))
      } else if (now >= ramp.t1) {
        this.pressure = ramp.p1
        this.pressureUpdateTimer = undefined  // no more updates needed
      } else {
        const x = (now - ramp.t0) / (ramp.t1 - ramp.t0)
        this.pressure = ramp.p0 + x * (ramp.p1 - ramp.p0)
        this.pressureUpdateTimer = setTimeout(() => this.updatePressure(), 100 + 300 * Math.random())
      }
    },
  },
  watch: {
    pressureRamp () {
      if (this.pressureUpdateTimer) clearInterval(this.pressureUpdateTimer)
      this.updatePressure()
    },
  },
  created () {
    startDataBlobSync('box', this.$store.state.boxId)
  },
}
</script>
