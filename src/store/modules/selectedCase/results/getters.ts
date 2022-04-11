import getStepAnswers from "@/helpers/getStepAnswers";
import { MetricsSection, Question, Step } from "@/types";
import _ from "lodash";

export default {
  answers: (state: Step) => getStepAnswers(state),
  resultsErrorsFirstStep: (state: Step): number => {
    const errors: Question[] = state.firstStep.filter(
      question => question.error !== ""
    );
    return errors.length;
  },
  resultsErrorsSecondStep: (state: Step): number => {
    const errors: Question[] = state.secondStep?.filter(
      question => question.error !== ""
    );
    return errors.length;
  },
  resultsErrorsThirdStep: (state: Step): number => {
    const errors: Question[] = state.thirdStep?.filter(
      question => question.error !== ""
    );
    return errors.length;
  },
  incomeQuestions: (state: Step) => {
    const questions: Question[] = state.firstStep.filter(
      question =>
        question.isFinancialMetric === true &&
        question.financialMetricsArea === MetricsSection.income
    );
    return questions;
  },
  balanceQuestions: (state: Step) => {
    const questions: Question[] = state.firstStep.filter(
      question =>
        question.isFinancialMetric === true &&
        question.financialMetricsArea === MetricsSection.balance
    );
    return questions;
  },
  rpmQuestions: (state: Step) => {
    const questions: Question[] = state.secondStep.filter(
      question => question.isFinancialMetric === false
    );
    return questions;
  }
};
