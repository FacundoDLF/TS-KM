<template>
  <div class="barContainer" :class="[{ mainBar: !title }]">
    <div
      class="progressBar"
      :class="[{ full: !title, progressBarError: error }]"
    >
      <div
        class="progressValue"
        :class="[{ progressValueError: error }]"
        :style="{ '--progress': percentage + '%' }"
      ></div>
    </div>
    <p class="status" :class="[{ labelError: error }]">
      <span class="title">{{ title || "" }}</span>
      <span :class="[{ labelError: error }]">{{ " " + status }}</span>
      <span v-if="errorsInFirstStep && secondaryStep !== 1" class="errorText">
        - You have errors on the first step
      </span>
      <span v-if="errorsInSecondStep && secondaryStep !== 2" class="errorText">
        - You have errors on the second step
      </span>
    </p>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { UserRoles, CaseStatus } from "@/types";

export default {
  name: "ProgressBar",
  props: {
    percentage: {
      type: Number,
      required: true
    },
    title: {
      type: String
    },
    error: {
      type: Boolean
    }
  },
  computed: {
    ...mapState({
      secondaryStep: state => state["selectedCase"].secondaryStep,
      selectedCaseStatus: state => state.selectedCase.status,
      bicReviewer: state => state.selectedCase.reviewerBIC
    }),
    ...mapGetters("selectedCase", [
      "errorsInFirstStep",
      "errorsInSecondStep",
      "userRole"
    ]),
    UserRoles() {
      return UserRoles;
    },
    status() {
      return `completion: ${this.percentage}%`;
    },
    isSubmitted() {
      return this.selectedCaseStatus === CaseStatus.submitted;
    }
  }
};
</script>

<style lang="scss" scoped>
.barContainer {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 50px;
}

.mainBar {
  margin-top: 50px;
}

.progressBar {
  height: 15px;
  border-radius: 5px;
  background-color: var(--color-disabled-grey);
  width: 100%;
}

.full {
  width: 100%;
}

.progressValue {
  width: var(--progress);
  height: 100%;
  border-left: 1px solid var(--color-green-tone-two);
  border-radius: 5px;
  background-color: var(--color-green-tone-two);
  transition: width 1s ease-in-out;
}

.status {
  padding: 10px 0 0 15px;
  margin-bottom: 0;
  color: var(--color-green);
  font-size: 14px;
  color: #727272;
}

.title {
  text-transform: capitalize;
  color: #727272;
}

.progressValueError {
  border-left: 1px solid var(--color-red);
  border-radius: 5px;
  background-color: var(--color-red);
}

.labelError {
  color: #727272;
}
</style>
