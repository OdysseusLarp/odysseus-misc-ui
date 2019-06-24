<template>
  <div class="app-container">
    <div class="infoboard-container" ref="infoboardContainer">
      <img src="img/infoboard/solar.svg">
      <div class="shift">{{ solar }}</div>
      <div class="title">{{ item.title.toUpperCase() }}</div>
      <div class="body" v-html="item.body">
      </div>
      <div class="jump-time">{{ jump_text || '' }}</div>
      <div class="ship-time">SHIP TIME {{ time }}</div>
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
  // padding: 1vh;
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
    border: 2px solid #f00;
    transform: translate(50%, 0);
    line-height: normal;
  }

  .title {
    position: absolute;
    top: var(--title-top);
    font-size: var(--title-font-size);
    border: 2px solid #0f0;
    line-height: normal;
  }

  .body {
    position: absolute;
    top: var(--body-top);
    left: var(--body-leftRight);
    right: var(--body-leftRight);
    font-size: var(--body-font-size);
    border: 2px solid #0ff;
    font-family: $roboto;
  }

  .ship-time {
    position: absolute;
    bottom: var(--ship-time-bottom);
    left: var(--ship-time-left);
    font-size: var(--ship-time-font-size);
    border: 2px solid #0f0;
    line-height: normal;
  }

  .jump-time {
    position: absolute;
    bottom: var(--jump-time-bottom);
    left: var(--ship-time-left);
    font-size: var(--ship-time-font-size);
    border: 2px solid #00f;
    line-height: normal;
  }
}
/*
.main {
  position: fixed;
  background-image: url("../../public/img/infoboard.png");
  background-size: cover;  
  padding: 1em;
  width: 1920px;
  height: 1080px;
  z-index: 1;
}
.solar {
  font-family: $orbitron;
  font-size: 300%;
  color: #fff;
  margin-left: 1240px;
  margin-top: 50px;
}
.title {
  font-family: $roboto;
  font-size: 500%;
  font-weight: 700;
  color: #fff;
  text-align: center;
  text-transform: uppercase;
  margin-top: 50px;
  margin-bottom: 10px;
  width: 1600px;
}
.text {
  font-family: $roboto;
  font-size: 400%;
  background-color: #202020;
  color: #aaa;
  margin: 0 -5px;
  padding: 0 5px;
  margin-top: 10px;
  margin-left: 80px;
  border-radius: 3px;
  position: fixed;
  width: 1600px;
  height: 480px;
  overflow: hidden;
  z-index: -1;
}
.bottom {
  height: 225px;
  position: fixed;
  bottom: 0%;
  width: 50%;
  z-index: 1;
}
.time {
  font-family: $orbitron;
  font-size: 220%;
  color: #fff;
  height: 100px;
  margin-left: 100px;
}
.jump {
  font-family: $orbitron;
  font-size: 220%;
  color: #fff;
  height: 80px;
  margin-left: 100px;
}
*/
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
      solar: 'SOLAR',
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

      const shipTimeFontSize = 2.2 * widthOffset;
      const shipTimeLeft = 6 * widthOffset;
      const shipTimeBottom = 8.5 * heightOffset;

      const jumpTimeBottom = 15.5 * heightOffset;

      document.documentElement.style.setProperty('--shift-font-size', `${shiftFontSize}vw`);
      document.documentElement.style.setProperty('--shift-right', `${shiftRight}vw`);
      document.documentElement.style.setProperty('--shift-top', `${shiftTop}vh`);

      document.documentElement.style.setProperty('--title-font-size', `${titleFontSize}vh`);
      document.documentElement.style.setProperty('--title-top', `${titleTop}vh`);

      document.documentElement.style.setProperty('--body-top', `${bodyTop}vh`);
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
      if( ( d.getHours() > 15 && d.getHours() < 20 ) || ( d.getHours() > 3 && d.getHours() < 12 ) ) {
        this.solar = "SOLAR"
      } else {
	this.solar = "LUNAR"
      }
      console.log('shift ===>', this.solar);
      const status = this.jumpStatus
      this.jump_text = '';
      if( status === 'broken' || status === 'cooldown' ) {
        this.showBody = true;
	this.jumpTime = 0;
      }
      if( status === 'calculating' ) {
	this.jump_text = 'Calculating jump'
      }
      if( status === 'preparation' ) {
	this.jump_text = 'Preparing for jump'
      }
      if( status === 'prep_complete' ) {
	this.jump_text = 'Prepared for jump'
      }
      if( status === 'ready' ) {
	this.jump_text = 'Ready for jump'
      }
      if( status === 'jump_initiated' ) {
	this.item = { title: 'Jump countdown initated', body: `Ship jumping in <strong>${this.jumpCountdown}</strong>` };
      } else if( status === 'jumping' && this.jumpTime === 0 ) {
	this.item = { title: 'Jumping now', body: 'Ship jumping' };
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
