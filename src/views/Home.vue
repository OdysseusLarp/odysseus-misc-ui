<template>
  <b-container fluid>
    <h2 class="mt-4">Backend settings:</h2>
    <b-button size="sm" class="my-2 my-sm-0" v-b-modal.backendChooserModal>{{backendUri}}</b-button>
    <backend-chooser></backend-chooser>
    <b-form-input class="box-id" v-model="boxId" type="text" placeholder="Box ID"></b-form-input>

    <h2 class="mt-4">Choose app:</h2>
    <b-button variant="outline-primary" to="/tasks" class="mt-4">Engineer tasks list</b-button>
    <b-button variant="outline-primary" to="/taskDetails" class="mt-4">Task details</b-button>
    <b-button variant="outline-primary" to="/taskMap" class="mt-4">Task map</b-button>
    <b-button variant="outline-primary" to="/infoboard" class="mt-4">Infoboard</b-button>
    <b-button variant="outline-primary" to="/airlock" class="mt-4">Airlock control</b-button>
    <b-button variant="outline-primary" to="/powerSource" class="mt-4">Power source</b-button>
    <b-button variant="outline-primary" to="/starfield" class="mt-4">Starfield</b-button>
  </b-container>
</template>

<script>
import BackendChooser from '@/components/BackendChooser.vue';
import { mapState } from 'vuex';

export default {
  name: 'home',
  components: {
    BackendChooser,
  },
  computed: {
    backendUri () {
      return this.$store.state.backend.uri
    },
    boxId: {
      get () {
        return this.$store.state.boxId
      },
      set (value) {
        this.$store.commit('setBoxId', value)
      }
    }

  },
};
</script>

<style lang="scss" scoped>
a.btn:not(:last-child) {
  margin-right: 10px;
}
.box-id {
  margin-top: 10px;
}
</style>
