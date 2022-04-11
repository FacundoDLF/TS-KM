<template>
  <div id="app">
    <Layout v-if="accessToken">
      <router-view />
    </Layout>
    <Modal />
  </div>
</template>

<script>
import Layout from "@/components/layouts/";
import Modal from "@/components/shared/Modal";
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import { ACTIONS_TYPES as GLOBAL_ACTIONS_TYPES } from "@/store/types";
import { ACTIONS_TYPES as NOTIFICATIONS_ACTIONS_TYPES } from "@/store/modules/notifications/types";
import { ACTIONS_TYPES as CASE_ACTIONS_TYPES } from "@/store/modules/cases/types";

//Notifications fetching interval
let interval;
const INTERVAL_PERIOD = 60000; //1 minute

const Component = Vue.extend({
  name: "App",
  components: {
    Layout,
    Modal
  },
  async created() {
    await this[GLOBAL_ACTIONS_TYPES.GET_SIGNED_IN_USER]();
    await this[GLOBAL_ACTIONS_TYPES.GET_USER_BY_TOKEN]();
    this[CASE_ACTIONS_TYPES.FETCH_CASES_BY_USER]();
    await this[NOTIFICATIONS_ACTIONS_TYPES.FETCH_NOTIFICATIONS]();
    interval = setInterval(() => {
      this[NOTIFICATIONS_ACTIONS_TYPES.FETCH_NOTIFICATIONS]();
    }, INTERVAL_PERIOD);
  },
  unmounted() {
    clearInterval(interval);
  },
  computed: {
    ...mapState({
      accessToken: state => state.accessToken
    })
  },
  methods: {
    ...mapActions("notifications", [
      NOTIFICATIONS_ACTIONS_TYPES.FETCH_NOTIFICATIONS
    ]),
    ...mapActions("cases", [CASE_ACTIONS_TYPES.FETCH_CASES_BY_USER]),
    ...mapActions([
      GLOBAL_ACTIONS_TYPES.GET_SIGNED_IN_USER,
      GLOBAL_ACTIONS_TYPES.GET_USER_BY_TOKEN
    ])
  }
});

export default Component;
</script>

<style lang="scss">
// .introjs-progressbar {
//   background-color: var(--color-green) !important;
// }

// .introjs-button {
//   align-self: center;
//   color: var(--color-white);
//   background-color: var(--color-green);
//   &:hover {
//     align-self: center;
//     color: var(--color-white);
//     background-color: var(--color-green);
//     border-color: var(--color-light-green);
//   }
//   &:focus {
//     align-self: center;
//     color: var(--color-white);
//     background-color: var(--color-green);
//     border-color: var(--color-light-green);
//   }
//   &:active {
//     align-self: center;
//     color: var(--color-white);
//     background-color: var(--color-green);
//     border-color: var(--color-light-green);
//   }
// }
</style>
