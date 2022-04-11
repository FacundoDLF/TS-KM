<template>
  <div class="situationStepContainer">
    <RichTextInput
      v-for="question in secondStep"
      :key="question.id"
      :title="question.title"
      @myBlur="handleChange"
      :value="getValue(question.id)"
      :inputKey="question.id"
      :disabled="isLoading"
      :description="question.description"
      :isRequired="question.isRequired"
      :bigger="secondStep.length < 3"
      :lengthLimit="question.lengthLimit"
      :error="question.error"
      :editMode="editMode"
    />
  </div>
</template>

<script>
import Vue from "vue";
import RichTextInput from "@/components/shared/RichTextInput";
import { SituationFields } from "@/constants/situationFields";
import { mapState, mapGetters, mapActions } from "vuex";
import { ACTIONS_TYPES as SITUATION_ACTIONS_TYPES } from "@/store/modules/selectedCase/situation/types";
import { SecondaryStep } from "@/types";
import findQuestionInState from "@/helpers/findQuestionInState";

const Component = Vue.extend({
  name: "SituationStep2",
  components: {
    RichTextInput
  },
  methods: {
    getValue(id) {
      switch (id) {
        case SituationFields.DESCRIPTION:
          return this.description;
        case SituationFields.CHALLENGES:
          return this.challenges;
        case SituationFields.HIRED_TO:
          return this.hiredTo;
        default:
          break;
      }
    },
    ...mapActions("selectedCase/situation", [
      SITUATION_ACTIONS_TYPES.CHANGE_SITUATION_FIELD
    ]),
    handleChange(value) {
      const { e, key, forcedSave } = value;
      this[SITUATION_ACTIONS_TYPES.CHANGE_SITUATION_FIELD]({
        value: forcedSave || e.target.value,
        step: SecondaryStep.secondStep,
        key,
        isForcedSave: forcedSave
      });
    }
  },
  computed: {
    ...mapState({
      secondStep: state =>
        state["selectedCase"].situation[SecondaryStep.secondStep],
      editMode: state => state.selectedCase.editMode,
      isLoading: state => state.isLoading
    }),
    ...mapGetters("selectedCase/situation", ["situationErrors"]),
    description() {
      return findQuestionInState(
        this.$store.state.selectedCase.situation,
        SituationFields.DESCRIPTION
      ).answer;
    },
    challenges() {
      return findQuestionInState(
        this.$store.state.selectedCase.situation,
        SituationFields.CHALLENGES
      ).answer;
    },
    hiredTo() {
      return findQuestionInState(
        this.$store.state.selectedCase.situation,
        SituationFields.HIRED_TO
      ).answer;
    },
    SituationFields() {
      return SituationFields;
    }
  }
});

export default Component;
</script>

<style lang="scss" scoped>
.situationStepContainer {
  width: 100%;
  height: 100%;
}
</style>
