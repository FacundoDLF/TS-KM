<template>
  <div class="clientInformationStepContainer">
    <div class="inputColumnsContainer">
      <div class="clientFields">
        <h3 class="fieldTitle">Client Information</h3>
        <div class="containerInputs">
          <div class="modalInputContainer">
            <ModalInput
              @inputModified="handleChange"
              label="Name"
              objectKey="clientName"
              :value="
                selectedCase.client && selectedCase.client.name
                  ? selectedCase.client.name
                  : '-'
              "
            />
          </div>
          <div class="modalInputContainer">
            <ModalInput
              @inputModified="handleChange"
              label="Business Description"
              objectKey="businessDescription"
              :value="
                selectedCase.client && selectedCase.client.shortDescription
                  ? selectedCase.client.shortDescription
                  : '-'
              "
            />
          </div>
          <div class="selectContainer">
            <Select
              :options="['Please select an option', ...bucketOptions]"
              :value="revenue"
              title=""
              requiredInLabel
              foreignKey="clientRevenueBucket"
              inputKey="clientRevenueBucket"
              label="Client Revenue"
              :error="
                findQuestionInStateF(
                  selectedCase.clientInformation,
                  ClientInfoFields.REVENUE
                ).error
              "
              description=" "
              :disabled="selectedCase && !selectedCase.editMode"
              :editMode="true"
              :isRequired="true"
              @selectedChange="handleSingleChange"
            />
          </div>
          <div class="selectContainer" />
          <div class="selectContainer">
            <MultiSelect
              title="Industries"
              inputKey="industries"
              :options="getValues([...collections.industries])"
              placeholder="Please select the Industries"
              :value="getValues([...industries])"
              :isDisable="selectedCase && !selectedCase.editMode"
              :editMode="true"
              foreignKey="IndustryID"
              :isRequired="true"
              @selectedChange="handleChange"
              @checkValue="checkMultiSelectValue"
            />
          </div>
          <div class="selectContainer" id="segmentSelect">
            <MultiSelect
              title="Segments"
              inputKey="segments"
              :options="getValues([...segmentsOptions])"
              placeholder="Please select the Segments"
              :value="getValues([...segments])"
              :editMode="true"
              foreignKey="SegmentID"
              :isDisable="selectedCase && !selectedCase.editMode"
              :isRequired="true"
              @selectedChange="handleChange"
              @checkValue="checkMultiSelectValue"
            />
          </div>
        </div>
      </div>
      <div class="projectFields">
        <h3 class="fieldTitle">Engagement Information</h3>
        <div class="containerInputs">
          <div class="modalInputContainer">
            <ModalInput
              @inputModified="handleChange"
              label="Lead Name"
              :editable="false"
              objectKey="leadName"
              :value="selectedCase.projectName"
            />
          </div>
          <div class="modalInputContainer">
            <ModalInput
              @inputModified="handleChange"
              label="Lead Managing Director"
              objectKey="supervisingTimeKeeperMd"
              :value="
                selectedCase.reviewerMD && selectedCase.reviewerMD.name
                  ? selectedCase.reviewerMD.name
                  : '-'
              "
            />
          </div>
          <div class="modalInputContainer">
            <ModalInput
              @inputModified="handleChange"
              label="Engagement Team"
              objectKey="engagementTeam"
              :value="
                selectedCase.team && selectedCase.team.length > 0
                  ? getTeam()
                  : '-'
              "
            />
          </div>
          <div class="modalInputContainer">
            <ModalInput
              @inputModified="handleChange"
              label="Engagement Revenue"
              objectKey="selectedCase.client.revenue"
              :value="
                selectedCase && selectedCase.estimatedRevenue
                  ? selectedCase.estimatedRevenue
                  : '-'
              "
            />
          </div>
          <div class="selectContainer">
            <MultiSelect
              title="Communities"
              inputKey="communities"
              :options="getValues([...collections.communities])"
              placeholder="-"
              :value="communities"
              foreignKey="CommunityID"
              :isDisable="true"
              :editMode="true"
              @selectedChange="handleChange"
            />
          </div>
          <div class="selectContainer">
            <MultiSelect
              title="Business Units"
              inputKey="businessUnits"
              :options="getValues([...collections.businessUnits])"
              placeholder="-"
              :value="businessUnits"
              :isDisable="true"
              foreignKey="BusinessUnitID"
              :editMode="true"
              @selectedChange="handleChange"
            />
          </div>
          <div class="selectContainer">
            <MultiSelect
              title="Services"
              inputKey="services"
              :options="getValues([...collections.services])"
              placeholder="Please select a Service"
              :value="getValues([...services])"
              :isDisable="selectedCase && !selectedCase.editMode"
              :editMode="true"
              foreignKey="ServiceID"
              :isRequired="true"
              @selectedChange="handleChange"
              @checkValue="checkMultiSelectValue"
            />
          </div>
          <div class="selectContainer">
            <MultiSelect
              title="Offerings"
              inputKey="offerings"
              :options="getValues([...offeringsOptions])"
              placeholder="Please select an Offering"
              :value="getValues([...offerings])"
              :isDisable="selectedCase && !selectedCase.editMode"
              :editMode="true"
              foreignKey="OfferingID"
              :isRequired="true"
              @selectedChange="handleChange"
              @checkValue="checkMultiSelectValue"
            />
          </div>
          <div class="selectContainer">
            <MultiSelect
              title="Engagement Countries"
              inputKey="countries"
              :options="getValues([...collections.countries])"
              placeholder="Please select the Countries"
              :value="getValues([...countries])"
              :editMode="true"
              :isDisable="selectedCase && !selectedCase.editMode"
              foreignKey="CountryID"
              :isRequired="true"
              @selectedChange="handleChange"
              @checkValue="checkMultiSelectValue"
            />
          </div>
          <div class="modalInputContainer">
            <ModalInput
              v-show="false"
              @inputModified="handleChange"
              label="Project Codename"
              :editable="true"
              :disabled="isLoading"
              :required="true"
              objectKey="projectNameEditable"
              :error="
                inputErrorsKey && inputErrorsKey.includes('projectNameEditable')
              "
              :value="selectedCase.projectNameEditable"
              @inputError="requireError"
            />
          </div>
          <div class="modalInputContainer">
            <DateInput
              :value="startDate"
              objectKey="startDate"
              :required="true"
              :disabled="isLoading"
              :editable="selectedCase && selectedCase.editMode"
              label="Start Date"
              @inputModified="handleChange"
              @inputError="requireError"
              :error="inputErrorsKey && inputErrorsKey.includes('startDate')"
            />
          </div>
          <div class="modalInputContainer">
            <DateInput
              :value="endDate"
              objectKey="endDate"
              :required="true"
              :disabled="isLoading"
              :editable="selectedCase && selectedCase.editMode"
              clearable
              label="End Date"
              @inputModified="handleChange"
              @inputError="requireError"
              :error="inputErrorsKey && inputErrorsKey.includes('endDate')"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapActions, mapState, mapGetters, mapMutations } from "vuex";
import { ClientInfoFields } from "@/constants/clientInfoFields";
import { SecondaryStep } from "@/types";
import { ACTIONS_TYPES as CLIENT_INFO_ACTIONS_TYPES } from "@/store/modules/selectedCase/clientInformation/types";
import { MUTATIONS_TYPES as CLIENT_INFO_MUTATIONS_TYPES } from "@/store/modules/selectedCase/clientInformation/types";
import ModalInput from "../../../shared/ModalInput";
import MultiSelect from "../../../shared/MultiSelect";
import DateInput from "../../../shared/DateInput.vue";
import Select from "../../../shared/Select.vue";
import findQuestionInState from "@/helpers/findQuestionInState";

const Component = Vue.extend({
  name: "ClientInformationStep1",
  data() {
    return {
      inputErrorsKey: [],
      inputsErrors: [],
      multiSelectErrors: [],
      error: false,
      bucketOptions: [
        "<$250m",
        "$251m-$500m",
        "$501m-$1b",
        "$1.1b-$5b",
        "$5.1b-$10b",
        ">10.1b"
      ],
      segmentsOptions: [],
      offeringsOptions: [],
      wasOfferingChecked: false,
      wasSegmentChecked: false
    };
  },
  components: {
    ModalInput,
    MultiSelect,
    Select,
    DateInput
  },
  computed: {
    ...mapState({
      selectedCase: state => state.selectedCase,
      isLoading: state => state.isLoading,
      collections: state => state.collections,
      currentRoutePath: state => state.currentRoutePath,
      editMode: state => state.editMode
    }),
    ...mapGetters("selectedCase/clientInformation", ["clientInfoErrors"]),
    revenue() {
      return findQuestionInState(
        this.selectedCase.clientInformation,
        ClientInfoFields.REVENUE
      ).answer;
    },
    industries() {
      return findQuestionInState(
        this.selectedCase.clientInformation,
        ClientInfoFields.INDUSTRIES
      ).answer;
    },
    segments() {
      return findQuestionInState(
        this.selectedCase.clientInformation,
        ClientInfoFields.SEGMENTS
      ).answer;
    },
    services() {
      return findQuestionInState(
        this.selectedCase.clientInformation,
        ClientInfoFields.SERVICES
      ).answer;
    },
    offerings() {
      return findQuestionInState(
        this.selectedCase.clientInformation,
        ClientInfoFields.OFFERINGS
      ).answer;
    },
    countries() {
      return findQuestionInState(
        this.selectedCase.clientInformation,
        ClientInfoFields.COUNTRIES
      ).answer;
    },
    startDate() {
      return findQuestionInState(
        this.selectedCase.clientInformation,
        ClientInfoFields.START_DATE
      ).answer;
    },
    endDate() {
      return findQuestionInState(
        this.selectedCase.clientInformation,
        ClientInfoFields.END_DATE
      ).answer;
    },
    ClientInfoFields() {
      return ClientInfoFields;
    }
  },
  created() {
    this.businessUnits =
      this.selectedCase.businessUnits &&
      this.selectedCase.businessUnits.length !== 0
        ? this.selectedCase.businessUnits.map(unit => unit.name)
        : [];
    this.communities =
      this.selectedCase.communities && this.selectedCase.communities.length
        ? this.selectedCase.communities.map(community => community.name)
        : [];
    this.updateOptions("industries");
    this.updateOptions("services");
  },
  methods: {
    ...mapMutations("selectedCase/clientInformation", [
      CLIENT_INFO_MUTATIONS_TYPES.SET_CLIENT_INFO_FIELD
    ]),
    ...mapActions("selectedCase/clientInformation", [
      CLIENT_INFO_ACTIONS_TYPES.CHANGE_CLIENT_INFO_FIELD
    ]),
    getOptions(key) {
      if (key === "segments") {
        return this.collections.segments;
      } else {
        return this.collections.offerings;
      }
    },
    requireError({ error, objectKey }) {
      const isRegistered = this.inputErrorsKey.find(
        inputKey => inputKey === objectKey
      );
      if (this.inputsErrors.length < 3 || !error) {
        if (error) {
          if (!isRegistered) {
            this.inputsErrors.push(error);
            this.inputErrorsKey.push(objectKey);
          }
        } else {
          if (isRegistered) {
            this.inputErrorsKey = this.inputErrorsKey.filter(
              inputKey => inputKey !== objectKey
            );
            this.inputsErrors.pop();
          }
        }
      }
      this.error =
        this.inputsErrors.length !== 0 || this.multiSelectErrors.length !== 0;
      this.btnError = this.error && this.btnError;
    },
    getTeam() {
      const names = this.selectedCase.team.map(member => member.name);
      return names.join();
    },
    formatDate(date) {
      const enteringDate = new Date(date);
      const month = enteringDate.getMonth() + 1;
      const year = enteringDate.getFullYear();
      return `${month < 10 ? "0" + month : month}/${year}`;
    },
    scrollToElement() {
      const element = document.querySelector(".inputError");
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
    },
    getValues(options) {
      const optionsNames = [];
      options.forEach(option => optionsNames.push(option.name));
      return optionsNames;
    },
    checkMultiSelectValue(payload) {
      const isRegistered = this.multiSelectErrors.find(
        key => key === payload.key
      );
      if (
        (payload.isEmpty && !isRegistered) ||
        (payload.key === "offerings" &&
          payload.isEmpty &&
          !this.wasOfferingChecked) ||
        (payload.key === "segments" &&
          payload.isEmpty &&
          !this.wasSegmentChecked)
      ) {
        this.wasOfferingChecked = true;
        this.multiSelectErrors.push(payload.key);
        if (
          payload.key === "offerings" &&
          this.services.length > 0 &&
          payload.isEmpty
        ) {
          const selectContainer = document.querySelector(`#${payload.key}`);
          selectContainer && selectContainer.classList.add("inputError");
        }
        if (
          payload.key === "segments" &&
          this.industries.length > 0 &&
          payload.isEmpty
        ) {
          const selectContainer = document.querySelector(`#${payload.key}`);
          selectContainer && selectContainer.classList.add("inputError");
        }
      } else if (isRegistered) {
        this.multiSelectErrors = this.multiSelectErrors.filter(
          key => key !== payload.key
        );
        if (!payload.isEmpty) {
          const selectContainer = document.querySelector(`#${payload.key}`);
          selectContainer && selectContainer.classList.remove("inputError");
        }
      }
      this.error =
        this.inputsErrors.length !== 0 || this.multiSelectErrors.length !== 0;
      this.btnError = this.error && this.btnError;
    },
    updateOptions(key) {
      if (key === "industries") {
        if (this.industries.length > 0) {
          // Update segment options
          this.segmentsOptions = this.collections.segments.reduce(
            (acc, segment) => {
              this.industries.forEach(industry => {
                if (industry.name === segment.industry.name) {
                  acc.push(segment);
                }
              });
              return acc;
            },
            []
          );
          // Update selected segments with segments options
          this[CLIENT_INFO_MUTATIONS_TYPES.SET_CLIENT_INFO_FIELD]({
            value: this.segments.filter(segment =>
              this.segmentsOptions.some(
                segmentOption => segmentOption.name === segment.name
              )
            ),
            key: ClientInfoFields.SEGMENTS,
            secondaryStep: SecondaryStep.firstStep
          });
        } else {
          // Reset segment options
          this.segmentsOptions = this.collections.segments;
          this[CLIENT_INFO_MUTATIONS_TYPES.SET_CLIENT_INFO_FIELD]({
            value: [],
            key: ClientInfoFields.SEGMENTS,
            secondaryStep: SecondaryStep.firstStep
          });
          this.multiSelectErrors.push("segments");
          const selectContainer = document.querySelector(`#segments`);
          selectContainer && selectContainer.classList.add("inputError");
        }
      } else {
        // Update services options
        if (this.services.length > 0) {
          this.offeringsOptions = this.collections.offerings.reduce(
            (acc, offering) => {
              this.services.forEach(service => {
                if (service.name === offering.service.name) {
                  acc.push(offering);
                }
              });
              return acc;
            },
            []
          );
          // Update selected services with offerings options
          this[CLIENT_INFO_MUTATIONS_TYPES.SET_CLIENT_INFO_FIELD]({
            value: this.offerings.filter(offering =>
              this.offeringsOptions.some(
                offeringOption => offeringOption.name === offering.name
              )
            ),
            key: ClientInfoFields.OFFERINGS,
            secondaryStep: SecondaryStep.firstStep
          });
        } else {
          // Reset offering options
          this.offeringsOptions = this.collections.offerings;
          this[CLIENT_INFO_MUTATIONS_TYPES.SET_CLIENT_INFO_FIELD]({
            value: [],
            key: ClientInfoFields.OFFERINGS,
            secondaryStep: SecondaryStep.firstStep
          });
          this.multiSelectErrors.push("offerings");
          const selectContainer = document.querySelector(`#offerings`);
          selectContainer && selectContainer.classList.add("inputError");
        }
      }
    },
    handleChange(inputObject) {
      // Update segments and offerings
      if (inputObject.key === "industries" || inputObject.key === "services") {
        if (this.offeringsOptions.length === 0) {
          const falseOffering = {
            key: "offerings",
            newValue: [
              {
                OfferingID: -1,
                name: "False Offering"
              }
            ]
          };
          this.multiSelectErrors = this.multiSelectErrors.filter(
            key => key !== "offerings"
          );
          this.wasOfferingChecked = false;
          this[CLIENT_INFO_MUTATIONS_TYPES.SET_CLIENT_INFO_FIELD]({
            value: falseOffering,
            key: ClientInfoFields.OFFERINGS,
            secondaryStep: SecondaryStep.firstStep
          });
        }
      }
      // Store selected values
      const newValues = [];
      if (Array.isArray(inputObject.forcedSave)) {
        inputObject.forcedSave.forEach(optionName => {
          const optionObject = this.collections[inputObject.key].find(
            element => `${element.name}` === optionName
          );
          if (optionObject) {
            newValues.push({
              [inputObject.foreignKey]: Object.values(optionObject)[0],
              name: optionObject.name
            });
          }
        });
        const { key, forcedSave } = inputObject;
        this[CLIENT_INFO_ACTIONS_TYPES.CHANGE_CLIENT_INFO_FIELD]({
          value: newValues,
          step: SecondaryStep.firstStep,
          key,
          isForcedSave: forcedSave
        });
        this.updateOptions(inputObject.key);
      } else {
        const { key, newValue } = inputObject;
        this[CLIENT_INFO_ACTIONS_TYPES.CHANGE_CLIENT_INFO_FIELD]({
          value: newValue,
          step: SecondaryStep.firstStep,
          key,
          isForcedSave: true
        });
      }
    },
    findQuestionInStateF(a, b) {
      return findQuestionInState(a, b);
    },
    handleSingleChange(inputObject) {
      this[CLIENT_INFO_ACTIONS_TYPES.CHANGE_CLIENT_INFO_FIELD]({
        value: inputObject.e.target.value,
        step: SecondaryStep.firstStep,
        key: ClientInfoFields.REVENUE,
        isForcedSave: true
      });
      const container = document.getElementById(inputObject.key);
      this.findQuestionInStateF(
        this.selectedCase.clientInformation,
        ClientInfoFields.REVENUE
      ).answer;
      container && container.classList.remove("inputError");

      this.requireError({
        error: !inputObject.e.target.value,
        objectKey: inputObject.key
      });
    }
  }
});

export default Component;
</script>

<style lang="scss" scoped>
.clientInformationStepContainer {
  width: 88%;
  height: 100%;
}

.inputColumnsContainer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  width: 90%;
}

.clientFields,
.projectFields {
  width: 100%;
}

.fieldTitle {
  margin-bottom: 30px;
  font-size: 17px;
  font-weight: 700;
}

#clientRevenueBucket {
  width: 100%;
}

.containerInputs {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.modalInputContainer {
  width: 46%;
}

.selectField {
  width: 100%;
  border: 1px solid black;
  padding: 10px 5px;
  color: var(--color-black);
  border: 1px solid var(--color-dark-grey-border);
  background: transparent;
  border-radius: 5px;
  option {
    padding: 10px 5px;
  }
}

.colorGreen {
  color: var(--color-green);
}

.inputError {
  .inputLabel {
    color: var(--color-red);
  }

  .selectField {
    border-color: var(--color-red);
  }
}

.selectField:focus {
  outline: none !important;
  border: 0.1px solid var(--color-green);
}

.selectContainer {
  width: 46%;
  .selectTitle {
    font-size: 14px;
  }
  label {
    font-size: 14px;
    margin-bottom: 1px;
  }
}
</style>
