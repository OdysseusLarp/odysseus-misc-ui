<template>
  <div class="app-container">
    <div class="infoboard-container" ref="infoboardContainer">
      <img :src="`img/infoboard/${solar === 'SOLAR' ? 'solar' : 'lunar'}.svg`">
      <div class="shift">{{ solar }}</div>
      <div class="title">{{ item.title.toUpperCase() }}</div>
      <div class="body" v-html="item.body">
      </div>
      <div class="jump-time">{{ (jump_text || '').toUpperCase() }}</div>
      <div class="ship-time">SHIP TIME {{ (time || '').toUpperCase() }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url(https://fonts.googleapis.com/css?family=Roboto|Orbitron:400italic,700italic,400,700);

$roboto: 'Roboto', sans-serif;
$orbitron: 'Orbitron', sans-serif;

.app-container {
  background: #1f1f1f;
  font-family: $orbitron;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.infoboard-container {
  color: #fff;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-height: 100vh;
    max-width: 100vw;
  }

  .shift {
    position: absolute;
    top: var(--shift-top);
    right: var(--shift-right);
    font-size: var(--shift-font-size);
    font-family: $orbitron;
    transform: translate(50%, 0);
    line-height: normal;
    // border: 2px solid #f00;
  }

  .title {
    position: absolute;
    top: var(--title-top);
    font-size: var(--title-font-size);
    line-height: normal;
    // border: 2px solid #0f0;
  }

  .body {
    position: absolute;
    top: var(--body-top);
    left: var(--body-leftRight);
    right: var(--body-leftRight);
    font-size: var(--body-font-size);
    height: var(--body-max-height);
    font-family: $roboto;
    overflow: hidden;
    // border: 2px solid #0ff;
  }

// Small gradient to indicate that the content is about to cut off
  .body:after {
    content: '';
    position: absolute;
    height: 8vw;
    left:0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(#1f1f1f, 0) 0%,rgba(#1f1f1f,1) 100%);
  }

  .ship-time {
    position: absolute;
    bottom: var(--ship-time-bottom);
    left: var(--ship-time-left);
    font-size: var(--ship-time-font-size);
    line-height: normal;
    // border: 2px solid #0f0;
  }

  .jump-time {
    position: absolute;
    bottom: var(--jump-time-bottom);
    left: var(--ship-time-left);
    font-size: var(--ship-time-font-size);
    line-height: normal;
    // border: 2px solid #00f;
  }
}
</style>

<script>
import { startDataBlobSync } from '../storeSync'
import axios from 'axios'

export default {
  data() {
    return {
      item: {
        title: 'Loading', body: 'Wait until data is loaded'
      },
      solar: this.getIsSolar() ? 'SOLAR' : 'LUNAR',
      time: (new Date()).toLocaleString(),
      jump_text: '',
      jumpTime: 0,
      showBody: true
    }
  },
  computed: {
    jumpStatus() {
      return this.$store.state.dataBlobs.find(t => t.type === 'ship' && t.id === 'jump').status
    },
    jumpCountdown() {
      return this.$store.state.dataBlobs.find(t => t.type === 'ship' && t.id === 'jumpstate').jumpT
    }
  },
  created () {
    startDataBlobSync('ship', 'jump')
    startDataBlobSync('ship', 'jumpstate')
    this.$options.interval = setInterval(this.fetch, 1000)
    window.onresize = () => this.resizeFonts();
    setTimeout(() => this.resizeFonts(), 200);
  },
  beforeDestroy() {
    window.onresize = undefined;
  },
  mounted () {
    fetch
  },
  beforeDestroy () {
    clearInterval(this.$options.interval)
  },
  methods: {
    getJumpStatus(status) {
      switch (status) {
        case 'ready_to_prep':
          return 'Ready for jump prep';
        case 'preparation':
          return 'Preparing for jump';
        case 'ready':
          return 'Ready to jump';
        case 'prep_complete':
          return 'Jump prep complete';
        case 'jumping':
          return 'Jumping';
        case 'jump_initiated':
          return 'Jump initiated';
        case 'cooldown':
          return 'Jump drive on cooldown';
        case 'calculating':
          return 'Calculating jump vectors';
        case 'broken':
          return 'Jump drive broken';
        default:
          return 'Jump drive state unknown';
      }
    },
    getIsSolar() {
      const d = new Date()
      return ((d.getHours() > 15 && d.getHours() < 20 ) || ( d.getHours() > 3 && d.getHours() < 12));
    },
    resizeFonts() {
      const windowWidth = window.innerWidth;
      const containerWidth = this.$refs.infoboardContainer.offsetWidth;
      const widthOffset = containerWidth / windowWidth;

      const windowHeight = window.innerHeight;
      const containerHeight = this.$refs.infoboardContainer.offsetHeight;
      const heightOffset = containerHeight / windowHeight;


      const shiftFontSize = 3 * widthOffset;
      const shiftRight = 27.5 * widthOffset;
      const shiftTop = 6.2 * heightOffset;

      const titleFontSize = 8 * widthOffset;
      const titleTop = 19.5 * heightOffset;

      const bodyTop = 30 * heightOffset;
      const bodyLeftRight = 5 * heightOffset;
      const bodyFontSize = 4 * widthOffset;
      const bodyMaxHeight = 47.5 * heightOffset;

      const shipTimeFontSize = 2.2 * widthOffset;
      const shipTimeLeft = 6 * widthOffset;
      const shipTimeBottom = 8 * heightOffset;

      const jumpTimeBottom = 15 * heightOffset;

      document.documentElement.style.setProperty('--shift-font-size', `${shiftFontSize}vw`);
      document.documentElement.style.setProperty('--shift-right', `${shiftRight}vw`);
      document.documentElement.style.setProperty('--shift-top', `${shiftTop}vh`);

      document.documentElement.style.setProperty('--title-font-size', `${titleFontSize}vh`);
      document.documentElement.style.setProperty('--title-top', `${titleTop}vh`);

      document.documentElement.style.setProperty('--body-top', `${bodyTop}vh`);
      document.documentElement.style.setProperty('--body-max-height', `${bodyMaxHeight}vh`);
      document.documentElement.style.setProperty('--body-font-size', `${bodyFontSize}vh`);
      document.documentElement.style.setProperty('--body-leftRight', `${bodyLeftRight}vw`);

      document.documentElement.style.setProperty('--ship-time-font-size', `${shipTimeFontSize}vw`);
      document.documentElement.style.setProperty('--ship-time-left', `${shipTimeLeft}vw`);
      document.documentElement.style.setProperty('--ship-time-bottom', `${shipTimeBottom}vh`);

      document.documentElement.style.setProperty('--jump-time-bottom', `${jumpTimeBottom}vh`);
    },
    fetch () {
      const d = new Date()
      this.time = "Year 542, " + (d.getHours() < 10 ? "0" : "") + d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "" ) + d.getMinutes() + ":" + (d.getSeconds() < 10 ? "0" : "" ) + d.getSeconds()
      this.solar = this.getIsSolar() ? 'SOLAR' : 'LUNAR';
      const status = this.jumpStatus
      if( status === 'broken' || status === 'cooldown' ) {
        this.showBody = true;
	this.jumpTime = 0;
      }
      this.jump_text = this.getJumpStatus(status);
      if( status === 'jump_initiated' ) {
	this.item = { title: 'Jump countdown initated', body: `<div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 5vw;">Ship jumping in<p style="font-size: 7vw; font-family: Orbitron;">${this.jumpCountdown}</p></div>` };
      } else if( status === 'jumping' && this.jumpTime === 0 ) {
	this.item = { title: 'Jumping now', body: '<div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 5vw;">Ship jumping</div>' };
        this.jumpTime = (new Date()).getTime()
        clearInterval(this.$options.interval)
        this.$options.interval = setInterval(this.brokenFetch, 60)
      } else if( d.getSeconds() % 5 === 0 ) {
        axios.get('/infoboard/display', {baseURL: this.$store.state.backend.uri})
	  .then(response => {
            this.item = response.data
	  }).catch(function (error) {
	    console.log(error)
	  });
      }
    },

    brokenFetch () {
      const now = (new Date()).getTime()
      if( now - this.jumpTime > 5000 ) {
        clearInterval(this.$options.interval)
        this.$options.interval = setInterval(this.fetch, 1000)
        this.showBody = false
        this.item = { title: '', body: '' };
        this.$refs.infoboardContainer.style.transform = 'none';
      } else {
        this.$refs.infoboardContainer.style.transform = `translate3d(${Math.random()*100-50}px, ${Math.random()*100-50}px, 0)`
      }
    }

  }
}

</script>
