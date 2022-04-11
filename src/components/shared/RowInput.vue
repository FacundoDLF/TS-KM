<template>
  <tr>
    <td>{{ name }}</td>
    <td>
      <div class="balance">
        From {{ isFinancial ? "$" : "" }}
        <input
          :value="startDateValue"
          @blur="handleStartDateBlur"
          type="number"
          placeholder=""
          :disabled="!editMode"
          :class="[{ error: error && !startDateValue }, 'input']"
        />
        M
      </div>
    </td>
    <td>
      <div class="balance">
        To {{ isFinancial ? "$" : "" }}
        <input
          :value="endDateValue"
          @blur="handleEndDateBlur"
          type="number"
          placeholder=""
          v-bind:disabled="!editMode"
          :class="[{ error: error && !endDateValue }, 'input']"
        />
        M
      </div>
    </td>
    <td v-bind:class="delta < 0 ? 'lessThan0' : 'moreThan0'">
      {{ `${delta} ${startDateValue && endDateValue ? "%" : ""}` }}
    </td>
    <td class="actions">
      <div class="actions">
        <button v-if="created && editMode" @click="handleEdit">
          <img :src="require('@/assets/img/pen-logo.svg')" alt="edit icon" />
        </button>
        <button
          v-if="created && editMode"
          @click="handleDelete"
          class="deleteBtn"
        >
          <img :src="require('@/assets/img/trash-logo.svg')" alt="trash icon" />
        </button>
      </div>
    </td>
  </tr>
</template>
<script>
import Vue from "vue";
import { mapActions, mapState } from "vuex";
import { ACTIONS_TYPES as RESULTS_ACTIONS_TYPES } from "@/store/modules/selectedCase/results/types";
import {
  ACTIONS_TYPES as MODAL_ACTIONS_TYPES,
  ModalComponents
} from "@/store/modules/modal/types";
import { SecondaryStep } from "@/types";

const Component = Vue.extend({
  name: "RowInput",
  props: {
    name: {
      type: String,
      required: true
    },
    startDateValue: {
      type: Number
    },
    endDateValue: {
      type: Number
    },
    inputKey: {
      type: String,
      required: true
    },
    created: {
      type: Boolean,
      required: false
    },
    isFinancial: {
      type: Boolean
    },
    financialMetricsArea: {
      type: String
    },
    error: {
      type: String
    }
  },
  computed: {
    ...mapState({
      editMode: state => state.selectedCase.editMode
    }),
    delta() {
      if (!this.startDateValue || !this.endDateValue) return "-";
      const delta =
        ((this.endDateValue - this.startDateValue) / this.startDateValue) * 100;
      return delta === 0 ? 0 : Math.round(delta) || "-";
    }
  },
  methods: {
    ...mapActions("selectedCase/results", [
      RESULTS_ACTIONS_TYPES.DELETE_METRIC
    ]),
    ...mapActions("modal", [MODAL_ACTIONS_TYPES.OPEN_MODAL]),
    handleDelete() {
      this[RESULTS_ACTIONS_TYPES.DELETE_METRIC]({
        id: this.inputKey,
        secondaryStep: this.isFinancial
          ? SecondaryStep.firstStep
          : SecondaryStep.secondStep
      });
    },
    handleEdit() {
      if (this.isFinancial) {
        this[MODAL_ACTIONS_TYPES.OPEN_MODAL]({
          component: ModalComponents.FINANCIAL_METRIC,
          props: {
            isEditing: true,
            metricKey: this.inputKey,
            metricName: this.name,
            metricSection: this.financialMetricsArea,
            secondaryStep: this.isFinancial
              ? SecondaryStep.firstStep
              : SecondaryStep.secondStep
          }
        });
      } else {
        this[MODAL_ACTIONS_TYPES.OPEN_MODAL]({
          component: ModalComponents.RPM_METRIC,
          props: {
            isEditing: true,
            metricKey: this.inputKey,
            metricName: this.name
          }
        });
      }
    },
    handleStartDateBlur(e) {
      this.$emit("startDateBlur", {
        value: e.target.value,
        key: this.inputKey
      });
    },
    handleEndDateBlur(e) {
      this.$emit("endDateBlur", { value: e.target.value, key: this.inputKey });
    }
  }
});

export default Component;
</script>

<style lang="scss" scoped>
tr > :first-child {
  font-weight: 400;
  font-size: 14px;
  padding-left: 7px;
}

.lessThan0 {
  font-size: 14px;
  color: var(--color-red);
}

.moreThan0 {
  font-size: 14px;
  color: var(--color-green);
}

.actions {
  text-align: right;
  width: 100%;
}

.actions > button:not(.deleteBtn) {
  color: var(--color-green);
  font-size: 14px;
  height: 100%;
  margin-right: 15px;
}

.deleteBtn {
  font-size: 14px;
  color: var(--color-red);
  margin: 0px 10px;
}

.action,
.moreThan0,
.lessThan0 {
  text-align: center;
}

.error {
  outline: none !important;
  border-bottom: 0.1px solid var(--color-red) !important;
  box-shadow: 0 0 10px var(--color-grey-border);
}

input {
  border: none;
  font-size: 14px;
  border: 1px solid #ccc;
  width: 30%;
  height: 100%;
  margin: 0px 8px;
}

span {
  width: 33%;
  font-size: 14px;
  text-align: center;
}

input:focus {
  outline: 0;
}

.balance {
  display: flex;
  font-size: 14px;
  justify-content: flex-start;
}
</style>
