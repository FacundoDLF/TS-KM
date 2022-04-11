<template>
  <div class="container">
    <div class="titleContainer">
      <div class="titleSubContainer">
        <span class="title">Results</span>
        <span class="subtitle">{{ descriptionMessage }}</span>
      </div>
      <StepsHandler
        firstSection="Financial Impacts"
        secondSection="Operational, Organization, & Other Impacts"
        thirdSection="Additional Information"
      />
    </div>
    <ResultsStep1 v-if="secondaryStep === 1" />
    <ResultsStep2 v-if="secondaryStep === 2" />
    <ResultsStep3 v-if="secondaryStep === 3" />
    <ProgressBar
      :class="[{ viewMode: !editMode }]"
      class="caseProgress"
      :percentage="resultsStatus"
      title="Results"
      :error="
        resultsErrorsFirstStep > 0 ||
          resultsErrorsSecondStep > 0 ||
          resultsErrorsThirdStep > 0
      "
    />
  </div>
</template>

<script>
import Vue from "vue";
import ResultsStep1 from "@/components/routes/selectedCase/results/ResultsStep1";
import ResultsStep2 from "@/components/routes/selectedCase/results/ResultsStep2";
import ResultsStep3 from "@/components/routes/selectedCase/results/ResultsStep3";
import ProgressBar from "@/components/shared/ProgressBar";
import StepsHandler from "@/components/shared/StepsHandler";
import { mapState, mapActions, mapGetters } from "vuex";
import { ACTIONS_TYPES as GLOBAL_ACTIONS_TYPES } from "@/store/types";
import { ACTIONS_TYPES as SELECTED_CASE_ACTIONS_TYPES } from "@/store/modules/selectedCase/types";

const Component = Vue.extend({
  name: "Results",
  computed: {
    ...mapState({
      secondaryStep: state => state.selectedCase.secondaryStep,
      currentRoutePath: state => state.currentRoutePath,
      editMode: state => state.selectedCase.editMode
    }),
    ...mapGetters("selectedCase", ["resultsStatus"]),
    ...mapGetters("selectedCase/results", [
      "resultsErrorsFirstStep",
      "resultsErrorsSecondStep",
      "resultsErrorsThirdStep"
    ]),
    descriptionMessage() {
      switch (this.secondaryStep) {
        case 1:
          return "Financial Impacts";
        case 2:
          return "Operational, Organization, & Other Impacts";
        default:
          return "Additional Information";
      }
    }
  },
  methods: {
    ...mapActions([GLOBAL_ACTIONS_TYPES.FETCH_URL_VALUES]),
    ...mapActions("selectedCase", [
      SELECTED_CASE_ACTIONS_TYPES.CHANGE_SECONDARY_STEP
    ])
  },
  created() {
    if (
      !this.$route.params.secondaryStep ||
      (this.secondaryStep !== 1 &&
        this.secondaryStep !== 2 &&
        this.secondaryStep !== 3)
    ) {
      this[SELECTED_CASE_ACTIONS_TYPES.CHANGE_SECONDARY_STEP](5);
      this[GLOBAL_ACTIONS_TYPES.FETCH_URL_VALUES]();
    }
  },
  components: {
    ResultsStep1,
    ResultsStep2,
    ResultsStep3,
    ProgressBar,
    StepsHandler
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

.titleContainer {
  display: flex;
  justify-content: space-between;
  width: 80%;
  margin: 50px 0px;
}

.titleSubContainer {
  display: flex;
  flex-direction: column;
}

.caseProgress {
  width: 80%;
}

.title {
  color: var(--color-black);
  font-size: 23px !important;
  text-transform: capitalize;
  font-weight: 700;
}

.subtitle {
  color: var(--color-black);
  font-weight: 400;
  font-size: 17px;
}
</style>
