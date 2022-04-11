import { RootStateWithModulesState } from "./";
import { Routes } from "@/constants/routes";
import { PrimaryStepTab } from "@/types/";

export default {
  activePrimaryStep: (
    state: RootStateWithModulesState
  ): PrimaryStepTab | undefined =>
    state.primaryStepTabs.find(tab =>
      state.currentRoutePath.includes(tab.route)
    ),
  numberOfSteps: (state: RootStateWithModulesState): number | undefined => {
    if (state.currentRoutePath.includes(Routes.SITUATION)) {
      return 3;
    } else if (state.currentRoutePath.includes(Routes.RESULTS)) {
      return 3;
    } else if (state.currentRoutePath.includes(Routes.APPROACH)) {
      return 1;
    } else if (state.currentRoutePath.includes(Routes.AVAILABLE_CASE_DATA)) {
      return 1;
    }
  },
  absoluteSecondaryStepNumber: (
    state: RootStateWithModulesState
  ): number | undefined => {
    if (
      state.currentRoutePath.includes(Routes.AVAILABLE_CASE_DATA) &&
      state.selectedCase.secondaryStep === 1
    ) {
      return 0;
    } else if (
      state.currentRoutePath.includes(Routes.SITUATION) &&
      state.selectedCase.secondaryStep === 1
    ) {
      return 1;
    } else if (
      state.currentRoutePath.includes(Routes.SITUATION) &&
      state.selectedCase.secondaryStep === 2
    ) {
      return 2;
    } else if (
      state.currentRoutePath.includes(Routes.SITUATION) &&
      state.selectedCase.secondaryStep === 3
    ) {
      return 3;
    } else if (state.currentRoutePath.includes(Routes.APPROACH)) {
      return 4;
    } else if (
      state.currentRoutePath.includes(Routes.RESULTS) &&
      state.selectedCase.secondaryStep === 1
    ) {
      return 5;
    } else if (
      state.currentRoutePath.includes(Routes.RESULTS) &&
      state.selectedCase.secondaryStep === 2
    ) {
      return 6;
    } else if (
      state.currentRoutePath.includes(Routes.RESULTS) &&
      state.selectedCase.secondaryStep === 3
    ) {
      return 7;
    }
  },
  employees: (state: RootStateWithModulesState) => state.employees,
  isLegacyCaseSelected: (state: RootStateWithModulesState) =>
    state.casesToExport.some(aCase => aCase.isLegacy)
};
