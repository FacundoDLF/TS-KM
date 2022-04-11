<template>
  <div class="situationStepContainer">
    <RichTextInput
      v-for="question in firstStep"
      :key="question.id"
      :title="question.title"
      @myBlur="handleChange"
      :value="getValue(question.id)"
      :inputKey="question.id"
      :disabled="isLoading"
      :maxLength="120"
      :description="question.description"
      :isRequired="question.isRequired"
      :lengthLimit="question.lengthLimit"
      :bigger="firstStep.length < 3"
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
  name: "SituationStep1",
  components: {
    RichTextInput
  },
  methods: {
    getValue(id) {
      if (id === SituationFields.HEADLINE) {
        return this.headline;
      }
    },
    ...mapActions("selectedCase/situation", [
      SITUATION_ACTIONS_TYPES.CHANGE_SITUATION_FIELD
    ]),
    handleChange(value) {
      const { e, key, forcedSave } = value;
      this[SITUATION_ACTIONS_TYPES.CHANGE_SITUATION_FIELD]({
        value: forcedSave || e.target.value,
        step: SecondaryStep.firstStep,
        key,
        isForcedSave: forcedSave
      });
    }
  },
  computed: {
    ...mapState({
      firstStep: state => state.selectedCase.situation[SecondaryStep.firstStep],
      editMode: state => state.selectedCase.editMode,
      isLoading: state => state.isLoading
    }),
    ...mapGetters("selectedCase/situation", ["situationErrors"]),
    headline() {
      return findQuestionInState(
        this.$store.state.selectedCase.situation,
        SituationFields.HEADLINE
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
