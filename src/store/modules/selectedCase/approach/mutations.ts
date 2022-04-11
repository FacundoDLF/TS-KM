import { MUTATIONS_TYPES } from "./types";
import { ApproachFields } from "@/constants/approachFields";
import { Question, SecondaryStep, Step } from "@/types";

export default {
  [MUTATIONS_TYPES.SET_APPROACH_FIRST_STEP]: (
    state: Step,
    value: Question[]
  ) => {
    state[SecondaryStep.firstStep] = value;
  },
  [MUTATIONS_TYPES.SET_APPROACH_SECOND_STEP]: (
    state: Step,
    value: Question[]
  ) => {
    state[SecondaryStep.secondStep] = value;
  },
  [MUTATIONS_TYPES.SET_APPROACH_FIELD]: (
    state: Step,
    value: { text: string; key: ApproachFields; secondaryStep: SecondaryStep }
  ) =>
    (state[value.secondaryStep][
      state[value.secondaryStep].findIndex(
        question => question.id === value.key
      )
    ].answer = value.text)
};
