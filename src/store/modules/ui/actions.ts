import { MUTATIONS_TYPES, ACTIONS_TYPES } from "./types";
import Vue from "vue";
import { ActionContext } from "vuex";
import { RootStateWithModulesState } from "../../";
import { UIState } from "./";
import { Message } from "@/types";
// import {
//   caseAuthorIntroSteps,
//   reviewerIntroSteps,
//   mdIntroSteps,
//   IntroStep
// } from "@/constants/introSteps";
import { CaseStatus, UserRoles } from "@/types";
import {
  ACTIONS_TYPES as MODAL_ACTIONS_TYPES,
  ModalComponents
} from "@/store/modules/modal/types";
import { MUTATIONS_TYPES as SELECTED_CASE_MUTATIONS_TYPES } from "@/store/modules/selectedCase/types";
// import { Intro } from "@/helpers/introJs";

export default {
  [ACTIONS_TYPES.SHOW_MESSAGE](
    { commit }: ActionContext<UIState, RootStateWithModulesState>,
    message: Message
  ) {
    const { text, ...rest } = message;
    commit(MUTATIONS_TYPES.SET_MESSAGE, message);
    Vue.toasted.show(text, rest);
  },
  [ACTIONS_TYPES.HANDLE_CASE_INTRO]({
    commit,
    dispatch,
    rootState,
    rootGetters
  }: ActionContext<UIState, RootStateWithModulesState>) {
    const isMatchIndustry = () => {
      if (Array.isArray(rootState.selectedCase.industries)) {
        return rootState.selectedCase.industries.some(
          industry =>
            industry?.industryId === rootState.user?.industry?.industryId
        );
      } else if (rootState.selectedCase.industries) {
        return (
          rootState.selectedCase.industries.industryId ===
          rootState.user.industry.industryId
        );
      } else return null;
    };
    const initInEditMode =
      (rootState.user.userId === rootState.selectedCase.author?.userId &&
        rootState.selectedCase.status === CaseStatus.opened) ||
      (rootState.user?.isBICReviewer &&
        rootState.selectedCase.status === CaseStatus.submitted) ||
      (rootState.user.userId === rootState.selectedCase.reviewerMD?.userId &&
        rootState.selectedCase.status === CaseStatus.approvedByKM);

    commit(
      `selectedCase/${SELECTED_CASE_MUTATIONS_TYPES.SET_EDIT_MODE}`,
      initInEditMode,
      {
        root: true
      }
    );
    // const startIntro = (introSteps: IntroStep[]): void => {
    //   const intro = Intro.getInstance();
    //   intro.initialize(introSteps);
    //   intro.start();
    // };
    // const manageIntro = () => {
    //   if (rootState.selectedCase) {
    //     if (
    //       rootState.selectedCase.status === CaseStatus.opened &&
    //       rootGetters["selectedCase/caseStatus"] === 0 &&
    //       rootGetters["selectedCase/userRole"] === UserRoles.author
    //     )
    //       return startIntro(caseAuthorIntroSteps);
    //     if (
    //       rootState.selectedCase.status === CaseStatus.submitted &&
    //       rootState.user.userId === rootState.selectedCase.reviewerMD?.userId
    //     )
    //       return startIntro(mdIntroSteps);
    //     if (
    //       rootState.selectedCase.status === CaseStatus.submitted &&
    //       rootState.user.isBICReviewer
    //     )
    //       return startIntro(reviewerIntroSteps);
    //   }
    // };
    const arrayRoute = rootState.currentRoutePath.split("/");
    if (arrayRoute[1] === "my-cases" && arrayRoute.length > 3) {
      if (
        rootState.selectedCase.status === CaseStatus.opened &&
        rootGetters["selectedCase/userRole"] === UserRoles.author &&
        !rootState.ui.shownClientInfo
      ) {
        // setTimeout(() => {
        //   dispatch(
        //     `modal/${MODAL_ACTIONS_TYPES.OPEN_MODAL}`,
        //     {
        //       component: ModalComponents.CLIENT_INFORMATION,
        //       props: {
        //         selectedCase: rootState.selectedCase
        //       }
        //     },
        //     { root: true }
        //   );
        //   commit(MUTATIONS_TYPES.SHOWN_CLIENT_INFO, true);
        // }, 1000);
      } else if (!rootState.ui.shownIntroSteps) {
        // manageIntro();
        commit(MUTATIONS_TYPES.SHOWN_INTRO_STEPS, true);
      }
    } else if (!rootState.ui.shownIntroSteps) {
      // manageIntro();
      commit(MUTATIONS_TYPES.SHOWN_INTRO_STEPS, true);
    }
  }
};
