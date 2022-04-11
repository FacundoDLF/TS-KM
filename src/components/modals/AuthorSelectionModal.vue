<template>
  <div class="modal-content">
    <button v-if="!isFetching" class="closeBtn" @click="closeModal">
      <img src="@/assets/img/close-black.svg" alt="" />
    </button>
    <!-- <div v-if="!isFetching || fetchingEmployees" class="modalContainer"> -->
    <div class="modalContainer">
      <div v-if="precase.isCaseAuthorSelected" class="rejectedContainer">
        <h1 class="modalTitle">
          The case author for this case has already been selected
        </h1>
        <button class="homePage" @click="goToHomePage">Go to Home page</button>
      </div>
      <div v-else-if="precase.isRejected" class="rejectedContainer">
        <h1 class="modalTitle">This case has been rejected</h1>
        <button class="homePage" @click="goToHomePage">Go to Home page</button>
      </div>
      <div v-else class="selectionContainer">
        <h1 class="modalNewCaseTitle">
          New Case Requires Case Author Selection
        </h1>
        <p>
          Please review and update the pre-existing data for this engagement and
          then select the person who will be responsable to create the case.
        </p>
        <h2 class="clientInformationTitle">Client Information</h2>
        <div class="clientInformationSection">
          <div class="rowInputs">
            <div class="inputsContainer">
              <ModalInput
                :noModifications="true"
                label="Name"
                objectKey="clientName"
                :value="
                  precase && precase.clientName ? precase.clientName : '-'
                "
              />
            </div>
            <div class="inputsContainer">
              <ModalInput
                :noModifications="true"
                label="Business Description"
                objectKey=""
                :value="
                  precase && precase.projectDescription
                    ? precase.projectDescription
                    : '-'
                "
              />
            </div>
            <div></div>
          </div>
          <div class="rowInputs">
            <div class="inputsContainer">
              <ModalInput
                :noModifications="true"
                label="Private Equity Sponsor"
                objectKey=""
                :value="precase && precase.peSponsor ? precase.peSponsor : '-'"
              />
            </div>
            <div class="communitySelect">
              <span class="label"
                ><h3 class="fieldTittle">Industries</h3>
                <span class="requiredTag">* Required</span></span
              >
              <div class="selectContainer">
                <MultiSelect
                  :options="
                    collections.industries.map(
                      industry => industry.name && industry.name
                    )
                  "
                  :value="selectedIndustries.map(industry => industry)"
                  placeholder="Select the industries for the case"
                  title=""
                  :isRequired="false"
                  inputKey="industries"
                  foreignKey="industryId"
                  :editMode="true"
                  :isDisable="submitting"
                  @selectedChange="simpleSelection"
                />
              </div>
              <p v-if="industryError" class="errorMsg">
                This field is required for submitting the case
              </p>
            </div>
            <div class="communitySelect">
              <span class="label"
                ><h3 class="fieldTittle">Segments</h3>
                <span class="requiredTag">* Required</span></span
              >
              <div class="selectContainer">
                <MultiSelect
                  :options="segmentsOptions"
                  :value="selectedSegments.map(segment => segment)"
                  placeholder="Select the segments for the case"
                  title=""
                  :isRequired="false"
                  inputKey="segments"
                  foreignKey="segmentId"
                  :editMode="true"
                  :isDisable="submitting"
                  @selectedChange="simpleSelection"
                />
              </div>
              <p v-if="segmentError" class="errorMsg">
                This field is required for submitting the case
              </p>
            </div>
          </div>
        </div>
        <h2 class="engagementInformationTitle">Engagement Information</h2>
        <div class="engagementInformationSection">
          <div class="rowInputs">
            <ModalInput
              :noModifications="true"
              label="Lead Name"
              objectKey=""
              :value="precase && precase.leadName ? precase.leadName : '-'"
            />
            <div class="communitySelect">
              <span class="label"
                ><h3 class="fieldTittle">Communities</h3>
                <span class="requiredTag">* Required</span></span
              >
              <div class="selectContainer">
                <MultiSelect
                  :options="communitiesOptions"
                  :value="selectedCommunities.map(community => community)"
                  placeholder="Select the communities for the case"
                  title=""
                  :isRequired="false"
                  inputKey="communities"
                  foreignKey="communityId"
                  :editMode="true"
                  :isDisable="submitting"
                  @selectedChange="simpleSelection"
                />
              </div>
              <p v-if="comuError" class="errorMsg">
                This field is required for submitting the case
              </p>
            </div>
            <div class="communitySelect">
              <span class="label"
                ><h3 class="fieldTittle">Business Units</h3>
                <span class="requiredTag">* Required</span></span
              >
              <div class="selectContainer">
                <MultiSelect
                  :options="
                    collections.businessUnits.map(
                      unit => unit.name && unit.name.toUpperCase()
                    )
                  "
                  :value="selectedUnits.map(unit => unit)"
                  placeholder="Select the business units for the case"
                  title=""
                  :isRequired="false"
                  inputKey="businessUnits"
                  foreignKey="businessUnitId"
                  :editMode="true"
                  :isDisable="submitting"
                  @selectedChange="simpleSelection"
                />
              </div>
              <p v-if="unitError" class="errorMsg">
                This field is required for submitting the case
              </p>
            </div>
          </div>
          <div class="rowInputs">
            <div class="teamMemberSelect">
              <span class="label"
                ><h3 class="fieldTittle">Engagement Team Members</h3>
                <span class="requiredTag">* Required</span></span
              >
              <div class="selectContainer">
                <MultiSelect
                  :options="
                    employeesOptions.map(
                      member => member.displayName && member.displayName
                    )
                  "
                  :value="
                    submitObject.teamMembers.map(
                      member => member.name && member.name
                    )
                  "
                  placeholder="Select the team members"
                  title=""
                  :isRequired="false"
                  inputKey="teamMembers"
                  :editMode="true"
                  :isDisable="submitting"
                  @selectedChange="saveSelection"
                  :isLoading="
                    isFetching &&
                      searchQuery.length > 0 &&
                      isTeamMemberSelectOpen
                  "
                  @searchDebounce="asyncSearch"
                  @onOpen="onOpenTeamMemberSelect"
                  @onClose="onCloseTeamMemberSelect"
                  noOptsMsg="Please start typing to search for a team member"
                />
                <p v-if="teamError" class="errorMsg">
                  This field is required for submitting the case
                </p>
              </div>
            </div>
            <div class="modalInputContainer">
              <DateInput
                :value="precase && precase.startDate"
                objectKey="startDate"
                :noModifications="true"
                :required="true"
                :disabled="true"
                :editable="false"
                label="Start Date"
              />
            </div>
            <div class="modalInputContainer">
              <DateInput
                :value="submitObject.endDate"
                objectKey="endDate"
                @inputModified="handleChange"
                requiredWithLabel
                :required="true"
                :disabled="false"
                :editable="true"
                label="Approximate End Date"
              />
              <p v-if="endDateError" class="errorMsg">
                This field is required for submitting the case
              </p>
            </div>
          </div>
          <div class="rowInputs">
            <div class="inputsContainer">
              <ModalInput
                class="revenue"
                @inputModified="handleRevenue"
                label="Engagement Revenue"
                objectKey="revenue"
                type="number"
                :value="precase && precase.estBilling ? precase.estBilling : 0"
                noModifications
                editable
                requiredWithLabel
                required
              />
              <p v-if="revenueError" class="errorMsg">
                This field is required for submitting the case
              </p>
            </div>
            <div class="caseAuthorSelect">
              <span class="labelAuthor"
                ><h3 class="fieldTittle">Assign Case Author</h3>
                <span class="requiredTag">* Required</span></span
              >
              <Select
                :options="[
                  'Start typing to search',
                  ...this.employeesOptions.map(
                    member => member.displayName && member.displayName
                  )
                ]"
                :value="submitObject.caseAuthorName"
                inputKey="caseAuthorName"
                :editMode="true"
                :isSearchable="true"
                :disabled="submitting"
                @selectedChange="authorSelection"
                @onOpen="onOpenCaseAuthorSelect"
                @onClose="onCloseCaseAuthorSelect"
                :isLoading="isFetching && isCaseAuthorSelectOpen"
                @searchDebounce="asyncSearch"
                noOptsMsg="Please start typing to search for a case author"
              />
              <p v-if="authorError" class="errorMsg">
                This field is required for submitting the case
              </p>
            </div>
            <div></div>
          </div>
        </div>
        <template v-if="isRejectable">
          <h2 class="caseRejectionTitle">Case Rejection</h2>
          <p class="caseRejectionSubtitle">
            To reject a case, please select one of the reasons below:
          </p>
          <div class="caseRejection">
            <form>
              <template v-for="(rejectOption, i) in rejectOptions">
                <div class="rejectOption" :key="i">
                  <input
                    type="radio"
                    name="rejectReason"
                    class="optionRadio"
                    :id="i"
                    @click="manageRejectSelection(i)"
                    :checked="i === rejectOptionSelected"
                  />
                  <label :for="i">{{ rejectOption }}</label>
                </div>
              </template>
              <ModalInput
                v-if="showOtherSpecify"
                label="Please specify the reason."
                objectKey="rejectReason"
                @inputModified="rejectReason = $event.newValue"
                editable
                :value="rejectReason"
              />
            </form>
          </div>
        </template>
        <div class="authorSelection">
          <div class="errorMessage">
            <p v-if="error" class="errorMsg">
              There are errors in the form, please check and try again
            </p>
          </div>
          <div class="actionButtons">
            <button
              v-if="isRejectable"
              @click="rejectPrecase"
              :class="['cancel', { submitError: submitting }]"
            >
              Reject Case
            </button>
            <button
              @click="handleSubmit"
              :disabled="error || submitting"
              :class="['continue', { submitError: error || submitting }]"
            >
              <span v-if="!isFetching || searchQuery">Submit</span>
              <div v-if="isFetching && !searchQuery" class="spinnerContainer">
                <div class="spinner">
                  <b-spinner />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Warning Modal for Submission and Rejection -->
    <div v-if="aboutToSubmit || aboutToReject" class="underlayer">
      <div class="warningContainer">
        <h2 v-if="aboutToSubmit" class="warningTittle">
          Some core information provided cannot be updated by the Case Author.
          Are you sure you want to submit?
        </h2>
        <h2 v-else class="warningTittle">
          Are you sure you want to reject this case?
        </h2>
        <div class="warningButtons">
          <button @click="closeWarning" class="cancel">Close</button>
          <button v-if="aboutToSubmit" @click="handleSubmit" class="continue">
            Submit
          </button>
          <button v-else @click="rejectPrecase" class="continue">Reject</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapActions, mapState } from "vuex";
import { ACTIONS_TYPES as PRECASE_ACTIONS_TYPES } from "@/store/modules/preCase/types";
import { ACTIONS_TYPES as GLOBAL_ACTIONS_TYPES } from "@/store/types";
import MultiSelect from "../shared/MultiSelect";
import ModalInput from "../shared/ModalInput";
import DateInput from "../shared/DateInput";
import Select from "../shared/Select";
import {
  ACTIONS_TYPES as MODAL_ACTIONS_TYPES,
  ModalComponents
} from "@/store/modules/modal/types";
import _ from "lodash";

export default {
  name: "AuthorSelectionModal",
  data() {
    return {
      aboutToSubmit: false,
      aboutToReject: false,
      showingInfo: true,
      comuError: false,
      teamError: false,
      endDateError: false,
      revenueError: false,
      authorError: false,
      unitError: false,
      segmentError: false,
      industryError: false,
      isCaseAuthorSelectOpen: false,
      isTeamMemberSelectOpen: false,
      submitObject: {
        preCaseId: parseInt(this.precaseId),
        caseAuthorName: "",
        caseAuthorEmail: "",
        teamMembers: [],
        communities: [],
        businessUnits: [],
        industries: [],
        segments: [],
        revenue: "",
        startDate: "",
        endDate: ""
      },
      selectedCommunities: [],
      segmentsOptions: [],
      selectedUnits: [],
      selectedIndustries: [],
      selectedSegments: [],
      searchQuery: "",
      fetchingEmployees: false,
      employeesOptions: [],
      teamMembersData: [],
      submitting: false,
      communitiesOptions: [],
      rejectOptions: [
        "This engagement did not have billings of $1M or greater because we did not eventually work on it.",
        "The case for this engagement has already been written.",
        "Other, please specify."
      ],
      rejectReason: "",
      rejectOptionSelected: null,
      showOtherSpecify: false
    };
  },
  props: {
    precaseId: {
      type: String,
      required: true
    }
  },
  components: {
    MultiSelect,
    Select,
    ModalInput,
    DateInput
  },
  computed: {
    ...mapState({
      isFetching: state => state.isFetching,
      precase: state => state.precase,
      employees: state => state.employees,
      collections: state => state.collections
    }),
    error() {
      return (
        this.authorError ||
        this.unitError ||
        this.comuError ||
        this.segmentError ||
        this.industryError ||
        this.teamError ||
        this.endDateError ||
        this.revenueError
      );
    },
    isRejectable() {
      return (
        this.precase.estBilling < 1000000 && this.submitObject.revenue < 1000000
      );
    },
    disableReject() {
      return (
        this.submitting ||
        this.rejectOptionSelected === null ||
        this.rejectOptionSelected > 2 ||
        (this.rejectOptionSelected === 2 && this.rejectReason === "")
      );
    }
  },
  mounted() {
    const industries = this.precase.industry.split(";");
    industries.forEach(industry => {
      Vue.set(
        this.selectedIndustries,
        this.selectedIndustries.length,
        industry
      );
      const precaseIndustries = this.collections.industries.filter(
        collectionIndustry => {
          return collectionIndustry.name === industry;
        }
      );
      precaseIndustries.forEach(precaseIndustry => {
        Vue.set(
          this.submitObject.industries,
          this.submitObject.industries.length,
          {
            industryId: precaseIndustry.industryId
          }
        );
      });
    });
    this.updateOptions("industries");
  },
  created() {
    this.submitObject.teamMembers = this.precase.teamMembers.filter(
      member => member.name !== " " && member
    );
    this.communitiesOptions = this.collections.communities.map(
      community => community.name.split(" ")[0]
    );
    this.submitObject.startDate = this.precase.startDate;
    this.submitObject.revenue = this.precase.estBilling;
    const communities = this.precase.community.split(";");
    communities.forEach(community => {
      this.selectedCommunities.push(community.split(" ")[0]);
      const precaseCommunities = this.collections.communities.filter(
        collectionCommunity => {
          return (
            collectionCommunity.name.split(" ")[0] === community.split(" ")[0]
          );
        }
      );
      precaseCommunities.forEach(precaseCommunity => {
        this.submitObject.communities.push({
          communityId: precaseCommunity.communityId
        });
      });
    });
    const units = this.precase.businessUnit.split(";");
    units.forEach(unit => {
      this.selectedUnits.push(unit.split(" ")[0].toUpperCase());
      const precaseUnits = this.collections.businessUnits.filter(
        collectionUnit => {
          return collectionUnit.name.split(" ")[0] === unit.split(" ")[0];
        }
      );
      precaseUnits.forEach(precaseUnit => {
        this.submitObject.businessUnits.push({
          businessUnitId: precaseUnit.businessUnitId
        });
      });
    });
    const segments = this.precase.segment.split(";");
    segments.forEach(segment => {
      this.selectedSegments.push(segment);
      const precaseSegments = this.collections.segments.filter(
        collectionSegment => {
          return collectionSegment.name === segment;
        }
      );
      precaseSegments.forEach(precaseSegment => {
        this.submitObject.segments.push({
          segmentId: precaseSegment.segmentId
        });
      });
    });
  },
  methods: {
    ...mapActions("precase", [
      PRECASE_ACTIONS_TYPES.REJECT_CASE,
      PRECASE_ACTIONS_TYPES.POST_PRECASE,
      PRECASE_ACTIONS_TYPES.FETCH_EMPLOYEES
    ]),
    ...mapActions("modal", [MODAL_ACTIONS_TYPES.CLOSE_MODAL]),
    ...mapActions([GLOBAL_ACTIONS_TYPES.ROUTER_REPLACE]),
    manageRejectSelection(optionSelected) {
      if (optionSelected === this.rejectOptionSelected) {
        this.rejectReason = "";
        this.showOtherSpecify = false;
        return (this.rejectOptionSelected = null);
      }
      this.rejectReason = this.rejectOptions[optionSelected];
      this.rejectOptionSelected = optionSelected;
      if (optionSelected === 2) {
        this.rejectReason = "";
        this.showOtherSpecify = true;
      } else this.showOtherSpecify = false;
    },
    onOpenCaseAuthorSelect() {
      this.isCaseAuthorSelectOpen = true;
    },
    handleChange(inputObject) {
      this.submitObject.endDate = inputObject.newValue;
      this.endDateError = !this.submitObject.endDate;
    },
    handleRevenue(inputObject) {
      this.submitObject.revenue = inputObject.newValue;
      this.revenueError = !this.submitObject.revenue;
    },
    onCloseCaseAuthorSelect() {
      this.isCaseAuthorSelectOpen = false;
      this.clearList();
    },
    onOpenTeamMemberSelect() {
      this.isTeamMemberSelectOpen = true;
    },
    onCloseTeamMemberSelect() {
      this.isTeamMemberSelectOpen = false;
      this.clearList();
    },
    saveSelection(inputObject) {
      this.teamMembersData = [...this.submitObject.teamMembers];
      if (inputObject.forcedSave.length >= this.teamMembersData.length) {
        this.submitObject.teamMembers = inputObject.forcedSave.map(
          optionName => {
            const optionObject = this.employeesOptions.find(
              element => element.displayName === optionName
            );
            const selectedOption = this.teamMembersData.find(
              element => element.name === optionName
            );
            if (optionObject) {
              return {
                name: optionObject.displayName,
                email: optionObject.mail,
                teamMemberId: 0
              };
            }
            if (selectedOption) {
              return {
                name: selectedOption.name,
                email: selectedOption.email,
                teamMemberId: 0
              };
            }
          }
        );
      } else {
        this.submitObject.teamMembers = inputObject.forcedSave.map(
          inputName => {
            return this.teamMembersData.find(
              member => inputName === member.name
            );
          }
        );
      }
    },
    updateOptions(key) {
      if (key === "industries") {
        if (this.selectedIndustries.length > 0) {
          this.segmentsOptions = this.collections.segments.reduce(
            (acc, segment) => {
              this.selectedIndustries.forEach(industryName => {
                if (industryName === segment.industry.name) {
                  acc.push(segment.name);
                }
              });
              return acc;
            },
            []
          );
        } else {
          this.segmentsOptions = this.segmentsOptions.filter(segment => {
            return this.selectedSegments.includes(segment);
          });
        }
      } else {
        this.segmentsOptions = this.collections.segments.map(
          segment => segment.name
        );
        this.segments = [];
      }
    },
    rejectPrecase() {
      if (this.disableReject) return;
      if (this.aboutToReject) {
        this[PRECASE_ACTIONS_TYPES.REJECT_CASE]({
          precaseId: this.precaseId,
          reason: this.rejectReason
        });
        this.aboutToReject = false;
      } else {
        this.aboutToReject = true;
      }
    },
    handleSubmit() {
      this.comuError = _.isEmpty(this.submitObject.communities);
      this.unitError = _.isEmpty(this.submitObject.businessUnits);
      this.segmentError = _.isEmpty(this.submitObject.segments);
      this.industryError = _.isEmpty(this.submitObject.industries);
      this.teamError = _.isEmpty(this.submitObject.teamMembers);
      this.endDateError = !this.submitObject.endDate;
      this.revenueError = this.submitObject.revenue === 0;
      this.authorError = this.submitObject.caseAuthorName === "";
      if (this.aboutToSubmit && !this.error) {
        this.searchQuery = "";
        this.fetchingEmployees = false;
        this[PRECASE_ACTIONS_TYPES.POST_PRECASE](this.submitObject);
        this.submitting = true;
        this.aboutToSubmit = false;
      } else if (!this.error) {
        this.aboutToSubmit = true;
      }
    },
    closeWarning() {
      this.aboutToReject = false;
      this.aboutToSubmit = false;
    },
    authorSelection(inputObject) {
      if (inputObject.e.target.value) {
        const { displayName, mail } = this.employeesOptions.find(
          member => member.displayName === inputObject.e.target.value
        );
        this.submitObject.caseAuthorName = displayName;
        this.submitObject.caseAuthorEmail = mail;
        this.authorError = false;
        this.teamError = false;
      } else this.authorError = true;
    },
    clearList() {
      this.employeesOptions = [];
    },
    simpleSelection(inputObject) {
      const { forcedSave, key, foreignKey } = inputObject;
      const newValue = [];
      this.selectedUnits = key === "businessUnits" ? [] : this.selectedUnits;
      this.selectedIndustries =
        key === "industries" ? [] : this.selectedIndustries;
      this.selectedSegments = key === "segments" ? [] : this.selectedSegments;
      this.selectedCommunities =
        key === "communities" ? [] : this.selectedCommunities;
      forcedSave.map(selectedName => {
        let found;
        if (key === "communities") {
          found = this.collections.communities.find(
            element => element.name.split(" ")[0] === selectedName
          );
        }
        if (key === "businessUnits") {
          found = this.collections.businessUnits.find(
            element => element.name.toUpperCase() === selectedName.toUpperCase()
          );
        }
        if (key === "industries") {
          this.updateOptions(inputObject.key);
          found = this.collections.industries.find(
            element => element.name === selectedName
          );
        }
        if (key === "segments") {
          found = this.collections.segments.find(
            element => element.name === selectedName
          );
        }
        if (found) {
          newValue.push({
            [foreignKey]: found[foreignKey]
          });
          if (key === "communities") {
            found.name = found.name.split(" ")[0];
            this.selectedCommunities.push(found.name);
          } else if (key === "industries") {
            found.name;
            this.selectedIndustries.push(found.name);
          } else if (key === "segments") {
            found.name;
            this.selectedSegments.push(found.name);
          } else {
            found.name = found.name.toUpperCase();
            this.selectedUnits.push(found.name);
          }
        }
      });
      this.submitObject[key] = newValue;
      this.unitError =
        key === "businessUnits" ? _.isEmpty(newValue) : this.unitError;
      this.comuError =
        key === "communities" ? _.isEmpty(newValue) : this.comuError;
      this.segmentError =
        key === "segments" ? _.isEmpty(newValue) : this.segmentError;
      this.industryError =
        key === "industries" ? _.isEmpty(newValue) : this.industryError;
      this.teamError =
        key === "teamMembers" ? _.isEmpty(newValue) : this.teamError;
    },
    goToHomePage() {
      this[MODAL_ACTIONS_TYPES.CLOSE_MODAL]({
        component: ModalComponents.AUTHOR_SELECTION
      });
      this[GLOBAL_ACTIONS_TYPES.ROUTER_REPLACE]("/my-cases");
    },
    closeModal() {
      this[MODAL_ACTIONS_TYPES.CLOSE_MODAL]({
        component: ModalComponents.AUTHOR_SELECTION
      });
    },
    asyncSearch: _.debounce(async function(searchQuery) {
      this.searchQuery = searchQuery;
      this.fetchingEmployees = true;
      await this[PRECASE_ACTIONS_TYPES.FETCH_EMPLOYEES](searchQuery);
      this.employeesOptions = this.employees;
    }, 1000)
  }
};
</script>

<style lang="scss" scoped>
.errorMessage {
  margin-top: 40px;
}

.modal-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 40%;
  width: 90%;
  padding: 50px 30px;
  background-color: #f9f9f9;
  text-align: center;
  animation: fadein 0.4s;
}

.caseRejection {
  display: flex;
  align-items: left;
  flex-direction: column;
  width: 100%;
}

.optionRadio {
  margin-right: 5px;
}

.optionRadio:after {
  width: 15px;
  height: 15px;
  border-radius: 15px;
  top: -3px;
  left: -1px;
  position: relative;
  background-color: #d1d3d1;
  content: "";
  display: inline-block;
  visibility: visible;
  border: 2px solid white;
}

.optionRadio:checked:after {
  width: 15px;
  height: 15px;
  border-radius: 15px;
  top: -3px;
  left: -1px;
  position: relative;
  background-color: var(--color-green);
  content: "";
  display: inline-block;
  visibility: visible;
  border: 2px solid white;
}

.underlayer {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2000;
  width: 100%;
  height: 100%;
  padding: 100px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background-color: rgba($color: #000000, $alpha: 0.3);
  overflow-y: auto;
}

.MultiSelectContainer {
  margin-top: 0px;
}

.label {
  display: flex;
  margin-bottom: 0px;
}

.requiredTag {
  font-size: 12px;
  margin-left: 5px;
  color: var(--color-red);
}

.modalContainer {
  width: 100%;
}

.spinnerLabel {
  margin-right: 30px;
  color: var(--color-green);
  font-size: 18px;
}

@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modalTitle {
  margin-bottom: 10px;
  font-size: 24px;
  color: var(--color-black);
}

.modalNewCaseTitle {
  align-self: flex-start;
  margin-bottom: 10px;
  font-size: 24px;
  color: var(--color-black);
}

.clientInformationTitle,
.engagementInformationTitle,
.caseRejectionTitle {
  align-self: flex-start;
  font-size: 20px;
  color: var(--color-black);
}

.caseRejectionSubtitle {
  align-self: flex-start;
  font-size: 14px;
  color: var(--color-black);
}

.clientInformationSection,
.engagementInformationSection {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

.rowInputs {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.rowInputs > div {
  width: 31%;
}

.selectionContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  margin: auto;
}

.labelAuthor {
  display: flex;
  margin-bottom: -10px;
}

.precaseInfo {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
  margin-bottom: 30px;
  background-color: #ffffff;
}

.clientName {
  font-size: 25px;
  margin-left: 5px;
}

.menu {
  width: 20%;
  height: 100%;
  margin-right: 15px;
}

.hideBtn {
  font-size: 17px;
  text-transform: uppercase;
  img {
    width: 32px;
    height: 32px;
  }
}

.logoContainer {
  height: 40px;
  widows: 100%;
}

.preview {
  width: 85%;
  height: 100%;
  padding-left: 30px;
}

.authorSelection {
  width: 100%;
  .fieldTittle {
    color: var(--color-light-grey);
    font-size: 14px;
    text-transform: uppercase;
  }

  button {
    height: 45px;
    width: 178px;
    text-transform: uppercase;
  }
}

.continue,
.cancel {
  text-align: center;
  text-transform: uppercase;
  font-size: 14px;
  width: 100px;
  padding: 10px 15px;
  margin: 10px;
}
.continue {
  color: var(--color-white);
  background-color: var(--color-green);
}
.cancel {
  border: 1px solid var(--color-light-grey);
  color: var(--color-light-grey);
}
.cancel:hover {
  color: var(--color-white);
  background-color: var(--color-light-grey);
}

button.submitError {
  background-color: var(--color-light-grey);
}

.actionButtons {
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
  margin-top: 30px;
}

.rejectedContainer {
  display: flex;
  flex-direction: column;
}

.homePage {
  text-align: center;
  text-transform: uppercase;
  font-size: 14px;
  padding: 10px 15px;
  margin-top: 10px;
  color: var(--color-white);
  background-color: var(--color-green);
}

.homePage:hover {
  background-color: var(--color-light-green);
}

.homePage {
  align-self: flex-end;
}

.spinnerContainer {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner-border {
  color: white;
}

.firstRow,
.secondRow {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.fieldContainer {
  width: 33%;
  padding: 5px;
}

.fieldTittle {
  font-size: 14px;
  color: var(--color-black);
  text-transform: capitalize;
}

.caseAuthorSelect {
  width: 100%;
}

.errorMsg {
  font-size: 18px;
  color: var(--color-red);
  margin: 0;
  margin-top: -30px;
  margin-bottom: 30px;
}

.selectContainer {
  width: 100%;
  margin-bottom: 30px;
}

.MultiSelectContainer {
  margin-bottom: 30px;
}

.warningContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
  justify-content: space-between;
  width: 800px;
  background-color: white;
  padding: 25px;
  text-align: center;
}

.warningTittle {
  font-size: 24px;
  margin-bottom: 30px;
}

.warningButtons {
  display: flex;
  align-items: center;
}

.closeBtn {
  position: absolute;
  top: 15px;
  right: 15px;
}

@media screen and (min-width: 960px) {
  .modal-content {
    align-items: flex-start;
    height: auto;
    width: 1034px;
    background-color: #f9f9f9;
    text-align: left;
    padding: 50px 30px;
  }

  .modalTitle {
    font-size: 24px;
    margin-bottom: 20px;
  }
}
</style>
