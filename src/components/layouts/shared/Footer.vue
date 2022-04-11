<template>
  <nav class="row footer">
    <div class="buttonsContainerLeft">
      <button
        v-if="absoluteSecondaryStepNumber !== 0"
        @click="handleStepDown()"
        :class="[
          { disabledSubmit: isLoading },
          'actionSecondaryBtn',
          'backBtn'
        ]"
      >
        <span>Back</span>
      </button>
    </div>
    <div class="buttonsContainerRight">
      <div>
        <div v-if="buttonContent !== 'Approve'">
          <button
            v-if="showButton && absoluteSecondaryStepNumber === 7"
            @click="goToPpt"
            :class="[
              { disabledSubmit: disabled || isLoading },
              'actionSecondaryBtn'
            ]"
            :disabled="disabled"
          >
            <b-spinner v-if="isLoading" class="loadingSpinner"> </b-spinner>
            <span v-else>{{ buttonContent }}</span>
          </button>
        </div>
        <div v-else-if="isSubmitted && isBicReviewer">
          <button
            v-if="showButton && !isFetching"
            id="approveButton"
            @click="goToPpt"
            :class="[
              { disabledSubmit: disabled || isLoading },
              'actionSecondaryBtn'
            ]"
            :disabled="disabled"
          >
            <b-spinner v-if="isLoading" class="loadingSpinner"> </b-spinner>
            <span v-else>{{ buttonContent }}</span>
          </button>
        </div>
        <div v-else-if="isApprovedByKM && hasMDReviewer">
          <button
            v-if="showButton && !isFetching"
            id="approveButton"
            :class="[
              { disabledSubmit: disabled || isLoading },
              'actionSecondaryBtn'
            ]"
            @click="goToPpt"
            :disabled="disabled"
          >
            <b-spinner v-if="isLoading" class="loadingSpinner"> </b-spinner>
            <span v-else>Publish</span>
          </button>
        </div>
      </div>
      <div v-if="absoluteSecondaryStepNumber !== 7" class="nextBtn">
        <button
          @click="handleStepUp()"
          :class="[{ disabledSubmit: isLoading }, 'actionBtn']"
        >
          <span>Next</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import {
  ACTIONS_TYPES as SELECTED_CASE_ACTIONS_TYPES,
  MUTATIONS_TYPES as SELECTED_CASE_MUTATIONS_TYPES
} from "@/store/modules/selectedCase/types";
import { ACTIONS_TYPES as MODAL_ACTIONS_TYPES } from "@/store/modules/modal/types";
import { ACTIONS_TYPES as GLOBAL_ACTIONS_TYPES } from "@/store/types";
import { ACTIONS_TYPES as RESULTS_ACTION_TYPES } from "@/store/modules/selectedCase/results/types";
import { CaseStatus, UserRoles } from "@/types";
import QuestionsData from "@/data/QuestionsData";
import findQuestionInState from "@/helpers/findQuestionInState";
import { Routes } from "@/constants/routes";

export default {
  name: "Footer",
  computed: {
    ...mapState({
      isLoading: state => state.isLoading,
      isFetching: state => state.isFetching,
      selectedCase: state => state.selectedCase,
      currentRoutePath: state => state.currentRoutePath,
      secondaryStep: state => state.selectedCase.secondaryStep,
      caseStatus: state => state.selectedCase.status,
      errors: state => state.selectedCase.errors,
      bicReviewer: state => state.selectedCase.reviewerBIC,
      mdReviewer: state => state.selectedCase.reviewerMD,
      user: state => state.user
    }),
    ...mapGetters("selectedCase", [
      "errorsInFirstStep",
      "errorsInSecondStep",
      "errorsInThirdStep",
      "errorsInForm",
      "userRole",
      "isEditableCase",
      "isFasCase"
    ]),
    ...mapGetters(["numberOfSteps", "absoluteSecondaryStepNumber"]),
    buttonContent() {
      if (
        this.userRole === UserRoles.author &&
        this.caseStatus === CaseStatus.opened
      ) {
        return "Submit";
      } else return "Approve";
    },
    showButton() {
      return (
        (this.userRole === UserRoles.author &&
          this.caseStatus === CaseStatus.opened) ||
        (this.userRole === UserRoles.reviewer &&
          this.caseStatus !== CaseStatus.opened) ||
        (this.isBicReviewer && this.caseStatus === CaseStatus.submitted)
      );
    },
    disabled() {
      return this.errorsInForm;
    },
    isApprovedByKM() {
      return this.caseStatus === CaseStatus.approvedByKM;
    },
    isSubmitted() {
      return this.caseStatus === CaseStatus.submitted;
    },
    isSituationStep() {
      return this.currentRoutePath.includes(Routes.SITUATION);
    },
    hasMDReviewer() {
      return this.user.userId === this.mdReviewer?.userId;
    },
    isBicReviewer() {
      return this.user.isBICReviewer;
    }
  },
  methods: {
    ...mapActions("selectedCase", [
      SELECTED_CASE_ACTIONS_TYPES.CHANGE_SECONDARY_STEP
    ]),
    ...mapActions([GLOBAL_ACTIONS_TYPES.ROUTER_REPLACE]),
    ...mapActions("selectedCase/results", [
      RESULTS_ACTION_TYPES.CHECK_METRIC_ERRORS
    ]),
    ...mapActions("modal", [MODAL_ACTIONS_TYPES.OPEN_MODAL]),
    ...mapMutations("selectedCase", [
      SELECTED_CASE_MUTATIONS_TYPES.SET_IS_ERROR,
      SELECTED_CASE_MUTATIONS_TYPES.ADD_ERROR
    ]),
    smoothScrollTop() {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    },
    goToPpt() {
      this[GLOBAL_ACTIONS_TYPES.ROUTER_REPLACE](
        `${Routes.MY_CASES}/${this.$route.params.id}/preview-ppt/1`
      );
    },
    handleStepDown() {
      const newSecondaryStep =
        this.absoluteSecondaryStepNumber === 4 && !this.isFasCase
          ? 2
          : this.absoluteSecondaryStepNumber - 1;
      this[SELECTED_CASE_ACTIONS_TYPES.CHANGE_SECONDARY_STEP](newSecondaryStep);
      this.smoothScrollTop();
    },
    handleStepUp() {
      const newSecondaryStep =
        this.absoluteSecondaryStepNumber === 2 && !this.isFasCase
          ? 4
          : this.absoluteSecondaryStepNumber + 1;
      this[SELECTED_CASE_ACTIONS_TYPES.CHANGE_SECONDARY_STEP](newSecondaryStep);
      this.smoothScrollTop();
    },
    getAbsoluteSecondaryStepNumber(step) {
      if (
        this.currentRoutePath.includes(Routes.AVAILABLE_CASE_DATA) &&
        step === 1
      ) {
        return 0;
      } else if (
        this.currentRoutePath.includes(Routes.SITUATION) &&
        step === 1
      ) {
        return 1;
      } else if (
        this.currentRoutePath.includes(Routes.SITUATION) &&
        step === 2
      ) {
        return 2;
      } else if (
        this.currentRoutePath.includes(Routes.SITUATION) &&
        step === 3
      ) {
        return 3;
      } else if (this.currentRoutePath.includes(Routes.APPROACH)) {
        return 4;
      } else if (this.currentRoutePath.includes(Routes.RESULTS) && step === 1) {
        return 5;
      } else if (this.currentRoutePath.includes(Routes.RESULTS) && step === 2) {
        return 6;
      } else if (this.currentRoutePath.includes(Routes.RESULTS) && step === 3) {
        return 7;
      }
    },
    handleClickOnStep(step) {
      this[SELECTED_CASE_ACTIONS_TYPES.CHANGE_SECONDARY_STEP](
        this.getAbsoluteSecondaryStepNumber(step)
      );
      this.smoothScrollTop();
    },
    scrollToElement(element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    },
    checkForErrors() {
      this[RESULTS_ACTION_TYPES.CHECK_METRIC_ERRORS]();
      QuestionsData.forEach(question => {
        if (question.isRequired) {
          if (
            findQuestionInState(
              this.selectedCase[question.questionParent],
              question.id
            )?.answer === ""
          ) {
            this[SELECTED_CASE_MUTATIONS_TYPES.SET_IS_ERROR](true);
            this[SELECTED_CASE_MUTATIONS_TYPES.ADD_ERROR]({
              question: findQuestionInState(
                this.selectedCase[question.questionParent],
                question.id
              ),
              message: `This field is required`
            });
          }
        }
      });
      if (this.errorsInForm) {
        this[SELECTED_CASE_ACTIONS_TYPES.CHANGE_SECONDARY_STEP](8);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.loadingSpinner {
  width: 1.5em;
  height: 1.5em;
}

.footer {
  position: sticky;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  z-index: 10;
  width: 100%;
  height: 65px;
  background-color: var(--color-white);
  box-shadow: 0px 4px 6px 4px rgba(0, 0, 0, 0.25);
}

.radioStepContainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.radioStep {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  margin: 0 5px;
  box-sizing: border-box;
  font-size: 14px;
  border-radius: 50%;
  color: var(--color-white);
  border: 3px var(--color-white) solid;
}

.withError {
  border-color: var(--color-red);
}

.radioStep:hover {
  border-color: var(--color-green);
}

.activeStep {
  border-color: var(--color-green);
}

.icon {
  height: 45px;
}

.levelUp {
  transform: rotateY(0deg) rotate(180deg);
}

.disabled {
  visibility: hidden;
}

.buttonsContainerRight {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  position: absolute;
  right: 15%;
}

.buttonsContainerLeft {
  display: flex;
  flex-direction: row-reverse;
  position: absolute;
  left: 26%;
}

.actionBtn {
  padding: 6px 50px 3px 50px;
  background-color: var(--color-green-tone-two);
  color: var(--color-white);
  font-family: "Roboto-Bold";
  text-transform: uppercase;
  height: 40px;
  width: 170px;
}

.actionSecondaryBtn {
  padding: 6px 50px 3px 50px;
  font-family: "Roboto-Bold";
  background-color: var(--color-white);
  color: var(--color-green-tone-two);
  border: 1px solid var(--color-green-tone-two);
  text-transform: uppercase;
  height: 40px;
  width: 170px;
}

.nextBtn {
  margin-left: 20px;
}

.backBtn {
  margin-right: 20px;
}

.backButton {
  height: 40px;
  font-family: "Roboto-Bold";
  padding: 6px 50px 3px 50px;
  color: var(--color-white);
  text-transform: uppercase;
  background-color: var(--color-red);
}

.disabledSubmit {
  cursor: default;
  background-color: var(--color-medium-light-grey);
}
</style>
