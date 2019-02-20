<template>
  <div class="home">
    <h2>Choose backend:</h2>
    <b-button size="sm" class="my-2 my-sm-0" v-b-modal.backendChooserModal>{{backendUri}}</b-button>

    <backend-chooser></backend-chooser>
  </div>
</template>

<script>
import BackendChooser from '@/components/BackendChooser.vue';
import { mapState } from 'vuex';

export default {
  name: 'home',
  components: {
    BackendChooser,
  },
  computed: mapState({
    'backendUri': state => state.backend.uri
  }),
};
</script>
