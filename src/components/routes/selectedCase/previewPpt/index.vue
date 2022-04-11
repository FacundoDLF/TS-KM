<template>
  <div class="pptPreview">
    <span class="title">Preview your PPT</span>
    <p class="subtitle" v-html="actualSubtitle" />
    <div class="options">
      <div class="empty"></div>
      <div class="inputWrapper">
        <div class="links">
          <a @click="goTo('situation')" class="link">EDIT SITUATION</a>
          <a @click="goTo('approach')" class="link">EDIT APPROACH</a>
          <a @click="goTo('results')" class="link">EDIT RESULTS</a>
        </div>
        <button
          @click="manageButtonAction"
          :class="{ hidden: !selectedCase.editMode }"
          class="submitButton"
        >
          {{ actualButtonContent }}
        </button>
      </div>
    </div>
    <div class="pptContainer">
      <div class="exportOptions">
        <img
          v-for="(exportOption, i) in exportOptions"
          :key="i"
          :class="{ active: isActive(exportOption.pptName) }"
          class="exportOption"
          @click="!loading ? managePptChange(exportOption.pptName) : null"
          :src="require(`@/assets/img/${exportOption.logo}`)"
        />
      </div>
      <div class="pptPreviewContainer">
        <div v-if="!actualPpt.guid || loading" class="spinner text-center">
          <b-spinner class="loadingSpinner"> </b-spinner>
        </div>
        <iframe
          v-else
          class="ppt"
          :src="
            `https://alixpartners.sharepoint.com/sites/ICP/_layouts/15/Doc.aspx?sourcedoc={${actualPpt.guid}}&amp;action=embedview&amp;wdAr=1.3333333333333333`
          "
          frameborder="0"
          >Esto es un documento de
          <a target="_blank" href="https://office.com">Microsoft Office</a>
          incrustado con tecnología de
          <a target="_blank" href="https://office.com/webapps">Office</a>.
        </iframe>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getPptByName, PptNames, PptTypes } from "@/helpers/generatePpt";
import { subtitles } from "@/constants/previewPpt";
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";
import { ACTIONS_TYPES as GLOBAL_ACTIONS_TYPES } from "@/store/types";
import { Routes } from "@/constants/routes";
import { CaseStatus, UserRoles } from "@/types";
import { ACTIONS_TYPES as CASE_ACTIONS_TYPES } from "@/store/modules/selectedCase/types";
import {
  ACTIONS_TYPES as MODAL_ACTIONS_TYPES,
  ModalComponents
} from "@/store/modules/modal/types";
import { MUTATIONS_TYPES as SELECTED_CASE_MUTATIONS_TYPES } from "@/store/modules/selectedCase/types";
import QuestionsData from "@/data/QuestionsData";
import { ACTIONS_TYPES as RESULTS_ACTION_TYPES } from "@/store/modules/selectedCase/results/types";
import findQuestionInState from "@/helpers/findQuestionInState";

export default {
  data: () => ({
    ppt: null,
    loading: false,
    ppts: [],
    actualPpt: {
      guid: null,
      name: null
    },
    exportOptions: [
      {
        logo: "three_columns.svg",
        pptName: PptNames.ThreeColumns
      },
      {
        logo: "impacts.svg",
        pptName: PptNames.StatsSlide
      },
      {
        logo: "case_study.svg",
        pptName: PptNames.CaseStudy
      },
      {
        logo: "case_with_graph.svg",
        pptName: PptNames.CaseWithGraph
      },
      {
        logo: "standard_mini_case.svg",
        pptName: PptNames.MiniCaseSummary
      },
      {
        logo: "mini_case_table.svg",
        pptName: PptNames.MiniCaseTable
      },
      {
        logo: "quotes_slide.svg",
        pptName: PptNames.QuotesSlide
      }
    ]
  }),
  computed: {
    ...mapState({
      caseId: state => state.selectedCase.caseId,
      caseStatus: state => state.selectedCase.status,
      selectedCase: state => state.selectedCase,
      user: state => state.user,
      reviewerMD: state => state.selectedCase.reviewerMD,
      token: state => state.accessToken,
      attachment: state => state.selectedCase.file,
      isLoading: state => state.isLoading,
      chartLocation: state =>
        state.selectedCase?.results?.thirdStep?.find(
          a => a.id === "chartLocation"
        )?.answer
    }),
    ...mapGetters("selectedCase", ["caseData", "userRole", "errorsInForm"]),
    isCaseAuthor() {
      return this.userRole === UserRoles.author;
    },
    isMDReviewer() {
      return this.user.userId === this.reviewerMD?.userId;
    },
    isBICReviewer() {
      return this.user.isBICReviewer;
    },
    actualSubtitle() {
      if (this.userRole === UserRoles.author) return subtitles[0];
      if (this.isBICReviewer) return subtitles[1];
      if (this.isMDReviewer) return subtitles[2];
      return subtitles[0];
    },
    actualButtonContent() {
      if (
        (this.isCaseAuthor && this.caseStatus === CaseStatus.opened) ||
        (this.isBICReviewer && this.caseStatus === CaseStatus.submitted)
      )
        return "SUBMIT CASE";
      return "PUBLISH CASE";
    }
  },
  methods: {
    ...mapActions([GLOBAL_ACTIONS_TYPES.ROUTER_REPLACE]),
    ...mapActions("selectedCase/results", [
      RESULTS_ACTION_TYPES.CHECK_METRIC_ERRORS
    ]),
    ...mapActions("modal", [
      MODAL_ACTIONS_TYPES.CLOSE_MODAL,
      MODAL_ACTIONS_TYPES.OPEN_MODAL
    ]),
    ...mapActions("selectedCase", [
      CASE_ACTIONS_TYPES.FETCH_FILE,
      CASE_ACTIONS_TYPES.DELETE_FILE,
      CASE_ACTIONS_TYPES.CHANGE_SECONDARY_STEP,
      CASE_ACTIONS_TYPES.HANDLE_EDIT_MODE
    ]),
    ...mapMutations("selectedCase", [
      SELECTED_CASE_MUTATIONS_TYPES.SET_IS_ERROR,
      SELECTED_CASE_MUTATIONS_TYPES.ADD_ERROR
    ]),
    checkForErrors() {
      this[RESULTS_ACTION_TYPES.CHECK_METRIC_ERRORS]();
      QuestionsData.forEach(question => {
        if (question.isRequired) {
          if (
            findQuestionInState(
              this.selectedCase[question.questionParent],
              question.id
            )?.answer === "" ||
            findQuestionInState(
              this.selectedCase[question.questionParent],
              question.id
            )?.answer === null
          ) {
            this[SELECTED_CASE_MUTATIONS_TYPES.SET_IS_ERROR](true);
            this[SELECTED_CASE_MUTATIONS_TYPES.ADD_ERROR]({
              question: findQuestionInState(
                this.selectedCase[question.questionParent],
                question.id
              ),
              message: `This field is required`
            });
          }
        }
      });
      if (this.errorsInForm) {
        this[CASE_ACTIONS_TYPES.CHANGE_SECONDARY_STEP](8);
      }
    },
    manageButtonAction() {
      if (this.isCaseAuthor && this.caseStatus === CaseStatus.opened)
        return this.submitCase();
      if (this.isBICReviewer && this.caseStatus === CaseStatus.submitted)
        return this.approveCaseKM();
      if (this.isMDReviewer && this.caseStatus === CaseStatus.approvedByKM)
        return this.approveCaseMD();
    },
    submitCase() {
      if (this.isLoading) return;
      if (this.caseStatus === CaseStatus.opened) {
        this.checkForErrors();
        if (!this.errorsInForm) {
          this[MODAL_ACTIONS_TYPES.OPEN_MODAL]({
            component: ModalComponents.WARNING,
            props: {
              type: "Submit"
            }
          });
        }
      }
    },
    approveCaseKM() {
      this.checkForErrors();
      if (!this.errorsInForm) {
        this[MODAL_ACTIONS_TYPES.OPEN_MODAL]({
          component: ModalComponents.WARNING,
          props: {
            type: "ApproveKM"
          }
        });
      }
    },
    approveCaseMD() {
      this.checkForErrors();
      if (!this.errorsInForm) {
        this[MODAL_ACTIONS_TYPES.OPEN_MODAL]({
          component: ModalComponents.WARNING,
          props: {
            type: "Publish"
          }
        });
      }
    },
    goTo(route) {
      this[GLOBAL_ACTIONS_TYPES.ROUTER_REPLACE](
        `${Routes.MY_CASES}/${this.$route.params.id}/${route}/1`
      );
    },
    isActive(pptName) {
      return this.actualPpt.name === pptName;
    },
    async managePptChange(pptName) {
      this.loading = true;
      this.actualPpt = {
        name: pptName
      };
      const savedPpt = this.ppts.find(ppt => ppt.name == pptName);
      if (savedPpt) {
        this.actualPpt = savedPpt;
        return (this.loading = false);
      }
      if (pptName == PptNames.CaseWithGraph && this.chartLocation) {
        await this[CASE_ACTIONS_TYPES.FETCH_FILE]({
          caseId: this.caseId,
          fileLocation: this.chartLocation
        });
      }
      this.ppt = getPptByName(pptName, PptTypes.Single);
      await this.previewPpt(pptName);
      this.loading = false;
    },
    async previewPpt(pptName) {
      const base64Ppt = await this.ppt.write("base64");
      const resp = await axios.patch(
        `${process.env.VUE_APP_BE_URL}/api/v1/cases/${this.caseId}/preview`,
        {
          ppt: base64Ppt,
          pptName
        },
        { headers: { Authorization: `Bearer ${this.token}` } }
      );
      const guid = resp.data;
      this.actualPpt = {
        guid,
        name: pptName
      };
      this.ppts.push({ name: pptName, guid });
      this.loading = false;
    }
  },
  async mounted() {
    await this[CASE_ACTIONS_TYPES.HANDLE_EDIT_MODE]();
    this.managePptChange(PptNames.ThreeColumns);
  }
};
</script>

<style lang="scss" scoped>
.hidden {
  visibility: hidden;
}

.submitButton {
  font-size: 14px;
  padding: 5px 18px;
  background-color: var(--color-green-tone-two);
  color: var(--color-white);
  text-transform: uppercase;
}

.link {
  font-size: 13px;
  font-weight: bold;
  color: var(--color-green-tone-two);
  cursor: pointer;
}

.links {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 30%;
}

.pptPreview {
  width: 100%;
  padding: 20px 50px 0px 20px;
}

.inputWrapper {
  display: flex;
  justify-content: space-between;
  width: 75vw;
  margin-left: 43px;
}

.ppt {
  width: 75vw;
  height: 65vh;
}

.pptContainer {
  display: flex;
  width: 100%;
  height: 65vh;
}

.pptPreviewContainer {
  margin-left: 43px;
}

.options {
  display: flex;
  margin: 8px 0px 8px 0px;
  width: 100%;
}

.active {
  border: solid 3px var(--color-green) !important;
}

.empty {
  min-width: 200px;
}

.exportOptions {
  overflow-y: auto;
  min-width: 200px;
  height: 100%;
}

.exportOption {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 190px;
  margin-bottom: 10px;
  border: solid 1px var(--color-grey);
}

.exportOption:hover {
  border: solid 3px var(--color-green);
  cursor: pointer;
}

.spinner {
  height: 400px;
  width: 900px;
  margin: 180px 240px;
  padding: auto;
}

.loadingSpinner {
  color: var(--color-green);
  margin: 100px;
}

.subtitle {
  font-size: 17px;
  width: 90%;
}

.title {
  width: 100%;
  font-size: 23px;
  font-weight: 700;
}
</style>
