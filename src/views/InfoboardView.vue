<template>
  <div class="app-container">
    <div v-if="showBody" class="infoboard-container" ref="infoboardContainer">
      <img :src="`img/infoboard/${solar === 'SOLAR' ? 'solar' : 'lunar'}.svg`">
      <div class="shift">{{ solar }}</div>
      <div class="title" ref="title"><div class="titleInner" ref="titleInner">{{ item.title.toUpperCase() }}</div></div>
      <div class="body" v-html="item.body" v-bind:class="{ 'short-body': item.body.length < 160 }">
      </div>
      <div class="jump-time"><counter :value="(jump_text || '').toUpperCase()" /></div>
      <div class="ship-time">SHIP TIME: <counter :value="(time || '').toUpperCase()" /></div>
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
    font-weight: bold;
    text-shadow: 0.05rem 0.05rem 0.2rem rgba(0, 0, 0, 0.4);
    // border: 2px solid #0f0;
  }

  .jump-time {
    position: absolute;
    bottom: var(--jump-time-bottom);
    left: var(--ship-time-left);
    font-size: var(--ship-time-font-size);
    line-height: normal;
    font-weight: bold;
    text-shadow: 0.05rem 0.05rem 0.2rem rgba(0, 0, 0, 0.4);
    // border: 2px solid #00f;
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
      solar: this.getIsSolar() ? 'SOLAR' : 'LUNAR',
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
  },
  mounted () {
    fetch
  },
  beforeDestroy () {
    clearInterval(this.$options.interval)
  },
  methods: {
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
      const shiftRight = 28 * widthOffset;
      const shiftTop = 5 * heightOffset;

      const titleFontSize = 8 * widthOffset;
      const titleTop = 18 * heightOffset;
      const titleLeftRight = 8 * heightOffset;

      const bodyTop = 30 * heightOffset;
      const bodyLeftRight = 5 * heightOffset;
      const bodyFontSize = 4 * widthOffset;
      const bodyMaxHeight = 47.5 * heightOffset;

      const shipTimeFontSize = 2.2 * widthOffset;
      const shipTimeLeft = 6 * widthOffset;
      const shipTimeBottom = 8 * heightOffset;

      const jumpTimeBottom = 15 * heightOffset;

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

      document.documentElement.style.setProperty('--jump-time-bottom', `${jumpTimeBottom}vh`);
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
      this.time = "Year 542, " + (d.getHours() < 10 ? "0" : "") + d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "" ) + d.getMinutes() + ":" + (d.getSeconds() < 10 ? "0" : "" ) + d.getSeconds()
      this.solar = this.getIsSolar() ? 'SOLAR' : 'LUNAR';
      const status = this.jumpStatus
      if( status === 'broken' || status === 'cooldown' ) {
        this.showBody = true;
        this.jumpTime = 0;
      }
      this.jump_text = `Next safe jump in ${this.safeJumpCountdown}`;
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
