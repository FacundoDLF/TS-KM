import { MUTATIONS_TYPES, ACTIONS_TYPES } from "./types";
import { MUTATIONS_TYPES as GLOBAL_MUTATIONS_TYPES } from "@/store/types";
import { RootStateWithModulesState } from "@/store";
import { ActionContext } from "vuex";
import _ from "lodash";
import Service from "@/service";

export default {
  async [ACTIONS_TYPES.FETCH_CASES_BY_USER](
    {
      commit,
      dispatch,
      state,
      rootState
    }: ActionContext<RootStateWithModulesState, RootStateWithModulesState>,
    caseId: number
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
        action: ACTIONS_TYPES.FETCH_CASES_BY_USER,
        withErrorMessage: false
      };
      const response = await Service(appContext).get(
        `/cases?userId=${encodeURIComponent(rootState.user.userId)}`
      );
      const caseData = response.data;
      commit(`cases/${MUTATIONS_TYPES.SET_CASES_LIST}`, caseData, {
        root: true
      });
      commit(GLOBAL_MUTATIONS_TYPES.SET_IS_FETCHING, false, { root: true });
      commit(GLOBAL_MUTATIONS_TYPES.SET_IS_FETCHING, false, { root: true });
    } catch (err) {
      console.error(err);
    }
  }
};
