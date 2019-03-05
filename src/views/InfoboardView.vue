<template>
  <div class="main">
    <div v-if="item.title">
      <div class="title">{{item.title}}</div>
      <div class="text" v-html="item.body"></div>
      <div class="footer" v-if="item.time_to_jump">Time to jump: {{item.time_to_jump}}</div>
      <div class="footer">Time now: {{new Date()}}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main {
  background-color: #aaa;
  padding: 1em;
  height: 100%;
}
.title {
  font-size: 120%;
  font-weight: 500;
  margin-bottom: 0.5em;
}
.text {
  font-size: 80%;
  background-color: #bbb;
  margin: 0 -5px;
  padding: 0 5px;
  border-radius: 3px;
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
