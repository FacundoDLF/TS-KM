import { MUTATIONS_TYPES } from "./types";
import { ResultsFields } from "@/constants/resultsFields";
import {
  Question,
  SecondaryStep,
  Step,
  MetricValue,
  MetricOption,
  MetricsSection
} from "@/types";

export default {
  [MUTATIONS_TYPES.ADD_QUESTION]: (state: Step, value: Question) => {
    state["thirdStep"] = [...state["thirdStep"], value];
  },
  [MUTATIONS_TYPES.REMOVE_QUESTION]: (state: Step, id: string) => {
    state["thirdStep"] = state["thirdStep"].filter(
      question => question.id !== id
    );
  },
  [MUTATIONS_TYPES.SET_RESULTS_FIRST_STEP]: (
    state: Step,
    value: Question[]
  ) => {
    state[SecondaryStep.firstStep] = value;
  },
  [MUTATIONS_TYPES.SET_RESULTS_SECOND_STEP]: (
    state: Step,
    value: Question[]
  ) => {
    state[SecondaryStep.secondStep] = value;
  },
  [MUTATIONS_TYPES.SET_RESULTS_THIRD_STEP]: (
    state: Step,
    value: Question[]
  ) => {
    state[SecondaryStep.thirdStep] = value;
  },
  [MUTATIONS_TYPES.SET_RESULTS_FIELD]: (
    state: Step,
    value: { text: string; key: ResultsFields; secondaryStep: SecondaryStep }
  ) => {
    const questionIndex = state[value.secondaryStep].findIndex(
      question => question.id === value.key
    );
    state[value.secondaryStep][questionIndex].answer = value.text;
  },
  [MUTATIONS_TYPES.ASSIGN_RESULTS_FIELDS_VALUES]: (
    state: Step,
    payload: {
      value: number;
      path: MetricOption;
      key: ResultsFields;
      secondaryStep: SecondaryStep;
    }
  ) => {
    const questionIndex = state[payload.secondaryStep].findIndex(
      question => question.id === payload.key
    );
    (state[payload.secondaryStep][questionIndex].answer as MetricValue)[
      payload.path
    ] = payload.value;
  },
  [MUTATIONS_TYPES.ADD_METRIC]: (state: Step, value: Question) => {
    state[value.questionStep] = [...state[value.questionStep], value];
  },
  [MUTATIONS_TYPES.REMOVE_METRIC]: (
    state: Step,
    value: { id: string; secondaryStep: SecondaryStep }
  ) => {
    state[value.secondaryStep] = state[value.secondaryStep].filter(
      question => question.id !== value.id
    );
  },
  [MUTATIONS_TYPES.ASSIGN_METRIC_SECTION]: (
    state: Step,
    payload: {
      value: MetricsSection;
      key: string;
      secondaryStep: SecondaryStep;
    }
  ) => {
    const questionIndex = state[payload.secondaryStep].findIndex(
      question => question.id === payload.key
    );
    state[payload.secondaryStep][questionIndex]["financialMetricsArea"] =
      payload.value;
  },
  [MUTATIONS_TYPES.ASSIGN_METRIC_TITLE]: (
    state: Step,
    payload: {
      value: string;
      key: string;
      secondaryStep: SecondaryStep;
    }
  ) => {
    const questionIndex = state[payload.secondaryStep].findIndex(
      question => question.id === payload.key
    );
    state[payload.secondaryStep][questionIndex]["title"] = payload.value;
  }
};
