<template>
  <div
    v-if="isShowNotifications"
    class="notificationsBox"
    v-on-clickaway="toggleNotificationsVisualization"
  >
    <div class="notificationsHeader">
      <h6>Notifications</h6>
      <button
        @click="markAllAsRead"
        class="notificationsBell"
        v-if="nonReadNotificationsLength"
      >
        <h6>Mark all as read</h6>
      </button>
    </div>
    <div class="notifications">
      <Notifications
        v-for="notification in notifications"
        :key="notification.id"
        :notification="notification"
      />
      <span v-if="notifications.length == 0" class="noData"
        >No new notifications</span
      >
    </div>
  </div>
</template>

<script>
import Notifications from "./Notification.vue";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { directive as onClickaway } from "vue-clickaway";
import { MUTATIONS_TYPES as NOTIFICATIONS_MUTATIONS_TYPES } from "@/store/modules/notifications/types";
import { ACTIONS_TYPES as NOTIFICATIONS_ACTIONS_TYPES } from "@/store/modules/notifications/types";

export default {
  computed: {
    ...mapState({
      isShowNotifications: state => state.notifications.isShowNotifications,
      notifications: state => state.notifications.notificationsList
    }),
    ...mapGetters({
      nonReadNotificationsLength: `notifications/nonReadNotificationsLength`
    })
  },
  methods: {
    ...mapMutations("notifications", [
      NOTIFICATIONS_MUTATIONS_TYPES.SET_NOTIFICATIONS_VISUALIZATION
    ]),
    ...mapActions("notifications", [
      NOTIFICATIONS_ACTIONS_TYPES.SET_ALL_NOTIFICATIONS_AS_READ
    ]),
    toggleNotificationsVisualization() {
      this[NOTIFICATIONS_MUTATIONS_TYPES.SET_NOTIFICATIONS_VISUALIZATION](
        !this.isShowNotifications
      );
    },
    markAllAsRead() {
      if (this.nonReadNotificationsLength)
        this[NOTIFICATIONS_ACTIONS_TYPES.SET_ALL_NOTIFICATIONS_AS_READ]();
    }
  },
  components: {
    Notifications
  },
  directives: {
    onClickaway
  }
};
</script>

<style lang="scss" scope>
.notificationsHeader {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 24px;
  font-family: var(--secondary-font);
  text-align: left;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.3px;
  border-bottom: 0.7px solid var(--color-grey-border);
}

.noData {
  font-family: var(--secondary-font);
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.3px;
}

.notifications {
  margin: 5px 0px;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 480px;
}

.notificationsBox {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: absolute;
  top: 50px;
  right: 0;
  z-index: 5;
  width: 600px;
  padding: 20px;
  background-color: var(--color-white);
  box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.15);
  animation: fadein 0.6s;
}

@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.notificationsBell {
  color: var(--color-green);
}
</style>
