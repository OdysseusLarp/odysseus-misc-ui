<template>
  <Box title="Location" color="violet" style="height: 100%">
    <div class="container">
      <div class="img-container">
        <img class="img" :src="image"/>
        <div v-if="indicator" class="indicator" :style="{left: x+'%', top: y+'%'}"></div>
      </div>
    </div>
  </Box>
</template>

<style lang="scss" scoped>
.container {
  height: 100%;
  text-align: center;
}
.img-container {
  height: 100%;
  position: relative;
  display: inline-block;
}
.img {
  height: 100%;
}

.indicator {
  // From https://jsfiddle.net/mandynicole/7xrKP/
  border: 3px solid rgb(209, 10, 10);
  border-radius: 40px;
  height: 40px;
  width: 40px;
  margin-left: -20px;
  margin-top: -20px;
  position: absolute;
  animation: pulsate 1s ease-out;
  animation-iteration-count: infinite; 
  opacity: 0.0
}
@keyframes pulsate {
  0% {-webkit-transform: scale(0.1, 0.1); opacity: 0.0;}
  50% {opacity: 1.0;}
  100% {-webkit-transform: scale(1.2, 1.2); opacity: 0.0;}
}
</style>


<script>
const KEY = "odysseus.selectedTask"
const ANIM_TIMEOUT = 60
const ANIM_LENGTH = 12
const MAP_SIZE = 450
const ANIMATIONS = Array(20).fill(0).map((e, index) => `map/map${twoDigit(index+1)}.png`)
import Box from '../components/Box'

function twoDigit(n) {
  return n<10 ? "0"+n : ""+n
}

export default {
  data() {
    return {
      item: {
      },
      indicator: false,
      x: 0,
      y: 0,
      image: "",
      images: [],
    }
  },
  created () {
    window.addEventListener('storage', () => this.update())
    this.update()
  },
  methods: {
    update () {
      const newItem = JSON.parse(localStorage.getItem(KEY) || '{}')
      if (this.item.map === newItem.map && this.item.mapX === newItem.mapX && this.item.mapY === newItem.mapY) {
        // Don't update unnecessarily
        return;
      }
      this.item = JSON.parse(localStorage.getItem(KEY) || '{}')
      if (this.item.map) {
        this.images = this.randomSet('/map/' + this.item.map)
        if (this.item.mapX && this.item.mapY) {
          this.x = this.item.mapX / MAP_SIZE * 100
          this.y = this.item.mapY / MAP_SIZE * 100
        } else {
          this.x = this.y = undefined
        }
      } else {
        this.images = [ undefined ]
      }
      this.indicator = false
      this.changeImage()
    },
    changeImage () {
      this.image = this.images.shift()
      if (this.images.length) {
        setTimeout(this.changeImage, ANIM_TIMEOUT)
      } else if (this.image && this.x) {
        this.indicator = true
      }
    },

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    },
    randomSet(last) {
        var array = [...ANIMATIONS]
        this.shuffleArray(array)
        array.splice(ANIM_LENGTH)
        array.push(last)
        return array
    },

  },
  components: {
    Box,
  },
}
</script>
