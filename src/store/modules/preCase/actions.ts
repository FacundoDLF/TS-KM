import { ACTIONS_TYPES } from "./types";
import { MUTATIONS_TYPES as GLOBAL_MUTATIONS_TYPES } from "@/store/types";
import {
  ACTIONS_TYPES as MODAL_ACTIONS_TYPES,
  ModalComponents
} from "@/store/modules/modal/types";
import { RootStateWithModulesState } from "@/store";
import { ActionContext } from "vuex";
import Service from "@/service";
import { PrecaseRequest } from "@/types";
import router from "@/router";

export default {
  async [ACTIONS_TYPES.FETCH_PRECASE](
    {
      commit,
      dispatch,
      state,
      rootState
    }: ActionContext<RootStateWithModulesState, RootStateWithModulesState>,
    precaseId: string
  ) {
    try {
      commit(GLOBAL_MUTATIONS_TYPES.SET_IS_FETCHING, true, { root: true });
      commit(GLOBAL_MUTATIONS_TYPES.SET_IS_SESSION_EXPIRED, false, {
        root: true
      });
      const appContext = {
        commit,
        dispatch,
        token: rootState.accessToken,
        action: ACTIONS_TYPES.FETCH_PRECASE,
        withErrorMessage: false
      };
      const response = await Service(appContext).get(`/precases/${precaseId}`);
      commit(GLOBAL_MUTATIONS_TYPES.SET_PRECASE, response.data, { root: true });
      commit(GLOBAL_MUTATIONS_TYPES.SET_IS_FETCHING, false, { root: true });
      dispatch(
        `modal/${MODAL_ACTIONS_TYPES.OPEN_MODAL}`,
        {
          component: ModalComponents.AUTHOR_SELECTION,
          props: {
            precaseId: router.currentRoute.params.id
          }
        },
        { root: true }
      );
    } catch (error) {
      console.error(error);
    }
  },
  async [ACTIONS_TYPES.REJECT_CASE](
    {
      commit,
      dispatch,
      state,
      rootState
    }: ActionContext<RootStateWithModulesState, RootStateWithModulesState>,
    {
      precaseId,
      reason
    }: {
      precaseId: string;
      reason: string;
    }
  ) {
    commit(GLOBAL_MUTATIONS_TYPES.SET_IS_FETCHING, true, { root: true });
    commit(GLOBAL_MUTATIONS_TYPES.SET_IS_SESSION_EXPIRED, false, {
      root: true
    });
    const appContext = {
      commit,
      dispatch,
      token: rootState.accessToken,
      action: ACTIONS_TYPES.REJECT_CASE,
      withErrorMessage: false
    };
    await Service(appContext).patch(`/precases/${precaseId}/reject`, {
      reason
    });
    dispatch(
      `modal/${MODAL_ACTIONS_TYPES.OPEN_MODAL}`,
      {
        component: ModalComponents.SUBMIT_SUCCESS,
        props: {
          type: "rejectSucces"
        }
      },
      { root: true }
    );
    commit(GLOBAL_MUTATIONS_TYPES.SET_IS_FETCHING, false, { root: true });
  },
  async [ACTIONS_TYPES.POST_PRECASE](
    {
      commit,
      dispatch,
      state,
      rootState
    }: ActionContext<RootStateWithModulesState, RootStateWithModulesState>,
    precaseRequest: PrecaseRequest
  ) {
    try {
      commit(GLOBAL_MUTATIONS_TYPES.SET_IS_FETCHING, true, { root: true });
      commit(GLOBAL_MUTATIONS_TYPES.SET_IS_SESSION_EXPIRED, false, {
        root: true
      });
      const appContext = {
        commit,
        dispatch,
        token: rootState.accessToken,
        action: ACTIONS_TYPES.POST_PRECASE,
        withErrorMessage: false
      };
      const data = JSON.stringify(precaseRequest);
      const response = await Service(appContext).post("/cases", data);
      dispatch(
        `modal/${MODAL_ACTIONS_TYPES.OPEN_MODAL}`,
        {
          component: ModalComponents.SUBMIT_SUCCESS,
          props: {
            type: "submitSucces"
          }
        },
        { root: true }
      );
      // Post the preCase locally
      rootState.cases.casesList.push(response.data);
      commit(GLOBAL_MUTATIONS_TYPES.SET_IS_FETCHING, false, { root: true });
    } catch (error) {
      console.error(error);
    }
  },
  async [ACTIONS_TYPES.FETCH_EMPLOYEES](
    {
      commit,
      dispatch,
      state,
      rootState
    }: ActionContext<RootStateWithModulesState, RootStateWithModulesState>,
    searchQuery: string
  ) {
    commit(GLOBAL_MUTATIONS_TYPES.SET_IS_FETCHING, true, { root: true });
    commit(GLOBAL_MUTATIONS_TYPES.SET_IS_SESSION_EXPIRED, false, {
      root: true
    });
    const appContext = {
      commit,
      dispatch,
      token: rootState.accessToken,
      action: ACTIONS_TYPES.FETCH_EMPLOYEES,
      withErrorMessage: false
    };
    const response = await Service(appContext).get(
      `/users/employees?queryString=${searchQuery}`
    );
    commit(GLOBAL_MUTATIONS_TYPES.SET_EMPLOYEES, response.data.value, {
      root: true
    });
    commit(GLOBAL_MUTATIONS_TYPES.SET_IS_FETCHING, false, { root: true });
  }
};
