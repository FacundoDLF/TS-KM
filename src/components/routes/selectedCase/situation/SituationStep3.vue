<template>
  <div class="situationStepContainer">
    <div v-for="question in thirdStep" :key="question.id">
      <RichTextInput
        v-if="
          question.type == 'text' &&
            question.id != SituationFields.FAS_OPPOSING_EXPERT_REPORT_DATE
        "
        :title="question.title"
        @myBlur="handleChange"
        :value="getAnswers(question.id)"
        :inputKey="question.id"
        :disabled="isLoading"
        :description="question.description"
        :isRequired="question.isRequired"
        :error="question.error"
        :editMode="editMode"
      />
      <div class="inputNumericCointainer">
        <div class="numericContainer">
          <NumericInput
            v-if="question.type == 'numeric'"
            :title="question.title"
            @numericChange="handleChange"
            :value="getAnswers(question.id)"
            :inputKey="question.id"
            :disabled="isLoading"
            :description="question.description"
            :isRequired="question.isRequired"
            :error="question.error"
            :editMode="editMode"
          />
        </div>
      </div>
      <div class="dateContainer">
        <DateInput
          v-if="question.id == SituationFields.FAS_OPPOSING_EXPERT_REPORT_DATE"
          @inputModified="handleChange"
          :objectKey="question.id"
          :title="question.title"
          :value="getAnswers(question.id)"
          :required="question.isRequired"
          :editable="editMode"
          :disabled="!editMode"
          label=""
          dense
          onlyMonth
        />
      </div>
      <div class="multiSelectContainer" v-if="question.type == 'multiselect'">
        <MultiSelect
          :title="question.title"
          :inputKey="question.id"
          :options="getMultiSelectOptions(question.id) || []"
          :groupLabel="
            question.id == SituationFields.FAS_TERMS ? 'fasTermGroup' : ''
          "
          :groupValues="question.id == SituationFields.FAS_TERMS ? 'terms' : ''"
          label="name"
          placeholder=""
          :value="getAnswers(question.id) || []"
          :trackBy="getTrackById(question.id)"
          :editMode="editMode"
          :isRequired="question.isRequired"
          @selectedChange="handleChange"
        />
        <div class="inputContainer" v-if="otherSpecify(question.id)">
          <label for="otherSpecify">Please specify the other option</label>
          <input
            class="inputField"
            type="text"
            @blur="updateOtherSpecify(question.id)"
            v-model="otherSpecify(question.id).otherSpecify"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import RichTextInput from "@/components/shared/RichTextInput";
import MultiSelect from "@/components/shared/MultiSelect";
import DateInput from "@/components/shared/DateInput";
import NumericInput from "@/components/shared/NumericInput";
import { SituationFields } from "@/constants/situationFields";
import { mapState, mapGetters, mapActions } from "vuex";
import { ACTIONS_TYPES as SITUATION_ACTIONS_TYPES } from "@/store/modules/selectedCase/situation/types";
import { SecondaryStep } from "@/types";
import findQuestionInState from "@/helpers/findQuestionInState";

const Component = Vue.extend({
  name: "SituationStep3",
  components: {
    RichTextInput,
    MultiSelect,
    DateInput,
    NumericInput
  },
  methods: {
    getTrackById(id) {
      switch (id) {
        case SituationFields.FAS_REGULATORY_AGENCIES:
          return "fasRegulatoryAgencyId";
        case SituationFields.FAS_TERMS:
          return "fasTermId";
        default:
          return "fasLawFirmId";
      }
    },
    getAnswers(id) {
      return findQuestionInState(this.$store.state.selectedCase.situation, id)
        .answer;
    },
    ...mapActions("selectedCase/situation", [
      SITUATION_ACTIONS_TYPES.CHANGE_SITUATION_FIELD
    ]),
    updateOtherSpecify(key) {
      let newValue;
      if (
        key == SituationFields.FAS_LAW_FIRMS ||
        key == SituationFields.FAS_OPPOSING_LAW_FIRMS
      )
        newValue = [
          ...this.getAnswers(SituationFields.FAS_OPPOSING_LAW_FIRMS),
          ...this.getAnswers(SituationFields.FAS_LAW_FIRMS)
        ];
      else newValue = this.getAnswers(key);
      this[SITUATION_ACTIONS_TYPES.CHANGE_SITUATION_FIELD]({
        value: newValue,
        step: SecondaryStep.thirdStep,
        key,
        isForcedSave: true
      });
    },
    handleChange(fieldValue) {
      const { e, key, forcedSave } = fieldValue;
      const newValue =
        fieldValue.newValue ||
        (Array.isArray(forcedSave)
          ? forcedSave.map(f => Object.assign({}, f))
          : forcedSave);
      if (
        key == SituationFields.FAS_LAW_FIRMS ||
        key == SituationFields.FAS_OPPOSING_LAW_FIRMS
      ) {
        const lawFirms = Object.assign(
          [],
          this.getAnswers(SituationFields.FAS_LAW_FIRMS)
        );
        const opposingLawFirms = Object.assign(
          [],
          this.getAnswers(SituationFields.FAS_OPPOSING_LAW_FIRMS)
        );
        if (key == SituationFields.FAS_LAW_FIRMS)
          newValue.push(...opposingLawFirms);
        else {
          newValue.forEach(v => (v.isOpposing = true));
          newValue.push(...lawFirms);
        }
      }
      this[SITUATION_ACTIONS_TYPES.CHANGE_SITUATION_FIELD]({
        value: newValue || e?.target?.value,
        step: SecondaryStep.thirdStep,
        key,
        isForcedSave: forcedSave
      });
    },
    getMultiSelectOptions(id) {
      let options;
      switch (id) {
        case SituationFields.FAS_LAW_FIRMS:
        case SituationFields.FAS_OPPOSING_LAW_FIRMS:
          options = this.collections.fasLawFirms;
          break;
        case SituationFields.FAS_TERMS:
          options = this.fasTerms;
          break;
        case SituationFields.FAS_REGULATORY_AGENCIES:
          options = this.collections.fasRegulatoryAgencies;
          break;
        default:
          options = [];
      }
      return options;
    },
    otherSpecify(questionId) {
      const answers = this.getAnswers(questionId);
      if (!answers || !answers.length) return;
      return answers.find(a => a.name == "Other");
    }
  },
  computed: {
    ...mapState({
      thirdStep: state =>
        state["selectedCase"].situation[SecondaryStep.thirdStep],
      collections: state => state.collections,
      editMode: state => state.selectedCase.editMode,
      isLoading: state => state.isLoading
    }),
    ...mapGetters("selectedCase", ["isFasCase"]),
    ...mapGetters("selectedCase/situation", ["situationErrors"]),
    fasTerms() {
      return !this.collections.fasTerms
        ? []
        : this.collections.fasTerms.reduce((acc, e) => {
            const index = acc.findIndex(
              group => group.id == e.fasTermGroup.fasTermGroupId
            );
            if (index < 0)
              acc.push({
                fasTermGroup: e.fasTermGroup.name,
                id: e.fasTermGroup.fasTermGroupId,
                terms: [
                  {
                    name: e.name,
                    fasTermId: e.fasTermId,
                    otherSpecify: e.otherSpecify
                  }
                ]
              });
            else
              acc[index].terms.push({
                name: e.name,
                fasTermId: e.fasTermId,
                otherSpecify: e.otherSpecify
              });
            return acc;
          }, []);
    },
    SituationFields() {
      return SituationFields;
    }
  }
});

export default Component;
</script>

<style lang="scss" scoped>
.inputContainer {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  height: 70px;
  margin-bottom: 40px;
}

.inputLabel {
  position: absolute;
  pointer-events: none;
  font-size: 14px;
  top: 0;
  color: var(--color-black);
  transition: all 0.1s ease-in;
}

.inputField {
  width: 100%;
  border: 1px solid black;
  padding: 10px 5px;
  color: var(--color-black);
  border: 1px solid var(--color-grey-border);
  background: transparent;
  border-radius: 5px;
  font-size: 14px;
}

.inputField:focus {
  outline: none !important;
  border: 0.1px solid var(--color-green);
}

.inputField:focus + .inputLabel {
  color: var(--color-green);
  left: 0 !important;
  top: 0 !important;
}

.multiSelectContainer {
  width: 80%;
}
.numericContainer {
  width: 100%;
}

.inputNumericCointainer {
  width: 80%;
}

.dateContainer {
  width: 80%;
  padding: 12px 0;
}
.situationStepContainer {
  width: 100%;
  height: 100%;
}
</style>
