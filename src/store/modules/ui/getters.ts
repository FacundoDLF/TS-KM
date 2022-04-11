import { RootStateWithModulesState } from "@/store";
import { UIState } from "./";
import { Routes } from "@/constants/routes";

export default {
  showPrimaryStepAndFooterInLayout: (
    state: UIState,
    getters: any,
    rootState: RootStateWithModulesState
  ): boolean =>
    rootState.currentRoutePath.includes(Routes.AVAILABLE_CASE_DATA) ||
    rootState.currentRoutePath.includes(Routes.APPROACH) ||
    rootState.currentRoutePath.includes(Routes.RESULTS) ||
    rootState.currentRoutePath.includes(Routes.SITUATION),
  showClientInformation: (
    state: UIState,
    getters: any,
    rootState: RootStateWithModulesState
  ): boolean =>
    rootState.currentRoutePath.includes(Routes.APPROACH) ||
    rootState.currentRoutePath.includes(Routes.RESULTS) ||
    rootState.currentRoutePath.includes(Routes.SITUATION) ||
    (rootState.currentRoutePath !== Routes.MY_CASES &&
      rootState.currentRoutePath.includes(Routes.MY_CASES)),
  showPrimaryStepLayout: (
    state: UIState,
    getters: any,
    rootState: RootStateWithModulesState
  ): boolean => rootState.currentRoutePath.includes(Routes.ERROR_IN_STEP)
};
