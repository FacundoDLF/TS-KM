import getters from "./getters";
import actions from "./actions";
import mutations from "./mutations";
import { RootStateWithModulesState } from "@/store";
import { Module } from "vuex";
import { Step, SecondaryStep } from "@/types";

const module: Module<Step, RootStateWithModulesState> = {
  namespaced: true,
  state: () =>
    ({
      [SecondaryStep.firstStep]: [],
      [SecondaryStep.secondStep]: [],
      [SecondaryStep.thirdStep]: []
    } as Step),
  getters,
  mutations,
  actions
};

export default module;
