<template>
  <div class="notification">
    <div @click="selectNotification" class="content">
      <div class="row">
        <div class="col-8">
          <div class="mainContent">
            <img class="icon mt-1 mr-3" :src="notificationIcon" />
            <span class="notificationDescription">
              {{ notificationDescriptionText }}
            </span>
          </div>
        </div>
        <div class="col-4">
          <span class="timestamp mt-1">{{ notificationTimestamp }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { ACTIONS_TYPES as NOTIFICATION_ACTION_TYPES } from "@/store/modules/notifications/types";
import { NotificationsText } from "@/helpers/notificationsText";
import { ACTIONS_TYPES as GLOBAL_ACTIONS_TYPES } from "@/store/types";
import { ACTIONS_TYPES as SELECTED_CASE_ACTIONS_TYPES } from "@/store/modules/selectedCase/types";
import { format } from "date-fns";

export default {
  props: {
    notification: Object
  },
  methods: {
    ...mapActions("notifications", [
      NOTIFICATION_ACTION_TYPES.PATCH_NOTIFICATION_AS_READ
    ]),
    ...mapActions([GLOBAL_ACTIONS_TYPES.ROUTER_REPLACE]),
    ...mapActions("selectedCase", [
      SELECTED_CASE_ACTIONS_TYPES.FETCH_CASE_DETAILS
    ]),
    selectNotification() {
      if (!this.notification.isRead) {
        this[NOTIFICATION_ACTION_TYPES.PATCH_NOTIFICATION_AS_READ](
          this.notification
        );
      }
      const isActualCase = this.currentPath.includes(
        `/my-cases/${this.notification.caseId}`
      );
      if (!isActualCase) {
        this[GLOBAL_ACTIONS_TYPES.ROUTER_REPLACE](
          `/my-cases/${this.notification.caseId}`
        );
        this[SELECTED_CASE_ACTIONS_TYPES.FETCH_CASE_DETAILS](
          this.notification.caseId
        );
      }
    }
  },
  computed: {
    ...mapState({
      currentPath: state => state.currentRoutePath
    }),
    notificationDescriptionText() {
      const { triggerUser, notificationType, projectName } = this.notification;
      const payload = {
        userName: triggerUser.name,
        projectName
      };
      return NotificationsText[notificationType](payload);
    },
    notificationTimestamp() {
      return format(new Date(this.notification.createdAt), "Pp");
    },
    notificationIcon() {
      let icon = "user-avatar";
      if (!this.notification.isRead) icon += "-green";
      icon += ".svg";
      return require(`@/assets/img/${icon}`);
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  text-align: left;
}

.mainContent {
  display: flex;
  justify-content: space-between;
}

.notificationDescription {
  white-space: normal;
  font-family: "Roboto-light";
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.3px;
  color: var(--color-dark-grey);
}

.notification {
  margin: 12px 0px;
}

.timestamp {
  font-family: "Roboto-light";
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  text-align: right;
  color: var(--color-light-grey);
}

.icon {
  height: 24px;
  width: 24px;
}
</style>
