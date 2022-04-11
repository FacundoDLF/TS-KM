import { MUTATIONS_TYPES } from "./types";
import { ClientInfoFields } from "@/constants/clientInfoFields";
import { Question, SecondaryStep, Step } from "@/types";

export default {
  [MUTATIONS_TYPES.SET_CLIENT_INFO_FIRST_STEP]: (
    state: Step,
    value: Question[]
  ) => {
    state[SecondaryStep.firstStep] = value;
  },
  [MUTATIONS_TYPES.SET_CLIENT_INFO_SECOND_STEP]: (
    state: Step,
    value: Question[]
  ) => {
    state[SecondaryStep.secondStep] = value;
  },
  [MUTATIONS_TYPES.SET_CLIENT_INFO_FIELD]: (
    state: Step,
    payload: {
      value: string | string[];
      key: ClientInfoFields;
      secondaryStep: SecondaryStep;
    }
  ) =>
    (state[payload.secondaryStep][
      state[payload.secondaryStep].findIndex(
        question => question.id === payload.key
      )
    ].answer = payload.value)
};
