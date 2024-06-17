<template>
  <div class="nfc-container">
    <div class="nfc-reader" :style="getBackgroundStyle()">
    </div>
  </div>
</template>

<script>
import { startWatch, cancelWatch } from '../nfc';
import axios from 'axios';

const STATE_RESET_DELAY = 3000;
const CODES_REQUIRED = 4;

const ValidationStatus = {
  Initial: 'INITIAL',
  Success: 'SUCCESS',
  Failed: 'FAILED',
};

export default {
  name: "NfcReader",
  data() {
    return {
      isNfcPermissionGranted: false,
      readCodes: [],
      validationStatus: ValidationStatus.Initial,
      nfcWatchStarted: false,
      isValidationInProgress: false,
    }
  },
  created() {
    this.preloadImages([
      'img/powersource/initial.png',
      'img/powersource/start.png',
      'img/powersource/success.png',
      'img/powersource/failed.png',
    ]);
  },
  methods: {
    handleNfcMessage(message) {
      if (this.isValidationInProgress) {
        console.log('Validation already in progress, ignoring');
        return;
      }
      console.log('NFC message received:', message);
      if (message.startsWith('bio:')) {
        const id = message.split(':', 2)[1];
        console.log('Bio ID:', id);
        if (this.readCodes.includes(id)) {
          console.log('Duplicate code detected, ignorning');
          return;
        }
        this.readCodes.push(id);
        if (this.readCodes.length === CODES_REQUIRED) {
          this.validateCodes();
        }
      } else {
        this.$ons.notification.toast('Scanned tag is not a Bio ID', { timeout: 2500, animation: 'fall' });
      }
    },
    async validateCodes() {
      if (this.isValidationInProgress) {
        console.log('Validation already in progress, ignoring');
        return;
      }
      try {
        const results = await Promise.all(this.readCodes.map(id => axios.get(`/person/bio/${id}`)));
        const allValid = results.every(response => response.data.medical_elder_gene === true);
        this.validationStatus = allValid ? ValidationStatus.Success : ValidationStatus.Failed;
        if (this.validationStatus === ValidationStatus.Success) {
          // TODO: Add whatever should happen when validation is successful
          // setTimeout(this.reset, STATE_RESET_DELAY);
        } else {
          setTimeout(this.reset, STATE_RESET_DELAY);
        }
      } catch (error) {
        console.error('Error validating codes:', error);
        this.validationStatus = ValidationStatus.Failed;
        setTimeout(this.reset, STATE_RESET_DELAY);
      } finally {
        this.isValidationInProgress = false;
      }
    },
    reset() {
      this.readCodes = [];
      if (this.validationStatus === ValidationStatus.Failed) {
        setTimeout(() => {
          this.validationStatus = ValidationStatus.Initial;
          this.nfcWatchStarted = false;
          this.startNfcWatch();
        }, STATE_RESET_DELAY);
      } else {
        this.validationStatus = ValidationStatus.Initial;
        this.nfcWatchStarted = false;
        this.startNfcWatch();
      }
    },
    async startNfcWatch() {
      this.nfcWatchStarted = true;
      await startWatch(this.handleNfcMessage);
    },
    getBackgroundImage() {
      if (!this.nfcWatchStarted) {
        return 'img/powersource/initial.png';
      }

      switch (this.validationStatus) {
        case ValidationStatus.Initial:
          return 'img/powersource/start.png';
        case ValidationStatus.Success:
          return 'img/powersource/success.png';
        case ValidationStatus.Failed:
          return 'img/powersource/failed.png';
        default:
          return 'img/powersource/initial.png';
      }
    },
    getBackgroundStyle() {
      return {
        backgroundImage: `url(${this.getBackgroundImage()})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
      };
    },
    preloadImages(imageArray) {
      imageArray.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    }
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
.nfc-container {
  background: #000;
  height: 100%;
}
.nfc-reader {
  height: 100%;
}

.background-image {
  width: 100%;
  height: auto;
}
</style>