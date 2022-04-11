<template>
  <div class="StepsWrapper">
    <div>
      <div v-if="numberOfSteps > 1" class="radioStepContainer">
        <div>
          <button
            @click="handleClickOnStep(1)"
            :disabled="secondaryStep === 1"
            class="radioStep"
            :class="[
              { activeStep: secondaryStep === 1, withError: errorsInFirstStep }
            ]"
          >
            1
          </button>
        </div>
        <div class="lineThrough"></div>
        <div>
          <button
            v-if="numberOfSteps >= 2"
            :disabled="secondaryStep === 2"
            @click="handleClickOnStep(2)"
            class="radioStep"
            :class="[
              { activeStep: secondaryStep === 2, withError: errorsInSecondStep }
            ]"
          >
            2
          </button>
        </div>
        <div
          v-if="numberOfSteps > 2 && (!isSituationStep || isFasCase)"
          class="lineThrough"
        ></div>
        <div v-if="numberOfSteps > 2 && (!isSituationStep || isFasCase)">
          <button
            v-if="numberOfSteps > 2 && (!isSituationStep || isFasCase)"
            :disabled="secondaryStep === 3"
            @click="handleClickOnStep(3)"
            class="radioStep"
            :class="[
              { activeStep: secondaryStep === 3, withError: errorsInThirdStep }
            ]"
          >
            3
          </button>
        </div>
      </div>
    </div>
    <div>
      <div class="captions">
        <p v-if="firstSection" class="sectionCaption leftSectionCaption">
          {{ firstSection }}
        </p>
        <p
          v-if="secondSection"
          class="sectionCaption"
          :class="
            thirdSection && numberOfSteps > 2 && (!isSituationStep || isFasCase)
              ? 'centerSectionCaption'
              : 'rightSectionCaption'
          "
        >
          {{ secondSection }}
        </p>
        <p
          v-if="
            thirdSection && numberOfSteps > 2 && (!isSituationStep || isFasCase)
          "
          class="sectionCaption rightSectionCaption"
        >
          {{ thirdSection }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import {
  ACTIONS_TYPES as SELECTED_CASE_ACTIONS_TYPES,
  MUTATIONS_TYPES as SELECTED_CASE_MUTATIONS_TYPES
} from "@/store/modules/selectedCase/types";
import { ACTIONS_TYPES as RESULTS_ACTION_TYPES } from "@/store/modules/selectedCase/results/types";
import QuestionsData from "@/data/QuestionsData";
import findQuestionInState from "@/helpers/findQuestionInState";
import { Routes } from "@/constants/routes";

export default {
  name: "StepsHandler",
  props: {
    firstSection: String,
    secondSection: String,
    thirdSection: String
  },
  computed: {
    ...mapState({
      isLoading: state => state.isLoading,
      isFetching: state => state.isFetching,
      selectedCase: state => state.selectedCase,
      currentRoutePath: state => state.currentRoutePath,
      secondaryStep: state => state.selectedCase.secondaryStep,
      caseStatus: state => state.selectedCase.status,
      errors: state => state.selectedCase.errors
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
    disabled() {
      return this.errorsInForm;
    },
    isSituationStep() {
      return this.currentRoutePath.includes(Routes.SITUATION);
    }
  },
  methods: {
    ...mapActions("selectedCase", [
      SELECTED_CASE_ACTIONS_TYPES.CHANGE_SECONDARY_STEP
    ]),
    ...mapActions("selectedCase/results", [
      RESULTS_ACTION_TYPES.CHECK_METRIC_ERRORS
    ]),
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
      if (this.currentRoutePath.includes(Routes.SITUATION) && step === 1) {
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
    }
  }
};
</script>

<style lang="scss" scoped>
.errorsWarning {
  position: absolute;
  color: var(--color-red);
  background-color: var(--color-white);
  top: -50%;
  margin-right: auto;
  margin-left: auto;
}

.captions {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.radioStepContainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0% 4%;
}

.radioStep {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 600;
  border-radius: 50%;
  font-family: "Roboto-Bold";
  color: var(--color-green-tone-two);
  background-color: var(--color-white);
  border: 1px solid var(--color-green-tone-two);
}

.radioStep:hover {
  background-color: #3f7b25;
  color: var(--color-white);
}

.sectionCaption {
  margin-top: 5px;
  font-size: 14px;
  font-weight: 400;
  text-transform: capitalize;
  font-family: var(--secondary-font);
  color: #727272;
  width: 100%;
}

.leftSectionCaption {
  text-align: left;
}

.centerSectionCaption {
  text-align: center;
}

.rightSectionCaption {
  text-align: right;
}

.withError {
  border-color: var(--color-red);
  background-color: var(--color-red);
  color: var(--color-white);
}

.radioStep:hover {
  border-color: var(--color-green-tone-two);
}

.lineThrough {
  width: 90%;
  background-color: #5cb335;
  height: 1px;
  z-index: -20;
}

.activeStep {
  border-color: var(--color-green-tone-two);
  background-color: var(--color-green-tone-two);
  color: var(--color-white);
}

.StepsWrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 38%;

  & > div {
    width: 100%;
  }
}
</style>
