import { State } from "./";

export default {
  nonReadNotificationsLength: (state: State) => {
    return state.notificationsList?.filter(n => !n.isRead)?.length;
  }
};
