<template>
  <div class="airlock-ui">
    <div class="edge left" :class="mainUIColor"></div>
    <div class="sections">

      <div class="section" v-if="this.box.config.title_bar_text">
        <div class="content" :class="mainUIColor">{{this.box.config.title_bar_text}}</div>
      </div>

      <div class="section">
        <div class="splitpane">
          <div class="header" :class="doorColor">Inner door</div>
          <div class="header" :class="pressureColor">Pressure</div>
        </div>
        <div class="splitpane">
          <div class="content" :class="doorColor">{{doorState}}</div>
          <div class="content" :class="pressureColor">
            <airlockPressure :rawPressure="box.pressure" :curve="box.config.pressure_curve" v-on:pressureChange="onPressureChange" />
          </div>
        </div>
      </div>

      <div class="section">
        <div v-if="buttonAction === 'close'" class="action" :class="closeButtonColor"  v-on:click="closeDoor">
          {{localize('button_close')}}
        </div>
        <div v-else class="action" :class="openButtonColor"  v-on:click="openDoor">
          {{localize('button_open')}}
        </div>
      </div>

      <div class="section">
        <div class="header" :class="mainUIColor">Condition</div>
        <div class="content" :class="mainUIColor">{{statusMessage}}</div>
      </div>

      <div class="section">
        <div class="header" :class="mainUIColor">{{countdownTitle}}</div>
        <div class="content" :class="mainUIColor"><timer :target="countdown" /></div>
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
import AirlockPressure from '@/components/AirlockPressure.vue';
import Timer from '@/components/Timer.vue';
import { startDataBlobSync } from '../storeSync';
import axios from 'axios';

const DEFAULT_BOX = {}
const DEFAULT_MESSAGES = {
  // main status box messages
  status_open: 'Door open',
  status_opening: 'Door opening',
  status_closing: 'Door closing',
  status_malfunction: 'Door malfunction',
  status_closed: 'Door closed',
  status_pressurizing: 'Pressurizing',
  status_depressurizing: 'Depressurizing',
  status_vacuum: 'Open to space',
  // door status messages
  door_open: 'Open',
  door_opening: 'Opening',
  door_closing: 'Closing',
  door_closed: 'Closed',
  door_malfunction: 'Error',
  // button actions
  button_open: '<< Open door >>',
  button_close: '>> Close door <<',
  // countdown titles
  countdown_opening: 'Door opening in',
  countdown_closing: 'Door closing in',
  countdown_pressurizing: 'Time to full pressure',
  countdown_depressurizing: 'Time to vacuum',
  countdown_default: 'Countdown',
}

export default {
  components: {
    AirlockPressure,
    Timer,
  },
  data () {
    return {
      pressure: 0,
      scaledPressure: 0
    }
  },
  computed: {
    box () {
      return this.$store.state.dataBlobs.find(e => e.type === 'box' && e.id === this.$store.state.boxId) || DEFAULT_BOX
    },
    countdown () {
      return new Date(this.box.countdown_to)
    },
    mainUIColor () {
      if (this.box.status === 'open' || this.box.status === 'opening') return 'green'
      // if (this.box.status === 'closed' || this.box.status === 'closing') return 'green'
      return 'red'
    },
    doorColor () {
      if (this.box.status === 'open') return 'green'
      if (this.box.status === 'closing') return 'darkgreen'
      return 'red'
    },
    pressureColor () {
      if (this.scaledPressure >= (this.box.safe_pressure_threshold || 0.99)) return 'green'
      return 'red'
    },
    openButtonColor () {
      if (this.box.status === 'opening' || this.box.status === 'open' || this.box.status === 'closing') return 'darkgreen'
      return this.canOpen ? 'green' : 'red'
    },
    closeButtonColor () {
      if (this.box.status === 'closing' || this.box.status === 'closed') return 'darkgreen'
      return this.canClose ? 'green' : 'red'
    },
    canOpen () {
      return this.pressure >= 1 && this.box.status === 'closed'
    },
    canClose () {
      return this.box.status === 'open'
    },
    buttonAction () {
      if (this.box.config.auto_close_delay > 0) return 'open'  // closes automatically
      if (this.box.status === 'open' || this.box.status === 'closing') return 'close'
      return 'open'
    },
    statusMessage () {
      return this.localize('status_' + this.box.status) || this.box.status
    },
    doorState () {
      return this.localize('door_' + this.box.status) || this.localize('door_closed')
    },
    countdownTitle () {
      if (this.box.status === 'open' && this.box.countdown_to > 0) return this.localize('countdown_closing')
      return this.localize('countdown_' + this.box.status) || this.localize('countdown_default')
    }
  },
  methods: {
    openDoor () {
      if (this.canOpen) this.sendCommand('open')  // backend does the rest
    },
    closeDoor () {
      if (this.canClose) this.sendCommand('close')  // backend does the rest
    },
    localize (message) {
      return this.box.config.messages[message] || DEFAULT_MESSAGES[message]
    },
    sendCommand (command) {
      console.log(`Send command ${command} to ${this.$store.state.boxId}...`)
			axios.patch(`/data/box/${this.$store.state.boxId}?force=true`, {command: command})
				.then(() => console.log(`Command ${command} sent to ${this.$store.state.boxId}`))
				.catch((err) => console.log(`Command ${command} to ${this.$store.state.boxId} failed:`, err))
    },
    onPressureChange (values) {
      this.pressure = values.unscaled
      this.scaledPressure = values.scaled
    },
  },
  created () {
    startDataBlobSync('box', this.$store.state.boxId)
  },
}
</script>
