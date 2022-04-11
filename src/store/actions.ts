import { MUTATIONS_TYPES, ACTIONS_TYPES } from "./types";
import { MUTATIONS_TYPES as SINGULAR_CASE_MUTATIONS_TYPES } from "./modules/selectedCase/types";
import { MUTATIONS_TYPES as GLOBAL_MUTATIONS_TYPES } from "@/store/types";
import _ from "lodash";
import { RootStateWithModulesState } from "./";
import { ActionContext } from "vuex";
import router from "@/router";
import routeFormatter from "@/components/routes/helpers/routeFormatter";
import Axios from "axios";
import _get from "lodash/get";
import Service from "@/service";
import { decode } from "jsonwebtoken";
import { SearchResult, SelectedCase } from "@/types";

export default {
  [ACTIONS_TYPES.ROUTER_PUSH](
    {
      state,
      commit
    }: ActionContext<RootStateWithModulesState, RootStateWithModulesState>,
    value: string
  ) {
    const newRouter = routeFormatter(state.currentRoutePath + value);
    router.push(newRouter);
    commit(MUTATIONS_TYPES.SET_CURRENT_ROUTE, newRouter);
  },
  [ACTIONS_TYPES.ROUTER_REPLACE](
    {
      commit
    }: ActionContext<RootStateWithModulesState, RootStateWithModulesState>,
    value: string
  ) {
    commit(MUTATIONS_TYPES.SET_CURRENT_ROUTE, value);
    if (router.currentRoute.path !== value) {
      router.push(value);
    }
  },
  [ACTIONS_TYPES.FETCH_URL_VALUES]({
    commit
  }: ActionContext<RootStateWithModulesState, RootStateWithModulesState>) {
    commit(MUTATIONS_TYPES.SET_CURRENT_ROUTE, router.currentRoute.path);
    commit(
      `selectedCase/${SINGULAR_CASE_MUTATIONS_TYPES.SET_PRIMARY_STEP}`,
      router.currentRoute.params.primaryStep || null
    );
    commit(
      `selectedCase/${SINGULAR_CASE_MUTATIONS_TYPES.SET_SECONDARY_STEP}`,
      parseInt(router.currentRoute.params.secondaryStep) || 1
    );
  },
  async [ACTIONS_TYPES.GET_SIGNED_IN_USER]({
    state,
    commit
  }: ActionContext<RootStateWithModulesState, RootStateWithModulesState>) {
    try {
      if (!process.env.VUE_APP_IS_LOCAL) {
        const response = await Axios.get("/.auth/me");
        const data = response.data[0];
        const accessToken = _get(data, "access_token");
        const userProfile = decode(accessToken);
        commit(MUTATIONS_TYPES.SET_ACCESS_TOKEN, accessToken);
        commit(MUTATIONS_TYPES.SET_USER_PROFILE, userProfile);
      }
      if (process.env.VUE_APP_IS_LOCAL) {
        const accessToken = process.env.VUE_APP_TOKEN || "";
        const userProfile = decode(accessToken);
        commit(MUTATIONS_TYPES.SET_ACCESS_TOKEN, accessToken);
        commit(MUTATIONS_TYPES.SET_USER_PROFILE, userProfile);
      }
    } catch (error) {
      if (!state.accessToken) {
        window.location.href = "/.auth/login/aad";
      }
      console.error(error);
    }
  },
  async [ACTIONS_TYPES.GET_USER_BY_TOKEN]({
    state,
    rootState,
    commit,
    dispatch
  }: ActionContext<RootStateWithModulesState, RootStateWithModulesState>) {
    commit(GLOBAL_MUTATIONS_TYPES.SET_IS_FETCHING_USER, true, { root: true });
    commit(GLOBAL_MUTATIONS_TYPES.SET_IS_SESSION_EXPIRED, false, {
      root: true
    });
    const appContext = {
      commit,
      dispatch,
      token: rootState.accessToken,
      action: ACTIONS_TYPES.GET_USER_BY_TOKEN,
      withErrorMessage: false
    };
    const response = await Service(appContext).get(`/users`);
    const user = response.data;
    commit(MUTATIONS_TYPES.SET_USER, user);
    commit(GLOBAL_MUTATIONS_TYPES.SET_IS_FETCHING_USER, false, { root: true });
  },
  async [ACTIONS_TYPES.REFRESH_USER_ACCESS_TOKEN]({
    state,
    rootState,
    commit
  }: ActionContext<RootStateWithModulesState, RootStateWithModulesState>) {
    try {
      commit(GLOBAL_MUTATIONS_TYPES.SET_IS_FETCHING, true, { root: true });
      commit(GLOBAL_MUTATIONS_TYPES.SET_IS_SESSION_EXPIRED, false, {
        root: true
      });
      if (!process.env.VUE_APP_IS_LOCAL) {
        await Axios.get("/.auth/refresh");
        const response = await Axios.get("/.auth/me");
        const data = response.data[0];
        const accessToken = _get(data, "access_token");
        const userProfile = decode(accessToken);
        commit(MUTATIONS_TYPES.SET_ACCESS_TOKEN, accessToken);
        commit(MUTATIONS_TYPES.SET_USER_PROFILE, userProfile);
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  },
  async [ACTIONS_TYPES.FETCH_COLLECTIONS]({
    state,
    rootState,
    commit,
    dispatch
  }: ActionContext<RootStateWithModulesState, RootStateWithModulesState>) {
    commit(MUTATIONS_TYPES.SET_IS_FETCHING, true);
    commit(MUTATIONS_TYPES.SET_IS_SESSION_EXPIRED, false);
    const appContext = {
      commit,
      dispatch,
      token: rootState.accessToken,
      action: ACTIONS_TYPES.FETCH_COLLECTIONS,
      withErrorMessage: false
    };
    const collections = await Service(appContext).get(`/collections`);
    commit(MUTATIONS_TYPES.SET_COLLECTIONS, collections.data);
    commit(MUTATIONS_TYPES.SET_IS_FETCHING, false);
  },
  async [ACTIONS_TYPES.SEARCH_CASES](
    {
      state,
      rootState,
      commit,
      dispatch
    }: ActionContext<RootStateWithModulesState, RootStateWithModulesState>,
    queryString: string
  ) {
    commit(MUTATIONS_TYPES.SET_IS_FETCHING, true);
    commit(MUTATIONS_TYPES.SET_IS_SESSION_EXPIRED, false, {
      root: true
    });
    const appContext = {
      commit,
      dispatch,
      token: rootState.accessToken,
      action: ACTIONS_TYPES.SEARCH_CASES,
      withErrorMessage: false
    };
    const response = await Service(appContext).get(
      `/cases/search?${queryString}`
    );
    const results = response.data.sort(
      (a: SearchResult, b: SearchResult) => b.score - a.score
    );
    commit(MUTATIONS_TYPES.SET_SEARCH_RESULTS, results);
    commit(MUTATIONS_TYPES.SET_IS_FETCHING, false);
  },
  async [ACTIONS_TYPES.FETCH_SELECTED_CASES](
    {
      state,
      rootState,
      commit,
      dispatch
    }: ActionContext<RootStateWithModulesState, RootStateWithModulesState>,
    queryString: string
  ) {
    commit(MUTATIONS_TYPES.SET_IS_FETCHING_CASES_TO_EXPORT, true);
    commit(MUTATIONS_TYPES.SET_IS_SESSION_EXPIRED, false, {
      root: true
    });
    const appContext = {
      commit,
      dispatch,
      token: rootState.accessToken,
      action: ACTIONS_TYPES.FETCH_SELECTED_CASES,
      withErrorMessage: false
    };
    const selectedIds = [...state.selectedCasesIds];
    const promises = selectedIds.map(id =>
      Service(appContext).get(`/cases/${id}`)
    );
    const resp = await Promise.all(promises);
    const cases: SelectedCase[] = resp.map(item => item.data);
    const filesToFetch: string[] = [];
    cases.forEach(aCase => {
      if (aCase.chartLocation) filesToFetch.push(aCase.caseId);
    });
    const filesPromises = filesToFetch.map(f =>
      Service(appContext).get(`/cases/${f}/download`)
    );
    const filesResp = await Promise.all(filesPromises);
    cases.map(
      aCase =>
        (aCase.attachment = filesResp.find(
          fr => fr.config.url?.split("/")[2] == aCase.caseId
        )?.data)
    );
    commit(MUTATIONS_TYPES.SET_CASES_TO_EXPORT, cases);
    commit(MUTATIONS_TYPES.SET_IS_FETCHING_CASES_TO_EXPORT, false);
  }
};
