import { MUTATIONS_TYPES, ACTIONS_TYPES, ModalComponents } from "./types";
import { ACTIONS_TYPES as GLOBAL_ACTIONS_TYPES } from "@/store/types";
import { RootStateWithModulesState } from "../../";
import { State } from "./";
import { ActionContext } from "vuex";
import { Routes } from "@/constants/routes";

export default {
  [ACTIONS_TYPES.OPEN_MODAL](
    { commit }: ActionContext<State, RootStateWithModulesState>,
    { component, props = {} }: { component: string; props: any }
  ) {
    commit(MUTATIONS_TYPES.SET_MODAL_VISIBILITY, true);
    commit(MUTATIONS_TYPES.SET_MODAL_COMPONENT_PROPS, props);
    commit(MUTATIONS_TYPES.SET_MODAL_CONTENT, component);
  },
  [ACTIONS_TYPES.CLOSE_MODAL](
    { commit, dispatch }: ActionContext<State, RootStateWithModulesState>,
    { component }: { component: string }
  ) {
    if (
      component !== ModalComponents.REVIEWER_ERROR &&
      component !== ModalComponents.WARNING &&
      component !== ModalComponents.EXPORT_SELECTION &&
      component !== ModalComponents.AUTHOR_SELECTION
    ) {
      dispatch(GLOBAL_ACTIONS_TYPES.ROUTER_REPLACE, Routes.MY_CASES, {
        root: true
      });
    }
    commit(MUTATIONS_TYPES.SET_MODAL_VISIBILITY, false);
    commit(MUTATIONS_TYPES.SET_MODAL_CONTENT, null);
    commit(MUTATIONS_TYPES.SET_MODAL_COMPONENT_PROPS, {});
  }
};
