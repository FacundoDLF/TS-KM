<template>
  <div class="approachStepContainer">
    <RichTextInput
      v-for="question in firstStep"
      :key="question.id"
      :title="question.title"
      @myBlur="handleChange"
      :value="getValue(question.id)"
      :inputKey="question.id"
      :disabled="isLoading"
      :description="question.description"
      :lengthLimit="question.lengthLimit"
      :isRequired="question.isRequired"
      :bigger="firstStep.length < 3"
      :error="question.error"
      :editMode="editMode"
    />
  </div>
</template>

<script>
import Vue from "vue";
import RichTextInput from "@/components/shared/RichTextInput";
import { ApproachFields } from "@/constants/approachFields";
import { mapState, mapGetters, mapActions } from "vuex";
import { ACTIONS_TYPES as APPROACH_ACTIONS_TYPES } from "@/store/modules/selectedCase/approach/types";
import { SecondaryStep } from "@/types";
import findQuestionInState from "@/helpers/findQuestionInState";

const Component = Vue.extend({
  name: "ApproachStep1",
  components: {
    RichTextInput
  },
  methods: {
    getValue(id) {
      if (id === ApproachFields.NARRATIVE) {
        return this.narrative;
      } else if (id === ApproachFields.DETAILS) {
        return this.details;
      }
    },
    ...mapActions("selectedCase/approach", [
      APPROACH_ACTIONS_TYPES.CHANGE_APPROACH_FIELD
    ]),
    handleChange(value) {
      const { e, key, forcedSave } = value;
      this[APPROACH_ACTIONS_TYPES.CHANGE_APPROACH_FIELD]({
        value: forcedSave || e.target.value,
        step: SecondaryStep.firstStep,
        key,
        isForcedSave: forcedSave
      });
    }
  },
  computed: {
    ...mapState({
      firstStep: state =>
        state["selectedCase"].approach[SecondaryStep.firstStep],
      editMode: state => state.selectedCase.editMode,
      isLoading: state => state.isLoading
    }),
    ...mapGetters("selectedCase/approach", ["approachErrors"]),
    narrative() {
      return findQuestionInState(
        this.$store.state.selectedCase.approach,
        ApproachFields.NARRATIVE
      ).answer;
    },
    details() {
      return findQuestionInState(
        this.$store.state.selectedCase.approach,
        ApproachFields.DETAILS
      ).answer;
    },
    ApproachFields() {
      return ApproachFields;
    }
  }
});

export default Component;
</script>

<style lang="scss" scoped>
.approachStepContainer {
  width: 100%;
  height: 100%;
}
</style>
