<template>
  <div class="guideContainer">
    <div class="title">
      <div class="titleContainer">
        <h3>
          Find cases of interest using keyword search, filters or a combination
          of both.
        </h3>
        <div class="fieldContainer">
          <input
            v-model="searchTerms"
            class="inputSearch"
            type="text"
            placeholder="Type in your keyword(s) and hit Enter"
            @change="handleTextInput"
          />
          <img
            :src="require('@/assets/img/search-logo.svg')"
            class="iconSearch"
          />
        </div>
      </div>
      <div class="clearFilter">
        <button
          @click="clearFilters"
          :disabled="isFetching"
          class="clearFilterButton"
          v-if="isFiltering"
        >
          Reset filters
        </button>
        <button
          @click="togglePanel()"
          v-b-toggle.advancedOptions
          :class="
            populateMoreFilters
              ? 'collapsedButtonWithOptions'
              : 'collapsedButton'
          "
        >
          <span>
            More filters
            {{ populateMoreFilters ? `(${populateMoreFilters})` : "" }}
          </span>
        </button>
      </div>
    </div>
    <div
      id="searchCard"
      :class="['searchCard', { collapseSearchCard: isCollapsed }]"
    >
      <div class="cardPadding">
        <div class="firstRow">
          <div class="fieldContainer">
            <h2 class="inputTitle">
              Industries:
            </h2>
            <MultiSelect
              title=""
              inputKey="selectedIndustries"
              :options="filterHandler.industries.sort()"
              placeholder="Select Industries"
              :value="selectedIndustries"
              :editMode="true"
              foreignKey="industryId"
              :isRequired="false"
              @selectedChange="saveSelection"
            />
          </div>
          <div class="fieldContainer">
            <h2 class="inputTitle">Services:</h2>
            <MultiSelect
              title=""
              inputKey="selectedServices"
              :options="filterHandler.services.sort()"
              placeholder="Select Services"
              :value="selectedServices"
              :editMode="true"
              foreignKey="serviceId"
              :isRequired="false"
              @selectedChange="saveSelection"
            />
          </div>
          <div class="fieldContainer">
            <h2 class="inputTitle">Segments:</h2>
            <MultiSelect
              title=""
              inputKey="selectedSegments"
              :options="filterHandler.segments.sort()"
              placeholder="Select Segments"
              :value="selectedSegments"
              :editMode="true"
              foreignKey="segmentId"
              :isRequired="false"
              @selectedChange="saveSelection"
            />
          </div>
          <div class="fieldContainer">
            <h2 class="inputTitle">Offerings:</h2>
            <MultiSelect
              title=""
              inputKey="selectedOfferings"
              :options="filterHandler.offerings.sort()"
              placeholder="Select Offerings"
              :value="selectedOfferings"
              :editMode="true"
              foreignKey="offeringId"
              :isRequired="false"
              @selectedChange="saveSelection"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="resultSeparator">
      <h3
        class="resultsInfoContainer"
        v-if="searchResults && searchResults.length"
      >
        Search results ordered by relevance:
        <span class="boldText"
          >{{ searchResults && searchResults.length }} matches</span
        >. Click on project name to access case profile, or select case(s) for
        quick PowerPoint export.
      </h3>
      <button
        @click="openExportModal"
        class="exportBtn"
        v-if="selectedCasesIds && selectedCasesIds.length !== 0"
      >
        <span>Export selection</span>
      </button>
    </div>
    <div class="searchResults">
      <div
        v-if="
          searchResults &&
            searchResults.length === 0 &&
            Object.keys(this.$route.query).length === 0
        "
      >
        <h3 class="startSearchMsg">
          <div class="startSearchMsgContainer">
            <img
              class="icon"
              :src="require('@/assets/img/warning-black-logo.svg')"
            />
            <span>
              Please input a keyword or select a least one filter to see case
              results.
            </span>
          </div>
        </h3>
      </div>
      <div v-else-if="isFetching" class="spinnerContainer">
        <b-spinner big></b-spinner>
      </div>
      <h3
        class="startSearchMsg"
        v-else-if="
          searchResults &&
            searchResults.length === 0 &&
            Object.keys(this.$route.query).length !== 0
        "
      >
        <div class="startSearchMsgContainer">
          <img
            class="icon"
            :src="require('@/assets/img/warning-black-logo.svg')"
          />
          <span>
            No results found.
          </span>
        </div>
      </h3>
      <div v-else class="resultsContainer">
        <div class="resultsHeader">
          <span class="headerSelect"></span>
          <span class="headerName">Name</span>
          <span class="headerYear">Year</span>
          <span class="headerHeadline">Headline</span>
          <span class="headerIndustry">Industry</span>
          <span class="headerSegment">Segment</span>
          <span class="headerService">Service</span>
          <span class="headerCommunity">Community</span>
          <span id="legacyCases" class="headerLegacy"> Legacy Case</span>
          <span class="headerViewCase" />
          <b-tooltip
            placement="lefttop"
            no-fade
            custom-class="headerTooltip"
            target="legacyCases"
            triggers="hover"
          >
            Cases pre-dating Jan 1, 2020 that have been uploaded to the
            Integrated Case Platform in a three column PowerPoint slide format.
          </b-tooltip>
        </div>
        <div
          v-if="!isFetching"
          :class="['results', { resultsOpen: isCollapsed }]"
        >
          <div
            v-for="(result, index) in searchResults"
            :key="index"
            class="result"
            :id="`case${result.caseId}`"
          >
            <div class="viewCaseResponsive">
              <button @click="goToCaseProfile(result.caseId)">
                <span>View</span>
              </button>
            </div>
            <div class="resultSelect">
              <div
                @click="selectCase(result.caseId)"
                :id="`checkInput${result.caseId}`"
                class="checkInput"
              >
                <img
                  class="imgSelect"
                  src="@/assets/img/tick-logo.svg"
                  alt=""
                />
              </div>
            </div>
            <button @click="goToCaseProfile(result.caseId)" class="resultName">
              {{ result.clientName }} - {{ result.projectName }}
            </button>
            <div class="resultYear">
              {{ new Date(result.caseCreationDate).getFullYear() }}
            </div>
            <div :id="`header${result.caseId}`" class="resultHeadline">
              {{
                result &&
                result.headline &&
                checkHTML(result.headline) &&
                result.headline.length > 70
                  ? `${convertHTML(result.headline.substring(0, 70))}...`
                  : convertHTML(result.headline)
              }}
            </div>
            <b-tooltip
              v-if="result.headline"
              placement="lefttop"
              no-fade
              custom-class="headerTooltip"
              :target="`header${result.caseId}`"
              triggers="hover"
            >
              {{ convertHTML(result.headline) }}
            </b-tooltip>
            <div class="resultIndustry">
              {{
                result.industries &&
                  result.industries.map(industry => industry.name).join(", ")
              }}
            </div>
            <div class="resultSegment">
              {{
                result.segments
                  ? result.segments.map(service => service.name).join(", ")
                  : "-"
              }}
            </div>
            <div class="resultService">
              {{
                result.services &&
                  result.services.map(service => service.name).join(", ")
              }}
            </div>
            <div class="resultCommunity">
              {{
                result.communities &&
                  result.communities.map(community => community.name).join(", ")
              }}
            </div>
            <div class="resultLegacy">
              {{ result.isLegacy && result.isLegacy ? "Yes" : "No" }}
            </div>
          </div>
        </div>
        <div v-if="isFetching" class="spinnerContainer">
          <b-spinner small></b-spinner>
        </div>
      </div>
    </div>
    <b-sidebar
      id="advancedOptions"
      right
      no-header
      shadow
      width="350px"
      bg-variant="white"
      backdrop
      backdrop-variant="transparent"
    >
      <template v-slot:default="{ hide }">
        <div class="px-4 pt-2 pb-1">
          <div class="closeButton">
            <button>
              <img
                class="closeIcon"
                @click="hide"
                :src="require('@/assets/img/close-icon-black.svg')"
              />
            </button>
          </div>
        </div>
        <div class="px-4 py-2">
          <div class="extraFields mt-2">
            <div class="fieldContainer">
              <h2 class="inputTitle">Countries:</h2>
              <MultiSelect
                title=""
                inputKey="selectedCountries"
                :options="filterHandler.countries.sort()"
                placeholder="Select Engagement Countries"
                :value="selectedCountries"
                :editMode="true"
                foreignKey="countryId"
                :isRequired="false"
                @selectedChange="saveSelection"
              />
            </div>
            <div class="fieldContainer dateContainer">
              <h2 class="inputTitle">Cases from:</h2>
              <DateInput
                @inputModified="saveDate"
                objectKey="fromDate"
                label=""
                :value="fromDate"
                editable
                clearable
                dense
                onlyMonth
              />
            </div>
            <div class="fieldContainer">
              <h2 class="inputTitle">Client Revenue:</h2>
              <Select
                :options="['Select a Range', ...bucketOptions]"
                :value="clientRevenue"
                title=""
                requiredInLabel
                foreignKey="clientRevenue"
                inputKey="clientRevenue"
                label=""
                description=""
                :editMode="true"
                :isRequired="false"
                @selectedChange="saveClientRevenue"
              />
            </div>
            <div class="fieldContainer">
              <h2 class="inputTitle">
                Communities:
              </h2>
              <MultiSelect
                title=""
                inputKey="selectedCommunities"
                :options="filterHandler.communities.sort()"
                placeholder="Select Communities"
                :value="selectedCommunities"
                :editMode="true"
                foreignKey="communityId"
                :isRequired="false"
                @selectedChange="saveSelection"
              />
            </div>
            <div class="fieldContainer">
              <h2 class="inputTitle">
                Business Units:
              </h2>
              <MultiSelect
                title=""
                inputKey="selectedBusinessUnits"
                :options="filterHandler.businessUnits.sort()"
                placeholder="Select Business Units"
                :value="selectedBusinessUnits"
                :editMode="true"
                foreignKey="businessUnitId"
                :isRequired="false"
                @selectedChange="saveSelection"
              />
            </div>
          </div>
        </div>
      </template>
    </b-sidebar>
  </div>
</template>

<script>
import MultiSelect from "../shared/MultiSelect";
import Select from "../shared/Select";
import DateInput from "../shared/DateInput";
import { mapState, mapActions, mapMutations } from "vuex";
import {
  ACTIONS_TYPES as GLOBAL_ACTIONS_TYPES,
  MUTATIONS_TYPES as GLOBAL_MUTATIONS_TYPES
} from "@/store/types";
import {
  ACTIONS_TYPES as MODAL_ACTIONS_TYPES,
  ModalComponents
} from "@/store/modules/modal/types";
import _ from "lodash";
import { emitInsightEvent, InsightEvent } from "@/helpers/insights";

export default {
  name: "GuideSearch",
  data() {
    return {
      selectedIndustries: [],
      selectedServices: [],
      selectedCountries: [],
      selectedOfferings: [],
      selectedBusinessUnits: [],
      selectedCommunities: [],
      selectedSegments: [],
      igLeaderRecommended: false,
      searchTerms: "",
      queryParams: null,
      isCollapsed: false,
      requestObject: {
        selectedIndustries: [],
        selectedServices: [],
        selectedCountries: [],
        selectedOfferings: [],
        selectedBusinessUnits: [],
        selectedCommunities: [],
        selectedSegments: []
      },
      searching: false,
      fromDate: "",
      clientRevenue: "",
      bucketOptions: [
        "<$250m",
        "$251m-$500m",
        "$501m-$1b",
        "$1.1b-$5b",
        "$5.1b-$10b",
        ">10.1b"
      ]
    };
  },
  components: {
    MultiSelect,
    DateInput,
    Select
  },
  computed: {
    ...mapState({
      collections: state => state.collections,
      isFetching: state => state.isFetching,
      searchResults: state => state.searchResults,
      selectedCasesIds: state => state.selectedCasesIds,
      isFetchingCasesToExport: state => state.isFetchingCasesToExport
    }),
    populateMoreFilters() {
      let count = 0;
      count = this.requestObject.selectedCountries?.length ? count + 1 : count;
      count = this.requestObject.selectedCommunities?.length
        ? count + 1
        : count;
      count = this.requestObject.selectedBusinessUnits?.length
        ? count + 1
        : count;
      count = this.fromDate ? count + 1 : count;
      count = this.clientRevenue ? count + 1 : count;
      return count;
    },
    isFiltering() {
      return (
        this.searchTerms ||
        this.requestObject.selectedCountries?.length ||
        this.requestObject.selectedCountries?.length ||
        this.requestObject.selectedIndustries?.length ||
        this.requestObject.selectedCommunities?.length ||
        this.requestObject.selectedOfferings?.length ||
        this.requestObject.selectedSegments?.length ||
        this.requestObject.selectedBusinessUnits?.length ||
        this.selectedIndustries?.length ||
        this.selectedServices?.length ||
        this.selectedCountries?.length ||
        this.selectedCommunities?.length ||
        this.selectedOfferings?.length ||
        this.selectedSegments?.length ||
        this.selectedBusinessUnits?.length ||
        this.fromDate ||
        this.clientRevenue
      );
    },
    radioInput() {
      return document.getElementById("igConfirm");
    },
    filterHandler() {
      const accum = {
        industries: [],
        services: [],
        countries: [],
        offerings: [],
        businessUnits: [],
        communities: [],
        segments: []
      };
      Object.keys(accum).forEach(el => {
        accum[el] = this.collections[el]
          ? this.collections[el].map(i => i.name)
          : [];
      });
      return accum;
    }
  },
  async created() {
    const newQuery = new URLSearchParams(this.$route.query);
    if (
      !this.$route.query.countryId?.length &&
      !this.$route.query.industryId?.length &&
      !this.$route.query.serviceId?.length &&
      !this.$route.query.communityId?.length &&
      !this.$route.query.offeringId?.length &&
      !this.$route.query.businessUnitId?.length &&
      !this.$route.query.segmentId?.length &&
      !this.$route.query.search &&
      !this.$route.query.fromDate
    ) {
      this[GLOBAL_MUTATIONS_TYPES.SET_SEARCH_RESULTS]([]);
    } else {
      Object.keys(this.$route.query).forEach(key => {
        if (key === "fromDate") {
          const date = new Date(this.$route.query.fromDate);
          this.fromDate = date.toISOString();
        } else if (key == "clientRevenue") {
          this.clientRevenue = this.$route.query.clientRevenue;
        } else {
          this.searchTerms = this.$route.query.search
            ? this.$route.query.search
            : "";
          this.requestObject.selectedCountries = this.$route.query.countryId
            ? this.$route.query.countryId.split(",")
            : [];
          this.requestObject.selectedIndustries = this.$route.query.industryId
            ? this.$route.query.industryId.split(",")
            : [];
          this.requestObject.selectedServices = this.$route.query.serviceId
            ? this.$route.query.serviceId.split(",")
            : [];
          this.requestObject.selectedCommunities = this.$route.query.communityId
            ? this.$route.query.communityId.split(",")
            : [];
          this.requestObject.selectedOfferings = this.$route.query.offeringId
            ? this.$route.query.offeringId.split(",")
            : [];
          this.requestObject.selectedBusinessUnits = this.$route.query
            .businessUnitId
            ? this.$route.query.businessUnitId.split(",")
            : [];
          this.requestObject.selectedSegments = this.$route.query.segmentId
            ? this.$route.query.segmentId.split(",")
            : [];
        }
      });
      await this[GLOBAL_ACTIONS_TYPES.FETCH_COLLECTIONS]();
      if (!_.isEmpty(this.$route.query)) {
        this.selectedIndustries =
          this.requestObject.selectedIndustries &&
          this.requestObject.selectedIndustries.map(industryId => {
            const resultingIndustry = this.collections.industries.find(
              industry => parseInt(industryId) === industry.industryId
            );
            if (resultingIndustry) {
              return resultingIndustry.name;
            }
          });
        this.selectedServices =
          this.requestObject.selectedServices &&
          this.requestObject.selectedServices.map(serviceId => {
            const resultingIndustry = this.collections.services.find(
              service => parseInt(serviceId) === service.serviceId
            );
            if (resultingIndustry) {
              return resultingIndustry.name;
            }
          });
        this.selectedCountries =
          this.requestObject.selectedCountries &&
          this.requestObject.selectedCountries.map(countryId => {
            const resultingIndustry = this.collections.countries.find(
              country => parseInt(countryId) === country.countryId
            );
            if (resultingIndustry) {
              return resultingIndustry.name;
            }
          });
        this.selectedCommunities =
          this.requestObject.selectedCommunities &&
          this.requestObject.selectedCommunities.map(communityId => {
            const resultingCommunity = this.collections.communities.find(
              community => {
                return parseInt(communityId) === community.communityId;
              }
            );
            if (resultingCommunity) {
              return resultingCommunity.name;
            }
          });
        this.selectedOfferings =
          this.requestObject.selectedOfferings &&
          this.requestObject.selectedOfferings.map(offeringId => {
            const resultingOffering = this.collections.offerings.find(
              offering => parseInt(offeringId) === offering.offeringId
            );
            if (resultingOffering) {
              return resultingOffering.name;
            }
          });
        this.selectedBusinessUnits =
          this.requestObject.selectedBusinessUnits &&
          this.requestObject.selectedBusinessUnits.map(businessUnitId => {
            const resultingBusinessUnit = this.collections.businessUnits.find(
              bu => parseInt(businessUnitId) === bu.businessUnitId
            );
            if (resultingBusinessUnit) {
              return resultingBusinessUnit.name;
            }
          });
        this.selectedSegments =
          this.requestObject.selectedSegments &&
          this.requestObject.selectedSegments.map(segmentId => {
            const resultingSegment = this.collections.segments.find(
              segment => parseInt(segmentId) === segment.segmentId
            );
            if (resultingSegment) {
              return resultingSegment.name;
            }
          });
        if (this.searchResults && this.searchResults.length === 0) {
          await this[GLOBAL_ACTIONS_TYPES.SEARCH_CASES](newQuery.toString());
          this[GLOBAL_MUTATIONS_TYPES.SET_CASE_SELECTION]();
        }
        this.searchResults.forEach(result => {
          if (this.selectedCasesIds.includes(result.caseId)) {
            this.selectCase(result.caseId);
          }
        });
      }
    }
  },
  methods: {
    ...mapActions([
      GLOBAL_ACTIONS_TYPES.ROUTER_REPLACE,
      GLOBAL_ACTIONS_TYPES.FETCH_COLLECTIONS,
      GLOBAL_ACTIONS_TYPES.SEARCH_CASES,
      GLOBAL_ACTIONS_TYPES.ROUTER_PUSH,
      GLOBAL_ACTIONS_TYPES.FETCH_SELECTED_CASES
    ]),
    ...mapActions("modal", [MODAL_ACTIONS_TYPES.OPEN_MODAL]),
    ...mapMutations([
      GLOBAL_MUTATIONS_TYPES.ADD_CASE_TO_SELECTION,
      GLOBAL_MUTATIONS_TYPES.REMOVE_CASE_FROM_SELECTION,
      GLOBAL_MUTATIONS_TYPES.SET_SEARCH_ROUTE,
      GLOBAL_MUTATIONS_TYPES.SET_SEARCH_RESULTS,
      GLOBAL_MUTATIONS_TYPES.SET_CASE_SELECTION
    ]),
    togglePanel() {
      emitInsightEvent(InsightEvent.clickAdvancedOptions);
    },
    clearFilters() {
      this.searchTerms = "";
      this.requestObject.selectedCountries = [];
      this.requestObject.selectedIndustries = [];
      this.requestObject.selectedServices = [];
      this.requestObject.selectedCommunities = [];
      this.requestObject.selectedSegments = [];
      this.requestObject.selectedOfferings = [];
      this.requestObject.selectedBusinessUnits = [];
      this.selectedCommunities = [];
      this.selectedSegments = [];
      this.selectedOfferings = [];
      this.selectedBusinessUnits = [];
      this.selectedIndustries = [];
      this.selectedServices = [];
      this.selectedCountries = [];
      this.fromDate = null;
      this.clientRevenue = "";
      window.history.pushState({}, "", this.$route.path);
      this.search();
    },
    getValueFromArray(value) {
      return this.searchResults.reduce((acc, searchItem) => {
        searchItem[value].forEach(i => {
          acc = [...acc, i.name];
        });
        return acc;
      }, []);
    },
    async openExportModal() {
      await this[GLOBAL_ACTIONS_TYPES.FETCH_SELECTED_CASES]();
      await this[MODAL_ACTIONS_TYPES.OPEN_MODAL]({
        component: ModalComponents.EXPORT_SELECTION,
        props: {
          mode: 1
        }
      });
    },
    getCollectionKey(key) {
      switch (key) {
        case "selectedIndustries":
          return "industries";
        case "selectedServices":
          return "services";
        case "selectedCountries":
          return "countries";
        case "selectedOfferings":
          return "offerings";
        case "selectedSegments":
          return "segments";
        case "selectedCommunities":
          return "communities";
        case "selectedBusinessUnits":
          return "businessUnits";
      }
    },
    saveClientRevenue(inputObject) {
      emitInsightEvent(InsightEvent.searchFilterUsed, {
        filter: "clientRevenue"
      });
      this.clientRevenue = inputObject.e.target.value;
      this.search();
    },
    saveSelection(inputObject) {
      const { key, forcedSave, foreignKey } = inputObject;
      this[key] = forcedSave;
      const collectionKey = this.getCollectionKey(key);
      emitInsightEvent(InsightEvent.searchFilterUsed, {
        filter: collectionKey
      });
      this.requestObject[key] = [];
      forcedSave.forEach(name => {
        this.collections[collectionKey].forEach(element => {
          if (name === element.name) {
            this.requestObject[key].push(element[foreignKey]);
          }
        });
      });
      this.search();
    },
    changeLeader() {
      this.igLeaderRecommended = this.radioInput.checked;
    },
    saveDate(inputObject) {
      emitInsightEvent(InsightEvent.searchFilterUsed, { filter: "fromDate" });
      if (inputObject && inputObject.newValue) {
        this.fromDate = inputObject.newValue;
        this.search();
      } else {
        this.fromDate = undefined;
        this.search();
      }
    },
    goToCaseProfile(id) {
      this[GLOBAL_ACTIONS_TYPES.ROUTER_REPLACE](`/case-profile/${id}`);
    },
    async selectCase(id) {
      const input = document.getElementById(`checkInput${id}`);
      const result = document.getElementById(`case${id}`);
      if ([...input.classList].includes("selected")) {
        input.classList.remove("selected");
        result.classList.remove("resultSelected");
        await this[GLOBAL_MUTATIONS_TYPES.REMOVE_CASE_FROM_SELECTION](id);
      } else {
        input.classList.add("selected");
        result.classList.add("resultSelected");
        if (!this.selectedCasesIds.includes(id)) {
          await this[GLOBAL_MUTATIONS_TYPES.ADD_CASE_TO_SELECTION](id);
        }
      }
    },
    handleTextInput() {
      emitInsightEvent(InsightEvent.searchFilterUsed, { filter: "keyword" });
      this.search();
    },
    async search() {
      this.searching = true;
      Object.entries({
        industryId: this.requestObject.selectedIndustries.join(","),
        serviceId: this.requestObject.selectedServices.join(","),
        countryId: this.requestObject.selectedCountries.join(","),
        communityId: this.requestObject.selectedCommunities.join(","),
        segmentId: this.requestObject.selectedSegments.join(","),
        offeringId: this.requestObject.selectedOfferings.join(","),
        businessUnitId: this.requestObject.selectedBusinessUnits.join(","),
        search: this.searchTerms,
        fromDate: this.fromDate ?? "",
        clientRevenue: this.clientRevenue ?? ""
      }).forEach(query => {
        if (query[1] !== "") {
          this.$route.query[query[0]] = query[1];
        } else {
          delete this.$route.query[query[0]];
        }
      });
      const newQuery = new URLSearchParams(this.$route.query);
      window.history.pushState(
        {},
        "",
        this.$route.path + "?" + newQuery.toString()
      );
      this[GLOBAL_MUTATIONS_TYPES.SET_SEARCH_ROUTE](
        `/search?${newQuery.toString()}`
      );
      if (!_.isEmpty(this.$route.query)) {
        await this[GLOBAL_ACTIONS_TYPES.SEARCH_CASES](newQuery.toString());
        this[GLOBAL_MUTATIONS_TYPES.SET_CASE_SELECTION]();
      } else {
        this[GLOBAL_MUTATIONS_TYPES.SET_SEARCH_RESULTS]([]);
      }
      this.searching = false;
    },
    checkHTML(text) {
      return !(text || "")
        .replace(/<([^>]+?)([^>]*?)>(.*?)<\/\1>/gi, "")
        .replace(/(<([^>]+)>)/gi, "")
        .trim();
    },
    convertHTML(text) {
      return text.replaceAll(/<(\/?|\?)(ol|ul|li|p|em|strong|u|a|h1|h2)>/g, "");
    }
  }
};
</script>

<style lang="scss" scoped>
.guideContainer {
  display: flex;
  flex-direction: column;
  width: 97%;
  height: calc(100vh - 50px);
}

.inputSearchContainer {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.inputSearchTitleContainer {
  display: flex;
  width: 100%;
}

.closeButton {
  display: flex;
  width: 100%;
  justify-content: flex-end;
}

.closeIcon {
  height: 24px;
  width: 24px;
  margin-right: 0px;
}

.clearFilterButton {
  color: var(--color-green-tone-two);
  margin-right: 15%;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 7px 0px;
}

.inputSearchTitle {
  flex: 1;
  font-size: 22px;
}

.inputSearch {
  width: 100%;
  margin-top: 6px;
  padding: 8px 5px;
  border-radius: 5px;
  border: 0.1px solid var(--color-grey-border);
}

.b-sidebar.b-sidebar-right > .b-sidebar-header .close {
  margin-right: 0px !important;
}

header {
  display: flex;
  justify-content: flex-end !important;
}

.iconSearch {
  position: absolute;
  margin-top: 15px;
  left: 46.5%;
}

.inputSearch:focus {
  outline: none !important;
  border: 0.1px solid var(--color-green);
}

.inputSearch::placeholder {
  font-size: 14px;
  color: #727272;
}

.collapseContainer {
  margin-top: 15px;
}

.titleContainer {
  width: 49%;
}

.fieldContainer {
  width: 100%;
}

.firstRow {
  display: flex;
  justify-content: space-between;
  flex: 1;
  margin-bottom: 20px;
  .fieldContainer {
    max-height: 90px;
    width: 24%;
    .inputTitle {
      font-family: "Roboto-Medium";
      margin-bottom: 10px;
      color: #4a4a4a;
      font-size: 14px;
    }
    .searchInput {
      width: 100%;
      padding: 10px 5px;
      border-radius: 5px;
    }
    .searchInput:focus {
      outline: none !important;
      border: 0.1px solid var(--color-green);
    }
    .MultiSelectContainer {
      margin-bottom: 0px;
    }
  }
  .dateInputsContainer {
    display: flex;
    width: 100%;
    .inputContainer {
      flex: 1;
      margin-right: 10px;
    }
  }
}

.extraFields {
  display: flex;
  flex-direction: column;
  .fieldContainer {
    width: 100%;
    .inputTitle {
      font-family: "Roboto-Medium";
      margin-bottom: 10px;
      color: #4a4a4a;
      font-size: 14px;
    }
  }
}

.resultsInfoContainer {
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 16, 41;
  color: var(--color-black);
}

.boldText {
  font-weight: 600;
}

.secondRow {
  display: flex;
  justify-content: flex-start;
  flex: 1;
  margin-top: 20px;
  margin-bottom: 10px;
  .fieldContainer {
    width: 15%;
    max-height: 90px;
    margin-right: 5%;
    .inputTitle {
      margin-bottom: 10px;
      font-size: 14px;
    }
    .termsSearch {
      margin-bottom: 33px;
    }
    .searchInput {
      width: 100%;
      padding: 10px 5px;
      border-radius: 5px;
      border: 0.1px solid var(--color-grey-border);
    }
    .searchInput:focus {
      outline: none !important;
      border: 0.1px solid var(--color-green);
    }
    .searchInput::placeholder {
      font-size: 14px;
      color: var(--color-grey-placeholder);
    }
    .inputContainer {
      margin-bottom: 0px;
    }
  }
  .dateInputsContainer {
    display: flex;
    .inputContainer:first-child {
      .inputField {
        border: solid 0.1px var(--color-grey-border);
      }
    }
  }
}

.hideFilterBtn {
  display: flex;
  position: absolute;
  right: 6%;
  top: 2%;
}

.filterQuantityCompomnent {
  margin-right: 15px;
  margin-top: 5px;
  color: var(--color-medium-grey);
}

.radioContainer {
  margin-left: 30px;
}

.radioLabel {
  margin-right: 10px;
  font-size: 18px;
}

.resultSeparator {
  display: flex;
  height: 20px;
  justify-content: space-between;
  align-items: flex-end;
}

.exportBtn {
  background: var(--color-green-tone-two);
  span {
    display: flex;
    align-self: center;
    padding: 10px 30px;
    color: white;
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 700;
  }
}

.searchResults {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 10px auto 20px;
}

.searchTitleContainer {
  align-self: flex-start;
  width: 100%;
  padding: 10px 15px;
  border: solid 0.1px var(--color-grey-border);
  .searchTitle {
    margin: 0;
    font-size: 16px;
  }
}

.searchTitle {
  display: inline;
  margin: 0;
  text-align: center;
  font-size: 18px;
}

.startSearchMsg {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  font-size: 14px;
  font-weight: 500;
  line-height: 16, 41px;
  margin: 20px 0;
  text-align: center;
  color: var(--color-black);
}

.startSearchMsgContainer {
  background-color: #f7fdff;
  padding: 16px 80px;
  border: 1px solid #77b0be;
  border-radius: 8px;
}

.icon {
  height: 20px;
  width: 20px;
  margin-right: 11px;
}

.resultsContainer {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  padding: 10px 0px;
}

.noResultsContainer {
  align-self: center;
  position: absolute;
  top: 150px;
  h3 {
    font-size: 18px;
  }
}

.result {
  display: flex;
  position: relative;
  padding: 10px 0;
  border: solid 0.1px var(--color-grey-border);
  border-top: unset;
  font-family: var(--secondary-font);
  font-size: 14px;
  &.resultSelected {
    background-color: var(--color-grey-1);
  }
  .resultSelect {
    display: flex;
    align-items: center;
    width: 5%;
    padding-left: 10px;
    .checkInput {
      width: 20px;
      height: 20px;
      padding: 2px;
      border: solid 1px #999999;
      border-radius: 5px;
    }
    .imgSelect {
      width: 15px;
      height: 15px;
    }
    .checkInput.selected {
      background-color: var(--color-green);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .resultName {
    display: flex;
    align-items: center;
    text-align: left;
    color: #0369a3;
    cursor: pointer;
    font-size: 14px;
    line-height: 16, 41px;
    width: 15%;
    margin-right: 1%;
    font-family: "Roboto-Medium";
  }

  .resultName:hover {
    color: #032e45;
  }

  .resultYear {
    width: 5%;
  }

  .resultHeadline {
    width: 17%;
  }

  .resultCommunity {
    width: 7%;
  }

  .resultSegment {
    width: 11%;
  }

  .resultService {
    width: 13%;
  }

  .resultIndustry {
    width: 13%;
  }

  .resultLegacy {
    display: flex;
    align-items: center;
    width: 7%;
    text-align: left;
  }

  .resultName,
  .resultYear,
  .resultHeadline,
  .resultCommunity,
  .resultIndustry,
  .resultSegment,
  .resultService {
    display: flex;
    align-items: center;
    text-align: left;
    margin-right: 1%;
  }

  .resultHeadline {
    font-family: "Roboto-Medium";
  }

  .resultViewCase {
    width: 5%;
    display: flex;
    justify-content: center;
    font-family: "Roboto-Medium";
    .viewCaseBtn {
      width: 100%;
      color: var(--color-green);
    }
  }
}

.expandBtnImg {
  width: 40px;
  margin-top: -5px;
  transform: rotate(180deg);
  color: var(--color-green);
}

.upwardsBtn {
  transform: rotate(0deg);
  color: var(--color-green);
}

.resultsHeader {
  display: flex;
  padding: 15px 0px;
  width: 100%;
  border: solid 1px var(--color-grey-border);
  text-align: left;
  color: var(--color-light-grey);
  font-size: 14px;
  font-family: "Roboto-Regular";
  font-weight: 700;
  color: #333333;

  .headerName,
  .headerYear,
  .headerHeadline,
  .headerIndustry,
  .headerCommunity,
  .headerSegment,
  .headerService {
    text-align: left;
    margin-right: 1%;
    border-right: 1px solid #cccccc;
  }

  .headerSelect {
    width: 5%;
  }

  .headerName {
    width: 15%;
  }

  .headerYear {
    width: 5%;
  }

  .headerHeadline {
    width: 17%;
  }

  .headerIndustry {
    width: 13%;
  }

  .headerCommunity {
    width: 7%;
  }

  .headerSegment {
    width: 11%;
  }

  .headerService {
    width: 13%;
  }

  .headerLegacy {
    width: 7%;
    text-align: left;
  }
}

.results {
  max-height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.resultsOpen {
  height: 320px;
  height: unset;
  max-height: 600px;
  overflow: auto;
}

.viewCaseResponsive {
  display: none;
}

.searchCard {
  display: flex;
  justify-content: space-between;
  height: auto;
  transition: all 0.25s;

  &.collapseSearchCard {
    overflow: hidden;
    height: 0;
    min-height: 0;
  }
}

.cardPadding {
  padding-bottom: 15px;
  width: 100%;
  display: flex;
  justify-self: center;
}

.spinnerContainer {
  align-self: center;
  display: flex;
  align-items: center;
  height: 250px;
  .spinner-border {
    width: 2rem;
    height: 2rem;
    color: var(--color-green);
  }
}

@media screen and (max-width: 950px) {
  .viewCaseResponsive {
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    height: 20px;
    width: 5%;
    background: var(--color-green);
    font-size: 14px;
    text-align: center;
    span {
      color: white;
    }
  }
  .result .resultViewCase,
  .headerViewCase {
    display: none;
  }
  .searchCard {
    height: unset;
  }
  .firstRow {
    flex-direction: column;
    align-items: center;
    .fieldContainer {
      width: 100%;
      margin-bottom: 40px;
    }
  }
  .secondRow {
    flex-direction: column;
    align-items: center;
    .fieldContainer {
      width: 100%;
      margin: 0;
      margin-bottom: 40px;
    }
  }

  .result {
    display: flex;
    padding: 20px 0;
    border: solid 0.1px var(--color-grey-border);
    border-top: unset;
    font-family: var(--secondary-font);
    font-weight: 500;
    &.resultSelected {
      background-color: #b8f4b8;
    }
    .resultSelect {
      display: flex;
      align-items: center;
      width: 5%;
      padding-left: 10px;
      .checkInput {
        width: 20px;
        height: 20px;
        padding: 2px;
        border: solid 1px #999999;
        border-radius: 5px;
      }
      .imgSelect {
        width: 15px;
        height: 15px;
      }
      .checkInput.selected {
        background-color: var(--color-green);
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .resultName {
      display: flex;
      align-items: center;
      width: 5%;
    }
    .resultYear {
      display: flex;
      align-items: center;
      width: 5%;
      padding-left: 5px;
    }
    .resultCommunity,
    .resultSegment,
    .resultService {
      display: flex;
      align-items: center;
      width: 24%;
      padding-left: 5px;
    }
  }
}
.clearFilter {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  width: 50%;
}
.title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 25px 0px;
}
h3 {
  font-size: 17px;
  font-weight: 400;
  line-height: 20px;
}

.collapsedButton {
  color: var(--color-green-tone-two);
  border: 1px solid var(--color-green-tone-two);
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 7px 16px;
  min-width: 150px;
}

.collapsedButtonWithOptions {
  background-color: var(--color-green-tone-two);
  color: var(--color-white);
  border: 1px solid var(--color-green-tone-two);
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 7px 16px;
  min-width: 150px;
}
</style>
