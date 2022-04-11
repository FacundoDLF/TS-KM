<template>
  <nav class="row header">
    <div class="menuContainer">
      <button
        :class="[{ open: isMenuOpen }, 'menuButton']"
        @click="toggleIsMenuOpen"
      >
        <div class="barMenuButton" />
        <div class="barMenuButton" />
        <div class="barMenuButton" />
      </button>
      <div class="col-sm-auto iconContainer">
        <img class="icon" src="@/assets/img/logo-alix.svg" />
        <div class="bar" />
        <div id="layoutTitle" class="logo iconText">
          <span class="desktopTitle">Integrated Case Platform</span>
          <span class="mobileTitle">ICP</span>
        </div>
      </div>
    </div>
    <div class="tabsContainer">
      <div
        class="navBarContainer"
        @click="closeMenu"
        :class="{ openMenu: isMenuOpen }"
      >
        <b-button-group :class="{ openMenu: isMenuOpen }" class="navButtons">
          <button
            :id="tab.name"
            v-for="tab in tabs"
            :key="tab.name"
            @click="goTo(tab.route)"
            class="col-sm-12 col-md-auto buttonTab"
            :class="{ layoutButtonActive: isActive(tab.route) }"
          >
            {{ tab.name }}
          </button>
        </b-button-group>
      </div>
      <div class="endIcons">
        <button class="faqIcon">
          <div
            class="col-sm-12 col-md-auto buttonTab faqText"
            :class="{ layoutButtonActive: isActive(faqs.route) }"
          >
            <a class="externalLink" :href="'mailto:' + email">
              Need help
            </a>
          </div>
          <img
            class="icon"
            v-if="isActive(faqs.route)"
            src="@/assets/img/faqs-logo-white.svg"
          />
          <img class="icon" v-else src="@/assets/img/faqs-logo-grey.svg" />
        </button>
        <button
          class="navButtons ml-3"
          @click="toggleNotificationsVisualization"
        >
          <a class="notificationAlert">
            <img class="icon" src="@/assets/img/notification.svg" />
            <span v-if="hasNewNotifications" class="badge">
              {{ nonReadNotificationsLength }}
            </span>
          </a>
          <NotificationsBox :show="isShowNotifications" />
        </button>
        <div class="profileDropdown">
          <button
            @click="profileDropdown"
            @blur="closeProfile"
            class="userLogo"
          >
            <span class="userName">{{ getNameToShow }}</span>
          </button>
          <div class="dropdown" v-show="profileState">
            <button @click="logout" class="dropdownOption">Logout</button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import NotificationsBox from "./NotificationsBox.vue";
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import { ACTIONS_TYPES as GLOBAL_ACTIONS_TYPES } from "@/store/types";
import { MUTATIONS_TYPES as UI_MUTATIONS_TYPES } from "@/store/modules/ui/types";
import { MUTATIONS_TYPES as NOTIFICATIONS_MUTATIONS_TYPES } from "@/store/modules/notifications/types";

export default {
  name: "Header",
  data() {
    return {
      tabs: [
        // {
        //   name: "Search",
        //   route: "/search"
        // },
        {
          name: "My cases",
          route: "/my-cases"
        }
      ],
      faqs: {
        name: "FAQS"
      },
      profileState: false,
      email: process.env.VUE_APP_NEED_HELP_EMAIL
    };
  },
  methods: {
    ...mapActions([GLOBAL_ACTIONS_TYPES.ROUTER_REPLACE]),
    ...mapMutations("ui", [UI_MUTATIONS_TYPES.SET_MENU_OPEN]),
    ...mapMutations("notifications", [
      NOTIFICATIONS_MUTATIONS_TYPES.SET_NOTIFICATIONS_VISUALIZATION
    ]),
    goTo(route) {
      if (this.$route.path !== route) {
        this[GLOBAL_ACTIONS_TYPES.ROUTER_REPLACE](route);
      }
    },
    isActive(route) {
      const currentURL =
        this.$route.path[this.$route.path.length - 1] === "/"
          ? this.$route.path.substring(0, this.$route.path.length - 1)
          : this.$route.path;
      return currentURL === route;
    },
    toggleNotificationsVisualization() {
      this[NOTIFICATIONS_MUTATIONS_TYPES.SET_NOTIFICATIONS_VISUALIZATION](
        !this.isShowNotifications
      );
    },
    toggleIsMenuOpen() {
      this[UI_MUTATIONS_TYPES.SET_MENU_OPEN](!this.isMenuOpen);
    },
    profileDropdown() {
      this.profileState = !this.profileState;
    },
    closeProfile() {
      setTimeout(() => {
        this.profileState = false;
      }, 300);
    },
    closeMenu() {
      this[UI_MUTATIONS_TYPES.SET_MENU_OPEN](false);
    },
    logout() {
      window.location = `/.auth/logout`;
    }
  },
  computed: {
    ...mapState({
      userProfile: state => state.userProfile,
      isMenuOpen: state => state.ui.isMenuOpen,
      casesList: state => state.cases.casesList,
      isShowNotifications: state => state.notifications.isShowNotifications
    }),
    ...mapGetters({
      nonReadNotificationsLength: `notifications/nonReadNotificationsLength`
    }),
    filteredTabs() {
      return this.tabs.filter(
        tab => tab.route !== "/my-cases" || this.casesList.length
      );
    },
    hasNewNotifications() {
      return (
        this.nonReadNotificationsLength && this.nonReadNotificationsLength > 0
      );
    },
    getNameToShow() {
      const givenName = this.userProfile.given_name;
      const familyName = this.userProfile.family_name;
      const userInitials = `${givenName.length > 0 ? givenName[0] : ""}${
        familyName.length > 0 ? familyName[0] : ""
      }`;

      return userInitials;
    }
  },
  components: {
    NotificationsBox
  }
};
</script>

<style lang="scss" scoped>
.header {
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
  width: 100%;
  min-height: 50px;
  height: auto;
  background: var(--color-dark-grey);
}

.notificationAlert {
  position: relative;
}

.badge {
  position: absolute;
  right: -8px;
  top: -8px;
  padding: 3px 6px;
  border-radius: 50%;
  background-color: var(--color-green);
  color: var(--color-white);
}

.menuButton {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 1.5rem;
  height: 1.5rem;
  margin-left: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 15;
  transition: all 0.3s linear;

  &:focus {
    outline: 0;
  }

  .barMenuButton {
    width: 1.5rem;
    height: 0.25rem;
    background: var(--color-white);
    border-radius: 10px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;
  }
}

.desktopTitle {
  display: none;
}

.open {
  .barMenuButton:nth-child(1) {
    transform: rotate(45deg);
  }
  .barMenuButton:nth-child(2) {
    opacity: 0;
    transform: translateX(20px);
  }
  .barMenuButton:nth-child(3) {
    transform: rotate(-45deg);
  }
}

.navBarContainer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100vh;
  z-index: 3;
  transition: left 0.6s;
}

.externalLink {
  text-decoration: none;
  color: inherit;
}

.tabsContainer {
  display: flex;
  align-items: center;
  margin-right: 15px;
}

.menuContainer {
  display: flex;
}

.icon {
  height: 24px;
  width: 24px;
}

.iconContainer {
  display: flex;
  width: auto;
  margin: 0px;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20px;
  color: var(--color-white);
}

.bar {
  width: 2px;
  height: 24px;
  background: var(--color-green);
  margin-left: 10px;
}

.iconText {
  height: 100%;
  margin-left: 10px;
  font-size: 19px;
}

.layoutButtonActive {
  color: var(--color-white) !important;
}

.navButtons {
  display: block;
  background: var(--color-dark-grey);
  position: absolute;
  height: calc(100vh - 50px);
  top: 50px;
  max-width: 200px;
  left: -60%;
  z-index: 4;
  width: 60%;
  min-width: 150px;
  transition: left 0.6s;
}

.buttonTab {
  display: flex;
  flex-wrap: nowrap;
  color: var(--color-medium-light-grey);
  font-size: 20px;
  margin-right: 20px;
  margin-top: 10px;
}

.endIcons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 13px 0px;
  height: 24px;
  border-left: 2px solid var(--color-dark-grey-border);
}

.faqText {
  display: none;
}

.faqIcon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 15px;
}

.userLogo {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 23px;
  height: 23px;
  margin-left: 25px;
  border-radius: 25px;
  background: var(--color-green);
}

.userName {
  position: relative;
  line-height: 25px;
  font-weight: 700;
  height: 25px;
  color: var(--color-white);
  font-size: 12px;
}

.profileDropdown {
  position: relative;
}

.dropdown {
  position: absolute;
  min-width: 150px;
  border: 0.5px solid var(--color-medium-light-grey);
  background: var(--color-white);
  right: 0;
  top: 35px;
  z-index: 2;
}

.dropdownOption {
  font-size: 16px;
  color: var(--color-dark-blue);
  font-weight: 400;
  padding: 10px 20px;
  width: 100%;
  z-index: 2;
  text-align: inherit;
  white-space: nowrap;
}

.openMenu {
  left: 0;
}

@media screen and (min-width: 960px) {
  .header {
    height: 50px;
  }

  .menuButton {
    display: none;
  }

  .desktopTitle {
    display: block;
  }

  .mobileTitle {
    display: none;
  }

  .navBarContainer {
    position: relative;
    top: auto;
    left: auto;
    width: auto;
    height: auto;
    z-index: 3;
  }

  .tabsContainer {
    margin-right: 25px;
  }

  .navButtons {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: none;
    position: relative;
    height: auto;
    top: auto;
    max-width: auto;
    left: auto;
    width: auto;
    min-width: auto;
    padding: 5px 0px;
    min-height: 50px !important;
  }

  .faqText {
    display: block;
    margin-right: 0px;
    padding-right: 10px;
  }

  .iconContainer {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    margin-left: 15px;
  }

  .buttonTab {
    margin: 0;
  }

  .faqIcon {
    margin-left: 5px;
  }
}
</style>
