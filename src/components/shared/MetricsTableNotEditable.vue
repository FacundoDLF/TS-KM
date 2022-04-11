<template>
  <div class="tableContainer">
    <table class="finantialTable">
      <tr class="tableHeader">
        <th></th>
        <th>Baseline prior to AP Engagement</th>
        <th>Projected or Realized Impact post AP Engagement</th>
        <th>Change (%)</th>
        <th></th>
      </tr>
      <tbody v-for="data in dataTable" :key="data.title">
        <tr class="separator dates">
          <th class="metricTitle">
            {{ data.title }}
          </th>
          <th>
            <div class="dateTitleContainer">
              <div class="dateTitle">
                {{ startDate ? formatDate(startDate) : "-" }}
              </div>
            </div>
          </th>
          <th>
            <div class="dateTitleContainer">
              <div class="dateTitle">
                {{ endDate ? formatDate(endDate) : "-" }}
              </div>
            </div>
          </th>
          <th></th>
          <th></th>
        </tr>
        <tr v-for="question in data.tableQuestions" :key="question.id">
          <td>{{ question.title }}</td>
          <td>
            <div class="balance">
              <span>
                {{ formattedValue(question.answer.startDateValue) }}
              </span>
            </div>
          </td>
          <td>
            <div class="balance">
              <span>
                {{ formattedValue(question.answer.endDateValue) }}
              </span>
            </div>
          </td>
          <td
            v-bind:class="
              delta(
                question.answer.startDateValue,
                question.answer.endDateValue
              ) < 0
                ? 'lessThan0'
                : 'moreThan0'
            "
          >
            {{
              `${delta(
                question.answer.startDateValue,
                question.answer.endDateValue
              )} %  `
            }}
          </td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ClientInfoFields } from "@/constants/clientInfoFields";
import findQuestionInState from "@/helpers/findQuestionInState";

export default {
  name: "MetricsTableNotEditable",
  data() {
    return {};
  },
  props: {
    dataTable: {
      type: Array
    },
    selectedCase: {
      type: Object
    }
  },
  computed: {
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
    }
  },
  methods: {
    delta(startValue, endValue) {
      if (!startValue || !endValue) return "-";
      const delta = ((endValue - startValue) / startValue) * 100;
      return delta === 0 ? 0 : Math.round(delta) || "-";
    },
    formatDate(date) {
      const enteringDate = new Date(date);
      const month = enteringDate.getMonth() + 1;
      const year = enteringDate.getFullYear();
      return `${month < 10 ? "0" + month : month}/${year}`;
    },
    formattedValue(value) {
      if (!value) {
        return "-";
      } else {
        const parsedValue = parseInt(value);
        const isBillion = parsedValue / 1000 >= 1;
        const formatChar = isBillion ? "B" : "M";
        const finalValue = isBillion ? parsedValue / 1000 : parsedValue;
        return `$${
          finalValue % 1 === 0 ? finalValue : finalValue.toFixed(1)
        } ${formatChar}`;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tableContainer {
  width: 100%;
}

tr > :first-child {
  font-weight: bold;
  padding-left: 7px;
}

.finantialTable .tableHeader {
  padding-top: 5px;
  padding-bottom: 5px;
  text-align: left;
  background-color: var(--color-light-grey-background);
  color: var(--color-white);
  font-size: 16px;
}

.lessThan0 {
  color: var(--color-red);
}

.moreThan0 {
  color: var(--color-green);
}

.moreThan0,
.lessThan0 {
  text-align: center;
}

.balance {
  display: flex;
  justify-content: space-around;
}

.tableHeader > th {
  text-align: center;
  font-weight: 700;
  font-size: 14px;
  color: var(--color-black);
}

.tableHeader > th:nth-child(1) {
  width: 20%;
}

.tableHeader > th:nth-child(2),
th:nth-child(3) {
  width: 28%;
}

.finantialTable {
  border-collapse: collapse;
  width: 100%;
  border: 1px solid var(--color-light-grey-border);
}

.finantialTable td,
.finantialTable th {
  border: none;
}

.finantialTable tr:nth-child(even) {
  background-color: var(--color-light-grey-background);
}

.dates {
  text-align: right;
  font-size: 16px;
}

.separator > th {
  background-color: #dff0db;
  height: 10px;
  color: var(--color-black);
  font-weight: 700;
  font-size: 14px;
  border: none;
}

.metricTitle {
  text-align: left;
  padding-left: 7px;
  font-weight: bold !important;
}

.dateTitleContainer {
  display: flex;
  justify-content: center;
}

.dateTitle {
  width: 33%;
  text-align: center;
}

.tableSection {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  padding: 25px;
  margin-bottom: 30px;
  background: white;
  box-shadow: 0px 4px 24px 0px #00000040;
}
</style>
