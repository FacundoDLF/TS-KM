<template>
  <div class="resultsStepContainer">
    <div v-for="question in firstStep" :key="question.id">
      <RichTextInput
        v-if="!question.isMetric"
        :title="question.title"
        @myBlur="handleChange"
        :value="getStaticQuestionValue(question.id)"
        :inputKey="question.id"
        :disabled="isLoading"
        :description="question.description"
        :lengthLimit="question.lengthLimit"
        :isRequired="question.isRequired"
        :bigger="firstStep.length < 3"
        :error="question.error"
        :editMode="editMode"
      />
    </div>
    <div v-if="!isLoading || balanceQuestions.length" class="metricsContainer">
      <div class="metricsTitle">Financial metrics</div>
      <div class="metricstTable">
        <MetricsTableEditable
          :dataTable="tableData"
          :isFinancial="true"
          @startDateBlurResult="handleStartDateChange"
          @endDateBlurResult="handleEndDateChange"
          :step="firstStep"
        />
        <div class="addButton">
          <button v-if="editMode" class="addButton" @click="AddFinancialMetric">
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
import { ClientInfoFields } from "@/constants/clientInfoFields";
import MetricsTableEditable from "@/components/shared/MetricsTableEditable";
import { mapState, mapGetters, mapActions } from "vuex";
import { ACTIONS_TYPES as RESULTS_ACTIONS_TYPES } from "@/store/modules/selectedCase/results/types";
import { SecondaryStep } from "@/types";
import findQuestionInState from "@/helpers/findQuestionInState";
import {
  ACTIONS_TYPES as MODAL_ACTIONS_TYPES,
  ModalComponents
} from "@/store/modules/modal/types";

const Component = Vue.extend({
  name: "ResultsStep1",
  components: {
    RichTextInput,
    MetricsTableEditable
  },
  computed: {
    ...mapState({
      firstStep: state =>
        state["selectedCase"].results[SecondaryStep.firstStep],
      editMode: state => state.selectedCase.editMode,
      isLoading: state => state.isLoading
    }),
    ...mapGetters("selectedCase/results", ["resultsErrors"]),
    ...mapGetters("selectedCase/results", [
      "incomeQuestions",
      "balanceQuestions"
    ]),
    tableData() {
      return [
        {
          title: "Income Statement ($M)",
          firstDate: this.startDate,
          secondDate: this.endDate,
          tableQuestions: this.incomeQuestions
        },
        {
          title: "Balance Sheet ($M)",
          firstDate: this.startDate,
          secondDate: this.endDate,
          tableQuestions: this.balanceQuestions
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
    benefits() {
      return findQuestionInState(
        this.$store.state.selectedCase.results,
        ResultsFields.BENEFITS
      ).answer;
    },
    overall() {
      return findQuestionInState(
        this.$store.state.selectedCase.results,
        ResultsFields.OVERALL_IMPACT
      ).answer;
    },
    ResultsFields() {
      return ResultsFields;
    }
  },
  methods: {
    formatDate(date) {
      const enteringDate = new Date(date);
      const month = enteringDate.getMonth() + 1;
      const year = enteringDate.getFullYear();
      return `${month < 10 ? "0" + month : month}/${year}`;
    },
    getStaticQuestionValue(id) {
      switch (id) {
        case ResultsFields.BENEFITS:
          return this.benefits;
        case ResultsFields.OVERALL_IMPACT:
          return this.overall;
        default:
          break;
      }
    },
    ...mapActions("selectedCase/results", [
      RESULTS_ACTIONS_TYPES.CHANGE_RESULTS_FIELD
    ]),
    ...mapActions("modal", [MODAL_ACTIONS_TYPES.OPEN_MODAL]),
    AddFinancialMetric() {
      this[MODAL_ACTIONS_TYPES.OPEN_MODAL]({
        component: ModalComponents.FINANCIAL_METRIC,
        props: {
          secondaryStep: SecondaryStep.firstStep
        }
      });
    },
    handleChange(value) {
      const { e, key, forcedSave } = value;
      this[RESULTS_ACTIONS_TYPES.CHANGE_RESULTS_FIELD]({
        value: forcedSave || e.target.value,
        step: SecondaryStep.firstStep,
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
        step: SecondaryStep.firstStep,
        key
      });
    },
    handleEndDateChange(payload) {
      const { value, key } = payload;
      this[RESULTS_ACTIONS_TYPES.CHANGE_RESULTS_FIELD]({
        isAssigningProp: true,
        value: eval(value),
        step: SecondaryStep.firstStep,
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
</style>
