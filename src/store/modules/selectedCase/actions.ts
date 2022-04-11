import { MUTATIONS_TYPES, ACTIONS_TYPES } from "./types";
import {
  MUTATIONS_TYPES as GLOBAL_MUTATIONS_TYPES,
  ACTIONS_TYPES as GLOBAL_ACTIONS_TYPES
} from "@/store/types";
import {
  ModalComponents,
  ACTIONS_TYPES as MODAL_ACTIONS_TYPES
} from "../modal/types";
import { MUTATIONS_TYPES as SITUATION_MUTATIONS_TYPES } from "./situation/types";
import { MUTATIONS_TYPES as APPROACH_MUTATIONS_TYPES } from "./approach/types";
import { MUTATIONS_TYPES as CLIENT_INFO_MUTATIONS_TYPES } from "./clientInformation/types";
import {
  MUTATIONS_TYPES as RESULTS_MUTATIONS_TYPES,
  ACTIONS_TYPES as RESULTS_ACTIONS_TYPES
} from "./results/types";
import { RootStateWithModulesState } from "@/store";
import { SelectedCaseWithModulesState } from "./";
import { ActionContext } from "vuex";
import { Routes } from "@/constants/routes";
import findQuestionInState from "@/helpers/findQuestionInState";
import findMetricByName from "@/helpers/findMetricByName";
import getChangeFieldActions from "@/helpers/getChangeFieldActions";
import _ from "lodash";
import router from "@/router";
import Service from "@/service";
import { SituationFields } from "@/constants/situationFields";
import { ApproachFields } from "@/constants/approachFields";
import { ResultsFields } from "@/constants/resultsFields";
import { ClientInfoFields } from "@/constants/clientInfoFields";
import QuestionsData from "@/data/QuestionsData";
import {
  CaseStatus,
  MetricsSection,
  PrimaryStep,
  SecondaryStep,
  Question,
  Metric,
  FasLawFirm
} from "@/types";
import { UserRoles } from "@/types";
import { getPptByName, PptNames, PptTypes } from "@/helpers/generatePpt";

export default {
  [ACTIONS_TYPES.SET_CASE_QUESTIONS]({
    commit
  }: ActionContext<SelectedCaseWithModulesState, RootStateWithModulesState>) {
    commit(
      `selectedCase/clientInformation/${CLIENT_INFO_MUTATIONS_TYPES.SET_CLIENT_INFO_FIRST_STEP}`,
      QuestionsData.filter(
        question =>
          question.questionParent === PrimaryStep.clientInformation &&
          question.questionStep === SecondaryStep.firstStep
      ),
      { root: true }
    );
    commit(
      `selectedCase/situation/${SITUATION_MUTATIONS_TYPES.SET_SITUATION_FIRST_STEP}`,
      QuestionsData.filter(
        question =>
          question.questionParent === PrimaryStep.situation &&
          question.questionStep === SecondaryStep.firstStep
      ),
      { root: true }
    );
    commit(
      `selectedCase/situation/${SITUATION_MUTATIONS_TYPES.SET_SITUATION_SECOND_STEP}`,
      QuestionsData.filter(
        question =>
          question.questionParent === PrimaryStep.situation &&
          question.questionStep === SecondaryStep.secondStep
      ),
      { root: true }
    );
    commit(
      `selectedCase/situation/${SITUATION_MUTATIONS_TYPES.SET_SITUATION_THIRD_STEP}`,
      QuestionsData.filter(
        question =>
          question.questionParent === PrimaryStep.situation &&
          question.questionStep === SecondaryStep.thirdStep
      ),
      { root: true }
    );
    commit(
      `selectedCase/approach/${APPROACH_MUTATIONS_TYPES.SET_APPROACH_FIRST_STEP}`,
      QuestionsData.filter(
        question =>
          question.questionParent === PrimaryStep.approach &&
          question.questionStep === SecondaryStep.firstStep
      ),
      { root: true }
    );
    commit(
      `selectedCase/approach/${APPROACH_MUTATIONS_TYPES.SET_APPROACH_SECOND_STEP}`,
      QuestionsData.filter(
        question =>
          question.questionParent === PrimaryStep.approach &&
          question.questionStep === SecondaryStep.secondStep
      ),
      { root: true }
    );
    commit(
      `selectedCase/results/${RESULTS_MUTATIONS_TYPES.SET_RESULTS_FIRST_STEP}`,
      QuestionsData.filter(
        question =>
          question.questionParent === PrimaryStep.results &&
          question.questionStep === SecondaryStep.firstStep
      ),
      { root: true }
    );
    commit(
      `selectedCase/results/${RESULTS_MUTATIONS_TYPES.SET_RESULTS_SECOND_STEP}`,
      QuestionsData.filter(
        question =>
          question.questionParent === PrimaryStep.results &&
          question.questionStep === SecondaryStep.secondStep
      ),
      { root: true }
    );
    commit(
      `selectedCase/results/${RESULTS_MUTATIONS_TYPES.SET_RESULTS_THIRD_STEP}`,
      QuestionsData.filter(
        question =>
          question.questionParent === PrimaryStep.results &&
          question.questionStep === SecondaryStep.thirdStep
      ),
      { root: true }
    );
  },
  [ACTIONS_TYPES.CHANGE_SECONDARY_STEP](
    {
      dispatch,
      commit
    }: ActionContext<SelectedCaseWithModulesState, RootStateWithModulesState>,
    value: number
  ) {
    let newURL = "";
    switch (value) {
      case 0:
        newURL = `${Routes.MY_CASES}/${router.currentRoute.params.id +
          Routes.AVAILABLE_CASE_DATA}/1`;
        break;
      case 1:
        newURL = `${Routes.MY_CASES}/${router.currentRoute.params.id +
          Routes.SITUATION}/1`;
        break;
      case 2:
        newURL = `${Routes.MY_CASES}/${router.currentRoute.params.id +
          Routes.SITUATION}/2`;
        break;
      case 3:
        newURL = `${Routes.MY_CASES}/${router.currentRoute.params.id +
          Routes.SITUATION}/3`;
        break;
      case 4:
        newURL = `${Routes.MY_CASES}/${router.currentRoute.params.id +
          Routes.APPROACH}/1`;
        break;
      case 5:
        newURL = `${Routes.MY_CASES}/${router.currentRoute.params.id +
          Routes.RESULTS}/1`;
        break;
      case 6:
        newURL = `${Routes.MY_CASES}/${router.currentRoute.params.id +
          Routes.RESULTS}/2`;
        break;
      case 7:
        newURL = `${Routes.MY_CASES}/${router.currentRoute.params.id +
          Routes.RESULTS}/3`;
        break;
      case 8:
        newURL = `${Routes.MY_CASES}/${router.currentRoute.params.id +
          Routes.ERROR_IN_STEP}/1`;
        break;
      default:
        break;
    }
    dispatch(GLOBAL_ACTIONS_TYPES.ROUTER_REPLACE, newURL, { root: true });
    commit(MUTATIONS_TYPES.SET_SECONDARY_STEP, value);
  },
  async [ACTIONS_TYPES.FETCH_CASE_DETAILS](
    {
      commit,
      dispatch,
      getters,
      state,
      rootState
    }: ActionContext<SelectedCaseWithModulesState, RootStateWithModulesState>,
    caseId: number
  ) {
    commit(GLOBAL_MUTATIONS_TYPES.SET_IS_FETCHING, true, { root: true });
    commit(
      `selectedCase/${MUTATIONS_TYPES.SET_IS_FETCHING_CLIENT_INFO}`,
      true,
      {
        root: true
      }
    );
    commit(GLOBAL_MUTATIONS_TYPES.SET_IS_SESSION_EXPIRED, true, { root: true });
    if (!rootState.accessToken) {
      await dispatch(GLOBAL_ACTIONS_TYPES.GET_USER_BY_TOKEN, null, {
        root: true
      });
    }
    const appContext = {
      commit,
      dispatch,
      token: rootState.accessToken,
      action: ACTIONS_TYPES.FETCH_CASE_DETAILS,
      payload: {},
      withErrorMessage: false
    };
    const response = await Service(appContext).get(
      `/cases/${encodeURIComponent(caseId)}`
    );
    commit(`selectedCase/${MUTATIONS_TYPES.SET_IS_ERROR}`, false, {
      root: true
    });
    const caseData = response.data;
    const lawFirms = caseData.fasLawFirms.filter(
      (f: FasLawFirm) => !f.isOpposing
    );
    const opposingLawFirms = caseData.fasLawFirms.filter(
      (f: FasLawFirm) => f.isOpposing
    );
    commit(
      GLOBAL_MUTATIONS_TYPES.SET_SELECTED_CASE,
      {
        addreseableSpend: caseData.addreseableSpend || 0,
        author: caseData.author || {},
        baseline: caseData.baseline || "",
        businessUnits: caseData.businessUnits || [""],
        capIQId: caseData.capIQId || "",
        caseId,
        client: caseData.client || {},
        communities: caseData.communities || [""],
        decisionMakers: caseData.decisionMakers || "",
        eliteClientCode: caseData.eliteClientCode || "",
        estimatedRevenue: caseData.estimatedRevenue || 0,
        fasCaseCitation: caseData.fasCaseCitation || "",
        fasJurisdiction: caseData.fasJurisdiction || "",
        fasLawFirms: lawFirms || [],
        fasOpposingExpert: caseData.fasOpposingExpert || "",
        fasOpposingExpertHourlyFee: caseData.fasOpposingExpertHourlyFee || "",
        fasOpposingExpertReportDate: caseData.fasOpposingExpertReportDate || "",
        fasOpposingLawFirms: opposingLawFirms || [],
        fasRegulatoryAgencies: caseData.fasRegulatoryAgencies || [],
        fasTerms: caseData.fasTerms || [],
        isELAllowDiscloseability: caseData.isELAllowDiscloseability || false,
        isLogoAndNameOk: caseData.isLogoAndNameOk || false,
        isLegacy: caseData.isLegacy || false,
        lastStatusChangeDate: caseData.lastStatusChangeDate || "",
        legacyManagerDirectors: caseData.legacyManagerDirectors,
        legacyTeamMembers: caseData.legacyTeamMembers,
        outcomeSaving: caseData.outcomeSaving || 0,
        projectDescription: caseData.projectDescription || "",
        projectName: caseData.projectName || "",
        projectNameEditable: caseData.projectNameEditable || "",
        radiusId: caseData.radiusId || "",
        reviewerBIC: caseData.reviewerBIC || {},
        reviewerIndustryLeader: caseData.reviewerIndustryLeader || {},
        reviewerMD: caseData.reviewerMD || {},
        starterTexts: caseData.starterTexts,
        status: caseData.status || 0,
        team: caseData.team || [],
        weeksDuration: caseData.weeksDuration || 0
      },
      { root: true }
    );
    commit(
      `selectedCase/clientInformation/${CLIENT_INFO_MUTATIONS_TYPES.SET_CLIENT_INFO_FIELD}`,
      {
        value: caseData.client[ClientInfoFields.REVENUE] || "",
        key: ClientInfoFields.REVENUE,
        secondaryStep: findQuestionInState(
          state.clientInformation,
          ClientInfoFields.REVENUE
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/clientInformation/${CLIENT_INFO_MUTATIONS_TYPES.SET_CLIENT_INFO_FIELD}`,
      {
        value: caseData[ClientInfoFields.INDUSTRIES] || [] || null,
        key: ClientInfoFields.INDUSTRIES,
        secondaryStep: findQuestionInState(
          state.clientInformation,
          ClientInfoFields.INDUSTRIES
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/clientInformation/${CLIENT_INFO_MUTATIONS_TYPES.SET_CLIENT_INFO_FIELD}`,
      {
        value: caseData[ClientInfoFields.SEGMENTS] || [],
        key: ClientInfoFields.SEGMENTS,
        secondaryStep: findQuestionInState(
          state.clientInformation,
          ClientInfoFields.SEGMENTS
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/clientInformation/${CLIENT_INFO_MUTATIONS_TYPES.SET_CLIENT_INFO_FIELD}`,
      {
        value: caseData[ClientInfoFields.SERVICES] || [],
        key: ClientInfoFields.SERVICES,
        secondaryStep: findQuestionInState(
          state.clientInformation,
          ClientInfoFields.SERVICES
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/clientInformation/${CLIENT_INFO_MUTATIONS_TYPES.SET_CLIENT_INFO_FIELD}`,
      {
        value: caseData[ClientInfoFields.OFFERINGS] || [],
        key: ClientInfoFields.OFFERINGS,
        secondaryStep: findQuestionInState(
          state.clientInformation,
          ClientInfoFields.OFFERINGS
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/clientInformation/${CLIENT_INFO_MUTATIONS_TYPES.SET_CLIENT_INFO_FIELD}`,
      {
        value: caseData[ClientInfoFields.COUNTRIES] || [],
        key: ClientInfoFields.COUNTRIES,
        secondaryStep: findQuestionInState(
          state.clientInformation,
          ClientInfoFields.COUNTRIES
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/clientInformation/${CLIENT_INFO_MUTATIONS_TYPES.SET_CLIENT_INFO_FIELD}`,
      {
        value: caseData[ClientInfoFields.START_DATE] || "",
        key: ClientInfoFields.START_DATE,
        secondaryStep: findQuestionInState(
          state.clientInformation,
          ClientInfoFields.START_DATE
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/clientInformation/${CLIENT_INFO_MUTATIONS_TYPES.SET_CLIENT_INFO_FIELD}`,
      {
        value: caseData[ClientInfoFields.END_DATE] || "",
        key: ClientInfoFields.END_DATE,
        secondaryStep: findQuestionInState(
          state.clientInformation,
          ClientInfoFields.END_DATE
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/situation/${SITUATION_MUTATIONS_TYPES.SET_SITUATION_FIELD}`,
      {
        text: caseData[SituationFields.HEADLINE] || "",
        key: SituationFields.HEADLINE,
        secondaryStep: findQuestionInState(
          state.situation,
          SituationFields.HEADLINE
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/situation/${SITUATION_MUTATIONS_TYPES.SET_SITUATION_FIELD}`,
      {
        text: caseData[SituationFields.DESCRIPTION] || "",
        key: SituationFields.DESCRIPTION,
        secondaryStep: findQuestionInState(
          state.situation,
          SituationFields.DESCRIPTION
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/situation/${SITUATION_MUTATIONS_TYPES.SET_SITUATION_FIELD}`,
      {
        text: caseData[SituationFields.CHALLENGES] || "",
        key: SituationFields.CHALLENGES,
        secondaryStep: findQuestionInState(
          state.situation,
          SituationFields.CHALLENGES
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/situation/${SITUATION_MUTATIONS_TYPES.SET_SITUATION_FIELD}`,
      {
        text: caseData[SituationFields.HIRED_TO] || "",
        key: SituationFields.HIRED_TO,
        secondaryStep: findQuestionInState(
          state.situation,
          SituationFields.HIRED_TO
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/situation/${SITUATION_MUTATIONS_TYPES.SET_SITUATION_FIELD}`,
      {
        text: caseData[SituationFields.FAS_CASE_CITATION] || "",
        key: SituationFields.FAS_CASE_CITATION,
        secondaryStep: findQuestionInState(
          state.situation,
          SituationFields.FAS_CASE_CITATION
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/situation/${SITUATION_MUTATIONS_TYPES.SET_SITUATION_FIELD}`,
      {
        text: caseData[SituationFields.FAS_JURISDICTION] || "",
        key: SituationFields.FAS_JURISDICTION,
        secondaryStep: findQuestionInState(
          state.situation,
          SituationFields.FAS_JURISDICTION
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/situation/${SITUATION_MUTATIONS_TYPES.SET_SITUATION_FIELD}`,
      {
        text: caseData[SituationFields.FAS_REGULATORY_AGENCIES] || [],
        key: SituationFields.FAS_REGULATORY_AGENCIES,
        secondaryStep: findQuestionInState(
          state.situation,
          SituationFields.FAS_REGULATORY_AGENCIES
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/situation/${SITUATION_MUTATIONS_TYPES.SET_SITUATION_FIELD}`,
      {
        //text: caseData[SituationFields.FAS_LAW_FIRMS] || [],
        text: lawFirms || [],
        key: SituationFields.FAS_LAW_FIRMS,
        secondaryStep: findQuestionInState(
          state.situation,
          SituationFields.FAS_LAW_FIRMS
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/situation/${SITUATION_MUTATIONS_TYPES.SET_SITUATION_FIELD}`,
      {
        text: opposingLawFirms || [],
        key: SituationFields.FAS_OPPOSING_LAW_FIRMS,
        secondaryStep: findQuestionInState(
          state.situation,
          SituationFields.FAS_OPPOSING_LAW_FIRMS
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/situation/${SITUATION_MUTATIONS_TYPES.SET_SITUATION_FIELD}`,
      {
        text: caseData[SituationFields.FAS_TERMS] || [],
        key: SituationFields.FAS_TERMS,
        secondaryStep: findQuestionInState(
          state.situation,
          SituationFields.FAS_TERMS
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/situation/${SITUATION_MUTATIONS_TYPES.SET_SITUATION_FIELD}`,
      {
        text: caseData[SituationFields.FAS_OPPOSING_EXPERT] || "",
        key: SituationFields.FAS_OPPOSING_EXPERT,
        secondaryStep: findQuestionInState(
          state.situation,
          SituationFields.FAS_OPPOSING_EXPERT
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/situation/${SITUATION_MUTATIONS_TYPES.SET_SITUATION_FIELD}`,
      {
        text: caseData[SituationFields.FAS_OPPOSING_EXPERT_HOURLY_FEE] || "",
        key: SituationFields.FAS_OPPOSING_EXPERT_HOURLY_FEE,
        secondaryStep: findQuestionInState(
          state.situation,
          SituationFields.FAS_OPPOSING_EXPERT_HOURLY_FEE
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/situation/${SITUATION_MUTATIONS_TYPES.SET_SITUATION_FIELD}`,
      {
        text: caseData[SituationFields.FAS_OPPOSING_EXPERT_REPORT_DATE] || "",
        key: SituationFields.FAS_OPPOSING_EXPERT_REPORT_DATE,
        secondaryStep: findQuestionInState(
          state.situation,
          SituationFields.FAS_OPPOSING_EXPERT_REPORT_DATE
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/approach/${APPROACH_MUTATIONS_TYPES.SET_APPROACH_FIELD}`,
      {
        text: caseData[ApproachFields.DETAILS] || "",
        key: ApproachFields.DETAILS,
        secondaryStep: findQuestionInState(
          state.approach,
          ApproachFields.DETAILS
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/approach/${APPROACH_MUTATIONS_TYPES.SET_APPROACH_FIELD}`,
      {
        text: caseData[ApproachFields.NARRATIVE] || "",
        key: ApproachFields.NARRATIVE,
        secondaryStep: findQuestionInState(
          state.approach,
          ApproachFields.NARRATIVE
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/results/${RESULTS_MUTATIONS_TYPES.SET_RESULTS_FIELD}`,
      {
        text: caseData[ResultsFields.OVERALL_IMPACT] || "",
        key: ResultsFields.OVERALL_IMPACT,
        secondaryStep: findQuestionInState(
          state.results,
          ResultsFields.OVERALL_IMPACT
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/results/${RESULTS_MUTATIONS_TYPES.SET_RESULTS_FIELD}`,
      {
        text: caseData[ResultsFields.BENEFITS] || "",
        key: ResultsFields.BENEFITS,
        secondaryStep: findQuestionInState(
          state.results,
          ResultsFields.BENEFITS
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/results/${RESULTS_MUTATIONS_TYPES.SET_RESULTS_FIELD}`,
      {
        text: caseData[ResultsFields.CULTURE_SHIFT] || "",
        key: ResultsFields.CULTURE_SHIFT,
        secondaryStep: findQuestionInState(
          state.results,
          ResultsFields.CULTURE_SHIFT
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/results/${RESULTS_MUTATIONS_TYPES.SET_RESULTS_FIELD}`,
      {
        text: caseData[ResultsFields.CHART] || "",
        key: ResultsFields.CHART,
        secondaryStep: findQuestionInState(state.results, ResultsFields.CHART)
          .questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/results/${RESULTS_MUTATIONS_TYPES.SET_RESULTS_FIELD}`,
      {
        text: caseData[ResultsFields.CLIENT_QUOTE] || "",
        key: ResultsFields.CLIENT_QUOTE,
        secondaryStep: findQuestionInState(
          state.results,
          ResultsFields.CLIENT_QUOTE
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/results/${RESULTS_MUTATIONS_TYPES.SET_RESULTS_FIELD}`,
      {
        text: caseData[ResultsFields.CASE_RECOGNITIONS] || "",
        key: ResultsFields.CASE_RECOGNITIONS,
        secondaryStep: findQuestionInState(
          state.results,
          ResultsFields.CASE_RECOGNITIONS
        ).questionStep
      },
      { root: true }
    );
    caseData.metrics.forEach((metric: Metric) => {
      let metricInState = findMetricByName(
        state.results,
        metric.name,
        metric.financialMetricsArea
      );
      if (metricInState) {
        dispatch(
          `selectedCase/results/${RESULTS_ACTIONS_TYPES.POPULATE_METRIC_VALUE}`,
          {
            id: metricInState.id,
            startDateValue: metric.startDateValue,
            endDateValue: metric.endDateValue,
            secondaryStep: metricInState.questionStep
          },
          { root: true }
        );
      } else {
        dispatch(
          `selectedCase/results/${RESULTS_ACTIONS_TYPES.PUSH_METRIC}`,
          {
            metricName: metric.name,
            metricSection: metric.financialMetricsArea,
            secondaryStep: metric.isFinancialMetric
              ? SecondaryStep.firstStep
              : SecondaryStep.secondStep
          },
          { root: true }
        );
        // }
        metricInState = findMetricByName(
          state.results,
          metric.name,
          metric.financialMetricsArea
        );
        dispatch(
          `selectedCase/results/${RESULTS_ACTIONS_TYPES.POPULATE_METRIC_VALUE}`,
          {
            id: metricInState.id,
            startDateValue: metric.startDateValue,
            endDateValue: metric.endDateValue,
            secondaryStep: metricInState.questionStep
          },
          { root: true }
        );
      }
    });
    commit(GLOBAL_MUTATIONS_TYPES.SET_IS_FETCHING, false, { root: true });
    commit(
      `selectedCase/${MUTATIONS_TYPES.SET_IS_FETCHING_CLIENT_INFO}`,
      false,
      {
        root: true
      }
    );
  },
  async [ACTIONS_TYPES.APPROVE_CASE_KM](
    {
      commit,
      dispatch,
      rootState
    }: ActionContext<SelectedCaseWithModulesState, RootStateWithModulesState>,
    submittedCaseId: string
  ) {
    try {
      rootState.isLoading = true;
      const appContext = {
        commit,
        dispatch,
        token: rootState.accessToken,
        action: ACTIONS_TYPES.APPROVE_CASE_KM,
        withErrorMessage: false
      };
      const response = await Service(appContext).get(
        `/cases/${encodeURIComponent(rootState.selectedCase.caseId)}`
      );
      response.data.newCaseStatus = CaseStatus.approvedByKM;
      await Service(appContext).put(
        `/cases/${encodeURIComponent(rootState.selectedCase.caseId)}`,
        response.data
      );
      dispatch(
        `modal/${MODAL_ACTIONS_TYPES.OPEN_MODAL}`,
        {
          component: ModalComponents.SUBMIT_SUCCESS,
          props: {
            type: "approveCase"
          }
        },
        { root: true }
      );
      rootState.isLoading = false;
      // Patch the case status locally
      rootState.cases.casesList[
        rootState.cases.casesList.findIndex(
          singularCase => singularCase.caseId == submittedCaseId
        )
      ].status = CaseStatus.approvedByKM;
    } catch (error) {
      console.error(error);
    }
  },
  async [ACTIONS_TYPES.PUBLISH_CASE](
    {
      commit,
      dispatch,
      rootState
    }: ActionContext<SelectedCaseWithModulesState, RootStateWithModulesState>,
    submittedCaseId: string
  ) {
    try {
      rootState.isLoading = true;
      const appContext = {
        commit,
        dispatch,
        token: rootState.accessToken,
        action: ACTIONS_TYPES.PUBLISH_CASE,
        withErrorMessage: false
      };
      const response = await Service(appContext).get(
        `/cases/${encodeURIComponent(rootState.selectedCase.caseId)}`
      );
      response.data.newCaseStatus = CaseStatus.published;
      const threeColumns = getPptByName(PptNames.ThreeColumns, PptTypes.Single);
      const impacts = getPptByName(PptNames.StatsSlide, PptTypes.Single);
      const caseStudy = getPptByName(PptNames.CaseStudy, PptTypes.Single);
      const caseChart = getPptByName(PptNames.CaseWithGraph, PptTypes.Single);
      const base64Ppt = await threeColumns.write("base64" as any);
      const base64Impacts = await impacts.write("base64" as any);
      const base64CaseStudy = await caseStudy.write("base64" as any);
      const base64CaseChart = await caseChart.write("base64" as any);
      const dataToSend = {
        ...response.data,
        base64Ppt,
        base64Impacts,
        base64CaseStudy,
        base64CaseChart
      };
      await Service(appContext).put(
        `/cases/${encodeURIComponent(rootState.selectedCase.caseId)}`,
        dataToSend
      );
      dispatch(
        `modal/${MODAL_ACTIONS_TYPES.OPEN_MODAL}`,
        {
          component: ModalComponents.SUBMIT_SUCCESS,
          props: {
            type: "publishCase"
          }
        },
        { root: true }
      );
      rootState.isLoading = false;
      // Patch the case status locally
      rootState.cases.casesList[
        rootState.cases.casesList.findIndex(
          singularCase => singularCase.caseId == submittedCaseId
        )
      ].status = CaseStatus.published;
    } catch (error) {
      console.error(error);
    }
  },
  async [ACTIONS_TYPES.OPEN_CASE](
    {
      commit,
      dispatch,
      rootState
    }: ActionContext<SelectedCaseWithModulesState, RootStateWithModulesState>,
    submittedCaseId: string
  ) {
    try {
      rootState.isLoading = true;
      const appContext = {
        commit,
        dispatch,
        token: rootState.accessToken,
        action: ACTIONS_TYPES.OPEN_CASE,
        withErrorMessage: false
      };

      const response = await Service(appContext).get(
        `/cases/${encodeURIComponent(rootState.selectedCase.caseId)}`
      );
      response.data.newCaseStatus = CaseStatus.opened;
      await Service(appContext).put(
        `/cases/${encodeURIComponent(rootState.selectedCase.caseId)}`,
        response.data
      );

      dispatch(
        `modal/${MODAL_ACTIONS_TYPES.OPEN_MODAL}`,
        {
          component: ModalComponents.SUBMIT_SUCCESS,
          props: {
            type: "reopenCase"
          }
        },
        { root: true }
      );
      rootState.isLoading = false;
      // Patch the case status locally
      rootState.cases.casesList[
        rootState.cases.casesList.findIndex(
          singularCase => singularCase.caseId == submittedCaseId
        )
      ].status = CaseStatus.opened;
    } catch (error) {
      console.error(error);
    }
  },
  async [ACTIONS_TYPES.SUBMIT_CASE](
    {
      commit,
      dispatch,
      state,
      getters,
      rootState
    }: ActionContext<SelectedCaseWithModulesState, RootStateWithModulesState>,
    submittedCaseId: string
  ) {
    try {
      rootState.isLoading = true;
      commit(GLOBAL_MUTATIONS_TYPES.SET_IS_SESSION_EXPIRED, true, {
        root: true
      });
      const appContext = {
        commit,
        dispatch,
        token: rootState.accessToken,
        action: ACTIONS_TYPES.SUBMIT_CASE,
        withErrorMessage: false
      };
      const response = await Service(appContext).get(
        `/cases/${encodeURIComponent(rootState.selectedCase.caseId)}`
      );
      response.data.newCaseStatus = CaseStatus.submitted;
      await Service(appContext).put(
        `/cases/${encodeURIComponent(rootState.selectedCase.caseId)}`,
        response.data
      );
      dispatch(
        `modal/${MODAL_ACTIONS_TYPES.OPEN_MODAL}`,
        {
          component: ModalComponents.SUBMIT_SUCCESS,
          props: {
            type: "submitCase"
          }
        },
        { root: true }
      );
      rootState.isLoading = false;
      // Patch the case status locally
      rootState.cases.casesList[
        rootState.cases.casesList.findIndex(
          singularCase => singularCase.caseId == submittedCaseId
        )
      ].status = CaseStatus.submitted;
    } catch (error) {
      console.error(error);
    }
  },
  [ACTIONS_TYPES.ADD_STARTER_TEXT](
    {
      dispatch,
      state,
      rootGetters
    }: ActionContext<SelectedCaseWithModulesState, RootStateWithModulesState>,
    inputKey: Question["id"]
  ) {
    const actualStep = rootGetters.activePrimaryStep;
    const actualStepRoute = actualStep?.route;
    let actualPrimaryStep;
    switch (actualStepRoute) {
      case Routes.AVAILABLE_CASE_DATA:
        actualPrimaryStep = state.clientInformation;
        break;
      case Routes.SITUATION:
        actualPrimaryStep = state.situation;
        break;
      case Routes.APPROACH:
        actualPrimaryStep = state.approach;
        break;
      default:
        actualPrimaryStep = state.results;
    }
    const question = findQuestionInState(actualPrimaryStep, inputKey);
    return dispatch(
      `modal/${MODAL_ACTIONS_TYPES.OPEN_MODAL}`,
      {
        component: ModalComponents.STARTER_TEXT_CONFIRMATION,
        props: {
          retryAddStarterText: (starterText: any) => {
            const actionToDispatch: string = getChangeFieldActions(
              actualStep.route
            );
            dispatch(actionToDispatch, {
              value: starterText,
              step: question.questionStep,
              key: inputKey,
              isForcedSave: true
            });
          },
          inputKey: inputKey
        }
      },
      { root: true }
    );
  },
  async [ACTIONS_TYPES.PATCH_CASE_DETAILS](
    {
      commit,
      dispatch,
      rootState
    }: ActionContext<SelectedCaseWithModulesState, RootStateWithModulesState>,
    patchObject: object
  ) {
    commit(GLOBAL_MUTATIONS_TYPES.SET_IS_FETCHING, true, { root: true });
    commit(GLOBAL_MUTATIONS_TYPES.SET_IS_SESSION_EXPIRED, false, {
      root: true
    });
    const appContext = {
      commit,
      dispatch,
      token: rootState.accessToken,
      action: ACTIONS_TYPES.PATCH_CASE_DETAILS,
      payload: {},
      withErrorMessage: false
    };
    try {
      Object.entries(patchObject).forEach(async entry => {
        const data = JSON.stringify([
          {
            op: "replace",
            path: `/${entry[0]}`,
            value: entry[1]
          }
        ]);
        const response = await Service(appContext).patch(
          `/cases/${encodeURIComponent(rootState.selectedCase.caseId)}`,
          data
        );
        rootState.selectedCase = {
          ...rootState.selectedCase,
          [entry[0]]: entry[1]
        };
      });
      commit(GLOBAL_MUTATIONS_TYPES.SET_IS_FETCHING, false, { root: true });
    } catch (error) {
      console.error(error);
    }
  },
  async [ACTIONS_TYPES.UPDATE_CASE_DETAILS](
    {
      commit,
      dispatch,
      getters,
      state,
      rootState
    }: ActionContext<SelectedCaseWithModulesState, RootStateWithModulesState>,
    caseId: number
  ) {
    commit(GLOBAL_MUTATIONS_TYPES.SET_IS_FETCHING_FROM_INFO, true, {
      root: true
    });
    commit(GLOBAL_MUTATIONS_TYPES.SET_IS_SESSION_EXPIRED, true, { root: true });
    const appContext = {
      commit,
      dispatch,
      token: rootState.accessToken,
      action: ACTIONS_TYPES.UPDATE_CASE_DETAILS,
      payload: {},
      withErrorMessage: false
    };
    const response = await Service(appContext).get(
      `/cases/${encodeURIComponent(caseId)}`
    );
    commit(`selectedCase/${MUTATIONS_TYPES.SET_IS_ERROR}`, false, {
      root: true
    });
    const caseData = response.data;
    commit(
      GLOBAL_MUTATIONS_TYPES.SET_SELECTED_CASE,
      {
        addreseableSpend: caseData.addreseableSpend || 0,
        author: caseData.author || {},
        baseline: caseData.baseline || "",
        businessUnits: caseData.businessUnits || [""],
        capIQId: caseData.capIQId || "",
        caseId,
        client: caseData.client || {},
        communities: caseData.communities || [""],
        countries: caseData.countries || [""],
        decisionMakers: caseData.decisionMakers || "",
        eliteClientCode: caseData.eliteClientCode || "",
        endDate: caseData.endDate || "",
        estimatedRevenue: caseData.estimatedRevenue || 0,
        industries: caseData.industries || [""],
        isELAllowDiscloseability: caseData.isELAllowDiscloseability || false,
        isLogoAndNameOk: caseData.isLogoAndNameOk || false,
        isLegacy: caseData.isLegacy || false,
        offerings: caseData.offerings || [""],
        outcomeSaving: caseData.outcomeSaving || 0,
        projectDescription: caseData.projectDescription || "",
        projectName: caseData.projectName || "",
        projectNameEditable: caseData.projectNameEditable || "",
        radiusId: caseData.radiusId || "",
        reviewerBIC: caseData.reviewerBIC || {},
        reviewerMD: caseData.reviewerMD || {},
        segments: caseData.segments || [""],
        services: caseData.services || [""],
        startDate: caseData.startDate || "",
        starterTexts: caseData.starterTexts,
        status: caseData.status || 0,
        team: caseData.team || [],
        weeksDuration: caseData.weeksDuration || 0
      },
      { root: true }
    );
    commit(
      `selectedCase/clientInformation/${CLIENT_INFO_MUTATIONS_TYPES.SET_CLIENT_INFO_FIELD}`,
      {
        value: caseData[ClientInfoFields.REVENUE] || "",
        key: ClientInfoFields.REVENUE,
        secondaryStep: findQuestionInState(
          state.clientInformation,
          ClientInfoFields.REVENUE
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/clientInformation/${CLIENT_INFO_MUTATIONS_TYPES.SET_CLIENT_INFO_FIELD}`,
      {
        value: caseData[ClientInfoFields.INDUSTRIES] || [],
        key: ClientInfoFields.INDUSTRIES,
        secondaryStep: findQuestionInState(
          state.clientInformation,
          ClientInfoFields.INDUSTRIES
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/clientInformation/${CLIENT_INFO_MUTATIONS_TYPES.SET_CLIENT_INFO_FIELD}`,
      {
        value: caseData[ClientInfoFields.SEGMENTS] || [],
        key: ClientInfoFields.SEGMENTS,
        secondaryStep: findQuestionInState(
          state.clientInformation,
          ClientInfoFields.SEGMENTS
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/clientInformation/${CLIENT_INFO_MUTATIONS_TYPES.SET_CLIENT_INFO_FIELD}`,
      {
        value: caseData[ClientInfoFields.SERVICES] || [],
        key: ClientInfoFields.SERVICES,
        secondaryStep: findQuestionInState(
          state.clientInformation,
          ClientInfoFields.SERVICES
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/clientInformation/${CLIENT_INFO_MUTATIONS_TYPES.SET_CLIENT_INFO_FIELD}`,
      {
        value: caseData[ClientInfoFields.OFFERINGS] || [],
        key: ClientInfoFields.OFFERINGS,
        secondaryStep: findQuestionInState(
          state.clientInformation,
          ClientInfoFields.OFFERINGS
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/clientInformation/${CLIENT_INFO_MUTATIONS_TYPES.SET_CLIENT_INFO_FIELD}`,
      {
        value: caseData[ClientInfoFields.COUNTRIES] || [],
        key: ClientInfoFields.COUNTRIES,
        secondaryStep: findQuestionInState(
          state.clientInformation,
          ClientInfoFields.COUNTRIES
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/clientInformation/${CLIENT_INFO_MUTATIONS_TYPES.SET_CLIENT_INFO_FIELD}`,
      {
        value: caseData[ClientInfoFields.START_DATE] || "",
        key: ClientInfoFields.START_DATE,
        secondaryStep: findQuestionInState(
          state.clientInformation,
          ClientInfoFields.START_DATE
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/clientInformation/${CLIENT_INFO_MUTATIONS_TYPES.SET_CLIENT_INFO_FIELD}`,
      {
        value: caseData[ClientInfoFields.END_DATE] || "",
        key: ClientInfoFields.END_DATE,
        secondaryStep: findQuestionInState(
          state.clientInformation,
          ClientInfoFields.END_DATE
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/situation/${SITUATION_MUTATIONS_TYPES.SET_SITUATION_FIELD}`,
      {
        text: caseData[SituationFields.HEADLINE] || "",
        key: SituationFields.HEADLINE,
        secondaryStep: findQuestionInState(
          state.situation,
          SituationFields.HEADLINE
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/situation/${SITUATION_MUTATIONS_TYPES.SET_SITUATION_FIELD}`,
      {
        text: caseData[SituationFields.DESCRIPTION] || "",
        key: SituationFields.DESCRIPTION,
        secondaryStep: findQuestionInState(
          state.situation,
          SituationFields.DESCRIPTION
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/situation/${SITUATION_MUTATIONS_TYPES.SET_SITUATION_FIELD}`,
      {
        text: caseData[SituationFields.CHALLENGES] || "",
        key: SituationFields.CHALLENGES,
        secondaryStep: findQuestionInState(
          state.situation,
          SituationFields.CHALLENGES
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/situation/${SITUATION_MUTATIONS_TYPES.SET_SITUATION_FIELD}`,
      {
        text: caseData[SituationFields.HIRED_TO] || "",
        key: SituationFields.HIRED_TO,
        secondaryStep: findQuestionInState(
          state.situation,
          SituationFields.HIRED_TO
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/approach/${APPROACH_MUTATIONS_TYPES.SET_APPROACH_FIELD}`,
      {
        text: caseData[ApproachFields.DETAILS] || "",
        key: ApproachFields.DETAILS,
        secondaryStep: findQuestionInState(
          state.approach,
          ApproachFields.DETAILS
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/approach/${APPROACH_MUTATIONS_TYPES.SET_APPROACH_FIELD}`,
      {
        text: caseData[ApproachFields.NARRATIVE] || "",
        key: ApproachFields.NARRATIVE,
        secondaryStep: findQuestionInState(
          state.approach,
          ApproachFields.NARRATIVE
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/results/${RESULTS_MUTATIONS_TYPES.SET_RESULTS_FIELD}`,
      {
        text: caseData[ResultsFields.OVERALL_IMPACT] || "",
        key: ResultsFields.OVERALL_IMPACT,
        secondaryStep: findQuestionInState(
          state.results,
          ResultsFields.OVERALL_IMPACT
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/results/${RESULTS_MUTATIONS_TYPES.SET_RESULTS_FIELD}`,
      {
        text: caseData[ResultsFields.BENEFITS] || "",
        key: ResultsFields.BENEFITS,
        secondaryStep: findQuestionInState(
          state.results,
          ResultsFields.BENEFITS
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/results/${RESULTS_MUTATIONS_TYPES.SET_RESULTS_FIELD}`,
      {
        text: caseData[ResultsFields.CULTURE_SHIFT] || "",
        key: ResultsFields.CULTURE_SHIFT,
        secondaryStep: findQuestionInState(
          state.results,
          ResultsFields.CULTURE_SHIFT
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/results/${RESULTS_MUTATIONS_TYPES.SET_RESULTS_FIELD}`,
      {
        text: caseData[ResultsFields.CHART] || "",
        key: ResultsFields.CHART,
        secondaryStep: findQuestionInState(state.results, ResultsFields.CHART)
          .questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/results/${RESULTS_MUTATIONS_TYPES.SET_RESULTS_FIELD}`,
      {
        text: caseData[ResultsFields.CLIENT_QUOTE] || "",
        key: ResultsFields.CLIENT_QUOTE,
        secondaryStep: findQuestionInState(
          state.results,
          ResultsFields.CLIENT_QUOTE
        ).questionStep
      },
      { root: true }
    );
    commit(
      `selectedCase/results/${RESULTS_MUTATIONS_TYPES.SET_RESULTS_FIELD}`,
      {
        text: caseData[ResultsFields.CASE_RECOGNITIONS] || "",
        key: ResultsFields.CASE_RECOGNITIONS,
        secondaryStep: findQuestionInState(
          state.results,
          ResultsFields.CASE_RECOGNITIONS
        ).questionStep
      },
      { root: true }
    );
    commit(GLOBAL_MUTATIONS_TYPES.SET_IS_FETCHING_FROM_INFO, false, {
      root: true
    });
  },
  async [ACTIONS_TYPES.UPLOAD_CHART](
    {
      dispatch,
      commit,
      rootState
    }: ActionContext<SelectedCaseWithModulesState, RootStateWithModulesState>,
    {
      formData,
      caseId,
      key,
      step
    }: {
      formData: FormData;
      caseId: string;
      key: ResultsFields;
      step: SecondaryStep;
    }
  ) {
    const appContext = {
      commit,
      dispatch,
      token: rootState.accessToken,
      action: ACTIONS_TYPES.UPLOAD_CHART,
      withErrorMessage: false,
      dataType: "multipart/form-data; boundary=---011000010111000001101001"
    };
    const response = await Service(appContext).post(
      `/cases/${caseId}/upload`,
      formData
    );
    if (response && response.data) {
      const newValue = response.data;
      await dispatch(`results/${RESULTS_ACTIONS_TYPES.CHANGE_RESULTS_FIELD}`, {
        value: newValue,
        key,
        step
      });
    }
  },
  async [ACTIONS_TYPES.FETCH_FILE](
    {
      dispatch,
      commit,
      rootState
    }: ActionContext<SelectedCaseWithModulesState, RootStateWithModulesState>,
    {
      caseId,
      fileLocation
    }: {
      caseId: string;
      fileLocation: string;
    }
  ) {
    const appContext = {
      commit,
      dispatch,
      token: rootState.accessToken,
      action: ACTIONS_TYPES.FETCH_FILE,
      withErrorMessage: false
    };
    const response = await Service(appContext).get(`/cases/${caseId}/download`);
    if (response) {
      commit(MUTATIONS_TYPES.FETCH_FILE, response.data);
    }
  },
  async [ACTIONS_TYPES.DELETE_FILE]({
    dispatch,
    commit,
    rootState
  }: ActionContext<SelectedCaseWithModulesState, RootStateWithModulesState>) {
    const appContext = {
      commit,
      dispatch,
      token: rootState.accessToken,
      action: ACTIONS_TYPES.DELETE_FILE,
      withErrorMessage: false
    };
    commit(MUTATIONS_TYPES.DELETE_FILE);
  },
  async [ACTIONS_TYPES.HANDLE_EDIT_MODE]({
    commit,
    rootState,
    dispatch
  }: ActionContext<SelectedCaseWithModulesState, RootStateWithModulesState>) {
    await dispatch(GLOBAL_ACTIONS_TYPES.GET_USER_BY_TOKEN, null, {
      root: true
    });
    const initInEditMode =
      (rootState.user?.userId === rootState.selectedCase.author?.userId &&
        rootState.selectedCase?.status === CaseStatus.opened) ||
      (rootState.user?.isBICReviewer &&
        rootState.selectedCase?.status === CaseStatus.submitted) ||
      (rootState.user?.userId === rootState.selectedCase.reviewerMD?.userId &&
        rootState.selectedCase?.status === CaseStatus.approvedByKM);
    commit(MUTATIONS_TYPES.SET_EDIT_MODE, initInEditMode);
  }
};
