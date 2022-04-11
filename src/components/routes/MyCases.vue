<template>
  <div class="col-12 container">
    <div class="tableContainer" v-if="casesList.length > 0 && !isFetching">
      <div class="col-12 rowContainer headerContainer">
        <div class="itemHeaderContainer headerBorder">
          <div class="col-12 col-md-auto columnContainer nameContainer">
            <div class="gridColumn textTitle">Project Codename</div>
          </div>
          <div class="col-12 col-md-auto columnContainer">
            <div class="gridColumn textTitle">Case Author</div>
          </div>
          <div class="col-12 col-md-auto columnContainer">
            <div class="gridColumn textTitle">Lead Managing Director</div>
          </div>
          <!-- <div class="col-12 col-md-auto columnContainer">
            <div class="gridColumn textTitle">Case Creation Date</div>
          </div> -->
          <div class="col-12 col-md-auto columnContainer">
            <div class="gridColumn textTitle">Case Assignment Date</div>
          </div>
          <div class="col-12 col-md-auto columnContainer statusContainer">
            <div class="gridColumn textTitle">Status</div>
          </div>
        </div>
      </div>
      <div
        v-for="(item, index) in casesList"
        :key="index"
        class="col-12 rowContainer"
      >
        <div class="col-12 itemContainer rowBorder">
          <div class="col-12 col-md-auto columnContainer nameContainer">
            <div class="gridHeader textTitle elementHeader">Project Name</div>
            <button
              class="gridColumn textContent grey name"
              @click="handleShowCaseClick(item.caseId)"
            >
              {{ item.projectName }}
            </button>
          </div>
          <div class="col-12 col-md-auto columnContainer">
            <div class="gridHeader textTitle elementHeader">Author</div>
            <div class="gridColumn textContent">
              {{ item.author ? item.author.name : "" }}
            </div>
          </div>
          <div class="col-12 col-md-auto columnContainer">
            <div class="gridHeader textTitle elementHeader">Case MD</div>
            <div class="gridColumn textContent">
              {{ item.reviewerMD ? item.reviewerMD.name : "" }}
            </div>
          </div>
          <div class="col-12 col-md-auto columnContainer">
            <div class="gridHeader textTitle elementHeader">
              Case Creation Date
            </div>
            <div class="gridColumn textContent bold">
              {{
                item.caseCreationDate ? formatDate(item.caseCreationDate) : "-"
              }}
            </div>
          </div>
          <!-- <div class="col-12 col-md-auto columnContainer">
            <div class="gridHeader textTitle elementHeader">Start Date</div>
            <div class="gridColumn textContent bold">
              {{ item.startDate ? formatDate(item.startDate) : "-" }}
            </div>
          </div> -->
          <div class="col-12 col-md-auto columnContainer statusContainer">
            <div class="gridHeader textTitle elementHeader">Status</div>
            <div class="gridColumn textContent green bold">
              {{ getStatus(item) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <p v-if="casesList.length === 0 && !isFetching" class="noCases">
      There are no cases to show
    </p>
    <div v-if="isFetching" class="emptyList">
      <div class="spinner">
        <b-spinner />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { CaseStatus } from "@/types";
import isCaseInProgress from "@/helpers/isCaseInProgress";
import { mapState, mapActions } from "vuex";
import { ACTIONS_TYPES as GLOBAL_ACTIONS_TYPES } from "@/store/types";
import { ACTIONS_TYPES as CASE_ACTIONS_TYPES } from "@/store/modules/cases/types";

const Component = Vue.extend({
  name: "MyCases",
  computed: {
    ...mapState({
      isFetching: state => state.isFetching,
      casesList: state => state.cases.casesList
    })
  },
  methods: {
    ...mapActions([
      GLOBAL_ACTIONS_TYPES.ROUTER_PUSH,
      GLOBAL_ACTIONS_TYPES.FETCH_URL_VALUES
    ]),
    ...mapActions("cases", [CASE_ACTIONS_TYPES.FETCH_CASES_BY_USER]),
    getStatus(singularCase) {
      switch (singularCase.status) {
        case CaseStatus.opened:
          return isCaseInProgress(singularCase) ? "In Progress" : "Opened";
        case CaseStatus.submitted:
          return "Submitted for Revision";
        case CaseStatus.approvedByKM:
          return "Approved by KM";
        case CaseStatus.published:
          return "Published";
        default:
          "-";
      }
    },
    handleShowCaseClick(id) {
      const particularCase = this.casesList.find(
        singularCase => singularCase.caseId === id
      );
      if (particularCase?.status === CaseStatus.opened) {
        this[GLOBAL_ACTIONS_TYPES.ROUTER_PUSH](`/${id}`);
      } else {
        this[GLOBAL_ACTIONS_TYPES.ROUTER_PUSH](`/${id}/client-information/1`);
      }
      this[GLOBAL_ACTIONS_TYPES.FETCH_URL_VALUES]();
    },
    formatDate(date) {
      const enteringDate = new Date(date);
      const month = enteringDate.getMonth() + 1;
      const year = enteringDate.getFullYear();
      return `${month < 10 ? "0" + month : month}/${year}`;
    }
  }
});

export default Component;
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  padding: 20px 5% 45px 5%;
  animation: fadein 0.4s;
}

@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.title {
  font-size: 20px;
  color: var(--color-black);
  margin-bottom: 20px;
}

.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
}

.tableContainer {
  display: flex;
  align-self: center;
  flex-direction: column;
  width: 100%;
}

.emptyList {
  width: 100%;
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.emptyListMessage {
  font-size: 16px;
  color: var(--color-black);
}

.screenTitleContainer {
  display: flex;
  align-items: center;
  margin: 30px 0px;
}

.screenTitle {
  font-size: 26px;
  font-weight: 500;
  margin: 0px;
}

.rowContainer {
  padding: 0px;
}

.itemContainer {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0px 10px;
  min-height: 80px;
}

.itemHeaderContainer {
  padding: 0px 10px;
  display: flex;
  justify-content: space-between;
}

.headerBorder {
  border-bottom: solid 2px var(--color-grey-placeholder);
}

.rowBorder {
  border: solid 1px var(--color-grey-placeholder);
}

.columnContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 5px 10px 5px;
  margin: 0;
}

.gridColumn {
  display: flex;
  max-width: 300px;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  min-height: 20px;
}

.gridHeader {
  display: flex;
  align-items: center;
  height: 40px;
}

.elementHeader {
  display: none;
}

.nameContainer {
  width: 100%;
}

.textTitle {
  font-size: 14px;
  font-family: "Roboto-Medium";
  color: var(--color-dark-grey);
}

.textContent {
  font-family: var(--secondary-font);
  font-size: 15px;
}

.statusContainer {
  display: flex;
  justify-content: center;
  width: 100%;
}

.center {
  justify-content: center;
}

.goCaseContainer {
  width: 100%;
}

.green {
  font-family: "Roboto-Medium";
  font-weight: 500;
}

.bold {
  font-family: "Roboto-Medium";
  font-weight: 500;
}

.linkText {
  font-size: 12px;
}

.assignedContainer {
  display: flex;
  flex-direction: column;
}

.spinner-border {
  color: var(--color-green);
}

.elementHeader {
  display: flex;
}

.headerContainer {
  display: none;
}

.mobileGoCase {
  text-align: center;
  text-transform: uppercase;
  font-size: 14px;
  padding: 5px 20px;
  background-color: var(--color-green);
  color: var(--color-white);
}

.desktopGoCase {
  display: none;
}

.noCases {
  align-self: center;
  position: absolute;
  top: 45%;
  white-space: nowrap;
  color: var(--color-medium-grey);
  font-size: 20px !important;
}

@media screen and (min-width: 960px) {
  .container {
    padding: 20px 7% 45px 7%;
  }

  .title {
    width: 100%;
    text-align: center;
    margin-bottom: 15px;
    font-size: 40px;
  }

  .textTitle {
    font-size: 16px;
    margin-bottom: 10px;
  }

  .rowBorder {
    border-top: 0px;
  }

  .tableContainer {
    display: flex;
    flex-direction: column;
    padding: 35px 25px 45px;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
  }

  .elementHeader {
    display: none;
  }

  .headerContainer {
    display: block;
  }

  .nameContainer {
    width: 20%;
    min-width: 140px;
  }

  .columnContainer {
    width: 17%;
    min-width: 110px;
    text-align: center;
  }

  .statusContainer {
    width: 15%;
    min-width: 140px;
  }

  .goCaseContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 10%;
    min-width: 80px;
  }

  .mobileGoCase {
    display: none;
  }

  .desktopGoCase {
    display: block;
  }

  .itemContainer {
    padding: 10px;
  }

  .icon {
    width: 35px;
    height: 35px;
    cursor: pointer;
  }

  .name {
    font-weight: bold;
    color: var(--color-green);
  }

  .name:hover {
    text-decoration: underline;
  }
}
</style>
