<template>
  <span class="timer">
    <span v-for="char in timeStr.split('')" :class="[/\d/.test(char) ? 'digit' : 'sep' ]">{{char}}</span>
  </span>
</template>

<style lang="scss" scoped>
.digit, .sep {
  display: inline-block;
  text-align: center;
}
.digit {
  width: 0.85em;
}
.sep {
  width: 0.4em;
}
</style>

<script>
export default {
  props: {
    target: Date
  },
  data: () => ({
    seconds: 0,
    timeout: null
  }),
  computed: {
    timeStr () {
      let t = this.seconds, m = Math.floor(t / 60), s = Math.floor(t % 60)
      if (m < 10) m = "0" + m
      if (s < 10) s = "0" + s
      return "" + m + ":" + s
    }
  },
  watch: {
    target () {
      this.refresh()
    },
  },
  methods: {
    refresh () {
      if (this.timeout !== null) clearTimeout(this.timeout)
      this.tick()
    },
    tick () {
      const now = new Date().getTime(), target = (this.target ? this.target.getTime() : now)
      const delta = target - now
      const seconds = Math.round(Math.max(delta, 0) / 1000)
      this.seconds = seconds
      if (seconds > 0) {
        this.timeout = setTimeout(this.tick, delta - (seconds - 1) * 1000)
      } else {
        this.timeout = null
        this.$emit('timer-completed')
      }
    }
  },
  created () {
    if (this.timeout === null) this.tick()
  },
};
</script>
