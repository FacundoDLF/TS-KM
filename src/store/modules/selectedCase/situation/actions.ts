import { MUTATIONS_TYPES, ACTIONS_TYPES } from "./types";
import { ACTIONS_TYPES as UI_ACTIONS_TYPES } from "@/store/modules/ui/types";
import { MUTATIONS_TYPES as SELECTED_CASE_MUTATIONS_TYPES } from "@/store/modules/selectedCase/types";
import { MUTATIONS_TYPES as GLOBAL_MUTATIONS_TYPES } from "@/store/types";
import _ from "lodash";
import { RootStateWithModulesState } from "@/store";
import { ActionContext } from "vuex";
import { SituationFields } from "@/constants/situationFields";
import Service from "@/service";
import findQuestionInState from "@/helpers/findQuestionInState";
import {
  FasLawFirm,
  FasRegulatoryAgency,
  FasTerm,
  SecondaryStep,
  Step
} from "@/types";

const isLawFirmArray = (array: any[]): array is FasLawFirm[] => {
  return array.every(a => "fasLawFirmId" in a);
};

export default {
  async [ACTIONS_TYPES.CHANGE_SITUATION_FIELD](
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
      value: string | number | FasRegulatoryAgency[] | FasLawFirm[] | FasTerm[];
      step: SecondaryStep;
      key: SituationFields;
      isForcedSave: boolean;
    }
  ) {
    const patchField = async () => {
      commit(GLOBAL_MUTATIONS_TYPES.SET_IS_SESSION_EXPIRED, false, {
        root: true
      });
      const patchKey =
        key == SituationFields.FAS_OPPOSING_LAW_FIRMS
          ? SituationFields.FAS_LAW_FIRMS
          : key;
      const data = JSON.stringify([
        {
          op: "replace",
          path: `/${patchKey}`,
          value: Array.isArray(value) && !value.length ? null : value
        }
      ]);
      const appContext = {
        commit,
        dispatch,
        token: rootState.accessToken,
        action: ACTIONS_TYPES.CHANGE_SITUATION_FIELD,
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
          type: "success",
          position: "top-center",
          duration: 2000
        },
        { root: true }
      );
      commit(
        `selectedCase/${SELECTED_CASE_MUTATIONS_TYPES.REMOVE_ERROR}`,
        findQuestionInState(rootState.selectedCase.situation, key),
        { root: true }
      );
    };
    if (
      findQuestionInState(rootState.selectedCase.situation, key).answer !==
        value ||
      isForcedSave
    ) {
      patchField();
      let inputValue;
      if (Array.isArray(value) && isLawFirmArray(value)) {
        if (key == SituationFields.FAS_LAW_FIRMS)
          inputValue = value.filter((v: FasLawFirm) => !v.isOpposing);
        if (key == SituationFields.FAS_OPPOSING_LAW_FIRMS)
          inputValue = value.filter((v: FasLawFirm) => v.isOpposing);
      }
      commit(MUTATIONS_TYPES.SET_SITUATION_FIELD, {
        text: inputValue || value,
        key,
        secondaryStep: step
      });
    }
  }
};
