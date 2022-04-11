import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";
import { Module } from "vuex";
import { RootStateWithModulesState } from "../../";
import clientInformation from "./clientInformation";
import situation from "./situation";
import approach from "./approach";
import results from "./results";
import { SelectedCase, Step } from "@/types";

export interface SelectedCaseWithModulesState extends SelectedCase {
  primaryStep: string;
  secondaryStep: number;
  thirdStep: number;
  clientInformation: Step;
  situation: Step;
  approach: Step;
  results: Step;
  errorInStep: Step;
  isError: boolean;
  forceStarterText: boolean;
  isFetchingClientInfo: boolean;
  editMode: boolean;
  collections: object;
  file?: {
    name: string;
    data: string;
  };
}

const module: Module<
  SelectedCaseWithModulesState,
  RootStateWithModulesState
> = {
  namespaced: true,
  state: () =>
    ({
      primaryStep: "",
      secondaryStep: 0,
      thirdStep: 0,
      isError: false,
      forceStarterText: false,
      isFetchingClientInfo: false,
      editMode: false,
      collections: {},
      file: undefined
    } as SelectedCaseWithModulesState),
  modules: {
    clientInformation,
    situation,
    approach,
    results
  },
  getters,
  mutations,
  actions
};

export default module;
