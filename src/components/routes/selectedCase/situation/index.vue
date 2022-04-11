<template>
  <div class="container">
    <div class="titleContainer">
      <div class="titleSubContainer">
        <span class="title">Situation</span>
        <span class="subtitle">{{ descriptionMessage }}</span>
      </div>
      <StepsHandler
        :firstSection="descriptionMessages[0]"
        :secondSection="descriptionMessages[1]"
        :thirdSection="descriptionMessages[2]"
      />
    </div>
    <SituationStep1 v-if="secondaryStep === 1" />
    <SituationStep2 v-if="secondaryStep === 2" />
    <SituationStep3 v-if="secondaryStep === 3" />
    <ProgressBar
      :class="[{ viewMode: !editMode }]"
      class="caseProgress"
      :percentage="situationStatus"
      title="Situation"
      :error="situationErrorsFirstStep > 0 || situationErrorsSecondStep > 0"
    />
  </div>
</template>

<script>
import Vue from "vue";
import SituationStep1 from "@/components/routes/selectedCase/situation/SituationStep1";
import SituationStep2 from "@/components/routes/selectedCase/situation/SituationStep2";
import SituationStep3 from "@/components/routes/selectedCase/situation/SituationStep3";
import ProgressBar from "@/components/shared/ProgressBar";
import StepsHandler from "@/components/shared/StepsHandler";
import { mapState, mapActions, mapGetters } from "vuex";
import { ACTIONS_TYPES as GLOBAL_ACTIONS_TYPES } from "@/store/types";
import { ACTIONS_TYPES as SELECTED_CASE_ACTIONS_TYPES } from "@/store/modules/selectedCase/types";

const Component = Vue.extend({
  name: "Situation",
  data: () => ({
    descriptionMessages: ["Headline", "Description", "Engagement info"]
  }),
  computed: {
    ...mapState({
      secondaryStep: state => state.selectedCase.secondaryStep,
      currentRoutePath: state => state.currentRoutePath,
      editMode: state => state.selectedCase.editMode
    }),
    ...mapGetters("selectedCase", ["situationStatus", "isFasCase"]),
    ...mapGetters("selectedCase/situation", [
      "situationErrorsFirstStep",
      "situationErrorsSecondStep"
    ]),
    descriptionMessage() {
      return this.descriptionMessages[this.secondaryStep - 1];
    }
  },
  methods: {
    ...mapActions([GLOBAL_ACTIONS_TYPES.FETCH_URL_VALUES]),
    ...mapActions("selectedCase", [
      SELECTED_CASE_ACTIONS_TYPES.CHANGE_SECONDARY_STEP
    ])
  },
  async created() {
    if (
      !this.$route.params.secondaryStep ||
      (this.secondaryStep !== 1 &&
        this.secondaryStep !== 2 &&
        this.secondaryStep == 3 &&
        !this.isFasCase)
    ) {
      this[SELECTED_CASE_ACTIONS_TYPES.CHANGE_SECONDARY_STEP](1);
      this[GLOBAL_ACTIONS_TYPES.FETCH_URL_VALUES]();
    }
  },
  components: {
    SituationStep1,
    SituationStep2,
    SituationStep3,
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
