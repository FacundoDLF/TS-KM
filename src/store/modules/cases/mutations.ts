import { MUTATIONS_TYPES } from "./types";
import { State } from "./";
import { SelectedCase } from "@/types";

export default {
  [MUTATIONS_TYPES.SET_CASES_LIST]: (state: State, value: SelectedCase[]) =>
    (state["casesList"] = value)
};
