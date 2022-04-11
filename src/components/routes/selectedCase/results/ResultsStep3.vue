<template>
  <div class="resultsStepContainer">
    <div v-for="question in thirdStep" :key="question.id">
      <FilesComponent
        v-if="
          (editMode ||
            (!editMode && question.isRequired) ||
            (!editMode && question.answer)) &&
            question.type === 'file'
        "
        :title="question.title"
        :description="question.description"
        :caseId="caseId"
        :inputKey="question.id"
        :route="getValue(question.id)"
        :answer="question.answer"
      />
      <RichTextInput
        v-else
        :title="question.title"
        :lengthLimit="question.lengthLimit"
        @myBlur="handleChange"
        :value="getValue(question.id)"
        :inputKey="question.id"
        :disabled="isLoading"
        :description="question.description"
        :isRequired="question.isRequired"
        :bigger="thirdStep.length < 3"
        :error="question.error"
        :editMode="editMode"
      />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import RichTextInput from "@/components/shared/RichTextInput";
import { ResultsFields } from "@/constants/resultsFields";
import { mapState, mapGetters, mapActions } from "vuex";
import { ACTIONS_TYPES as RESULTS_ACTIONS_TYPES } from "@/store/modules/selectedCase/results/types";
import { SecondaryStep } from "@/types";
import findQuestionInState from "@/helpers/findQuestionInState";
import FilesComponent from "@/components/shared/FilesComponent";

const Component = Vue.extend({
  name: "ResultsStep1",
  components: {
    RichTextInput,
    FilesComponent
  },
  methods: {
    getValue(id) {
      switch (id) {
        case ResultsFields.CHART:
          return this.chart;
        case ResultsFields.CLIENT_QUOTE:
          return this.clientQuote;
        case ResultsFields.CASE_RECOGNITIONS:
          return this.caseRecognitions;
        default:
          break;
      }
    },
    ...mapActions("selectedCase/results", [
      RESULTS_ACTIONS_TYPES.CHANGE_RESULTS_FIELD
    ]),
    handleChange(value) {
      const { e, key, forcedSave } = value;
      this[RESULTS_ACTIONS_TYPES.CHANGE_RESULTS_FIELD]({
        value: forcedSave || e.target.value,
        step: SecondaryStep.thirdStep,
        key,
        isForcedSave: forcedSave
      });
    }
  },
  computed: {
    ...mapState({
      thirdStep: state =>
        state["selectedCase"].results[SecondaryStep.thirdStep],
      editMode: state => state.selectedCase.editMode,
      isLoading: state => state.isLoading,
      caseId: state => state.selectedCase.caseId
    }),
    ...mapGetters("selectedCase/results", ["resultsErrors"]),
    chart() {
      return findQuestionInState(
        this.$store.state.selectedCase.results,
        ResultsFields.CHART
      ).answer;
    },
    clientQuote() {
      return findQuestionInState(
        this.$store.state.selectedCase.results,
        ResultsFields.CLIENT_QUOTE
      ).answer;
    },
    caseRecognitions() {
      return findQuestionInState(
        this.$store.state.selectedCase.results,
        ResultsFields.CASE_RECOGNITIONS
      ).answer;
    },
    ResultsFields() {
      return ResultsFields;
    }
  }
});

export default Component;
</script>

<style lang="scss" scoped>
.resultsStepContainer {
  width: 100%;
  height: 100%;
}
</style>
