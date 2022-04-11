<template>
  <div class="container">
    <h3 class="title">Approach</h3>
    <ApproachStep1 v-if="secondaryStep === 1" />
    <ProgressBar
      :class="[{ viewMode: !editMode }]"
      class="caseProgress"
      :percentage="approachStatus"
      title="Approach"
      :error="approachErrorsFirstStep > 0 || approachErrorsSecondStep > 0"
    />
  </div>
</template>

<script>
import Vue from "vue";
import ApproachStep1 from "@/components/routes/selectedCase/approach/ApproachStep1";
import ProgressBar from "@/components/shared/ProgressBar";
import { mapState, mapActions, mapGetters } from "vuex";
import { ACTIONS_TYPES as GLOBAL_ACTIONS_TYPES } from "@/store/types";
import { ACTIONS_TYPES as SELECTED_CASE_ACTIONS_TYPES } from "@/store/modules/selectedCase/types";

const Component = Vue.extend({
  name: "Approach",
  computed: {
    ...mapState({
      secondaryStep: state => state.selectedCase.secondaryStep,
      currentRoutePath: state => state.currentRoutePath,
      editMode: state => state.selectedCase.editMode
    }),
    ...mapGetters("selectedCase", ["approachStatus"]),
    ...mapGetters("selectedCase/approach", [
      "approachErrorsFirstStep",
      "approachErrorsSecondStep"
    ])
  },
  methods: {
    ...mapActions([GLOBAL_ACTIONS_TYPES.FETCH_URL_VALUES]),
    ...mapActions("selectedCase", [
      SELECTED_CASE_ACTIONS_TYPES.CHANGE_SECONDARY_STEP
    ])
  },
  created() {
    if (!this.$route.params.secondaryStep || this.secondaryStep !== 1) {
      this[SELECTED_CASE_ACTIONS_TYPES.CHANGE_SECONDARY_STEP](4);
      this[GLOBAL_ACTIONS_TYPES.FETCH_URL_VALUES]();
    }
  },
  components: {
    ApproachStep1,
    ProgressBar
  }
});

export default Component;
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  animation: fadein 0.4s;
}

.caseProgress {
  margin-top: 20px;
  width: 80%;
}

.viewMode {
  visibility: hidden;
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
  color: var(--color-black);
  margin: 50px 0px;
  font-size: 23px !important;
  text-transform: capitalize;
  font-weight: 700;
}
</style>
