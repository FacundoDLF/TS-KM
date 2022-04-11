import { MUTATIONS_TYPES, ACTIONS_TYPES } from "./types";
import { ACTIONS_TYPES as UI_ACTIONS_TYPES } from "@/store/modules/ui/types";
import { MUTATIONS_TYPES as SELECTED_CASE_MUTATIONS_TYPES } from "@/store/modules/selectedCase/types";
import { MUTATIONS_TYPES as GLOBAL_MUTATIONS_TYPES } from "@/store/types";
import _ from "lodash";
import { RootStateWithModulesState } from "@/store";
import { ActionContext } from "vuex";
import { ResultsFields } from "@/constants/resultsFields";
import Service from "@/service";
import {
  Step,
  SecondaryStep,
  MetricOption,
  PrimaryStep,
  MetricsSection,
  QuestionType,
  MetricValue,
  Question,
  Metric
} from "@/types";
import findQuestionInState from "@/helpers/findQuestionInState";

export default {
  async [ACTIONS_TYPES.CHANGE_RESULTS_FIELD](
    {
      dispatch,
      commit,
      rootState
    }: ActionContext<Step, RootStateWithModulesState>,
    {
      value,
      step,
      key,
      isForcedSave,
      isAssigningProp,
      property
    }: {
      value: string | number;
      step: SecondaryStep;
      key: ResultsFields;
      isForcedSave: boolean;
      isAssigningProp: boolean;
      property: MetricOption;
    }
  ) {
    const patchField = async () => {
      commit(GLOBAL_MUTATIONS_TYPES.SET_IS_SESSION_EXPIRED, false, {
        root: true
      });
      const data = JSON.stringify([
        { op: "replace", path: `/${key}`, value: `${value}` }
      ]);
      const appContext = {
        commit,
        dispatch,
        token: rootState.accessToken,
        action: ACTIONS_TYPES.CHANGE_RESULTS_FIELD,
        payload: {
          value,
          step,
          key,
          isForcedSave
        },
        withErrorMessage: true
      };
      await Service(appContext).patch(
        `/cases/${encodeURIComponent(rootState.selectedCase.caseId)}`,
        data
      );
      dispatch(
        `ui/${UI_ACTIONS_TYPES.SHOW_MESSAGE}`,
        {
          text: "Your changes are being saved",
          position: "top-center",
          duration: 2000
        },
        { root: true }
      );
      if (!isForcedSave) {
        commit(
          `selectedCase/${SELECTED_CASE_MUTATIONS_TYPES.REMOVE_ERROR}`,
          findQuestionInState(rootState.selectedCase.results, key),
          { root: true }
        );
      }
    };
    const patchMetric = async () => {
      commit(GLOBAL_MUTATIONS_TYPES.SET_IS_SESSION_EXPIRED, false, {
        root: true
      });
      commit(MUTATIONS_TYPES.ASSIGN_RESULTS_FIELDS_VALUES, {
        path: property,
        value,
        key,
        secondaryStep: step
      });
      dispatch(ACTIONS_TYPES.PATCH_METRIC_VALUES);
      const appContext = {
        commit,
        dispatch,
        token: rootState.accessToken,
        action: ACTIONS_TYPES.CHANGE_RESULTS_FIELD,
        payload: {
          value,
          step,
          key,
          isForcedSave,
          isAssigningProp
        },
        withErrorMessage: true
      };
      // We need to force the null value in order to match with the patch library
      commit(
        `selectedCase/${SELECTED_CASE_MUTATIONS_TYPES.REMOVE_ERROR}`,
        findQuestionInState(rootState.selectedCase.results, key),
        { root: true }
      );
    };
    if (!isAssigningProp) {
      if (
        findQuestionInState(rootState.selectedCase.results, key)?.answer !==
          value ||
        isForcedSave
      ) {
        commit(MUTATIONS_TYPES.SET_RESULTS_FIELD, {
          text: value,
          key,
          secondaryStep: step
        });
        if (!isForcedSave) {
          commit(MUTATIONS_TYPES.SET_RESULTS_FIELD, {
            text: value,
            key,
            secondaryStep: step
          });
        }
        patchField();
      }
    } else {
      if (
        findQuestionInState(rootState.selectedCase.results, key)?.answer[
          property
        ] !== value &&
        !(
          findQuestionInState(rootState.selectedCase.results, key)?.answer[
            property
          ] === null && !value
        )
      ) {
        patchMetric();
      }
    }
  },
  [ACTIONS_TYPES.CHECK_METRIC_ERRORS]({
    commit,
    state
  }: ActionContext<Step, RootStateWithModulesState>) {
    Object.values(state).forEach((questions: Question[]) => {
      questions.forEach((question: Question) => {
        if (
          (question.isMetric &&
            (question.answer as MetricValue).startDateValue &&
            !(question.answer as MetricValue).endDateValue) ||
          (!(question.answer as MetricValue).startDateValue &&
            (question.answer as MetricValue).endDateValue)
        ) {
          commit(
            `selectedCase/${SELECTED_CASE_MUTATIONS_TYPES.ADD_ERROR}`,
            {
              question: findQuestionInState(state, question.id),
              message: `This field is required`
            },
            { root: true }
          );
        }
      });
    });
  },
  [ACTIONS_TYPES.PUSH_METRIC](
    { commit }: ActionContext<Step, RootStateWithModulesState>,
    {
      metricName,
      metricSection,
      secondaryStep
    }: {
      metricName: string;
      metricSection: MetricsSection;
      secondaryStep: SecondaryStep;
    }
  ) {
    commit(MUTATIONS_TYPES.ADD_METRIC, {
      id: metricName,
      type: QuestionType.range,
      title: metricName,
      isRequired: false,
      error: "",
      answer: { startDateValue: null, endDateValue: null },
      questionParent: PrimaryStep.results,
      questionStep: secondaryStep,
      isMetric: true,
      isFinancialMetric: secondaryStep === SecondaryStep.firstStep,
      financialMetricsArea: metricSection,
      created: true
    });
  },
  async [ACTIONS_TYPES.DELETE_METRIC](
    { commit, dispatch }: ActionContext<Step, RootStateWithModulesState>,
    {
      id,
      secondaryStep
    }: {
      id: string;
      secondaryStep: SecondaryStep;
    }
  ) {
    commit(MUTATIONS_TYPES.REMOVE_METRIC, { id, secondaryStep });
    dispatch(ACTIONS_TYPES.PATCH_METRIC_VALUES);
  },
  [ACTIONS_TYPES.EDIT_METRIC](
    { commit, dispatch }: ActionContext<Step, RootStateWithModulesState>,
    {
      step,
      key,
      financialMetricsArea,
      title
    }: {
      step: SecondaryStep;
      key: string;
      financialMetricsArea: MetricsSection;
      title: string;
    }
  ) {
    commit(MUTATIONS_TYPES.ASSIGN_METRIC_TITLE, {
      value: title,
      key,
      secondaryStep: step
    });
    commit(MUTATIONS_TYPES.ASSIGN_METRIC_SECTION, {
      value: financialMetricsArea,
      key,
      secondaryStep: step
    });
    dispatch(ACTIONS_TYPES.PATCH_METRIC_VALUES);
  },
  [ACTIONS_TYPES.POPULATE_METRIC_VALUE](
    { commit }: ActionContext<Step, RootStateWithModulesState>,
    {
      id,
      startDateValue,
      endDateValue,
      secondaryStep
    }: {
      id: string;
      startDateValue: number;
      endDateValue: number;
      secondaryStep: SecondaryStep;
    }
  ) {
    if (startDateValue) {
      commit(MUTATIONS_TYPES.ASSIGN_RESULTS_FIELDS_VALUES, {
        path: MetricOption.startDateValue,
        value: startDateValue,
        key: id,
        secondaryStep
      });
    }
    if (endDateValue) {
      commit(MUTATIONS_TYPES.ASSIGN_RESULTS_FIELDS_VALUES, {
        path: MetricOption.endDateValue,
        value: endDateValue,
        key: id,
        secondaryStep
      });
    }
  },
  async [ACTIONS_TYPES.PATCH_METRIC_VALUES]({
    dispatch,
    commit,
    state,
    rootState
  }: ActionContext<Step, RootStateWithModulesState>) {
    commit(GLOBAL_MUTATIONS_TYPES.SET_IS_SESSION_EXPIRED, false, {
      root: true
    });
    const metricsQuestion: Metric[] = [];
    Object.values(state).map((step: Question[]) => {
      return step
        .filter((question: Question) => {
          return question.isMetric;
        })
        .forEach((metricQuestion: Question) => {
          if (
            (metricQuestion.answer as MetricValue)[
              MetricOption.startDateValue
            ] ||
            (metricQuestion.answer as MetricValue)[MetricOption.endDateValue]
          ) {
            metricsQuestion.push({
              name: metricQuestion.title,
              startDateValue: (metricQuestion.answer as MetricValue)[
                MetricOption.startDateValue
              ],
              endDateValue: (metricQuestion.answer as MetricValue)[
                MetricOption.endDateValue
              ],
              isFinancialMetric: metricQuestion.isFinancialMetric,
              financialMetricsArea: metricQuestion.financialMetricsArea
            });
          }
        });
    });
    const data = JSON.stringify([
      {
        op: "replace",
        path: `/metrics`,
        value: metricsQuestion.length ? metricsQuestion : null
      }
    ]);
    const appContext = {
      commit,
      dispatch,
      token: rootState.accessToken,
      action: ACTIONS_TYPES.PATCH_METRIC_VALUES,
      withErrorMessage: true
    };
    await Service(appContext).patch(
      `/cases/${encodeURIComponent(rootState.selectedCase.caseId)}`,
      data
    );
    dispatch(
      `ui/${UI_ACTIONS_TYPES.SHOW_MESSAGE}`,
      {
        text: "Your changes are being saved",
        type: "success",
        position: "top-center",
        duration: 2000
      },
      { root: true }
    );
  }
};
