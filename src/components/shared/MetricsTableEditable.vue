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
        <tr class="separator dates" v-show="data.title">
          <th class="metricTitle">{{ data.title }}</th>
          <th>
            <div class="dateTitleContainer">
              {{ data.firstDate ? formatDate(data.firstDate) : "-" }}
            </div>
          </th>
          <th>
            <div class="dateTitleContainer">
              {{ data.secondDate ? formatDate(data.secondDate) : "-" }}
            </div>
          </th>
          <th></th>
          <th></th>
        </tr>
        <RowInput
          v-show="data.tableQuestions"
          v-for="question in data.tableQuestions"
          :key="question.id"
          :name="question.title"
          @startDateBlur="handleStartDateBlur"
          @endDateBlur="handleEndDateBlur"
          :isFinancial="isFinancial"
          :startDateValue="
            question.created
              ? getDinamicQuestionValue(question.id).startDateValue
              : getStaticQuestionValue(question.id).startDateValue
          "
          :endDateValue="
            question.created
              ? getDinamicQuestionValue(question.id).endDateValue
              : getStaticQuestionValue(question.id).endDateValue
          "
          :inputKey="question.id"
          :created="question.created"
          :financialMetricsArea="question.financialMetricsArea"
          :error="question.error"
        />
      </tbody>
    </table>
  </div>
</template>

<script>
import { ResultsFields } from "@/constants/resultsFields";
import RowInput from "@/components/shared/RowInput";
import findQuestionInState from "@/helpers/findQuestionInState";
import { mapState } from "vuex";
import { SecondaryStep } from "@/types";

export default {
  name: "MetricsTableEditable",
  data() {
    return {};
  },
  props: {
    dataTable: {
      type: Array
    },
    step: {
      type: Array
    },
    isFinancial: {
      type: Boolean,
      required: false
    }
  },
  components: {
    RowInput
  },
  computed: {
    ...mapState({
      firstStep: state => state["selectedCase"].results[SecondaryStep.firstStep]
    }),
    overall() {
      return findQuestionInState(
        this.$store.state.selectedCase.results,
        ResultsFields.OVERALL_IMPACT
      ).answer;
    },
    revenue() {
      return findQuestionInState(
        this.$store.state.selectedCase.results,
        ResultsFields.REVENUE
      ).answer;
    },
    costGoodsSold() {
      return findQuestionInState(
        this.$store.state.selectedCase.results,
        ResultsFields.COST_GOODS_SOLD
      ).answer;
    },
    goodsProfit() {
      return findQuestionInState(
        this.$store.state.selectedCase.results,
        ResultsFields.GOODS_PROFIT
      ).answer;
    },
    sellingGeneralAdministrative() {
      return findQuestionInState(
        this.$store.state.selectedCase.results,
        ResultsFields.SELLING_GENERAL_ADMINISTRATIVE
      ).answer;
    },
    ebitda() {
      return findQuestionInState(
        this.$store.state.selectedCase.results,
        ResultsFields.EBITDA
      ).answer;
    },
    cashInvestments() {
      return findQuestionInState(
        this.$store.state.selectedCase.results,
        ResultsFields.CASH_INVESTMENTS
      ).answer;
    },
    accountsReceivable() {
      return findQuestionInState(
        this.$store.state.selectedCase.results,
        ResultsFields.ACCOUNTS_RECEIVABLE
      ).answer;
    },
    inventory() {
      return findQuestionInState(
        this.$store.state.selectedCase.results,
        ResultsFields.INVENTORY
      ).answer;
    },
    accountsPayable() {
      return findQuestionInState(
        this.$store.state.selectedCase.results,
        ResultsFields.ACCOUNTS_PAYABLE
      ).answer;
    },
    totalDebt() {
      return findQuestionInState(
        this.$store.state.selectedCase.results,
        ResultsFields.TOTAL_DEBT
      ).answer;
    }
  },
  methods: {
    handleStartDateBlur(payload) {
      const { value, key } = payload;
      this.$emit("startDateBlurResult", {
        value,
        key
      });
    },
    handleEndDateBlur(payload) {
      const { value, key } = payload;
      this.$emit("endDateBlurResult", { value, key });
    },
    getDinamicQuestionValue(id) {
      return this.step.find(question => question.id === id).answer;
    },
    formatDate(date) {
      const enteringDate = new Date(date);
      const month = enteringDate.getMonth() + 1;
      const year = enteringDate.getFullYear();
      return `${month < 10 ? "0" + month : month}/${year}`;
    },
    getStaticQuestionValue(id) {
      switch (id) {
        case ResultsFields.OVERALL_IMPACT:
          return this.overall;
        case ResultsFields.REVENUE:
          return this.revenue;
        case ResultsFields.COST_GOODS_SOLD:
          return this.costGoodsSold;
        case ResultsFields.GOODS_PROFIT:
          return this.goodsProfit;
        case ResultsFields.SELLING_GENERAL_ADMINISTRATIVE:
          return this.sellingGeneralAdministrative;
        case ResultsFields.EBITDA:
          return this.ebitda;
        case ResultsFields.CASH_INVESTMENTS:
          return this.cashInvestments;
        case ResultsFields.ACCOUNTS_RECEIVABLE:
          return this.accountsReceivable;
        case ResultsFields.INVENTORY:
          return this.inventory;
        case ResultsFields.ACCOUNTS_PAYABLE:
          return this.accountsPayable;
        case ResultsFields.TOTAL_DEBT:
          return this.totalDebt;
        default:
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.metricstTable tr {
  height: 40px;
}

.finantialTable .tableHeader {
  padding-top: 5px;
  padding-bottom: 5px;
  text-align: left;
  background-color: var(--color-light-grey-background);
  color: var(--color-white);
  font-size: 16px;
}

.tableHeader > th {
  margin-right: 30px;
  text-align: left;
  font-weight: 700;
  font-size: 14px;
  color: var(--color-black);
}

.tableHeader > th:nth-child(1) {
  width: 25%;
}

.tableHeader > th:nth-child(2) {
  width: 28%;
}

.tableHeader > th:nth-child(3) {
  width: 21%;
}

.tableHeader > th:nth-child(4) {
  width: 8%;
}

.tableHeader > th:nth-child(5) {
  width: 4%;
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
  text-align: left;
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
  justify-content: flex-start;
}
</style>
