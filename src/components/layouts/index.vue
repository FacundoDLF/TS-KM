<template>
  <div :class="{ layoutOpen: isMenuOpen }" class="layout">
    <Header />
    <main
      class="row children"
      :class="{
        gridLayout:
          (!isFetching && showPrimaryStepAndFooterInLayout) ||
          showPrimaryStepLayout
      }"
    >
      <PrimaryStep
        v-if="
          (!isFetching && showPrimaryStepAndFooterInLayout) ||
            showPrimaryStepLayout
        "
      />
      <slot />
    </main>
    <Footer v-if="showPrimaryStepAndFooterInLayout" />
  </div>
</template>

<script>
import Vue from "vue";
import Header from "./shared/Header";
import Footer from "./shared/Footer";
import PrimaryStep from "./shared/PrimaryStep";
import { mapState, mapGetters, mapActions } from "vuex";
import { ACTIONS_TYPES as GLOBAL_ACTIONS_TYPES } from "@/store/types";
import { ACTIONS_TYPES as SELECTED_CASE_ACTIONS_TYPES } from "@/store/modules/selectedCase/types";

const Component = Vue.extend({
  name: "Layout",
  computed: {
    ...mapGetters("ui", [
      "showPrimaryStepAndFooterInLayout",
      "showPrimaryStepLayout",
      "showClientInformation"
    ]),
    ...mapGetters("selectedCase", ["userRole"]),
    ...mapState({
      isFetching: state => state.isFetching,
      isMenuOpen: state => state.ui.isMenuOpen
    })
  },
  methods: {
    ...mapActions([GLOBAL_ACTIONS_TYPES.FETCH_COLLECTIONS]),
    ...mapActions("selectedCase", [
      SELECTED_CASE_ACTIONS_TYPES.HANDLE_EDIT_MODE,
      SELECTED_CASE_ACTIONS_TYPES.FETCH_CASE_DETAILS
    ])
  },
  async created() {
    await this[GLOBAL_ACTIONS_TYPES.FETCH_COLLECTIONS]();
    await this[SELECTED_CASE_ACTIONS_TYPES.HANDLE_EDIT_MODE]();
  },
  components: {
    Header,
    Footer,
    PrimaryStep
  }
});

export default Component;
</script>

<style scoped lang="scss">
.layoutOpen {
  position: fixed;
}

.layout {
  display: flex;
  position: relative;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  justify-content: center;
  align-items: center;
}

.gridLayout {
  display: grid;
  height: 100%;
  grid-template-columns: 26% 74%;
  grid-template-rows: 100%;
}

.children {
  position: relative;
  justify-content: center;
  align-items: flex-start;
  flex: 1;
  width: 100%;
}
</style>
