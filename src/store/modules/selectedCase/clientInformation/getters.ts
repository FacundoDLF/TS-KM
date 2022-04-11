import { Question, Step } from "@/types";
import getStepAnswers from "@/helpers/getStepAnswers";
import _ from "lodash";

export default {
  answers: (state: Step) => getStepAnswers(state),
  clientInfoErrorsFirstStep: (state: Step): number => {
    const errors: Question[] = state.firstStep.filter(
      question => question.error !== ""
    );
    return errors.length;
  },
  clientInfoErrorsSecondStep: (state: Step): number => {
    const errors: Question[] = state.secondStep?.filter(
      question => question.error !== ""
    );
    return errors.length;
  }
};
