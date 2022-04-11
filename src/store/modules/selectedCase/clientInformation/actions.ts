import { MUTATIONS_TYPES, ACTIONS_TYPES } from "./types";
import { ACTIONS_TYPES as UI_ACTIONS_TYPES } from "@/store/modules/ui/types";
import { MUTATIONS_TYPES as SELECTED_CASE_MUTATIONS_TYPES } from "@/store/modules/selectedCase/types";
import { MUTATIONS_TYPES as GLOBAL_MUTATIONS_TYPES } from "@/store/types";
import _ from "lodash";
import { RootStateWithModulesState } from "@/store";
import { ActionContext } from "vuex";
import { ClientInfoFields } from "@/constants/clientInfoFields";
import Service from "@/service";
import findQuestionInState from "@/helpers/findQuestionInState";
import { SecondaryStep, Step } from "@/types";

export default {
  async [ACTIONS_TYPES.CHANGE_CLIENT_INFO_FIELD](
    {
      dispatch,
      commit,
      rootState
    }: ActionContext<Step, RootStateWithModulesState>,
    {
      value,
      step,
      key,
      isForcedSave
    }: {
      value: string[] | string | number;
      step: SecondaryStep;
      key: ClientInfoFields;
      isForcedSave: boolean;
    }
  ) {
    const patchField = async () => {
      commit(GLOBAL_MUTATIONS_TYPES.SET_IS_SESSION_EXPIRED, false, {
        root: true
      });
      const data = JSON.stringify([
        {
          op: "replace",
          path:
            key === ClientInfoFields.REVENUE
              ? "/clientRevenueBucket"
              : `/${key}`,
          value
        }
      ]);
      const appContext = {
        commit,
        dispatch,
        token: rootState.accessToken,
        action: ACTIONS_TYPES.CHANGE_CLIENT_INFO_FIELD,
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
      commit(
        `selectedCase/${SELECTED_CASE_MUTATIONS_TYPES.REMOVE_ERROR}`,
        findQuestionInState(rootState.selectedCase.clientInformation, key),
        { root: true }
      );
    };
    if (
      findQuestionInState(rootState.selectedCase.clientInformation, key)
        .answer !== value ||
      isForcedSave
    ) {
      commit(MUTATIONS_TYPES.SET_CLIENT_INFO_FIELD, {
        value,
        key,
        secondaryStep: step
      });
      patchField();
    }
  }
};
