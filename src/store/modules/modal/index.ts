import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";
import { ModalComponents } from "./types";

export interface State {
  visible: boolean;
  content: ModalComponents;
  props: any;
}

export default {
  namespaced: true,
  state: () =>
    ({
      visible: false,
      content: "" as ModalComponents,
      props: {}
    } as State),
  getters,
  mutations,
  actions
};
