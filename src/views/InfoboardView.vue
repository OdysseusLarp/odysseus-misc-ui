<template>
  <div v-if="showBody" class="main">
    <div v-if="item.title">
      <div class="solar">{{solar}}</div>
      <div class="title">{{item.title}}</div>
      <div class="text" v-html="item.body"></div>
      <div class="bottom">
      	<div class="jump">
	  <div v-if="jump_text">{{jump_text}}</div>
	</div>
        <div class="time">Ship Time: {{time}}</div>
      </div>
    </div>
  </div>
  <div v-else class="blank">
  </div>
</template>

<style lang="scss" scoped>
@import url(https://fonts.googleapis.com/css?family=Roboto|Orbitron:400italic,700italic,400,700);

$roboto: 'Roboto', sans-serif;   
$orbitron: 'Orbitron', sans-serif;

.blank {
  width: 1920px;
  height: 1080px;
  background: rgba(0, 0, 0, 1.0);
}
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
  widht: 50%;
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
    }
  },
  created () {
    startDataBlobSync('ship', 'jump')
    this.$options.interval = setInterval(this.fetch, 1000)
  },
  mounted () {
    fetch
  },
  beforeDestroy () {
    clearInterval(this.$options.interval)
  },
  methods: {
    fetch () {
      const d = new Date()
      this.time = "Year 542, " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
      if( ( d.getHours() > 15 && d.getHours() < 20 ) || ( d.getHours() > 3 && d.getHours() < 12 ) ) {
        this.solar = "SOLAR"
      } else {
	this.solar = "LUNAR"
      }
      const status = this.jumpStatus
      this.jump_text = '';
      if( status === 'broken' ) {
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
	this.item = { title: 'Jump countdown initated', body: 'Ship jumping in less than a minute' }; 
      } else if( status === 'jumping' && this.jumpTime === 0 ) {
	this.item = { title: 'Jumping now', body: 'Ship jumping' }; 
        this.jumpTime = (new Date()).getTime()
        clearInterval(this.$options.interval)
        this.$options.interval = setInterval(this.brokenFetch, 100)
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
      } else {
        document.body.style.transform = `translate3d(${Math.random()*100-50}px, ${Math.random()*100-50}px, 0)`
      }
    }

  }
}

</script>
