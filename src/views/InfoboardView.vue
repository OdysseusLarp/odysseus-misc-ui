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
.main {
  background-image: url("/img/infoboard.png");
  background-size: cover;  
  padding: 1em;
  width: 1920px;
  height: 1080px;
}
.title {
  font-size: 300%;
  font-weight: 500;
  color: #fff;
  text-align: center;
  text-transform: uppercase;
  margin-top: 200px;
  margin-bottom: 10px;
}
.text {
  font-size: 200%;
  background-color: #202020;
  color: #aaa;
  margin: 0 -5px;
  padding: 0 5px;
  margin-top: 80px;
  margin-left: 80px;
  border-radius: 3px;
}
.bottom {
  height: 225px;
  position: fixed;
  bottom: 0%;
  widht: 50%;
}
.time {
  font-size: 220%;
  color: #fff;
  height: 100px;
  margin-left: 100px;
}
.jump {
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
      axios.get('http://localhost:8888/infoboard', {data: null})
	.then(response => { this.item = response.data })
	.catch(function (error) {
	  console.log(error);
	})
    }
  }
}
</script>
