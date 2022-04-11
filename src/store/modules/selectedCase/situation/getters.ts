import getStepAnswers from "@/helpers/getStepAnswers";
import { RootStateWithModulesState } from "@/store";
import { Question, Step } from "@/types";
import _ from "lodash";

export default {
  answers: (state: Step) => getStepAnswers(state),
  situationErrorsFirstStep: (state: Step): number => {
    const errors: Question[] = state.firstStep.filter(
      question => question.error !== ""
    );
    return errors.length;
  },
  situationErrorsSecondStep: (state: Step): number => {
    const errors: Question[] = state.secondStep?.filter(
      question => question.error !== ""
    );
    return errors.length;
  },
  situationErrorsThirdStep: (
    state: Step,
    getters: any,
    rootState: RootStateWithModulesState,
    rootGetters: any
  ): number => {
    let errors: Question[] = [];
    if (rootGetters["selectedCase/isFasCase"])
      errors = state.thirdStep?.filter(question => question.error !== "");
    return errors.length;
  }
};
