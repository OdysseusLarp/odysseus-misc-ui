<template>
  <div class="starfield" ref="wrapper">
    <iframe id="player"
            src="https://www.youtube.com/embed/M7hvI-CYX3I?enablejsapi=1&disablekbd=0&autoplay=1&loop=1&controls=0&rel=0"
            frameborder="0" allowfullscreen></iframe>
  </div>
</template>

<style scoped lang="scss">
.starfield, .starfield > iframe {
  width: 100%;
  height: 100%;
  background: black;
  overflow: hidden;
}
</style>

<script>
import {startDataBlobSync} from "@/storeSync";

const VIDEO_IDS = {
  jumping: 'JijuoM8Rvpo',
  default: 'M7hvI-CYX3I'
}

export default {
  created() {
    startDataBlobSync('ship', 'jumpstate')
  },
  mounted() {
    const scriptTag = document.createElement('script');
    scriptTag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      this.player = new YT.Player('player', {
        events: {
          onReady: () => this.refreshPlayer()
        }
      });
    }

    // FOR JUMP DEBUGGING
    setInterval(() => this.counter++, 5000)
  },
  data: () => ({
    player: null,
    counter: 0,
  }),
  computed: {
    jumpStatus () {
      return this.$store.state.dataBlobs.find(t => t.type === 'ship' && t.id === 'jumpstate')?.status
    },
    videoId () {
      const status = this.jumpStatus || 'unknown'
      //const status = this.counter % 2 ? 'jumping' : 'broken'
      return VIDEO_IDS[status] || VIDEO_IDS.default
    }
  },
  watch: {
    videoId () {
      this.refreshPlayer()
    },
  },
  methods: {
    refreshPlayer() {
      if (this.player) this.player.loadVideoById({ videoId: this.videoId })
    }
  }
}
</script>
