import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./index.css";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import Toasted from "vue-toasted";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "./helpers/insights";
import { mapActions } from "vuex";
import { ACTIONS_TYPES as GLOBAL_ACTIONS_TYPES } from "@/store/types";
import Clipboard from "v-clipboard";

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(Toasted, {
  theme: "toasted-primary",
  duration: 5000,
  iconPack: "custom-class",
  icon: {
    name: "check-input"
  },
  className: "vueToasted"
});
Vue.use(Clipboard);

new Vue({
  router,
  store,
  methods: {
    ...mapActions([GLOBAL_ACTIONS_TYPES.FETCH_URL_VALUES])
  },
  mounted() {
    this[GLOBAL_ACTIONS_TYPES.FETCH_URL_VALUES]();
  },
  watch: {
    $route() {
      this[GLOBAL_ACTIONS_TYPES.FETCH_URL_VALUES]();
    }
  },
  render: h => h(App)
}).$mount("#app");
