<template>
  <b-container fluid>
    <h2 class="mt-4">Backend settings:</h2>
    <b-button size="sm" class="my-2 my-sm-0" v-b-modal.backendChooserModal>{{backendUri}}</b-button>
    <backend-chooser></backend-chooser>
    <b-form-input v-model="boxId" type="text" placeholder="Box ID"></b-form-input>

    <h2 class="mt-4">Choose app:</h2>
    <b-button variant="outline-primary" to="/hangarbaydoor" class="mt-4">Hangar Bay doors</b-button>
    <b-button variant="outline-primary" to="/airlock" class="mt-4">Airlock controls</b-button>
    <b-button variant="outline-primary" to="/tasks" class="mt-4">Engineer tasks list</b-button>
    <b-button variant="outline-primary" to="/taskDetails" class="mt-4">Task details</b-button>
    <b-button variant="outline-primary" to="/taskMap" class="mt-4">Task map</b-button>
    <b-button variant="outline-primary" to="/infoboard" class="mt-4">Infoboard</b-button>
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
