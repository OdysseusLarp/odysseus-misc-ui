<template>
  <div class="nfc-container">
    <div class="nfc-reader">
      <img class="background-image" :src="getBackgroundImage()" />
    </div>
  </div>
</template>

<script>
import { startWatch, cancelWatch } from '../nfc';
import axios from 'axios';

export default {
  name: "NfcReader",
  data() {
    return {
      isNfcPermissionGranted: false,
      readCodes: [],
      validationStatus: null,
      nfcWatchStarted: false,
    }
  },
  methods: {
    nfcLogin(message) {
      console.log('NFC message received:', message);
      if (message.startsWith('bio:')) {
        const id = message.split(':', 2)[1];
        console.log('Bio ID:', id);
        this.readCodes.push(id);
        if (this.readCodes.length === 4) {
          this.validateCodes();
        }
      } else {
        this.$ons.notification.toast('Scanned tag is not a Bio ID', { timeout: 2500, animation: 'fall' });
      }
    },
    async validateCodes() {
      try {
        const results = await Promise.all(this.readCodes.map(id => axios.get(`/person/bio/${id}`)));
        const allValid = results.every(response => response.data.medical_elder_gene === true);
        this.validationStatus = allValid ? 'SUCCESS' : 'FAILED';
        if (this.validationStatus === 'FAILED') {
          setTimeout(this.reset, 3000);
        } else {
          setTimeout(this.reset, 3000);
        }
      } catch (error) {
        console.error('Error validating codes:', error);
        this.validationStatus = 'FAILED';
        setTimeout(this.reset, 3000);
      }
    },
    reset() {
      this.readCodes = [];
      if (this.validationStatus === 'FAILED') {
        setTimeout(() => {
          this.validationStatus = null;
          this.nfcWatchStarted = false;
          this.startNfcWatch();
        }, 3000);
      } else {
        this.validationStatus = null;
        this.nfcWatchStarted = false;
        this.startNfcWatch();
      }
    },
    async startNfcWatch() {
      this.nfcWatchStarted = true;
      await startWatch(this.nfcLogin);
    },
    getBackgroundImage() {
      if (!this.nfcWatchStarted) {
        return 'img/powersource/initial.png';
      } else if (this.validationStatus === null) {
        return 'img/powersource/start.png';
      } else {
        switch (this.validationStatus) {
          case 'SUCCESS':
            return 'img/powersource/success.png';
          case 'FAILED':
            return 'img/powersource/failed.png';
          default:
            return '';
        }
      }
    },
  },
  mounted() {
    this.startNfcWatch();
  },
  beforeDestroy() {
    cancelWatch();
  },
}
</script>

<style>

.background-image {
  width: 100%;
  height: auto;
}
</style>
