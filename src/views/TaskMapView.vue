<template>
  <Box title="Location" color="violet" style="height: 100%">
    <div class="container">
      <div class="img-container">
        <div class="img-square" :style="backgroundStyle">
          <div v-if="indicator" class="indicator" :style="{ left: indicatorX + '%', top: indicatorY + '%' }"></div>
        </div>
      </div>
    </div>
    <p class="title">{{ item.location }}</p>
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
  display: block;
}

.img-square {
  display: inline-block;
  position: relative;
  background-repeat: no-repeat;
  height: 100%;
  aspect-ratio: 1 / 1;
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
  0% {
    -webkit-transform: scale(0.1, 0.1);
    opacity: 0.0;
  }

  50% {
    opacity: 1.0;
  }

  100% {
    -webkit-transform: scale(1.2, 1.2);
    opacity: 0.0;
  }
}
</style>


<script>
const KEY = "odysseus.selectedTask"
const ANIM_TIMEOUT = 60
const ANIM_LENGTH = 12
const MAP_SIZE = 450

// Actual image sizes (must be fixed size)
const MAP_IMAGE_WIDTH = 2000;
const MAP_IMAGE_HEIGHT = 2828;
// Randomization on pulsating position unless explicit position provided by mapPosX / mapPosY
const MAP_RANDOM_POSITION_MIN = 100
const MAP_RANDOM_POSITION_MAX = 350
// Which images + random positions to use in animation
const ANIMATION_IMAGES = [
  'map/deck1.png',
  'map/deck2.png',
]
const ANIMATION_MIN_X = 150
const ANIMATION_MAX_X = 1200 - MAP_SIZE
const ANIMATION_MIN_Y = 900
const ANIMATION_MAX_Y = 1600 - MAP_SIZE
import Box from '../components/Box'

function twoDigit(n) {
  return n < 10 ? "0" + n : "" + n
}
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function randomIntFromString(str, min, max) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 1000000007; // A prime number for hash
  }
  return min + hash % (max - min + 1);
}

export default {
  data() {
    return {
      entry: '{}',
      item: {
      },
      indicator: false, // Whether indicator is visible
      indicatorX: 0, // Indicator position in percent
      indicatorY: 0, // Indicator position in percent
      imageX: 0, // Left edge image position in pixels
      imageY: 0, // Top edge image position in pixels
      image: "", // Current image without map/ or .png
      animationFrame: 0, // Current animation frame, counting downwards, 0 = final image
      finalImage: "", // Final image without map/ or .png
      finalX: 0, // Final imageX value
      finalY: 0, // Final imageY value
      backgroundScale: 1 // Background scale, viewport size / 450px
    }
  },
  created() {
    window.addEventListener('storage', () => this.update())
    this.update()
  },
  mounted() {
    this.updateBackgroundScale();
    window.addEventListener('resize', this.updateBackgroundScale);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.updateBackgroundScale);
  },
  computed: {
    backgroundStyle() {
      return {
        backgroundImage: `url(${this.image})`,
        backgroundPosition: `${-this.imageX * this.backgroundScale}px ${-this.imageY * this.backgroundScale}px`,
        backgroundSize: `${this.backgroundScale * MAP_IMAGE_WIDTH}px ${this.backgroundScale * MAP_IMAGE_HEIGHT}px`,
      }
    },
  },
  methods: {
    update() {
      const entry = localStorage.getItem(KEY) || '{}'
      if (this.entry === entry) {
        // Don't update unnecessarily
        return;
      }
      this.entry = entry
      this.item = JSON.parse(entry)
      if (this.item.map && this.item.mapX && this.item.mapY) {
        const finalX = this.item.mapPosX || this.item.mapX - randomIntFromString(`X${this.item.mapX},${this.item.mapY}X`, MAP_RANDOM_POSITION_MIN, MAP_RANDOM_POSITION_MAX)
        const finalY = this.item.mapPosY || this.item.mapY - randomIntFromString(`Y${this.item.mapX},${this.item.mapY}Y`, MAP_RANDOM_POSITION_MIN, MAP_RANDOM_POSITION_MAX)
        this.indicatorX = (this.item.mapX - finalX) * 100 / MAP_SIZE // percent
        this.indicatorY = (this.item.mapY - finalY) * 100 / MAP_SIZE // percent
        this.finalImage = 'map/' + this.item.map + '.png'
        this.finalX = finalX
        this.finalY = finalY
      } else {
        this.finalImage = ""
      }
      this.animationFrame = ANIM_LENGTH
      this.indicator = false
      this.changeImage()
    },
    changeImage() {
      const n = this.animationFrame;
      if (n > 0) {
        this.animationFrame = n - 1
        this.image = ANIMATION_IMAGES[n % ANIMATION_IMAGES.length]
        this.imageX = randomInt(ANIMATION_MIN_X, ANIMATION_MAX_X)
        this.imageY = randomInt(ANIMATION_MIN_Y, ANIMATION_MAX_Y)
        setTimeout(() => this.changeImage(), ANIM_TIMEOUT)
      } else {
        this.image = this.finalImage
        this.imageX = this.finalX
        this.imageY = this.finalY
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
    updateBackgroundScale() {
      const element = this.$el.querySelector('.img-square');
      if (element) {
        const width = element.clientWidth;
        this.backgroundScale = width / 450;
      }
    }

  },
  components: {
    Box,
  },
}
</script>
