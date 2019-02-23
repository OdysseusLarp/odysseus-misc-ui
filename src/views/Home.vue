<template>
  <b-container fluid>
    <h2 class="mt-4">Backend settings:</h2>
    <b-button size="sm" class="my-2 my-sm-0" v-b-modal.backendChooserModal>{{backendUri}}</b-button>
    <backend-chooser></backend-chooser>
    <b-form-input v-model="boxId" type="text" placeholder="Box ID"></b-form-input>

    <h2 class="mt-4">Choose app:</h2>
    <b-button variant="outline-primary" to="/hangarbaydoor" class="mt-4">Hangar Bay door</b-button>
    <b-button variant="outline-primary" to="/tasks" class="mt-4">Engineer tasks list</b-button>
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
