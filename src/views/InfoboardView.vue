<template>
  <div class="main">
    <div v-if="item.title">
      <div class="title">{{item.title}}</div>
      <div class="text" v-html="item.body"></div>
      <div class="bottom">
      	<div class="jump">
	  <div v-if="item.jump_text">{{item.jump_text}}</div>
	</div>
        <div class="time">Ship Time: {{(new Date()).toLocaleString()}}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url(https://fonts.googleapis.com/css?family=Roboto|Orbitron:400italic,700italic,400,700);

$roboto: 'Roboto', sans-serif;   
$orbitron: 'Orbitron', sans-serif;

.main {
  position: fixed;
  background-image: url("../../public/img/infoboard.png");
  background-size: cover;  
  padding: 1em;
  width: 1920px;
  height: 1080px;
  z-index: 1;
}
.title {
  font-family: $roboto;
  font-size: 500%;
  font-weight: 700;
  color: #fff;
  text-align: center;
  text-transform: uppercase;
  margin-top: 175px;
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
import axios from 'axios'

export default {
  data() {
    return {
      item: {
        title: 'Loading', body: 'Wait until data is loaded'
      }
    }
  },
  created () {
    this.$options.interval = setInterval(this.fetch, 5000)
  },
  mounted () {
    fetch
  },
  beforeDestroy () {
    clearInterval(this.$options.interval)
  },
  methods: {
    fetch () {
      console.log('Loading data')
      axios.get('/infoboard/display', {baseURL: this.$store.state.backend.uri})
	.then(response => { this.item = response.data })
	.catch(function (error) {
	  console.log(error);
	})
    }
  }
}

let crashScreen = function() {
    setInterval(() => document.body.style.transform = `translate3d(${Math.random()*100-50}px, ${Math.random()*100-50}px, 0)`, 100)
}

let uncrashScreen = function() {
}
</script>
