<template>
  <div class="pageContainer">
    <button @click="backToSearch" class="backBtn">
      <img class="backBtnImg" src="@/assets/img/arrow-down.svg" alt="" />
      <span class="backText">Back</span>
    </button>
    <div class="profileContainer">
      <div class="menuContainer">
        <div v-if="this.searchResults.length" class="searchMenu">
          <button
            @click="goToPreviousResult"
            :disbaled="isFirst"
            :class="['menuBtn', { hideBtn: isFirst }, 'firstBtn']"
          >
            <img src="@/assets/img/arrow-level-green.svg" alt="" />
            <span>Prev</span>
          </button>
          <span class="resultIndex">
            Case {{ `${resultIndex}/${this.searchResults.length}` }}
          </span>
          <button class="menuBtn" @click="goToNextResult" v-if="!isLast">
            <span>Next</span>
            <img
              class="arrowRight"
              src="@/assets/img/arrow-level-green.svg"
              alt=""
            />
          </button>
        </div>
        <div v-else></div>
        <button @click="openExport" class="exportBtn">Export</button>
      </div>
      <div v-if="!isFetching" class="caseInfo">
        <div class="firstRow">
          <div class="preview">
            <h1>
              {{
                selectedCase.client ? selectedCase.client.name : "Client name"
              }}
            </h1>
            <div class="previewData">
              <div class="fields">
                <div class="previewFieldLarge">
                  <h3 class="fieldTittle">Project name</h3>
                  <p class="fieldValue">
                    {{ selectedCase.projectName || "-" }}
                  </p>
                </div>
              </div>
              <div class="fields">
                <div class="previewFieldLarge">
                  <h3 class="fieldTittle">Description</h3>
                  <p v-if="!selectedCase.isLegacy" class="fieldValue">
                    {{
                      selectedCase.client && selectedCase.client.description
                        ? selectedCase.client.description
                        : "-"
                    }}
                  </p>
                  <p v-else class="fieldValue">Legacy Case - Not available</p>
                </div>
              </div>
              <div class="fields">
                <div class="previewField">
                  <h3 class="fieldTittle">Industries</h3>
                  <p class="fieldValue">
                    {{
                      industries && industries.length
                        ? industries.map(industry => industry.name).join(", ")
                        : "-"
                    }}
                  </p>
                </div>
                <div class="previewField">
                  <h3 class="fieldTittle">Segments</h3>
                  <p class="fieldValue">
                    {{
                      segments && segments.length
                        ? segments.map(segment => segment.name).join(", ")
                        : "-"
                    }}
                  </p>
                </div>
                <div class="previewField">
                  <h3 class="fieldTittle">Revenue</h3>
                  <p v-if="!selectedCase.isLegacy" class="fieldValue">
                    {{
                      selectedCase.client && selectedCase.client.revenue
                        ? selectedCase.client.revenue
                        : "-"
                    }}
                  </p>
                  <p v-else class="fieldValue">Legacy Case - Not available</p>
                </div>
              </div>
            </div>
          </div>
          <div class="secondPanel">
            <div class="fieldContainer">
              <h3 class="fieldTittle">Services</h3>
              <p class="fieldValue">
                {{
                  services && services.length
                    ? services.map(service => service.name).join(", ")
                    : "-"
                }}
              </p>
            </div>
            <div class="fieldContainer">
              <h3 class="fieldTittle">Offerings</h3>
              <p class="fieldValue">
                {{
                  offerings && offerings.length
                    ? offerings.map(offering => offering.name).join(", ")
                    : "-"
                }}
              </p>
            </div>
            <div class="fieldContainer">
              <h3 class="fieldTittle">Communities & Business Units</h3>
              <p class="fieldValue">
                <span>
                  {{
                    selectedCase.communities && selectedCase.communities.length
                      ? selectedCase.communities
                          .map(community => community.name)
                          .join("-")
                      : ""
                  }}
                </span>
                -
                <span>
                  {{
                    selectedCase.businessUnits &&
                    selectedCase.businessUnits.length
                      ? selectedCase.businessUnits
                          .map(bussinessUnit => bussinessUnit.name)
                          .join(", ")
                      : ""
                  }}
                </span>
              </p>
            </div>
          </div>
          <div class="thirdPanel">
            <div class="fieldContainer">
              <h3 class="fieldTittle">Lead Managing Director</h3>
              <p v-if="!selectedCase.isLegacy" class="fieldValue">
                {{
                  selectedCase.reviewerIndustryLeader &&
                  selectedCase.reviewerIndustryLeader.name
                    ? selectedCase.reviewerIndustryLeader.name
                    : "-"
                }}
              </p>
              <p v-else class="fieldValue">
                {{ selectedCase.legacyManagerDirectors }}
              </p>
            </div>
            <div class="fieldContainer">
              <h3 class="fieldTittle">Engagement Team</h3>
              <p v-if="!selectedCase.isLegacy" class="fieldValue">
                {{
                  selectedCase.team && selectedCase.team.length
                    ? selectedCase.team
                        .map(teamMember => teamMember.name)
                        .join(", ")
                    : "-"
                }}
              </p>
              <p v-else class="fieldValue">
                {{ selectedCase.legacyTeamMembers }}
              </p>
            </div>
            <div class="fieldContainer">
              <h3 class="fieldTittle">Engagement Countries</h3>
              <p class="fieldValue">
                {{
                  countries && countries.length
                    ? countries.map(country => country.name).join("-")
                    : "-"
                }}
              </p>
            </div>
          </div>
          <div class="dateInfo">
            <div class="fieldContainer">
              <h3 class="fieldTittle">Engagement Dates</h3>
              <p class="fieldValue">
                <span>
                  {{ startDate ? formatDate(startDate) : "-" }}
                </span>
                To
                <span>
                  {{ endDate ? formatDate(endDate) : "-" }}
                </span>
              </p>
            </div>
            <div class="fieldContainer">
              <h3 class="fieldTittle">Engagement Case Author</h3>
              <p v-if="!selectedCase.isLegacy" class="fieldValue">
                {{ selectedCase.author ? selectedCase.author.name : "" }}
              </p>
              <p v-else class="fieldValue">Legacy Case - Not available</p>
            </div>
            <div class="fieldContainer">
              <h3 class="fieldTittle">ICP Publishing Date</h3>
              <p v-if="!selectedCase.isLegacy" class="fieldValue">
                {{
                  selectedCase.lastStatusChangeDate
                    ? formatDate(selectedCase.lastStatusChangeDate)
                    : "-"
                }}
              </p>
              <p v-else class="fieldValue">Legacy Case - Not available</p>
            </div>
          </div>
        </div>
        <div class="headlineRow">
          <h2>Headline</h2>
          <p
            class="caseHeadline"
            v-html="selectedCase.situation.firstStep[0].answer"
            id="headlinez"
          ></p>
        </div>
        <div class="secondRow">
          <div class="stepContainer">
            <h2 class="stepTittle">Situation</h2>
            <p
              v-for="(answer, index) in situationDescription"
              :key="index"
              class="stepDescription"
              :id="`situationDescription-${index}`"
              v-html="answer"
            ></p>
          </div>
          <div class="stepContainer">
            <h2 class="stepTittle">Approach</h2>
            <p
              v-for="(answer, index) in approachDescription"
              :key="index"
              class="stepDescription"
              :id="`approachDescription-${index}`"
              v-html="answer"
            ></p>
          </div>
          <div class="stepContainer">
            <h2 class="stepTittle">Results</h2>
            <p
              v-for="(answer, index) in resultsDescription"
              :key="index"
              class="stepDescription"
              :id="`resultsDescription-${index}`"
              v-html="answer"
            ></p>
          </div>
        </div>
        <div
          class="tableSection"
          v-if="
            questionTypeFirstStep(MetricsSection.income).length > 0 ||
              questionTypeFirstStep(MetricsSection.balance).length > 0
          "
        >
          <h2>Financial Impacts</h2>
          <div class="answersContainer">
            <MetricsTableNotEditable
              :selectedCase="selectedCase"
              :dataTable="financialTableData"
            />
          </div>
        </div>
        <div class="tableSection" v-if="questionTypeSecondStep().length > 0">
          <h2>Operational & Organization Impacts</h2>
          <div class="answersContainer">
            <MetricsTableNotEditable
              :selectedCase="selectedCase"
              :dataTable="operationalTableData"
            />
          </div>
        </div>
      </div>
      <div v-else class="spinnerContainer">
        <div class="spinner">
          <b-spinner />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { ACTIONS_TYPES as SELECTED_CASE_ACTIONS_TYPES } from "@/store/modules/selectedCase/types";
import {
  ACTIONS_TYPES as MODAL_ACTIONS_TYPES,
  ModalComponents
} from "@/store/modules/modal/types";
import { ACTIONS_TYPES as GLOBAL_ACTIONS_TYPES } from "@/store/types";
import router from "@/router";
import { ClientInfoFields } from "@/constants/clientInfoFields";
import findQuestionInState from "@/helpers/findQuestionInState";
import { MetricsSection } from "@/types";
import MetricsTableNotEditable from "@/components/shared/MetricsTableNotEditable";

export default {
  name: "CaseProfile",
  components: {
    MetricsTableNotEditable
  },
  data() {
    return {
      situationDescription: [],
      approachDescription: [],
      resultsDescription: [],
      resultId: ""
    };
  },
  methods: {
    ...mapActions("selectedCase", [
      SELECTED_CASE_ACTIONS_TYPES.FETCH_CASE_DETAILS,
      SELECTED_CASE_ACTIONS_TYPES.SET_CASE_QUESTIONS
    ]),
    ...mapActions("modal", [MODAL_ACTIONS_TYPES.OPEN_MODAL]),
    ...mapActions([
      GLOBAL_ACTIONS_TYPES.ROUTER_REPLACE,
      GLOBAL_ACTIONS_TYPES.FETCH_SELECTED_CASES
    ]),
    formattedValue(value) {
      if (!value) {
        return "-";
      } else if (value % 1 == 0) {
        return `$${parseInt(value)} M`;
      } else {
        return `$${parseFloat(value).toFixed(1)} M`;
      }
    },
    questionTypeFirstStep(area) {
      return this.resultsFirstStep.filter(
        question =>
          question.financialMetricsArea === area &&
          question.answer.startDateValue &&
          question.answer.endDateValue
      );
    },
    questionTypeSecondStep() {
      return this.resultsSecondStep.filter(
        question =>
          question.isMetric &&
          question.answer.startDateValue &&
          question.answer.endDateValue
      );
    },
    setDescription(key) {
      const description = [];
      Object.values(this.selectedCase[key]).map(step => {
        step.forEach(question => {
          if (question.id !== "headline") {
            if (question.answer[0] === '"') {
              description.push(
                question.answer.substring(1, question.answer.length - 1)
              );
            } else if (question.id === "chartLocation") {
              description.push("");
            } else {
              if (question.id === "fasOpposingExpertReportDate") {
                description.push(question.answer.substring(0, 10));
              } else if (question.answer && Array.isArray(question.answer)) {
                const mapedAnswers = question.answer.map(answer => answer.name);
                description.push(mapedAnswers.join(", "));
              } else if (!question.isMetric && question.answer) {
                description.push(question.answer);
              }
            }
          }
        });
      });
      return description;
    },
    backToSearch() {
      this[GLOBAL_ACTIONS_TYPES.ROUTER_REPLACE](
        `${this.searchRoute ? this.searchRoute : "/search"}`
      );
    },
    openExport() {
      this[MODAL_ACTIONS_TYPES.OPEN_MODAL]({
        component: ModalComponents.EXPORT_SELECTION,
        props: {
          mode: 0
        }
      });
      this[GLOBAL_ACTIONS_TYPES.FETCH_SELECTED_CASES]();
    },
    goToPreviousResult() {
      const index = this.searchResults.findIndex(
        result => result.caseId === this.resultId
      );
      const caseId = this.searchResults[index - 1].caseId;
      this[GLOBAL_ACTIONS_TYPES.ROUTER_REPLACE](`/case-profile/${caseId}`);
      this.fetchCase();
    },
    goToNextResult() {
      const index = this.searchResults.findIndex(
        result => result.caseId === this.resultId
      );
      const caseId = this.searchResults[index + 1].caseId;
      this[GLOBAL_ACTIONS_TYPES.ROUTER_REPLACE](`/case-profile/${caseId}`);
      this.fetchCase();
    },
    async fetchCase() {
      this.resultId = router.currentRoute.params.id;
      this[SELECTED_CASE_ACTIONS_TYPES.SET_CASE_QUESTIONS]();
      await this[SELECTED_CASE_ACTIONS_TYPES.FETCH_CASE_DETAILS](
        router.currentRoute.params.id
      );
      this.approachDescription = this.setDescription("approach");
      this.resultsDescription = this.setDescription("results");
      this.situationDescription = this.setDescription("situation");
    },
    formatDate(date) {
      const enteringDate = new Date(date);
      const month = enteringDate.getMonth() + 1;
      const year = enteringDate.getFullYear();
      return `${month < 10 ? "0" + month : month}-${year}`;
    }
  },
  computed: {
    ...mapState({
      selectedCase: state => state.selectedCase,
      resultsFirstStep: state => state.selectedCase.results.firstStep,
      resultsSecondStep: state => state.selectedCase.results.secondStep,
      isFetching: state => state.isFetching,
      searchResults: state => state.searchResults,
      searchRoute: state => state.selectedSearchRoute
    }),
    financialTableData() {
      return [
        {
          title: "Income Statement ($M)",
          tableQuestions: this.questionTypeFirstStep(MetricsSection.income)
        },
        {
          title: "Balance Sheet ($M)",
          tableQuestions: this.questionTypeFirstStep(MetricsSection.balance)
        }
      ];
    },
    startDate() {
      return findQuestionInState(
        this.$store.state.selectedCase.clientInformation,
        ClientInfoFields.START_DATE
      ).answer;
    },
    endDate() {
      return findQuestionInState(
        this.$store.state.selectedCase.clientInformation,
        ClientInfoFields.END_DATE
      ).answer;
    },
    industries() {
      return findQuestionInState(
        this.$store.state.selectedCase.clientInformation,
        ClientInfoFields.INDUSTRIES
      ).answer;
    },
    segments() {
      return findQuestionInState(
        this.$store.state.selectedCase.clientInformation,
        ClientInfoFields.SEGMENTS
      ).answer;
    },
    services() {
      return findQuestionInState(
        this.$store.state.selectedCase.clientInformation,
        ClientInfoFields.SERVICES
      ).answer;
    },
    offerings() {
      return findQuestionInState(
        this.$store.state.selectedCase.clientInformation,
        ClientInfoFields.OFFERINGS
      ).answer;
    },
    countries() {
      return findQuestionInState(
        this.$store.state.selectedCase.clientInformation,
        ClientInfoFields.COUNTRIES
      ).answer;
    },
    operationalTableData() {
      return [
        {
          title: "Operational or Organizational Metrics",
          tableQuestions: this.questionTypeSecondStep()
        }
      ];
    },
    MetricsSection() {
      return MetricsSection;
    },
    isFirst() {
      const index = this.searchResults.findIndex(
        result => result.caseId === this.resultId
      );
      return index === 0;
    },
    isLast() {
      const index = this.searchResults.findIndex(
        result => result.caseId === this.resultId
      );
      return index === this.searchResults.length - 1;
    },
    resultIndex() {
      return (
        this.searchResults.findIndex(
          result => result.caseId === this.resultId
        ) + 1
      );
    }
  },
  created() {
    this.fetchCase();
  }
};
</script>

<style lang="scss" scoped>
.pageContainer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  padding: 85px 5% 45px 5%;
  background-color: #f2f2f2;
  animation: fadein 0.4s;
}

.backBtn {
  position: absolute;
  top: 10px;
  left: 10px;
}

.backBtnImg {
  width: 50px;
  transform: rotate(90deg);
}

.backText {
  margin-left: -5px;
}

.profileContainer {
  width: 100%;
}

.spinnerContainer {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80vh;
}

.spinner-border {
  color: var(--color-green);
}

.exportBtn {
  width: 138px;
  height: 36px;
  background: var(--color-green);
  color: white;
  text-transform: uppercase;
}

.menuContainer {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 30px;
}

.searchMenu {
  display: flex;
  align-items: center;
  button {
    img {
      width: 32px;
      height: 32px;
    }
  }
  .hideBtn {
    visibility: hidden;
  }
}

.resultIndex {
  font-size: 22px;
  color: var(--color-black);
  margin: 0 10px;
}

.noContent {
  width: 62%;
}

.balance {
  display: flex;
  justify-content: center;
}

.formatedDate {
  width: 33%;
  text-align: center;
}

.menuBtn {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-left: 15px;
  span {
    font-size: 18px;
    color: var(--color-green);
    margin: 0 5px 0px;
  }
  img {
    margin-left: -10px;
  }
}

.menuBtn.firstBtn {
  justify-content: flex-start;
  margin: 0;
  margin-right: 15px;
  img {
    margin-right: -10px;
  }
}

.firstRow {
  display: flex;
  justify-content: space-between;
  height: fit-content;
  width: 100%;
  margin-bottom: 35px;
}

.headlineRow {
  width: 100%;
  padding: 20px;
  margin-bottom: 35px;
  background: white;
  box-shadow: 0px 4px 24px 0px #00000040;
}

.preview {
  width: 32%;
  background: white;
  box-shadow: 0px 4px 24px 0px #00000040;
  padding: 25px;
}

.previewData {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.fields {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
}

.previewField {
  width: 33%;
}

.previewFieldLarge {
  width: 90%;
}

.secondPanel {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  width: 25%;
  padding: 30px;
  background: white;
  box-shadow: 0px 4px 24px 0px #00000040;
}

.fieldTittle {
  font-size: 14px;
  text-transform: uppercase;
  color: var(--color-light-grey);
}

.thirdPanel {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 25%;
  padding: 30px;
  background: white;
  box-shadow: 0px 4px 24px 0px #00000040;
}

.dateInfo {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 15%;
  padding: 30px;
  background: white;
  box-shadow: 0px 4px 24px 0px #00000040;
}

.secondRow {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  padding: 25px;
  margin-bottom: 30px;
  background: white;
  box-shadow: 0px 4px 24px 0px #00000040;
}

.stepContainer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 30%;
}

.stepTittle {
  font-size: 24px;
}

.stepDescription {
  line-height: 24px;
}

.tableSection {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  padding: 25px;
  margin-bottom: 30px;
  background: white;
  box-shadow: 0px 4px 24px 0px #00000040;
}

.answersContainer {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
}

.answerContainer {
  width: 30%;
}

.millions {
  margin-left: 5px;
  color: var(--color-light-grey);
}

.arrowRight {
  transform: rotate(180deg);
}

@media screen and (max-width: 950px) {
  .pageContainer {
    padding-top: 85px;
  }
}
</style>
