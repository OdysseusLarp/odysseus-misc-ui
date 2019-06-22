<template>
  <div class="main" id="mainDisplay">
    <div v-if="item.title">
      <div class="solar">{{solar}}</div>
      <div class="title">{{item.title}}</div>
      <div class="text" v-html="item.body"></div>
      <div class="bottom">
      	<div class="jump">
	  <div v-if="item.jump_text">{{item.jump_text}}</div>
	</div>
        <div class="time">Ship Time: {{time}}</div>
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
import axios from 'axios'

export default {
  data() {
    return {
      item: {
        title: 'Loading', body: 'Wait until data is loaded'
      },
      solar: 'SOLAR',
      time: (new Date()).toLocaleString(),
      jumping: false,
      jumpTime: 0
    }
  },
  created () {
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
      const d = new Date();
      this.time = d.toLocaleString();
      if( d.getHours() > 5 && d.getHours() < 13 ) {
        this.solar = "SOLAR";
      } else {
	this.solar = "LUNAR";
      }
      if( d.getSeconds() % 5 === 0 ) {
        axios.get('/infoboard/display', {baseURL: this.$store.state.backend.uri})
	  .then(function(response) {
	  console.log("Got data, state: " + this.jumping + ", body: " + response.data.body);
	    if( false ) {
	      checkJumpEnd();
	    } else if( response.data.body.startsWith('Jumping to coordinates') ) {
	      crashScreen();
	    } else {
	      this.item = response.data;
	    }
	  }).catch(function (error) {
	    console.log(error);
	  });
      }
    }
  }
}

let crashScreen = function() {
    this.jumping = true;
    setInterval(() => document.body.style.transform = `translate3d(${Math.random()*100-50}px, ${Math.random()*100-50}px, 0)`, 100)
}

let blankScreen = function() {
  $('#mainDisplay').css('visibility', 'hidden');
}

let checkJumpEnd = function() {
  if( this.item.title.startsWith('Odysseus completed') ) {
    $('#mainDisplay').css('visibility', 'visible');
    this.jumping = false;
  }
}
</script>
