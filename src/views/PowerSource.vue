<template>
  <div class="nfc-container">
    <div class="nfc-reader">
      <img class="circle1" :class="{'rotate-once': rotationStage === 1, 'rotate-twice': rotationStage === 2, 'dimmed': validationStatus === 'FAILED'|| validationStatus === 'SUCCESS'}" src="img/powersource/Circle_Piece_01.png" alt="NFC Reader Image 1">
      <img class="circle2" :class="{'rotate-once': rotationStage === 1, 'rotate-twice': rotationStage === 2, 'dimmed': validationStatus === 'FAILED'|| validationStatus === 'SUCCESS'}" src="img/powersource/Circle_Piece_02.png" alt="NFC Reader Image 2">
      <img class="circle3" :class="{'rotate-once': rotationStage === 1, 'rotate-twice': rotationStage === 2, 'dimmed': validationStatus === 'FAILED'|| validationStatus === 'SUCCESS'}" src="img/powersource/Circle_Piece_03.png" alt="NFC Reader Image 3">
      <img class="side1" :class="{'rotate-once': rotationStage === 1, 'rotate-twice': rotationStage === 2}" src="img/powersource/side1.png" alt="NFC Reader Image 4">
      <img class="side2" :class="{'rotate-once': rotationStage === 1, 'rotate-twice': rotationStage === 2}" src="img/powersource/side2.png" alt="NFC Reader Image 4">
      <img class="button_white" :class="{'fade-out': buttonWhiteFaded }" src="img/powersource/button_base_white.png" alt="Button White">
      <img class="button_white_2" :class="buttonWhite2Class" src="img/powersource/button_base_white.png" alt="Button White 2">
      <img class="button_bg" :class="{'fade-in': rotationStage === 2, 'dimmed': validationStatus === 'FAILED'|| validationStatus === 'SUCCESS'}" src="img/powersource/Card_Cell_Slide.png" alt="Button BG">
      <img ref="loader" class="loader" :class="{'fade-out': validationStatus === 'FAILED' || validationStatus === 'SUCCESS','fade-in': rotationStage === 2}" src="img/powersource/Loading.png" alt="Loader">
      <img class="rectangle1" :class="{'fade-in': rotationStage === 2}" src="img/powersource/Rectangle1.png" alt="Rectangel 1">
      <img class="rectangle2" :class="{'fade-in': rotationStage === 2}" src="img/powersource/Rectangle2.png" alt="Rectangel 2">
      <img class="leo" :class="{'fade-in': rotationStage === 2}" src="img/powersource/leo.png" alt="Leo">
      <img class="squares" :class="{'fade-in': rotationStage === 2}" src="img/powersource/squares.png" alt="Squares">
      <img class="torc" :class="{'fade-in': rotationStage === 2, 'move': validationStatus === 'SUCCESS'}" src="img/powersource/torc.png" alt="Torc">
      <img class="zigzag" :class="{'fade-in': rotationStage === 2, 'move': validationStatus === 'FAILED'}" src="img/powersource/zigzag.png" alt="Zigzag">
      <img class="Control_button_01" :class="{'fade-in': rotationStage === 2}" src="img/powersource/Control_button_01.png" alt="Control button 01">
      <img class="Control_button_02" :class="{'fade-in': rotationStage === 2}" src="img/powersource/Control_button_02.png" alt="Control button 02">
      <img class="Control_button_03" :class="{'fade-in': rotationStage === 2}" src="img/powersource/Control_button_03.png" alt="Control button 03">
      <img class="indicator_right" :class="{'fade-in': rotationStage === 2}" src="img/powersource/indicator_right.png" alt="Indicator right">
      <img class="indicator_up" :class="{'fade-in': rotationStage === 2}" src="img/powersource/indicator_up.png" alt="Indicator up">
      <img class="error" :class="{'fade-in': validationStatus === 'FAILED'}" src="img/powersource/Error.png" alt="Error">
      <img class="failed" :class="{'fade-in': validationStatus === 'FAILED'}" src="img/powersource/button_failed.png" alt="Failed">
      <img class="success" :class="{'fade-in': validationStatus === 'SUCCESS'}" src="img/powersource/button_success.png" alt="Success">
    </div>
  </div>
</template>

<script>
import { startWatch, cancelWatch, isNfcPermissionGranted } from '../nfc';
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
      buttonWhiteFaded: false,
      rotationStage: 0,
    }
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
        } else {
          this.startLoaderRotation();
          setTimeout(() => {
            this.reset();
            this.stopLoaderRotation();
          }, 3000);
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
  },
  mounted() {
    this.startNfcWatch();
    setTimeout(() => {
      this.buttonWhiteFaded = true;
      setTimeout(() => {
        this.rotationStage = 1;
        setTimeout(() => {
          this.rotationStage = 2;
        }, 2300);
      }, 2000);
    }, 2000);
    setTimeout(() => {
    this.validationStatus = 'SUCCESS';
  }, 10000);
    setTimeout(() => {
    this.validationStatus = 'FAILED';
  }, 12000);
  },
  beforeDestroy() {
    cancelWatch();
  },
  computed: {
    buttonWhite2Class() {
      if (this.validationStatus === 'FAILED' || this.validationStatus === 'SUCCESS') {
        return 'fade-out';
      } else if (this.rotationStage === 2) {
        return 'fade-in';
      }
      return '';
    }
  }
}
</script>

<style>
.nfc-container {
  width: 1440px;
  height: 2960px;
  background-color: black;
}

.nfc-reader {
}


.button_white {
  position: absolute;
  height: 700px;
  top: 1300px;
  left: 375px;
  transition: all 2s ease-in-out, top 2s ease-in-out;
  z-index: 100;
}

.button_white.fade-out {
  opacity: 0;
  transition: all 2s ease-in-out;
}

.button_white.move {
  opacity: 0;
  top: 730px;
}

.button_white.fade-in {
  opacity: 1;
  top: 730px;
}

.button_white_2 {
  position: absolute;
  height: 700px;
  top: 730px;
  left: 375px;
  opacity: 0;
  transition: all 2s ease-in-out, top 2s ease-in-out;
  z-index: 100;
}

.button_white_2.fade-out {
  opacity: 0;
  transition: all 2s ease-in-out;
}

.button_white_2.fade-in {
  opacity: 1;
}



.button_bg {
  position: absolute;
  height: 600px;
  top: 730px;
  left: 417px;
  opacity: 0;
  transition: opacity 2s ease-in-out;
  z-index: 10;
}

.button_bg.fade-in {
  opacity: 1;
}

.button_bg.dimmed {
  filter: brightness(30%);
  transition: all 2s;
}

.loader.fade-in {
  opacity: 1;
}

.loader.fade-out {
  opacity: 0;
}

.loader.rotate {
  animation: rotate-animation 2s linear infinite;
}

@keyframes rotate-animation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loader {
  position: absolute;
  height: 200px;
  top: 930px;
  left: 620px;
  opacity: 0;
  transition: opacity 2s ease-in-out;
  z-index: 101;
}

.rectangle1.fade-in {
  opacity: 1;
}

.rectangle1 {
  position: absolute;
  height: 300px;
  top: 550px;
  opacity: 0;
  transition: opacity 2s ease-in-out;
}

.rectangle2.fade-in {
  opacity: 1;
}

.rectangle2 {
  position: absolute;
  height: 300px;
  top: 550px;
  left: 1030px;
  opacity: 0;
  transition: opacity 2s ease-in-out;
}

.squares.fade-in {
  opacity: 1;
}

.squares {
  position: absolute;
  height: 150px;
  top: 350px;
  left: 1130px;
  opacity: 0;
  transition: opacity 2s ease-in-out;
}

.leo.fade-in {
  opacity: 1;
}

.leo {
  position: absolute;
  height: 150px;
  top: 350px;
  left: 150px;
  opacity: 0;
  transition: opacity 2s ease-in-out;
}

.torc.fade-in {
  opacity: 1;
}

.torc.move {
  top: 1100px;
  transform: scale(2.5);
}

.torc {
  position: absolute;
  height: 200px;
  top: 30px;
  left: 620px;
  opacity: 0;
  transition: all 2s ease-in-out;
  z-index: 13;
}

.zigzag.fade-in {
  opacity: 1;
}

.zigzag.move {
  top: 1700px;
  transform: scale(2.5);
}

.zigzag {
  position: absolute;
  height: 200px;
  top: 2700px;
  left: 620px;
  opacity: 0;
  transition: all 2s ease-in-out;
}

.Control_button_01.fade-in {
  opacity: 1;
}

.Control_button_01 {
  position: absolute;
  height: 150px;
  top: 2220px;
  left: 650px;
  opacity: 0;
  transition: opacity 2s ease-in-out;
}

.Control_button_01.fade-in {
  opacity: 1;
}

.Control_button_01 {
  position: absolute;
  height: 150px;
  top: 2220px;
  left: 400px;
  opacity: 0;
  transition: opacity 2s ease-in-out;
}

.Control_button_02.fade-in {
  opacity: 1;
}

.Control_button_02 {
  position: absolute;
  height: 150px;
  top: 2220px;
  left: 650px;
  opacity: 0;
  transition: opacity 2s ease-in-out;
}

.Control_button_03.fade-in {
  opacity: 1;
}

.Control_button_03 {
  position: absolute;
  height: 150px;
  top: 2220px;
  left: 900px;
  opacity: 0;
  transition: opacity 2s ease-in-out;
}

.indicator_right.fade-in {
  opacity: 1;
}

.indicator_right {
  position: absolute;
  height: 150px;
  top: 2420px;
  left: 1130px;
  opacity: 0;
  transition: opacity 2s ease-in-out;
}

.indicator_up.fade-in {
  opacity: 1;
}

.indicator_up {
  position: absolute;
  height: 200px;
  top: 2420px;
  left: 150px;
  opacity: 0;
  transition: opacity 2s ease-in-out;
}

.error.fade-in {
  opacity: 1;
}

.error {
  position: absolute;
  height: 1050px;
  top: 650px;
  left: 0px;
  opacity: 0;
  transition: opacity 2s ease-in-out;
  z-index: 12;
}

.failed.fade-in {
  opacity: 1;
}

.failed {
  position: absolute;
  height: 1050px;
  top: 700px;
  left: 200px;
  opacity: 0;
  transition: opacity 2s ease-in-out;
  z-index: 11;
}

.success.fade-in {
  opacity: 1;
  transform: scale(1.5);
}

.success {
  position: absolute;
  height: 1050px;
  top: 750px;
  left: 200px;
  opacity: 0;
  transition: all 2s ease-in-out;
  z-index: 11;
}

.circle2 {
  position: absolute;
  top: 380px;
  left: -475px;
  height: 2400px;
  transition: transform 2s ease-in-out;
}

.circle2.dimmed {
  filter: brightness(30%);
  transition: all 2s;
}

.circle1 {
  position: absolute;
  top: 380px;
  left: -475px;
  height: 2400px;
  transition: transform 2s ease-in-out;
}

.circle1.dimmed {
  filter: brightness(30%);
  transition: all 2s;
}

.circle3 {
  position: absolute;
  top: 880px;
  left: -268px;
  height: 1400px;
  transition: transform 2s ease-in-out;
}

.circle3.dimmed {
  filter: brightness(30%);
  transition: all 2s;
}

.side1 {
  position: absolute;
  top: 1190px;
  left: -125px;
  height: 2400px;
  transition: transform 2s ease-in-out;
}

.side2 {
  position: absolute;
  top: -640px;
  left: -125px;
  height: 2400px;
  transition: transform 2s ease-in-out;
}

.button_white.rotate-once {
  transform: rotate(-135deg);
}

.circle2.rotate-once {
  transform: rotate(-135deg);
}

.circle2.rotate-twice {
  transform: rotate(-45deg);
}

.circle1.rotate-once {
  transform: rotate(90deg);
}

.circle1.rotate-twice {
  transform: rotate(45deg);
}

.circle3.rotate-once {
  transform: rotate(-135deg);
}

.circle3.rotate-twice {
  transform: rotate(-90deg);
}

.side1.rotate-twice {
  transform: translateY(-630px);
}


.side2.rotate-twice {
  transform: translateY(630px);
  }
</style>
