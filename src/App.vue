<template>
  <div id="app" @click="debugPress">
    <router-view/>
  </div>
</template>

<style lang="scss">
@import 'assets/css/global.scss';
</style>


<script>
import BackendChooser from '@/components/BackendChooser.vue';
import { mapState } from 'vuex';

export default {
  data () {
    return {
      debugClickPosition: 0
    }
  },
  methods: {
    debugPress (event) {
      /*
       * Press from up to down:
       *  - 1st 1/3 of screen
       *  - 2nd 1/3 of screen
       *  - 3rd 1/3 of screen
       *  - 1st 1/3 of screen
       *  - 2nd 1/3 of screen
       *  - 3rd 1/3 of screen
       * Then will navigate to home page
       */
      const position = Math.floor((event.clientY / screen.height) * 3)
      if (position === this.debugClickPosition % 3) {
        this.debugClickPosition += 1
      } else {
        this.debugClickPosition = 0
      }
      if (this.debugClickPosition === 6) {
        console.log("DEBUG-TRIPLE-PRESS: Navigating to home page")
        this.$router.push('/')
      }
    }
  },
};
</script>
