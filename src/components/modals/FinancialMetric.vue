<template>
  <div class="modal-content">
    <h2 class="modalTitle">
      {{ !isEditing ? "Add Financial Metric" : "Edit Financial Metric" }}
    </h2>
    <p class="toContinue">
      {{
        !isEditing
          ? " If you continue, you will add a new Financial Metric on the table:"
          : "If you continue, you will edit this Financial Metric on the table:"
      }}
    </p>
    <div class="inputsContainer">
      <div>
        <p>Metric Name:</p>
        <input
          v-model="localMetricTitle"
          type="text"
          placeholder="Enter a name..."
          class="input"
          maxlength="24"
        />
      </div>
      <div>
        <p>Metric section:</p>
        <select v-model="localMetricSection" class="input">
          <option selected disabled>Please select one section:</option>
          <option :value="metricSections.income">Income</option>
          <option :value="metricSections.balance">Balance</option>
        </select>
      </div>
    </div>
    <p v-if="!isEditing && checkMetricName()" class="errorMsg">
      Repeated metric names are not allowed
    </p>
    <div class="buttons">
      <button class="cancel" @click="closeModal">Cancel</button>
      <button
        class="continue"
        :disabled="
          !localMetricTitle ||
            !localMetricSection ||
            (!isEditing && checkMetricName())
        "
        :class="{
          disabled:
            !localMetricTitle ||
            !localMetricSection ||
            (!isEditing && checkMetricName())
        }"
        @click="handleSubmitMetric"
      >
        Continue
      </button>
    </div>
  </div>
</template>

<script>
import { MUTATIONS_TYPES } from "@/store/modules/modal/types";
import { ACTIONS_TYPES as RESULTS_ACTIONS_TYPES } from "@/store/modules/selectedCase/results/types";
import { mapActions, mapState } from "vuex";
import { mapMutations } from "vuex";
import { MetricsSection } from "@/types";

export default {
  data: () => ({
    localMetricTitle: "",
    localMetricSection: null
  }),
  props: {
    metricKey: {
      type: String
    },
    metricName: {
      type: String
    },
    metricSection: {
      type: String
    },
    isEditing: {
      type: Boolean
    },
    secondaryStep: {
      type: String
    }
  },
  computed: {
    metricSections() {
      return MetricsSection;
    },
    ...mapState({
      resultsNameFirstStep: state => state.selectedCase.results.firstStep
    }),
    filteredAnswersFirstStep() {
      return this.resultsNameFirstStep.filter(metric => metric.isMetric);
    },
    mapedAnswersFirstStep() {
      return this.filteredAnswersFirstStep.map(metric => metric.title);
    }
  },
  methods: {
    ...mapActions("selectedCase/results", [
      RESULTS_ACTIONS_TYPES.PUSH_METRIC,
      RESULTS_ACTIONS_TYPES.EDIT_METRIC
    ]),
    ...mapMutations("modal", [MUTATIONS_TYPES.SET_MODAL_VISIBILITY]),
    closeModal() {
      this[MUTATIONS_TYPES.SET_MODAL_VISIBILITY](false);
    },
    handleSubmitMetric() {
      if (!this.isEditing) {
        this[RESULTS_ACTIONS_TYPES.PUSH_METRIC]({
          metricName: this.localMetricTitle,
          metricSection: this.localMetricSection,
          secondaryStep: this.secondaryStep
        });
        this[MUTATIONS_TYPES.SET_MODAL_VISIBILITY](false);
      } else {
        this[RESULTS_ACTIONS_TYPES.EDIT_METRIC]({
          step: this.secondaryStep,
          key: this.metricKey,
          financialMetricsArea: this.localMetricSection,
          title: this.localMetricTitle
        });
        this[MUTATIONS_TYPES.SET_MODAL_VISIBILITY](false);
      }
    },
    checkMetricName() {
      return this.mapedAnswersFirstStep.some(
        metric => metric === this.localMetricTitle
      );
    }
  },
  mounted() {
    if (this.isEditing) {
      this.localMetricTitle = this.metricName;
      this.localMetricSection = this.metricSection;
    }
  }
};
</script>

<style lang="scss" scoped>
.continue,
.cancel {
  text-align: center;
  text-transform: uppercase;
  font-size: 14px;
  width: 100px;
  padding: 10px 15px;
  margin: 10px;
}
.continue {
  color: var(--color-white);
  background-color: var(--color-green);
}
.cancel {
  border: 1px solid var(--color-light-grey);
  color: var(--color-light-grey);
}
.cancel:hover {
  color: var(--color-white);
  background-color: var(--color-light-grey);
}
.modal-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 40%;
  width: 90%;
  padding: 50px 30px;
  text-align: center;
  animation: fadein 0.4s;
}

.errorMsg {
  color: var(--color-red);
  width: 100%;
  text-align: center;
  max-height: 0px;
  margin: 0px;
}

@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.modalTitle {
  margin-bottom: 10px;
  font-size: 24px !important;
  color: var(--color-green);
}
.toContinue {
  font-size: 20px;
  color: var(--color-medium-grey);
}

.inputsContainer {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  margin: 15px 0;
}

.inputsContainer > div {
  flex-direction: column;
  width: 40%;
}

.input {
  width: 100%;
  height: 50px;
  outline: 0;
  border: 1px solid var(--color-grey-border);
  padding: 10px 5px;
  background-color: var(--color-white);
  border-radius: 5px;
}

.input::placeholder {
  color: var(--color-grey-placeholder);
}

.disabled {
  background: var(--color-disabled-grey);
  color: var(--color-medium-grey);
}

.buttons {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  align-self: flex-end;
}
@media screen and (min-width: 960px) {
  .modal-content {
    align-items: flex-start;
    height: auto;
    width: 58rem;
    text-align: left;
    padding: 40px 20px 20px 40px;
  }
  .modalTitle {
    font-size: 24px;
  }
}
</style>
