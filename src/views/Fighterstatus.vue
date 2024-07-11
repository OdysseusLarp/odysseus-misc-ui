<template>
  <div class="ee-status-container">
            <!-- For each key/value in gameState.landingPads print out stuff-->
             <div class="landing-pad-container">
              <div v-for="([key, value]) in landingPadStatus" :key="key" class="landing-pad-status" :class="getLandingPadClass(value)">
              <strong>{{ getLandingPadName(key) }}</strong>
              <span>{{ getLandingPadState(value) }}</span>
            </div>
             </div>
            <hr />
          </div>
</template>

<style lang="scss">
/* color palette */
$bg-whitish: #F9F1DC;  /* gaps and sidebars */

.ee-status-container {
  width: 100%;
  height: 100%;
  font-family: Orbitron;
  font-weight: normal;
  text-align: center;
  text-transform: uppercase;
  display: flex;
  flex-direction: row;
  color: black;
  background-color: $bg-whitish;
  user-select: none;
  cursor: pointer;
}
.ee-status-container {
  position: relative;
}
.landing-pad-container {
  display: flex;
  flex-direction: row;
}
.landing-pad-status {
  border: 1px solid #f00;
  padding: 0.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.2rem;
}
.landing-pad-status:not(:last-child) {
  margin-right: 0.5rem;
}

.landing-pad-status-destroyed {
  border: 1px solid #dc3545;
}

.landing-pad-status-docked {
  border: 1px solid #28a745;
}

.landing-pad-status-launched {
  border: 1px solid #ffc107;
}
h3 {
  padding-top: 0.5rem;
}

</style>

<script>
import { startDataBlobSync } from '@/storeSync';
import axios from 'axios';
import { get, startCase } from "lodash";

const DEFAULT_JUMPSTATE = { status: 'unknown' }
const DEFAULT_BOX = { config: { messages: {} } }

export default {
  computed: {
    gameState() {
      this.isAlertLevelChangePending = false;
      this.isSynchronizationChangePending = false;
      this.isConnectionChangePending = false;
      return this.$store.state.dataBlobs.find(
        (e) => e.type === "ship" && e.id === "ee",
      );
    },
    landingPadStatus() {
    const landingPads = Object.entries(
      _.get(this.gameState, "landingPads", {})
    );
    // Sort by key
    return landingPads.sort(([a], [b]) => a.localeCompare(b));
  },
    jumpstate () {
      return this.$store.state.dataBlobs.find(e => e.type === 'ship' && e.id === 'jumpstate') || DEFAULT_JUMPSTATE
    },
    jumpInitiated () {
      return this.jumpstate.status === 'jump_initiated'
    },
    jumping () {
      return this.jumpstate.status === 'jumping'
    },
  },
  methods: {
    getLandingPadName(key) {
      switch (key) {
        case "landingPadStatus1": {
          return "ESSODY-F18";
        }
        case "landingPadStatus2": {
          return "ESSODY-F23";
        }
        case "landingPadStatus3": {
          return "ESSODY-F36";
        }
        case "landingPadStatus4": {
          return "ESS Starcaller";
        }
        default: {
          return key;
        }
      }
    },
    getLandingPadState(value) {
      switch (value) {
        case 0: {
          return "Destroyed";
        }
        case 1: {
          return "Docked";
        }
        case 2: {
          return "Launched";
        }
        default: {
          return String(value) + " (unknown)";
        }
      }
    },
    getLandingPadClass(value) {
      switch (value) {
        case 0: {
          return "landing-pad-status-destroyed";
        }
        case 1: {
          return "landing-pad-status-docked";
        }
        case 2: {
          return "landing-pad-status-launched";
        }
        default: {
          return "";
        }
      }
    },

},
  created () {
    startDataBlobSync('ship', 'jumpstate')
    startDataBlobSync('ship', 'ee')
  },
}
</script>
