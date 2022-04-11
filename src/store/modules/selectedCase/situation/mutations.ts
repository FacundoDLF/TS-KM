import { MUTATIONS_TYPES } from "./types";
import { SituationFields } from "@/constants/situationFields";
import { Question, SecondaryStep, Step } from "@/types";

export default {
  [MUTATIONS_TYPES.SET_SITUATION_FIRST_STEP]: (
    state: Step,
    value: Question[]
  ) => {
    state[SecondaryStep.firstStep] = value;
  },
  [MUTATIONS_TYPES.SET_SITUATION_SECOND_STEP]: (
    state: Step,
    value: Question[]
  ) => {
    state[SecondaryStep.secondStep] = value;
  },
  [MUTATIONS_TYPES.SET_SITUATION_SECOND_STEP]: (
    state: Step,
    value: Question[]
  ) => {
    state[SecondaryStep.secondStep] = value;
  },
  [MUTATIONS_TYPES.SET_SITUATION_THIRD_STEP]: (
    state: Step,
    value: Question[]
  ) => {
    state[SecondaryStep.thirdStep] = value;
  },
  [MUTATIONS_TYPES.SET_SITUATION_FIELD]: (
    state: Step,
    value: { text: string; key: SituationFields; secondaryStep: SecondaryStep }
  ) =>
    (state[value.secondaryStep][
      state[value.secondaryStep].findIndex(
        question => question.id === value.key
      )
    ].answer = value.text)
};
