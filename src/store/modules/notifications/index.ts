import { Notification } from "@/types";

import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

export interface State {
  isShowNotifications: boolean;
  notificationsList: Notification[];
}

export default {
  namespaced: true,
  state: () =>
    ({
      isShowNotifications: false,
      notificationsList: []
    } as State),
  getters,
  mutations,
  actions
};
