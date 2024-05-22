<template>
  <div class="app-container">
    <div v-if="showBody" class="infoboard-container" ref="infoboardContainer">
      <img class="bg-img":src="`img/infoboard/${solar.toLowerCase()}.svg`">
      <div class="title" ref="title"><div class="titleInner" ref="titleInner">{{ item.title.toUpperCase() }}</div></div>
      <div class="body" v-html="item.body" v-bind:class="{ 'short-body': item.body.length < 160 }">
      </div>
      <div class="jump-time-text">NEXT SAFE JUMP</div>
      <div class="jump-time"><counter :value="(jump_text || '').toUpperCase()" /></div>
      <div class="ship-time-text">SHIP TIME</div>
      <div class="ship-time"><counter :value="(time || '').toUpperCase()" /></div>
      <div class="shift-time-text">NEXT SHIFT <span><img class="nextShift-img" :src="`img/icons/${nextShiftIcon}.svg`"></span> </div>
      <div class="shift-time"><counter :value="shiftTime.toUpperCase()" /></div>
    </div>
    <div v-else>
      <!-- Show TV-static screen during 'jumping' state -->
      <odysseus-static></odysseus-static>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// @import url(https://fonts.googleapis.com/css?family=Roboto|Orbitron:400italic,700italic,400,700);
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: local('Roboto'), local('Roboto-Regular'), url(../assets/fonts/Roboto-Regular.ttf) format('ttf');
}
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
  cursor: none;
}

.infoboard-container {
  color: #fff;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  .bg-img {
    height: 100vh;
    max-width: 100vw;
    object-fit: cover;
  }

  .nextShift-img {
    width: 4vh;
    height: 4vh;
    margin-left: 1vw;
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
    left: var(--title-leftRight);
    right: var(--title-leftRight);
    font-size: var(--title-font-size);
    line-height: normal;
    text-shadow: 0.05rem 0.05rem 0.4rem rgba(0, 0, 0, 0.2);
    // border: 2px solid #0f0;
    overflow: hidden;
  }
  .titleInner {
    min-width: 100%;
    text-align: center;
    white-space: nowrap;
    position: relative;
    animation: titlescroll 10s linear;
  }
  @keyframes titlescroll {
    0% { left: 0; }
    10% { left: 0; }
    90% { left: var(--title-scroll-amount); }
    100% { left: var(--title-scroll-amount); }
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
    margin: 1rem;
    // border: 2px solid #0ff;
  }

  .short-body {
    padding-top: 10vh;
    font-size: 3rem;
    text-align: center;
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
    text-shadow: 0.05rem 0.05rem 0.2rem rgba(0, 0, 0, 0.4);
    // border: 2px solid #0f0;
  }

  .ship-time-text {
    position: absolute;
    bottom: var(--ship-time-text-bottom);
    left: var(--ship-time-left);
    font-size: var(--ship-time-font-size);
    line-height: normal;
    text-shadow: 0.05rem 0.05rem 0.2rem rgba(0, 0, 0, 0.4);
    // border: 2px solid #0f0;
  }

  .jump-time {
    position: absolute;
    bottom: var(--jump-time-bottom);
    left: var(--jump-time-left);
    font-size: var(--ship-time-font-size);
    line-height: normal;
    text-shadow: 0.05rem 0.05rem 0.2rem rgba(0, 0, 0, 0.4);
    // border: 2px solid #00f;
  }
  .jump-time-text {
    position: absolute;
    bottom: var(--jump-time-text-bottom);
    left: var(--jump-time-left);
    font-size: var(--ship-time-font-size);
    line-height: normal;
    text-shadow: 0.05rem 0.05rem 0.2rem rgba(0, 0, 0, 0.4);
    // border: 2px solid #00f;
  }
  .shift-time {
    position: absolute;
    bottom: var(--shift-time-bottom);
    left: var(--shift-time-left);
    font-size: var(--ship-time-font-size);
    line-height: normal;
    text-shadow: 0.05rem 0.05rem 0.2rem rgba(0, 0, 0, 0.4);
    // border: 2px solid #f00;

  }
  .shift-time-text {
    position: absolute;
    bottom: var(--shift-time-text-bottom); 
    left: var(--shift-time-left);
    font-size: var(--ship-time-font-size);
    line-height: normal;
    text-shadow: 0.05rem 0.05rem 0.2rem rgba(0, 0, 0, 0.4);
    // border: 2px solid #f00;

  }
}
</style>

<script>
import Counter from '@/components/Counter.vue';
import { startDataBlobSync } from '../storeSync'
import { throttle } from 'lodash';
import axios from 'axios'

export default {
  components: { Counter },
  data() {
    return {
      item: {
        title: 'Loading', body: 'Wait until data is loaded'
      },
      nextShift: this.getNextShift(),
      solar: this.getCurrentShift(),
      nextShiftIcon: this.getNextShiftIcon(),
      time: (new Date()).toLocaleString(),
      jump_text: '',
      jumpTime: 0,
      showBody: true,
    }
  },
  computed: {
    jumpStatus() {
      return this.$store.state.dataBlobs.find(t => t.type === 'ship' && t.id === 'jump').status
    },
    safeJumpCountdown() {
      return this.$store.state.dataBlobs.find(t => t.type === 'ship' && t.id === 'jumpstate').readyT
    },
    jumpCountdown() {
      return this.$store.state.dataBlobs.find(t => t.type === 'ship' && t.id === 'jumpstate').jumpT
    },
    isInfoboardEnabled() {
      return this.$store.state.dataBlobs.find(t => t.type === 'ship' && t.id === 'metadata').infoboard_enabled
    },
  },
  watch: {
    jumpStatus: (newValue, oldValue) => {
      // Run fetch whenever jumpStatus changes, so that the jump countdown
      // updates in real time and not a second too late (in the worst case)
      if (this && this.fetch) this.fetch();
    },
  },
  created () {
    startDataBlobSync('ship', 'jump')
    startDataBlobSync('ship', 'jumpstate')
    startDataBlobSync('ship', 'metadata')
    this.$options.interval = setInterval(this.fetch, 1000)
    window.onresize = () => this.resizeFonts();
    setTimeout(() => this.resizeFonts(), 200);
    this.throttledFetchData = throttle(this.fetchData, 1000);
    this.fetch();
  },
  beforeDestroy() {
    window.onresize = undefined;
    clearInterval(this.interval);
  },
  mounted () {
    fetch;
    this.updateShiftTimer();  // Initial update
    this.interval = setInterval(this.updateShiftTimer, 1000);  // Update every second
  },
  beforeDestroy () {
    clearInterval(this.$options.interval)
  },
  methods: {

    formatTime(milliseconds) {
      let seconds = Math.floor(milliseconds / 1000);
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);
      seconds = seconds % 60;
      minutes = minutes % 60;
      return `T-${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    },

    getCurrentShift() {
      const d = new Date();
      const hour = d.getHours();

      // Determine shift based on the hour of the day
      if ((hour > 15 && hour < 20) || (hour > 3 && hour < 12)) {
        return 'SOLAR';
      } else if (hour > 20 || hour < 3) {
        return 'LUNAR';
      } else {
        return 'TWILIGHT';
      }
    },

    getNextShiftIcon() {
      const nextShift = this.getCurrentShift();
      if (nextShift === 'SOLAR') {
        return 'icon-lunar';
      } else if (nextShift === 'LUNAR') {
        return 'icon-solar';
      } else {
        return 'icon-solar';
      }
    },
 
    getNextShift() {
      const now = new Date();
      const currentHour = now.getHours();

      // Define shift changes based on provided times
      if ((currentHour >= 15 && currentHour < 20)) {
        return { name: 'SOLAR', startsAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20) }; // Solar ends at 20:00
      } else if (currentHour >= 20 || currentHour < 3) {
        return { name: 'LUNAR', startsAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + (currentHour >= 20 ? 1 : 0), 3) }; // Lunar ends at 03:00
      } else {
        // If it's between 03:00 and 15:00, it's TWILIGHT time and SOLAR starts at 15:00
        return { name: 'TWILIGHT', startsAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15) };
      }
    },
    updateShiftTimer() {
      const now = new Date();
      const timeToNextShift = this.nextShift.startsAt - now;
      if (timeToNextShift <= 0) {
        this.nextShift = this.getNextShift();  // Recalculate the next shift if current one is over
      }
      this.shiftTime = this.formatTime(timeToNextShift);
    },
    resizeFonts() {
      const windowWidth = window.innerWidth;
      const containerWidth = this.$refs.infoboardContainer.offsetWidth;
      const widthOffset = containerWidth / windowWidth;

      const windowHeight = window.innerHeight;
      const containerHeight = this.$refs.infoboardContainer.offsetHeight;
      const heightOffset = containerHeight / windowHeight;

      const shiftFontSize = 3 * widthOffset;
      const shiftRight = 28 * widthOffset;
      const shiftTop = 5 * heightOffset;

      const titleFontSize = 8 * widthOffset;
      const titleTop = 22 * heightOffset;
      const titleLeftRight = 8 * heightOffset;

      const bodyTop = 30 * heightOffset;
      const bodyLeftRight = 5 * heightOffset;
      const bodyFontSize = 4 * widthOffset;
      const bodyMaxHeight = 47.5 * heightOffset;

      const shipTimeFontSize = 1.7 * widthOffset;
      const shipTimeLeft = 68 * widthOffset;
      const shipTimeBottom = 7.8 * heightOffset;
      const shipTimeTextBottom = 15 * heightOffset;

      const jumpTimeLeft = 7 * widthOffset;
      const jumpTimeBottom = 7.8 * heightOffset;
      const jumpTimeTextBottom = 15 * heightOffset;

      const shiftTimeLeft = 38 * widthOffset;
      const shiftTimeBottom = 7.8 * heightOffset;
      const shiftTimeTextBottom = 15 * heightOffset;

      if (!document.documentElement) return console.warn('document.documentElement is not defined, exiting resize');

      document.documentElement.style.setProperty('--shift-font-size', `${shiftFontSize}vw`);
      document.documentElement.style.setProperty('--shift-right', `${shiftRight}vw`);
      document.documentElement.style.setProperty('--shift-top', `${shiftTop}vh`);

      document.documentElement.style.setProperty('--title-font-size', `${titleFontSize}vh`);
      document.documentElement.style.setProperty('--title-top', `${titleTop}vh`);
      document.documentElement.style.setProperty('--title-leftRight', `${titleLeftRight}vw`);

      document.documentElement.style.setProperty('--body-top', `${bodyTop}vh`);
      document.documentElement.style.setProperty('--body-max-height', `${bodyMaxHeight}vh`);
      document.documentElement.style.setProperty('--body-font-size', `${bodyFontSize}vh`);
      document.documentElement.style.setProperty('--body-leftRight', `${bodyLeftRight}vw`);

      document.documentElement.style.setProperty('--ship-time-font-size', `${shipTimeFontSize}vw`);
      document.documentElement.style.setProperty('--ship-time-left', `${shipTimeLeft}vw`);
      document.documentElement.style.setProperty('--ship-time-bottom', `${shipTimeBottom}vh`);
      document.documentElement.style.setProperty('--ship-time-text-bottom', `${shipTimeTextBottom}vh`);

      document.documentElement.style.setProperty('--jump-time-left', `${jumpTimeLeft}vw`);
      document.documentElement.style.setProperty('--jump-time-bottom', `${jumpTimeBottom}vh`);
      document.documentElement.style.setProperty('--jump-time-text-bottom', `${jumpTimeTextBottom}vh`);

      document.documentElement.style.setProperty('--shift-time-left', `${shiftTimeLeft}vw`);
      document.documentElement.style.setProperty('--shift-time-bottom', `${shiftTimeBottom}vh`);
      document.documentElement.style.setProperty('--shift-time-text-bottom', `${shiftTimeTextBottom}vh`);
    },
    stopTitleScroll () {
      if (!this.$refs.titleInner) return;
      this.$refs.titleInner.style.visibility = 'hidden'
      this.$refs.titleInner.style.animation = 'none'
    },
    scrollTitle () {
      const title = this.$refs.title
      const offsetWidth = title.offsetWidth, scrollWidth = title.scrollWidth  // this triggers reflow!
      document.documentElement.style.setProperty('--title-scroll-amount', `${offsetWidth - scrollWidth}px`)
      this.$refs.titleInner.style.animation = null
      this.$refs.titleInner.style.visibility = null
    },
    fetch () {
      if (!this.isInfoboardEnabled) return this.showBody = false;
      const d = new Date()
      this.time = "Year 542\u00A0 | " + (d.getHours() < 10 ? "0" : "") + d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "" ) + d.getMinutes() + ":" + (d.getSeconds() < 10 ? "0" : "" ) + d.getSeconds();
      const status = this.jumpStatus
      if( status === 'broken' || status === 'cooldown' ) {
        this.showBody = true;
        this.jumpTime = 0;
      }
      this.jump_text = this.safeJumpCountdown;
      if( status === 'jump_initiated' ) {
        this.item = { title: 'Jump countdown initated', body: `<div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 5vw;">Ship jumping in<p style="font-size: 7vw; font-family: Orbitron;">${this.makeCounterHtml(this.jumpCountdown)}</p></div>` };
      } else if( status === 'jumping' && this.jumpTime === 0 ) {
        this.item = { title: 'Jumping now', body: '<div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 5vw;">Ship jumping</div>' };
        this.jumpTime = (new Date()).getTime()
        clearInterval(this.$options.interval)
        this.$options.interval = setInterval(this.brokenFetch, 60)
      } else if( d.getSeconds() % 10 === 0 || !this.item.title || ['Loading', 'Jump countdown initated'].includes(this.item.title) ) {
        this.throttledFetchData()
      }
    },
    makeCounterHtml (text) {  // <counter> replacement for raw HTML; assumes no HTML-escaping is needed!
      const html = text.replace(/(\d)/g, '<span class="digit">$1</span>')
      return `<span class="counter">${html}</span>`
    },

    brokenFetch () {
        clearInterval(this.$options.interval)
        this.$options.interval = setInterval(this.fetch, 1000)
        this.showBody = false
        this.item = { title: '', body: '' };
    },

    fetchData() {
      this.stopTitleScroll()
      axios.get('/infoboard/display', {baseURL: this.$store.state.backend.uri})
        .then(response => {
          this.item = response.data
          setTimeout(() => {
            this.scrollTitle();
            this.resizeFonts();
          }, 0)
        }).catch(function (error) {
          console.log(error)
        });
    }

  }
}

</script>
