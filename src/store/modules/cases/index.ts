import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";
import { SelectedCase } from "@/types";

export interface State {
  casesList: SelectedCase[];
}

export default {
  namespaced: true,
  state: () =>
    ({
      casesList: []
    } as State),
  getters,
  mutations,
  actions
};
