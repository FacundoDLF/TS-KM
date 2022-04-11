<template>
  <div class="stickyContainer">
    <div class="leftBar">
      <div id="steps" class="flexColumn">
        <button
          class="stepButton"
          :class="{
            stepActive: isActive(zeroTab.route)
          }"
          :key="0"
          :disabled="isActive(zeroTab.route)"
          @click="selectPrimaryStep(zeroTab)"
          @mouseleave="setHoveredStep(null)"
          @mouseenter="setHoveredStep(zeroTab.id)"
        >
          <div>
            <img
              class="icon"
              :src="
                require('@/assets/img/' +
                  zeroTab.logo +
                  (isActive(zeroTab.route) ? '-white' : '-green') +
                  '-logo.svg')
              "
            />
            <span class="title">
              {{ zeroTab.title }}
            </span>
          </div>
          <div class="stepStatus">
            <img
              v-if="status[0] == 100"
              class="icon"
              :src="
                require('@/assets/img/check-primary-step' +
                  (isActive(zeroTab.route) ? '-white' : '-green') +
                  '-logo.svg')
              "
            />
            <img
              v-else-if="tabHasError(zeroTab.route)"
              class="icon"
              :src="
                require('@/assets/img/error-step-logo' +
                  (isActive(zeroTab.route) ? '-white' : '-red') +
                  '.svg')
              "
            />
            <span v-else class="status" @click="!isActive(zeroTab.route)">
              {{ `${status[0]}%` }}
            </span>
          </div>
        </button>
        <button
          class="stepButton"
          :class="{
            stepActive: isActive(firstTab.route)
          }"
          :key="1"
          :disabled="isActive(firstTab.route)"
          @click="selectPrimaryStep(firstTab)"
          @mouseleave="setHoveredStep(null)"
          @mouseenter="setHoveredStep(firstTab.id)"
        >
          <div>
            <img
              class="icon"
              :src="
                require('@/assets/img/' +
                  firstTab.logo +
                  (isActive(firstTab.route) ? '-white' : '-green') +
                  '-logo.svg')
              "
            />
            <span class="title">
              {{ firstTab.title }}
            </span>
          </div>
          <div class="stepStatus">
            <img
              v-if="status[1] == 100"
              class="icon"
              :src="
                require('@/assets/img/check-primary-step' +
                  (isActive(firstTab.route) ||
                  (!isActive(firstTab.route) && tabHasError(firstTab.route))
                    ? '-white'
                    : '-green') +
                  '-logo.svg')
              "
            />
            <img
              v-else-if="tabHasError(firstTab.route)"
              class="icon"
              :src="
                require('@/assets/img/error-step-logo' +
                  (isActive(firstTab.route) ? '-white' : '-red') +
                  '.svg')
              "
            />
            <span v-else class="status" @click="!isActive(firstTab.route)">
              {{ `${status[1]}%` }}
            </span>
          </div>
        </button>
        <button
          class="stepButton"
          :class="{
            stepActive: isActive(secondTab.route)
          }"
          :key="2"
          :disabled="isActive(secondTab.route)"
          @click="selectPrimaryStep(secondTab)"
          @mouseleave="setHoveredStep(null)"
          @mouseenter="setHoveredStep(secondTab.id)"
        >
          <div>
            <img
              class="icon"
              :src="
                require('@/assets/img/' +
                  secondTab.logo +
                  (isActive(secondTab.route) ? '-white' : '-green') +
                  '-logo.svg')
              "
            />

            <span class="title">
              {{ secondTab.title }}
            </span>
          </div>
          <div class="stepStatus">
            <img
              v-if="status[2] == 100"
              class="icon"
              :src="
                require('@/assets/img/check-primary-step' +
                  (isActive(secondTab.route) ? '-white' : '-green') +
                  '-logo.svg')
              "
            />
            <img
              v-else-if="tabHasError(secondTab.route)"
              class="icon"
              :src="
                require('@/assets/img/error-step-logo' +
                  (isActive(secondTab.route) ? '-white' : '-red') +
                  '.svg')
              "
            />
            <span v-else class="status" @click="!isActive(secondTab.route)">
              {{ `${status[2]}%` }}
            </span>
          </div>
        </button>
      </div>
      <button
        class="stepButton"
        id="resultsStep"
        :class="{
          stepActive: isActive(thirdTab.route)
        }"
        :key="3"
        :disabled="isActive(thirdTab.route)"
        @click="selectPrimaryStep(thirdTab)"
        @mouseleave="setHoveredStep(null)"
        @mouseenter="setHoveredStep(thirdTab.id)"
      >
        <div>
          <img
            class="icon"
            :src="
              require('@/assets/img/' +
                thirdTab.logo +
                (isActive(thirdTab.route) ? '-white' : '-green') +
                '-logo.svg')
            "
          />
          <span class="title">
            {{ thirdTab.title }}
          </span>
        </div>
        <div class="stepStatus">
          <img
            v-if="status[3] == 100"
            class="icon"
            :src="
              require('@/assets/img/check-primary-step' +
                (isActive(thirdTab.route) ? '-white' : '-green') +
                '-logo.svg')
            "
          />
          <img
            v-else-if="tabHasError(thirdTab.route)"
            class="icon"
            :src="
              require('@/assets/img/error-step-logo' +
                (isActive(thirdTab.route) ? '-white' : '-red') +
                '.svg')
            "
          />
          <span v-else class="status" @click="!isActive(thirdTab.route)">
            {{ `${status[3]}%` }}
          </span>
        </div>
      </button>
      <button
        class="stepButton"
        id="resultsStep"
        :class="{
          stepActive: isActive(fourthTab.route)
        }"
        :key="4"
        :disabled="isActive(fourthTab.route)"
        @click="selectPrimaryStep(fourthTab)"
        @mouseleave="setHoveredStep(null)"
        @mouseenter="setHoveredStep(fourthTab.id)"
      >
        <div>
          <img
            class="icon"
            :src="
              require('@/assets/img/' +
                fourthTab.logo +
                (isActive(fourthTab.route) ? '-white' : '-green') +
                '-logo.svg')
            "
          />
          <span class="title">
            {{ fourthTab.title }}
          </span>
        </div>
        <div class="stepStatus">
          <img
            v-if="status[4] == 100"
            class="icon"
            :src="
              require('@/assets/img/check-primary-step' +
                (isActive(fourthTab.route) ? '-white' : '-green') +
                '-logo.svg')
            "
          />
          <span v-else class="status" @click="!isActive(fourthTab.route)">
          </span>
        </div>
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { ACTIONS_TYPES as GLOBAL_ACTIONS_TYPES } from "@/store/types";
import { Routes } from "@/constants/routes";
import { UserRoles, CaseStatus } from "@/types";
import { ACTIONS_TYPES as MODAL_ACTIONS_TYPES } from "@/store/modules/modal/types";
// import { Intro } from "@/helpers/introJs";

export default {
  name: "PrimaryStep",
  data() {
    return {
      hoveredStep: null
    };
  },
  props: {
    fromIndex: {
      type: Boolean
    }
  },
  computed: {
    ...mapState({
      primaryStepTabs: state => state.primaryStepTabs,
      currentRoutePath: state => state.currentRoutePath,
      primaryStep: state => state.selectedCase.primaryStep,
      bicReviewer: state => state.selectedCase.reviewerBIC,
      selectedCaseStatus: state => state.selectedCase.status,
      user: state => state.user,
      selectedCase: state => state.selectedCase
    }),
    ...mapGetters("selectedCase/situation", [
      "situationErrorsFirstStep",
      "situationErrorsSecondStep",
      "situationErrorsThirdStep"
    ]),
    ...mapGetters("selectedCase/clientInformation", [
      "clientInfoErrorsFirstStep"
    ]),
    ...mapGetters("selectedCase/approach", [
      "approachErrorsFirstStep",
      "approachErrorsSecondStep"
    ]),
    ...mapGetters("selectedCase/results", [
      "resultsErrorsFirstStep",
      "resultsErrorsSecondStep",
      "resultsErrorsThirdStep"
    ]),
    ...mapGetters("ui", [
      "activePrimaryStep",
      "showPrimaryStepAndFooterInLayout",
      "showPrimaryStep"
    ]),
    ...mapGetters("selectedCase", [
      "clientInfoStatus",
      "situationStatus",
      "approachStatus",
      "resultsStatus",
      "caseStatus",
      "isEditableCase",
      "userRole"
    ]),
    isCaseAuthor() {
      return this.userRole === UserRoles.author;
    },
    isReviewer() {
      return this.userRole === UserRoles.reviewer;
    },
    isCaseOpen() {
      return this.selectedCaseStatus === CaseStatus.opened;
    },
    isSubmitted() {
      return this.selectedCaseStatus === CaseStatus.submitted;
    },
    isApproved() {
      return this.selectedCaseStatus === CaseStatus.approvedByMD;
    },
    isBicReviewer() {
      return this.user.isBICReviewer;
    },
    status() {
      return [
        this.clientInfoStatus,
        this.situationStatus,
        this.approachStatus,
        this.resultsStatus,
        this.caseStatus
      ];
    },

    zeroTab() {
      return this.primaryStepTabs[0];
    },
    firstTab() {
      return this.primaryStepTabs[1];
    },
    secondTab() {
      return this.primaryStepTabs[2];
    },
    thirdTab() {
      return this.primaryStepTabs[3];
    },
    fourthTab() {
      return this.primaryStepTabs[4];
    }
  },
  async created() {
    if (!this.user) {
      await this[GLOBAL_ACTIONS_TYPES.GET_USER_BY_TOKEN]();
    }
  },
  // beforeDestroy() {
  //   const intro = Intro.getInstance();
  //   intro.stop();
  // },
  methods: {
    isActive(route) {
      return route.includes(this.primaryStep);
    },
    ...mapActions([
      GLOBAL_ACTIONS_TYPES.ROUTER_PUSH,
      GLOBAL_ACTIONS_TYPES.ROUTER_REPLACE,
      GLOBAL_ACTIONS_TYPES.FETCH_URL_VALUES,
      GLOBAL_ACTIONS_TYPES.GET_USER_BY_TOKEN
    ]),
    ...mapActions("modal", [MODAL_ACTIONS_TYPES.OPEN_MODAL]),
    setHoveredStep(id) {
      this.hoveredStep = id;
    },
    selectPrimaryStep(step) {
      if (!this.currentRoutePath.includes(step.route)) {
        if (!this.showPrimaryStepAndFooterInLayout && this.showPrimaryStep) {
          this[GLOBAL_ACTIONS_TYPES.ROUTER_PUSH](step.route);
        } else {
          this[GLOBAL_ACTIONS_TYPES.ROUTER_REPLACE](
            `${Routes.MY_CASES}/${this.$route.params.id + step.route}/1`
          );
        }
        this[GLOBAL_ACTIONS_TYPES.FETCH_URL_VALUES]();
      }
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    },
    tabHasError(route) {
      switch (route) {
        case Routes.AVAILABLE_CASE_DATA:
          return this.clientInfoErrorsFirstStep > 0;
        case Routes.SITUATION:
          return (
            this.situationErrorsFirstStep > 0 ||
            this.situationErrorsSecondStep > 0 ||
            this.situationErrorsThirdStep > 0
          );
        case Routes.APPROACH:
          return (
            this.approachErrorsFirstStep > 0 ||
            this.approachErrorsSecondStep > 0
          );
        case Routes.RESULTS:
          return (
            this.resultsErrorsFirstStep > 0 ||
            this.resultsErrorsSecondStep > 0 ||
            this.resultsErrorsThirdStep > 0
          );
        default:
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.stickyContainer {
  // height: calc(100vh - 50px);
  display: flex;
  justify-content: center;
  align-items: center;
  position: sticky;
  margin-top: 50px;
  margin-left: 30px;
  top: 50px;
  width: 250px;
}

.normalContainer {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}
.centerContainer {
  align-self: center;
}

.fixContainer {
  align-self: flex-start;
}

.leftBar {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.leftBar .stepButton {
  display: flex;
  align-content: center;
  justify-content: space-between;
  transition: background-color 0.3s ease;
  color: var(--color-dark);
  background-color: var(--color-grey);
  width: 275px;
  height: 40px;
  margin-bottom: 4px;
  padding: 0px 10px;
}

.leftBar .stepButton .title {
  line-height: 1em;
  display: inline-block;
  padding: 7px 0 0 3px;
}

.stepStatus {
  margin-left: 30px;
}

.leftBar .stepButton .status {
  font-size: 15px;
  margin-left: 15px;
}

.leftBar .icon {
  height: 25px;
  width: 25px;
}

.mainSelection {
  display: flex;
  align-self: center;
  justify-self: center;
  grid-template-columns: 21;
  box-sizing: border-box;
}

.mainSelection .stepButton {
  color: var(--color-green);
  background-color: var(--color-light-grey-background);
  width: 180px;
  height: 180px;
  padding-top: 30px;
  margin: 0px 15px;
}

.mainSelection .stepButton:hover {
  background-color: var(--color-green);
  color: var(--color-white);
  .status {
    color: var(--color-white);
  }
}

.mainSelection .stepButton .title {
  font-size: 15px;
}

.mainSelection .stepButton .status {
  color: var(--color-green);
  font-size: 12px;
}

.mainSelection .icon {
  height: 70px;
  width: 70px;
}

.stepButton {
  display: flex;
  align-items: center;
}

.leftBar .stepActive {
  background-color: var(--color-green-tone-two);
  color: var(--color-white);
}

.status {
  text-transform: uppercase;
}

.flexRow {
  display: flex;
}
.flexColumn {
  display: flex;
  flex-direction: column;
}
</style>
