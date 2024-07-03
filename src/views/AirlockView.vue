<template>
  <div v-if="jumping">
    <!-- Show TV-static screen during 'jumping' state -->
    <odysseus-static></odysseus-static>
  </div>
  <div v-else class="airlock-ui">
    <div class="edge left" :class="mainUIColor"></div>
    <div class="sections">

      <div class="section" v-if="this.box.config?.title_bar_text">
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
            <airlockPressure :rawPressure="box.pressure" :curve="box.config?.pressure_curve" v-on:pressureChange="onPressureChange" />
          </div>
        </div>
      </div>

      <div class="section">
        <div v-if="buttonAction === 'close'" class="action" :class="closeButtonColor" v-on:click="onCloseClick">
          {{localize('button_close')}}
        </div>
        <div v-else class="action" :class="openButtonColor" v-on:click="onOpenClick">
          {{localize('button_open')}}
        </div>
      </div>

      <div class="section">
        <div class="header" :class="mainUIColor">Condition</div>
        <div class="content" :class="mainUIColor">{{statusMessage}}</div>
      </div>

      <div v-if="box.config.allow_depressurize" class="section">
        <div v-if="pressurizeAction === 'depressurize'" class="action splitpane">
          <div v-on:click="onDepressurizeClick" class="depressurize" :class="depressurizeButtonColor">
            {{localize('button_depressurize')}}
          </div>
          <div v-on:click="onEvacuateClick" class="evacuate" :class="depressurizeButtonColor">
            {{localize('button_evacuate')}}
          </div>
        </div>
        <div v-else class="action" :class="pressurizeButtonColor" v-on:click="onPressurizeClick">
          {{localize('button_pressurize')}}
        </div>
      </div>

      <div class="section">
        <div class="header" :class="mainUIColor">{{countdownTitle}}</div>
        <div class="content" :class="mainUIColor"><timer :target="countdown" /></div>
      </div>

    </div>
    <div class="edge right" :class="mainUIColor"></div>

    <audio src="../../public/sounds/airlock/beep.mp3" ref="beep"></audio>
    <audio src="../../public/sounds/airlock/buzz.mp3" ref="buzz"></audio>
    <audio src="../../public/sounds/airlock/access_denied.mp3" ref="accessDenied"></audio>
  </div>
</template>

<style lang="scss" scoped>
/* color palette */
$bg-green: #0ae4b4;     /* content/action ok */
$bg-yellow: #e4c80a;    /* caution! */
$bg-red: #ec4705;       /* content error */
$bg-gray: #808285;      /* content neutral / action disabled */
$bg-darkgreen: #506b6a; /* header ok / content ok de-emphasized */
$bg-darkyellow: #726609;/* caution! */
$bg-darkred: #891300;   /* header with error */
$bg-darkgray: #414042;  /* header neutral */
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
  user-select: none;
  cursor: pointer;
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

.action.splitpane {
  background-color: $bg-blackish;
}
.action.splitpane > div {
  background-color: $bg-gray;
}
.splitpane > div.depressurize {
  margin-right: 7px;
}
.splitpane > div.evacuate {
  margin-left: 7px;
  font-size: 30px;
  line-height: 30px;
  padding: 20px 0;
  white-space: pre-wrap;
}

.content.green, .edge.green, .action.green, .action > div.green { background-color: $bg-green; }
.header.green  { background-color: $bg-darkgreen; border-color: $bg-green; }

.content.yellow, .edge.yellow, .action.yellow, .action > div.yellow { background-color: $bg-yellow; }
.header.yellow { background-color: $bg-darkyellow; border-color: $bg-yellow; }

.content.red, .edge.red, .action.red, .action > div.red { background-color: $bg-red; }
.header.red  { background-color: $bg-darkred; border-color: $bg-red; }

.content.darkgreen, .header.darkgreen, .action.darkgreen, .action > div.darkgreen { background-color: $bg-darkgreen; }

audio { display: none }
</style>

<script>
import AirlockPressure from '@/components/AirlockPressure.vue';
import Timer from '@/components/Timer.vue';
import { startDataBlobSync } from '@/storeSync';
import axios from 'axios';

const DEFAULT_BOX = { config: { messages: {} } }
const DEFAULT_JUMPSTATE = { status: 'unknown' }

const DEFAULT_MESSAGES = {
  // main status box messages
  status_open: 'Door unlocked',
  status_opening: 'Unlocking door',
  status_closing: 'Locking door',
  status_closed: 'Door locked',
  status_pressurizing: 'Pressurizing',
  status_depressurizing: 'Depressurizing',
  status_vacuum: 'Open to space',
  // special status box message during jump countdown and scripted scene
  access_denied: '!! Access Denied !!',
  // door status messages
  door_open: 'Unlocked',
  door_opening: 'Unlocking',
  door_closing: 'Locking',
  door_closed: 'Locked',
  // button actions
  button_open: '<< Unlock door >>',
  button_close: '>> Lock door <<',
  button_pressurize: '<< Pressurize >>',
  button_depressurize: '>> Depressurize <<',
  button_evacuate: 'Emergency\nDepressurize',
  // countdown titles
  countdown_opening: 'Unlocking door in',
  countdown_closing: 'Locking door in',
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
    jumpstate () {
      return this.$store.state.dataBlobs.find(e => e.type === 'ship' && e.id === 'jumpstate') || DEFAULT_JUMPSTATE
    },
    countdown () {
      return new Date(this.box.countdown_to)
    },
    mainUIColor () {
      if (this.accessDenied) return 'red'
      if (this.box.status === 'open' || this.box.status === 'opening') return 'green'
      // if (this.box.status === 'closed' || this.box.status === 'closing') return 'green'
      return 'red'
    },
    doorColor () {
      if (this.accessDenied) return 'red'
      if (this.box.status === 'open') return 'green'
      if (this.box.status === 'closing') return 'darkgreen'
      return 'red'
    },
    pressureColor () {
      if (this.scaledPressure >= (this.box.safe_pressure_threshold || 0.75)) return 'green'
      if (this.scaledPressure >= (this.box.deadly_pressure_threshold || 0.25)) return 'yellow'
      return 'red'
    },
    openButtonColor () {
      if (this.box.status === 'opening' || this.box.status === 'open') return 'darkgreen'
      return this.canOpen ? 'green' : 'red'
    },
    closeButtonColor () {
      if (this.box.status === 'closing' || this.box.status === 'closed') return 'darkgreen'
      return this.canClose ? 'green' : 'red'
    },
    pressurizeButtonColor () {
      if (this.box.status === 'pressurizing' || this.pressure >= 1) return 'darkgreen'
      return this.canPressurize ? 'green' : 'red'
    },
    depressurizeButtonColor () {
      if (this.box.status === 'depressurizing' || this.pressure <= 0) return 'darkred'
      return this.canDepressurize ? 'yellow' : 'gray'
    },
    canOpen () {
      return this.pressure >= 1 && (this.box.status === 'closed' || this.box.status === 'closing') && !this.accessDenied
    },
    canClose () {
      return this.box.status === 'open' && !this.accessDenied
    },
    canPressurize () {
      return this.pressure < 1 && this.box.status !== 'pressurizing' && !this.accessDenied
    },
    canDepressurize () {
      return this.pressure > 0 && this.box.status === 'closed' && !this.accessDenied
    },
    accessDenied () {
      return this.box.access_denied || this.jumpInitiated || this.jumping
    },
    jumpInitiated () {
      return this.jumpstate.status === 'jump_initiated'
    },
    jumping () {
      return this.jumpstate.status === 'jumping'
    },
    buttonAction () {
      if (this.box.config.auto_close_delay > 0) return 'open'  // closes automatically
      if (this.box.status === 'open') return 'close'
      return 'open'
    },
    pressurizeAction () {
      if (this.box.status === 'vacuum' || this.box.status === 'pressurizing' || this.box.status === 'depressurizing') return 'pressurize'
      return 'depressurize'
    },
    statusMessage () {
      if (this.accessDenied) return this.localize('access_denied')
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
    onOpenClick () {
      this.attemptAction('open', this.canOpen)
    },
    onCloseClick () {
      this.attemptAction('close', this.canClose)
    },
    onPressurizeClick () {
      this.attemptAction('pressurize', this.canPressurize)
    },
    onDepressurizeClick () {
      this.attemptAction('depressurize', this.canDepressurize)
    },
    onEvacuateClick () {
      this.attemptAction('evacuate', this.canDepressurize)  // same permission logic!
    },
    attemptAction(command, allowed) {
      if (this.accessDenied) {
        this.playSound('accessDenied')
      } else if (!allowed) {
        this.playSound('buzz')
      } else {
        this.playSound('beep')
        this.sendCommand(command)  // backend does the rest
      }
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
    playSound (id) {
      const audio = this.$refs[id]
      if (!(audio instanceof Audio)) return null
      audio.pause()
      audio.currentTime = 0
      return audio.play()
    }
  },
  created () {
    startDataBlobSync('box', this.$store.state.boxId)
    startDataBlobSync('ship', 'jumpstate')
  },
}
</script>
