<template>
  <div class="app-container">
    <div v-if="showBody" class="infoboard-container" ref="infoboardContainer">
      <img class="background-image":src="getBackgroundImage()" />
      &nbsp;
      <div class="title" ref="title"><div class="title-gradient left"></div><div class="titleInner" ref="titleInner">{{ item.title.toUpperCase() }}</div><div class="title-gradient right"></div></div>
      <div class="body" v-if="item.metadata?.vote_results">
        <div v-html="item.body" class="vote-results-body"></div>
        <div class="vote-results">
          <div class="vote-result" v-for="(result, index) in item.metadata.vote_results" :key="index">
            <div class="vote-result-name">{{ index + 1 }}. {{ result.option }}</div>
            <div class="vote-result-bar-container">
              <div class="vote-result-bar" :style="{ width: Math.max(result.votesPercentage, 1) + '%' }"></div>
              <div class="vote-result-votes">{{ result.votes }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="body" v-else v-html="item.body" v-bind:class="{ 'short-body': item.body.length < 160 }">
      </div>
      <div class="bottom-text label jump-time">NEXT SAFE JUMP</div>
      <div class="bottom-text value jump-time">{{ safeJumpCountdown ?? "" }}</div>
      <div class="bottom-text label next-shift">NEXT SHIFT <img class="next-shift-icon" :src="getNextShiftIcon()" /></div>
      <div class="bottom-text value next-shift">{{ calculateTimeUntilNextShift() }}</div>
      <div class="bottom-text label ship-time">SHIP TIME</div>
      <div class="bottom-text value ship-time">{{ time ?? "Year 542 | ??:??"}}</div>
    </div>
    <div v-else>
      <!-- Show TV-static screen during 'jumping' state -->
      <odysseus-static></odysseus-static>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: local('Roboto'), local('Roboto-Regular'), url(../assets/fonts/Roboto-Regular.ttf) format('ttf');
}
@font-face {
    font-family: 'Oxanium';
    font-style: normal;
    font-weight: 200 800;
    font-display: swap;
    src: local('Oxanium-Medium'), url('../assets/fonts/Oxanium-Medium.ttf') format('truetype');
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

.vote-results {
  margin-top: 1rem;
}

.vote-result:not(:last-child) {
  margin-bottom: 1rem;
}

.vote-result-name {
  margin: 0;
  padding: 0;
  font-size: 1.5rem;
  margin-bottom: -0.4rem;
  font-weight: bold;
}

.vote-result-bar {
  background: var(--vote-result-bar-color);
  display: inline-block;
  height: 1.75rem;
}

.vote-results-body {
  text-align: center;
}

.vote-result-bar-container {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.vote-result-votes {
  margin-left: 0.5rem;
  font-size: 1.5rem;
  display: inline-block;
  height: 1.75rem;
}

.infoboard-container {
  color: #fff;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  // * {
  //   border: 1px solid #0f0;
  // }

  .background-image {
    max-height: 100vh;
    max-width: 100vw;
  }

  .title {
    position: absolute;
    top: var(--title-top);
    left: var(--title-leftRight);
    right: var(--title-leftRight);
    font-size: var(--title-font-size);
    line-height: normal;
    text-shadow: 0.05rem 0.05rem 0.4rem rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }
  .titleInner {
    position: absolute;
    top: 0.8rem;
    min-width: 100%;
    text-align: center;
    white-space: nowrap;
    position: relative;
    animation: titlescroll 10s linear;
  }
  .title-gradient {
    width: 3rem;
    height: 100%;
    display: inline-block;
    position: absolute;
    top: 0;
    z-index: 99;
  }
  .title-gradient.left {
    left: 0;
    background: linear-gradient(to left, transparent, var(--title-background-color));
  }
  .title-gradient.right {
    right: 0;
    background: linear-gradient(to right, transparent, var(--title-background-color));
    // Clip off the bottom right corner to match the background svg
    // clip-path: polygon(0 0, 100% 0, 100% 80%, 80% 100%, 0 100%);
  }
  @keyframes titlescroll {
    0% { left: 0; }
    10% { left: 0; }
    90% { left: var(--title-scroll-amount); }
    100% { left: var(--title-scroll-amount); }
  }

  .body {
    text-align:justify;
    word-break:keep-all;
    padding: 0.5rem;
    position: absolute;
    top: var(--body-top);
    left: var(--body-leftRight);
    right: var(--body-leftRight);
    font-size: var(--body-font-size);
    height: var(--body-max-height);
    font-family: $roboto;
    overflow: hidden;
  }

  .short-body {
    // padding-top: 10vh;
    font-size: 3rem;
    text-align: center;
  }

// Small gradient to indicate that the content is about to cut off
  .body:after {
    content: '';
    position: absolute;
    height: 5vw;
    left:0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(#1f1f1f, 0) 0%,rgba(#1f1f1f,1) 100%);
  }

  .bottom-text {
    position: fixed;
    font-family: 'Oxanium';
    font-size: var(--bottom-text-font-size);
    line-height: normal;
    font-weight: 400;
    text-shadow: 0.05rem 0.05rem 0.2rem rgba(0, 0, 0, 0.4);
    width: 28.2vw;
    text-align: center;
  }

  .label {
      bottom: var(--bottom-text-label-position);
    }

  .value {
    bottom: var(--bottom-text-value-position);
    // font-size: 1.5em;
  }

  .jump-time {
    left: var(--jump-time-left);
  }

  .next-shift {
    left: var(--next-shift-left);
  }

  .ship-time {
    left: var(--ship-time-left);
  }

  .next-shift-icon {
    margin-left: 0.4rem;
    margin-bottom: 0.3rem;
    width: 1.8rem;
    height: 1.8rem;
  }
}
</style>

<script>
import Counter from '@/components/Counter.vue';
import { startDataBlobSync } from '../storeSync'
import { throttle } from 'lodash';
import axios from 'axios'

const Shifts = {
  Solar: 'SOLAR',
  Lunar: 'LUNAR',
  Twilight: 'TWILIGHT',
};

export default {
  components: { Counter },
  data() {
    return {
      item: {
        title: 'Loading', body: 'Loading...'
      },
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
    getShift() {
      const hour = new Date().getHours();
      if (hour >= 4 && hour < 8) return Shifts.Solar;
      if (hour >= 8 && hour < 12) return Shifts.Twilight;
      if (hour >= 12 && hour < 16) return Shifts.Lunar;
      if (hour >= 16 && hour < 20) return Shifts.Solar;
      return Shifts.Twilight;
    },
    getNextShift() {
      const currentShift = this.getShift();
      if (currentShift === Shifts.Solar) return Shifts.Lunar;
      if (currentShift === Shifts.Lunar) return Shifts.Twilight;
      return Shifts.Solar;
    },
    calculateTimeUntilNextShift() {
      const now = new Date();
      const currentHour = now.getHours();

      const shiftStartTimes = [0, 4, 8, 12, 16, 20];

      let nextShiftHour = shiftStartTimes.find(hour => hour > currentHour);

      // If no future shift start time is found in the same day, take the first shift of the next day
      if (nextShiftHour === undefined) {
        nextShiftHour = shiftStartTimes[0];
        now.setDate(now.getDate() + 1);
      }

      const nextShift = new Date(now);
      nextShift.setHours(nextShiftHour, 0, 0, 0);

      const timeDifference = nextShift - new Date();
      const hoursLeft = Math.floor(timeDifference / (1000 * 60 * 60));
      const minutesLeft = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)) + 1;

      const formattedTimeLeft = `T-${String(hoursLeft).padStart(2, '0')}:${String(minutesLeft).padStart(2, '0')}`;
      const formattedNextShiftTime = `${String(nextShiftHour).padStart(2, '0')}:00`;
      return `${formattedTimeLeft} AT ${formattedNextShiftTime}`;
    },
    setShiftColors() {
      const shift = this.getShift();
      let titleBackgroundColor = "";
      let voteResultBarColor = "";
      switch (shift) {
        case Shifts.Solar:
          titleBackgroundColor = "#f4a416";
          voteResultBarColor = "#f4f482";
          break;
        case Shifts.Lunar:
          titleBackgroundColor = "#272782";
          voteResultBarColor = "#6adbdb";
          break;
        default:
          titleBackgroundColor = "#af0050";
          voteResultBarColor = "#ffabe1";
      }
      document.documentElement.style.setProperty('--title-background-color', titleBackgroundColor);
      document.documentElement.style.setProperty('--vote-result-bar-color', voteResultBarColor);
    },
    getBackgroundImage() {
      this.setShiftColors();
      switch (this.getShift()) {
        case Shifts.Solar:
          return 'img/infoboard/bg-solar.svg';
        case Shifts.Lunar:
          return 'img/infoboard/bg-lunar.svg';
        default:
          return 'img/infoboard/bg-twilight.svg';
      }
    },
    getNextShiftIcon() {
      switch (this.getNextShift()) {
        case Shifts.Solar:
          return 'img/infoboard/icon-solar.svg';
        case Shifts.Lunar:
          return 'img/infoboard/icon-lunar.svg';
        default:
          return 'img/infoboard/icon-twilight.svg';
      }
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

      const titleFontSize = 9 * widthOffset;
      const titleTop = 20.80 * heightOffset;
      const titleLeftRight = 7.9 * heightOffset;

      const bodyTop = 33 * heightOffset;
      const bodyLeftRight = 6 * heightOffset;
      const bodyFontSize = 4 * widthOffset;
      const bodyMaxHeight = 46.5 * heightOffset;

      const bottomTextFontSize = 2.5 * widthOffset;
      const bottomTextLabelPosition = 14 * heightOffset;
      const bottomTextValuePosition = 6.9 * heightOffset;

      const jumpTimeLeft = 5.5 * widthOffset;
      const nextShiftLeft = 35.8 * widthOffset;
      const shipTimeLeft = 66.2 * widthOffset;

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

      document.documentElement.style.setProperty('--jump-time-left', `${jumpTimeLeft}vw`);
      document.documentElement.style.setProperty('--next-shift-left', `${nextShiftLeft}vw`);
      document.documentElement.style.setProperty('--ship-time-left', `${shipTimeLeft}vw`);

      document.documentElement.style.setProperty('--bottom-text-font-size', `${bottomTextFontSize}vw`);
      document.documentElement.style.setProperty('--bottom-text-label-position', `${bottomTextLabelPosition}vh`);
      document.documentElement.style.setProperty('--bottom-text-value-position', `${bottomTextValuePosition}vh`);
    },
    stopTitleScroll () {
      if (!this.$refs.titleInner) return;
      // this.$refs.titleInner.style.visibility = 'hidden'
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
      this.time = "Year 542 | " + (d.getHours() < 10 ? "0" : "") + d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "" ) + d.getMinutes();
      const status = this.jumpStatus;
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
      axios.get('/infoboard/display', {baseURL: this.$store.state.backend.uri})
        .then(response => {
          this.stopTitleScroll();
          const data = response.data;
          if (data.metadata?.vote_results) {
            // Only show the vote results graph for top 3 results
            data.metadata.vote_results = data.metadata.vote_results.slice(0, Math.min(data.metadata.vote_results.length, 3));
          }
          this.item = data
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
