import { MUTATIONS_TYPES } from "./types";
import { Notification } from "@/types";
import { State } from "./";

export default {
  [MUTATIONS_TYPES.SET_NOTIFICATIONS_VISUALIZATION]: (
    state: State,
    value: boolean
  ) => (state["isShowNotifications"] = value),
  [MUTATIONS_TYPES.SET_NOTIFICATIONS_LIST]: (
    state: State,
    value: Notification[]
  ) => (state["notificationsList"] = value),
  [MUTATIONS_TYPES.SET_NOTIFICATION_AS_READ]: (
    state: State,
    value: Notification
  ) => {
    const index = state.notificationsList.findIndex(n => n.id == value.id);
    value.isRead = true;
    state.notificationsList.splice(index, 1, Object.assign({}, value));
  },
  [MUTATIONS_TYPES.SET_ALL_NOTIFICATIONS_AS_READ]: (state: State) =>
    state.notificationsList.forEach(
      notification => (notification.isRead = true)
    )
};
