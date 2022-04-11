import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";
import { Message } from "@/types";

export interface UIState {
  message: Message;
  isMenuOpen: boolean;
  shownClientInfo: boolean;
  shownIntroSteps: boolean;
}

export default {
  namespaced: true,
  state: () => ({
    message: {},
    isMenuOpen: false,
    shownClientInfo: false,
    shownIntroSteps: false
  }),
  mutations,
  actions,
  getters
};
