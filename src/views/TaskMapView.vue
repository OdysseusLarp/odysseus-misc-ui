<template>
  <Box title="Location" color="violet" style="height: 100%">
    <div class="container">
      <div class="img-container">
        <img class="img" :src="image"/>
        <div v-if="indicator" class="indicator" :style="{left: x+'%', top: y+'%'}"></div>
      </div>
    </div>
    <p class="title">{{item.location}}</p>
  </Box>
</template>

<style lang="scss" scoped>
.container {
  height: 95%;
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
.title {
  margin: 0 0 -1em;
  padding: 0;
  font-size: 80%;
  text-align: center;
  font-style: italic;
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
const ANIMATIONS = [
  'map/lower-1.png',
  'map/lower-2.png',
  'map/lower-3.png',
  'map/lower-4.png',
  'map/lower-5.png',
  'map/lower-6.png',
  'map/lower-7.png',
  'map/lower-8.png',
  'map/lower-9.png',
  'map/lower-10.png',
  'map/lower-11.png',
  'map/lower-12.png',
  'map/lower-13.png',
  'map/lower-14.png',
  'map/upper-1.png',
  'map/upper-2.png',
  'map/upper-3.png',
  'map/upper-4.png',
  'map/upper-5.png',
  'map/upper-6.png',
  'map/upper-7.png',
  'map/upper-8.png',
  'map/upper-9.png',
  'map/upper-10.png',
]
import Box from '../components/Box'

function twoDigit(n) {
  return n<10 ? "0"+n : ""+n
}

export default {
  data() {
    return {
      entry: '{}',
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
      const entry = localStorage.getItem(KEY) || '{}'
      if (this.entry === entry) {
        // Don't update unnecessarily
        return;
      }
      this.entry = entry
      this.item = JSON.parse(entry)
      if (this.item.map) {
        this.images = this.randomSet('map/' + this.item.map)
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
