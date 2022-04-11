import { MUTATIONS_TYPES, ACTIONS_TYPES } from "./types";
import {
  ACTIONS_TYPES as GLOBAL_ACTIONS_TYPES,
  MUTATIONS_TYPES as GLOBAL_MUTATIONS_TYPES
} from "@/store/types";
import { Notification } from "@/types";
import { RootStateWithModulesState } from "@/store";
import { State as NotificationState } from "@/store/modules/notifications";
import { ActionContext } from "vuex";
import _ from "lodash";
import Service from "@/service";

export default {
  async [ACTIONS_TYPES.FETCH_NOTIFICATIONS]({
    commit,
    dispatch,
    rootState
  }: ActionContext<NotificationState, RootStateWithModulesState>) {
    commit(GLOBAL_MUTATIONS_TYPES.SET_IS_SESSION_EXPIRED, true, { root: true });
    const appContext = {
      commit,
      dispatch,
      token: rootState.accessToken,
      action: ACTIONS_TYPES.FETCH_NOTIFICATIONS,
      withErrorMessage: false
    };
    const response = await Service(appContext).get(
      `/notifications?userId=${encodeURIComponent(rootState.user.userId)}`
    );
    const notifications = response.data;
    commit(MUTATIONS_TYPES.SET_NOTIFICATIONS_LIST, notifications);
  },
  async [ACTIONS_TYPES.PATCH_NOTIFICATION_AS_READ](
    {
      commit,
      dispatch,
      rootState
    }: ActionContext<NotificationState, RootStateWithModulesState>,
    notification: Notification
  ) {
    commit(GLOBAL_MUTATIONS_TYPES.SET_IS_SESSION_EXPIRED, false, {
      root: true
    });
    const appContext = {
      commit,
      dispatch,
      token: rootState.accessToken,
      action: ACTIONS_TYPES.PATCH_NOTIFICATION_AS_READ,
      payload: notification,
      withErrorMessage: false
    };
    await Service(appContext).patch(
      `/notifications/${notification.id}/Markasread`
    );
    commit(MUTATIONS_TYPES.SET_NOTIFICATION_AS_READ, notification);
  },
  async [ACTIONS_TYPES.SET_ALL_NOTIFICATIONS_AS_READ]({
    commit,
    dispatch,
    rootState
  }: ActionContext<NotificationState, RootStateWithModulesState>) {
    commit(GLOBAL_MUTATIONS_TYPES.SET_IS_SESSION_EXPIRED, false, {
      root: true
    });
    const appContext = {
      commit,
      dispatch,
      token: rootState.accessToken,
      action: ACTIONS_TYPES.SET_ALL_NOTIFICATIONS_AS_READ,
      withErrorMessage: false
    };
    await Service(appContext).patch(`/notifications/markAllAsRead`);
    commit(MUTATIONS_TYPES.SET_ALL_NOTIFICATIONS_AS_READ);
  }
};
