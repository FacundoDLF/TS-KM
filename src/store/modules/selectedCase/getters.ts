import { SelectedCaseWithModulesState } from "./";
import { RootStateWithModulesState } from "@/store";
import { Routes } from "@/constants/routes";
import { CaseStatus, MetricValue, UserRoles } from "@/types";
import _ from "lodash";

const FAS_COMMUNITY_ID = 4;

export default {
  caseData: (state: SelectedCaseWithModulesState, getters: any) => {
    const clientInfo = getters["clientInformation/answers"];
    return {
      clientInformation: getters["clientInformation/answers"],
      situation: getters["situation/answers"],
      approach: getters["approach/answers"],
      results: getters["results/answers"],
      client: state.client,
      revenue: state.estimatedRevenue,
      communities: state.communities,
      attachment: state.file?.data ?? "",
      projectName: state.projectName,
      offerings: clientInfo.offerings,
      countries: clientInfo.countries,
      industries: clientInfo.industries,
      startDate: clientInfo.startDate,
      endDate: clientInfo.endDate
      // offerings: state.offerings,
      // countries: state.countries,
      // industries: state.industries,
      // startDate: state.startDate,
      // endDate: state.endDate
    };
  },
  errorsInFirstStep: (
    state: SelectedCaseWithModulesState,
    getters: any,
    rootState: RootStateWithModulesState
  ): boolean => {
    if (rootState.currentRoutePath.includes(Routes.SITUATION)) {
      return getters["situation/situationErrorsFirstStep"];
    } else if (rootState.currentRoutePath.includes(Routes.APPROACH)) {
      return getters["approach/approachErrorsFirstStep"];
    } else if (rootState.currentRoutePath.includes(Routes.RESULTS)) {
      return getters["results/resultsErrorsFirstStep"];
    } else if (
      rootState.currentRoutePath.includes(Routes.AVAILABLE_CASE_DATA)
    ) {
      return getters["clientInformation/clientInfoErrorsFirstStep"];
    } else return false;
  },
  errorsInSecondStep: (
    state: SelectedCaseWithModulesState,
    getters: any,
    rootState: RootStateWithModulesState
  ): boolean => {
    if (rootState.currentRoutePath.includes(Routes.SITUATION)) {
      return getters["situation/situationErrorsSecondStep"];
    } else if (rootState.currentRoutePath.includes(Routes.APPROACH)) {
      return getters["approach/approachErrorsSecondStep"];
    } else if (rootState.currentRoutePath.includes(Routes.RESULTS)) {
      return getters["results/resultsErrorsSecondStep"];
    } else return false;
  },
  errorsInThirdStep: (
    state: SelectedCaseWithModulesState,
    getters: any,
    rootState: RootStateWithModulesState
  ): boolean => {
    if (rootState.currentRoutePath.includes(Routes.SITUATION))
      return getters["situation/situationErrorsThirdStep"];
    if (rootState.currentRoutePath.includes(Routes.RESULTS))
      return getters["results/resultsErrorsThirdStep"];
    else return false;
  },
  errorsInForm: (state: SelectedCaseWithModulesState, getters: any): boolean =>
    !!(
      getters["clientInformation/clientInfoErrorsFirstStep"] ||
      getters["approach/approachErrorsFirstStep"] ||
      getters["approach/approachErrorsSecondStep"] ||
      getters["results/resultsErrorsFirstStep"] ||
      getters["results/resultsErrorsSecondStep"] ||
      getters["results/resultsErrorsThirdStep"] ||
      getters["situation/situationErrorsFirstStep"] ||
      getters["situation/situationErrorsSecondStep"] ||
      getters["situation/situationErrorsThirdStep"]
    ),
  situationStatus: (
    state: SelectedCaseWithModulesState,
    getters: any
  ): number => {
    let accum = 0;
    let count = 0;

    state.situation.firstStep.map(question => {
      question.isRequired && (count += 1);
      question.isRequired && question.answer !== "" && (accum += 1);
    });
    state.situation.secondStep.map(question => {
      question.isRequired && (count += 1);
      question.isRequired && question.answer !== "" && (accum += 1);
    });
    if (getters["isFasCase"])
      state.situation.thirdStep.map(question => {
        question.isRequired && (count += 1);
        if (Array.isArray(question.answer))
          question.isRequired && question.answer.length && (accum += 1);
        else
          question.isRequired &&
            question.answer &&
            question.answer !== "" &&
            (accum += 1);
      });
    return Math.round((accum * 100) / count);
  },
  approachStatus: (state: SelectedCaseWithModulesState): number => {
    let accum = 0;
    let count = 0;

    state.approach.firstStep.map(question => {
      question.isRequired && (count += 1);
      question.isRequired && question.answer !== "" && (accum += 1);
    });
    state.approach.secondStep.map(question => {
      question.isRequired && (count += 1);
      question.isRequired && question.answer !== "" && (accum += 1);
    });

    return Math.round((accum * 100) / count);
  },
  clientInfoStatus: (state: SelectedCaseWithModulesState): number => {
    let accum = 0;
    let count = 0;

    state.clientInformation.firstStep.map(question => {
      question.isRequired && (count += 1);
      if (Array.isArray(question.answer))
        question.isRequired && question.answer.length && (accum += 1);
      else question.isRequired && question.answer !== "" && (accum += 1);
    });

    return Math.round((accum * 100) / count);
  },
  resultsStatus: (state: SelectedCaseWithModulesState): number => {
    let accum = 0;
    let count = 0;

    state.results.firstStep.map(question => {
      if (question.isMetric) {
        const start = (question.answer as MetricValue).startDateValue;
        const end = (question.answer as MetricValue).endDateValue;
        (start || end) && (count += 1);
        start && end && (accum += 1);
      }

      question.isRequired && (count += 1);
      question.isRequired && question.answer !== "" && (accum += 1);
    });
    state.results.secondStep.map(question => {
      if (question.isMetric) {
        const start = (question.answer as MetricValue).startDateValue;
        const end = (question.answer as MetricValue).endDateValue;
        (start || end) && (count += 1);
        start && end && (accum += 1);
      }

      question.isRequired && (count += 1);
      question.isRequired && question.answer !== "" && (accum += 1);
    });
    state.results.thirdStep &&
      state.results.thirdStep.length &&
      state.results.thirdStep.map(question => {
        question.isRequired && (count += 1);
        question.isRequired && question.answer !== "" && (accum += 1);
      });
    return count === 0 ? 0 : Math.round((accum * 100) / count);
  },
  isFasCase: (state: SelectedCaseWithModulesState) => {
    return (
      state.communities?.length == 1 &&
      state.communities[0].communityId == FAS_COMMUNITY_ID
    );
  },
  userRole: (
    state: SelectedCaseWithModulesState,
    getters: any,
    rootState: RootStateWithModulesState
  ): UserRoles | undefined => {
    if (
      rootState.user.userId &&
      (rootState.selectedCase.author?.userId ||
        rootState.selectedCase.reviewerMD?.userId)
    ) {
      return rootState.user.userId === rootState.selectedCase.author.userId
        ? UserRoles.author
        : UserRoles.reviewer;
    }
  },
  inputStarterText: (state: SelectedCaseWithModulesState) => (
    inputKey: string
  ): string | undefined => {
    if (!state.starterTexts) return;
    return state.starterTexts[inputKey];
  },
  isEditableCase: (state: SelectedCaseWithModulesState): boolean =>
    state.status === CaseStatus.opened,
  caseStatus: (state: SelectedCaseWithModulesState, getters: any): number => {
    return Math.round(
      ((getters.clientInfoStatus +
        getters.approachStatus +
        getters.situationStatus +
        getters.resultsStatus) /
        400) *
        100
    );
  }
};
