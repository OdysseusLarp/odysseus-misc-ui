<template>
  <div class="starfield">
    <video :src="videoSrc" autoplay loop muted @play="requestWakeLock" @pause="releaseWakeLock"
      @ended="releaseWakeLock"></video>
  </div>
</template>

<style scoped lang="scss">
.starfield {
  width: 100vw;
  height: 100vh;
  background: black;
  overflow: hidden;
  position: relative;
}

video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}
</style>

<script>
import { startDataBlobSync } from "@/storeSync";

const VIDEOS = {
  jumping: 'jump.mp4',
  default: 'base.mp4'
}

export default {
  created() {
    startDataBlobSync('ship', 'jumpstate')
  },
  data: () => ({
    wakeLock: null,
  }),
  computed: {
    jumpStatus() {
      return this.$store.state.dataBlobs.find(t => t.type === 'ship' && t.id === 'jumpstate')?.status
    },
    videoSrc() {
      const video = VIDEOS[this.jumpStatus] || VIDEOS.default;
      // Doesn't work locally for now, sorry
      const baseUrl = "/videos/";
      return baseUrl + video;
    }
  },
  methods: {
    async requestWakeLock() {
      if ('wakeLock' in navigator && !this.wakeLock) {
        try {
          this.wakeLock = await navigator.wakeLock.request('screen');
          this.wakeLock.addEventListener('release', () => {
            console.log('Screen Wake Lock released');
          });
          console.log('Screen Wake Lock acquired');
        } catch (err) {
          console.error(`${err.name}, ${err.message}`);
        }
      }
    },
    releaseWakeLock() {
      if (this.wakeLock) {
        this.wakeLock.release().then(() => {
          this.wakeLock = null;
          console.log('Screen Wake Lock released');
        });
      }
    }
  },
  beforeDestroy() {
    this.releaseWakeLock();
  }
}
</script>
