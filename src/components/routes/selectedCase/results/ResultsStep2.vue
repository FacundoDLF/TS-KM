<template>
  <div class="resultsStepContainer">
    <div
      v-for="question in secondStep"
      :key="question.id"
      class="questionContainer"
    >
      <RichTextInput
        v-if="
          (editMode ||
            (!editMode && question.isRequired) ||
            (!editMode && question.answer)) &&
            question.type === 'text'
        "
        :title="question.title"
        @myBlur="handleChange"
        :value="getValue(question.id)"
        :inputKey="question.id"
        :lengthLimit="question.lengthLimit"
        :disabled="isLoading"
        :description="question.description"
        :isRequired="question.isRequired"
        :error="question.error"
        :editMode="editMode"
      />
    </div>
    <div class="metricsContainer">
      <div class="metricsTitle">
        Operational & organizational impact metrics
      </div>
      <div class="metricstTable">
        <MetricsTableEditable
          :dataTable="tableData"
          :isFinancial="false"
          @startDateBlurResult="handleStartDateChange"
          @endDateBlurResult="handleEndDateChange"
          :step="secondStep"
        />
        <div v-show="!rpmQuestions.length" class="emptyRow">
          <p>
            {{
              editMode
                ? "There are no Metrics added yet"
                : "There are no Metrics added"
            }}
          </p>
        </div>
        <div class="addButton">
          <button v-if="editMode" class="addButton" @click="AddMetric">
            + ADD NEW METRIC
          </button>
        </div>
      </div>
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
import { ClientInfoFields } from "@/constants/clientInfoFields";
import findQuestionInState from "@/helpers/findQuestionInState";
import MetricsTableEditable from "@/components/shared/MetricsTableEditable";
import {
  ACTIONS_TYPES as MODAL_ACTIONS_TYPES,
  ModalComponents
} from "@/store/modules/modal/types";

const Component = Vue.extend({
  name: "ResultsStep2",
  components: {
    RichTextInput,
    MetricsTableEditable
  },
  computed: {
    ...mapState({
      secondStep: state =>
        state["selectedCase"].results[SecondaryStep.secondStep],
      editMode: state => state.selectedCase.editMode,
      isLoading: state => state.isLoading
    }),
    ...mapGetters("selectedCase/results", ["resultsErrors"]),
    ...mapGetters("selectedCase/results", ["rpmQuestions"]),
    tableData() {
      return [
        {
          title: "Operational or Organizational Metrics",
          firstDate: this.startDate,
          secondDate: this.endDate,
          tableQuestions: this.rpmQuestions
        }
      ];
    },
    startDate() {
      return findQuestionInState(
        this.$store.state.selectedCase.clientInformation,
        ClientInfoFields.START_DATE
      ).answer;
    },
    endDate() {
      return findQuestionInState(
        this.$store.state.selectedCase.clientInformation,
        ClientInfoFields.END_DATE
      ).answer;
    },
    culture() {
      return findQuestionInState(
        this.$store.state.selectedCase.results,
        ResultsFields.CULTURE_SHIFT
      ).answer;
    },
    test() {
      return findQuestionInState(
        this.$store.state.selectedCase.results,
        ResultsFields.TEST
      ).answer;
    }
  },
  methods: {
    getValue(id) {
      switch (id) {
        case ResultsFields.CULTURE_SHIFT:
          return this.culture;
        default:
          break;
      }
    },
    ...mapActions("selectedCase/results", [
      RESULTS_ACTIONS_TYPES.CHANGE_RESULTS_FIELD
    ]),
    ...mapActions("modal", [MODAL_ACTIONS_TYPES.OPEN_MODAL]),
    AddMetric() {
      this[MODAL_ACTIONS_TYPES.OPEN_MODAL]({
        component: ModalComponents.RPM_METRIC,
        props: {
          secondaryStep: SecondaryStep.secondStep
        }
      });
    },
    handleChange(value) {
      const { e, key, forcedSave } = value;
      this[RESULTS_ACTIONS_TYPES.CHANGE_RESULTS_FIELD]({
        value: forcedSave || e.target.value,
        step: SecondaryStep.secondStep,
        key,
        isForcedSave: forcedSave
      });
    },
    handleStartDateChange(payload) {
      const { value, key } = payload;
      this[RESULTS_ACTIONS_TYPES.CHANGE_RESULTS_FIELD]({
        isAssigningProp: true,
        value: eval(value),
        property: "startDateValue",
        step: SecondaryStep.secondStep,
        key
      });
    },
    handleEndDateChange(payload) {
      const { value, key } = payload;
      this[RESULTS_ACTIONS_TYPES.CHANGE_RESULTS_FIELD]({
        isAssigningProp: true,
        value: eval(value),
        step: SecondaryStep.secondStep,
        property: "endDateValue",
        key
      });
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

.metricsContainer {
  margin-bottom: 45px;
  display: flex;
  flex-direction: column;
}

.metricsTitle {
  color: var(--color-gren);
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 15px;
}

.metricstTable {
  width: 80%;
}

.addButton,
.addButton > button {
  margin-top: 10px;
  text-align: right;
  color: var(--color-green);
  font-size: 14px;
  font-weight: 700;
}

.addButton > button {
  border: 1px solid #41962c;
  padding: 7px;
}

.emptyRow {
  color: var(--color-light-grey);
  margin-top: 15px;
  display: flex;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  width: 100%;
}
</style>
