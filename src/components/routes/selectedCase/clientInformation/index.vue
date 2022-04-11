<template>
  <div class="container">
    <div class="titleSubContainer">
      <h3 class="title">Available Case Data</h3>
      <p>
        Please review and update the pre-existing data for this engagement (if
        needed).
      </p>
    </div>
    <ClientInformationStep1 v-if="secondaryStep === 1" />
    <ProgressBar
      :class="[{ viewMode: !editMode }]"
      class="caseProgress"
      :percentage="clientInfoStatus"
      title="Available Case Data"
      :error="clientInfoErrorsFirstStep > 0"
    />
  </div>
</template>

<script>
import Vue from "vue";
import ClientInformationStep1 from "./ClientInformationStep1.vue";
import ProgressBar from "@/components/shared/ProgressBar";
import { mapState, mapActions, mapGetters } from "vuex";
import { ACTIONS_TYPES as GLOBAL_ACTIONS_TYPES } from "@/store/types";
import { ACTIONS_TYPES as SELECTED_CASE_ACTIONS_TYPES } from "@/store/modules/selectedCase/types";

const Component = Vue.extend({
  name: "ClientInformation",
  computed: {
    ...mapState({
      secondaryStep: state => state.selectedCase.secondaryStep,
      currentRoutePath: state => state.currentRoutePath,
      editMode: state => state.selectedCase.editMode
    }),
    ...mapGetters("selectedCase", ["clientInfoStatus"]),
    ...mapGetters("selectedCase/clientInformation", [
      "clientInfoErrorsFirstStep"
    ])
  },
  methods: {
    ...mapActions([GLOBAL_ACTIONS_TYPES.FETCH_URL_VALUES]),
    ...mapActions("selectedCase", [
      SELECTED_CASE_ACTIONS_TYPES.CHANGE_SECONDARY_STEP
    ])
  },
  async created() {
    if (!this.$route.params.secondaryStep || this.secondaryStep !== 1) {
      this[SELECTED_CASE_ACTIONS_TYPES.CHANGE_SECONDARY_STEP](0);
      this[GLOBAL_ACTIONS_TYPES.FETCH_URL_VALUES]();
    }
  },
  components: {
    ClientInformationStep1,
    ProgressBar
  }
});

export default Component;
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  animation: fadein 0.4s;
}

.caseProgress {
  width: 80%;
}

.viewMode {
  visibility: hidden;
}

@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.title {
  color: var(--color-black);
  margin: 50px 0px 5px 0px;
  font-size: 23px !important;
  text-transform: capitalize;
  font-weight: 700;
}

.titleSubContainer {
  margin-bottom: 30px;
}
</style>
