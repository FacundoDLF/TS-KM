<script>
import Vue from "vue";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import ClientInformation from "./clientInformation";
import Situation from "./situation";
import Approach from "./approach";
import Results from "./results";
import ErrorInStep from "./errorInStep";
import PreviewPpt from "./previewPpt";
import PrimaryStep from "@/components/layouts/shared/PrimaryStep";
import ProgressBar from "@/components/shared/ProgressBar";
import { ACTIONS_TYPES as GLOBAL_ACTIONS_TYPES } from "@/store/types";
import {
  ACTIONS_TYPES as SELECTED_CASE_ACTIONS_TYPES,
  MUTATIONS_TYPES as SELECTED_CASE_MUTATIONS_TYPES
} from "@/store/modules/selectedCase/types";
import router from "@/router";
import QuestionsData from "@/data/QuestionsData";
import findQuestionInState from "@/helpers/findQuestionInState";

const Component = Vue.extend({
  name: "SingularCase",
  components: {
    PrimaryStep,
    ProgressBar
  },
  computed: {
    ...mapState({
      primaryStepTabs: state => state.primaryStepTabs,
      currentRoutePath: state => state.currentRoutePath,
      userProfile: state => state.userProfile,
      user: state => state.user,
      isSessionExpired: state => state.isSessionExpired,
      isFetching: state => state.isFetching,
      isFetchingClientInfo: state => state.selectedCase.isFetchingClientInfo,
      primaryStep: state => state.selectedCase.primaryStep,
      projectName: state => state.selectedCase.projectName,
      selectedCase: state => state.selectedCase
    }),
    ...mapGetters("selectedCase", ["caseStatus"])
  },
  methods: {
    ...mapActions("selectedCase", [
      SELECTED_CASE_ACTIONS_TYPES.FETCH_CASE_DETAILS,
      SELECTED_CASE_ACTIONS_TYPES.SET_CASE_QUESTIONS,
      SELECTED_CASE_ACTIONS_TYPES.HANDLE_EDIT_MODE
    ]),
    ...mapActions([GLOBAL_ACTIONS_TYPES.ROUTER_PUSH]),
    ...mapMutations("selectedCase", [
      SELECTED_CASE_MUTATIONS_TYPES.REMOVE_ERROR,
      SELECTED_CASE_MUTATIONS_TYPES.SET_IS_ERROR
    ])
  },
  async created() {
    await this[SELECTED_CASE_ACTIONS_TYPES.SET_CASE_QUESTIONS]();
    await this[SELECTED_CASE_ACTIONS_TYPES.FETCH_CASE_DETAILS](
      router.currentRoute.params.id
    );
    await this[SELECTED_CASE_ACTIONS_TYPES.HANDLE_EDIT_MODE]();
    if (
      !this.primaryStep &&
      this.user.userId !== this.selectedCase.author?.userId
    ) {
      this[GLOBAL_ACTIONS_TYPES.ROUTER_PUSH](`/client-information/1`);
    }
  },
  beforeDestroy() {
    QuestionsData.map(question => {
      if (question.isRequired) {
        if (
          findQuestionInState(
            this.selectedCase[question.questionParent],
            question.id
          )?.answer === ""
        ) {
          this[SELECTED_CASE_MUTATIONS_TYPES.SET_IS_ERROR](false);
          this[SELECTED_CASE_MUTATIONS_TYPES.REMOVE_ERROR](
            findQuestionInState(
              this.selectedCase[question.questionParent],
              question.id
            )
          );
        }
      }
    });
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(h) {
    if (this.isFetching) {
      return (
        <div class="spinner">
          <b-spinner />
        </div>
      );
    } else {
      switch (this.primaryStep) {
        case "client-information":
          if (this.isFetchingClientInfo) {
            return (
              <div class="spinner">
                <b-spinner />
              </div>
            );
          } else return <ClientInformation />;
        case "situation":
          return <Situation />;

        case "approach":
          return <Approach />;

        case "results":
          return <Results />;

        case "preview-ppt":
          return <PreviewPpt />;

        case "error-in-step":
          return <ErrorInStep />;

        default:
          return (
            <div class="view-container">
              <PrimaryStep class="steps" fromIndex />
              <div class="defaultContainer" id="welcomeMessage">
                <h1 class="title">{this.projectName} case story</h1>
                <h2 class="subtitle">Hi {this.userProfile.given_name},</h2>
                <h2 class="subtitle">
                  The <span class="boldText">Integrated Case Platform</span> is
                  designed to assist you in writing up the relevant and valuable
                  information pertaining to your engagement. Complete the
                  sections on the left, all{" "}
                  <span class="boldText">changes are auto-saved</span>. All
                  fields marked with an asterisk (*) are required.
                </h2>
                <div class="stepsContainer">
                  <div class="rowContainer">
                    <img
                      class="icon"
                      src={require("@/assets/img/case-data-logo.svg")}
                    />
                    <p class="rowText">
                      Review and update existing engagement information in{" "}
                      <span class="boldText">Available Case Data</span>, there
                      may be details about this project that changed.
                    </p>
                  </div>
                  <div class="rowContainer">
                    <img
                      class="icon"
                      src={require("@/assets/img/situation-logo.svg")}
                    />
                    <p class="rowText">
                      Don't wait until the project is over to get started. The{" "}
                      <span class="boldText">Situation</span> section can be
                      completed now, elements of the Approach section can be
                      started. All changes are autosaved so you can{" "}
                      <span class="boldText">
                        come back and continue where you left off
                      </span>
                      .
                    </p>
                  </div>
                  <div class="rowContainer">
                    <img
                      class="icon"
                      src={require("@/assets/img/results-logo.svg")}
                    />
                    <p class="rowText">
                      When you finish your engagement, complete the{" "}
                      <span class="boldText">Results</span> questions by adding
                      information about the impact and outcome.
                    </p>
                  </div>
                  <div class="rowContainer">
                    <img
                      class="icon"
                      src={require("@/assets/img/ppt-preview-logo.svg")}
                    />
                    <p class="rowText">
                      Your case will be displayed in multiple, client-ready
                      outputs. You can preview the output by selecting{" "}
                      <span class="boldText">Preview PPT</span>.
                    </p>
                  </div>
                  <div class="rowContainer">
                    <img
                      class="icon"
                      src={require("@/assets/img/checked-logo.svg")}
                    />
                    <p class="rowText">
                      Once you have submitted the case, the{" "}
                      <span class="boldText">Knowledge Management</span> team
                      will receive the case an review it for publishing.
                    </p>
                  </div>
                </div>
                <ProgressBar
                  class="caseBar"
                  title="engagement"
                  percentage={this.caseStatus}
                />
                <div class="caseContainer"></div>
              </div>
            </div>
          );
      }
    }
  }
});

export default Component;
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0px !important;
  max-width: 100% !important;
  height: 100%;
  align-items: flex-start;
}

.view-container {
  display: flex;
  width: 100%;
}

.steps {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  position: sticky;
  margin-top: 50px;
  margin-left: 19px;
  top: 50px;
  width: 450px;
  margin-right: 50px;
}

.caseBar {
  width: 100%;
}

.stepsContainer {
  margin-top: 30px;
}

@keyframes slideup {
  from {
    transform: translate(0, 50%);
  }
  to {
    transform: translate(0, 0);
  }
}

@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.defaultContainer {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 50px;
  padding-left: 100px;
  padding-right: 120px;
  margin-right: 120px;
}

.boldText {
  font-weight: 600;
  font-family: var(--secondary-font);
}

.rowContainer {
  display: flex;
  align-content: center;
  margin-bottom: 30px;
}

.icon {
  height: 41px;
  width: 41px;
  margin-right: 20px;
}

.rowText {
  font-size: 15px;
  font-weight: 400;
  font-family: var(--secondary-font);
}

.stepStatus {
  margin-left: 30px;
}

// .caseContainer {
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   align-items: center;
//   // width: 455px;
//   padding: 0px 0 0 0 !important;
//   max-width: 100% !important;
//   height: 100%;
// }

.title {
  text-align: left;
  margin-bottom: 30px;
  font-size: 23px;
  color: var(--color-black);
  font-weight: 400;
  font-family: var(--secondary-font);
}

.subtitle {
  text-align: left;
  margin-bottom: 10px;
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  color: var(--color-black);
  font-family: var(--secondary-font);
}

.spinner {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 350px;
}

.spinner-border {
  color: var(--color-green);
  width: 50px;
  height: 50px;
}
</style>
