import { MUTATIONS_TYPES } from "./types";
import { SelectedCaseWithModulesState } from "./";
import { Question, SelectedCase } from "@/types";

export default {
  [MUTATIONS_TYPES.SET_PRIMARY_STEP]: (
    state: SelectedCaseWithModulesState,
    value: string
  ) => (state["primaryStep"] = value),
  [MUTATIONS_TYPES.SET_SECONDARY_STEP]: (
    state: SelectedCaseWithModulesState,
    value: number
  ) => (state["secondaryStep"] = value),
  [MUTATIONS_TYPES.SET_THIRD_STEP]: (
    state: SelectedCaseWithModulesState,
    value: number
  ) => (state["thirdStep"] = value),
  [MUTATIONS_TYPES.SET_IS_ERROR]: (
    state: SelectedCaseWithModulesState,
    value: boolean
  ) => (state["isError"] = value),
  [MUTATIONS_TYPES.ADD_ERROR]: (
    state: SelectedCaseWithModulesState,
    { question, message }: { question: Question; message: string }
  ) =>
    (state[question.questionParent][question.questionStep][
      state[question.questionParent][question.questionStep].findIndex(
        (i: Question) => i.id === question.id
      )
    ].error = message),
  [MUTATIONS_TYPES.REMOVE_ERROR]: (
    state: SelectedCaseWithModulesState,
    question: Question
  ) =>
    (state[question.questionParent][question.questionStep][
      state[question.questionParent][question.questionStep].findIndex(
        (i: Question) => i.id === question.id
      )
    ].error = ""),
  [MUTATIONS_TYPES.SET_EDIT_MODE]: (
    state: SelectedCaseWithModulesState,
    value: boolean
  ) => (state["editMode"] = value),
  [MUTATIONS_TYPES.FETCH_FILE]: (
    state: SelectedCaseWithModulesState,
    file: string
  ) => {
    state.file = {
      name: "chart-uploaded",
      data: file
    };
  },
  [MUTATIONS_TYPES.DELETE_FILE]: (state: SelectedCaseWithModulesState) => {
    state.file = undefined;
  },
  [MUTATIONS_TYPES.SET_IS_FETCHING_CLIENT_INFO]: (
    state: SelectedCaseWithModulesState,
    value: boolean
  ) => (state["isFetchingClientInfo"] = value)
};
