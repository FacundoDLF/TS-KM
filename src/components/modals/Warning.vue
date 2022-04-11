<template>
  <div class="modal-content">
    <h1 v-if="type !== 'Submit' && type !== 'Publish'" class="modalTitle">
      Are you sure you want to
      {{
        type === "ApproveMD" || type === "ApproveKM"
          ? "approve the case"
          : "send this case back to the case author"
      }}?
    </h1>
    <h1 v-else-if="type === 'Publish'" class="modalTitle">
      Are you sure you want to publish the case?
    </h1>
    <h1 v-else class="modalTitle">Are you sure you want to submit the case?</h1>
    <h2 class="modalSubtitle">{{ projectName }}</h2>
    <div class="buttonsContainer">
      <button class="cancel" @click="closeWarning">
        Cancel
      </button>
      <b-spinner v-if="isLoading" class="loadingSpinner"> </b-spinner>
      <button
        v-else
        class="continue"
        :disabled="isFetching"
        @click="confirmAction"
      >
        Confirm
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { ACTIONS_TYPES as SELECTED_CASE_ACTIONS_TYPES } from "@/store/modules/selectedCase/types";
import {
  ACTIONS_TYPES as MODAL_ACTIONS_TYPES,
  ModalComponents
} from "@/store/modules/modal/types";

export default {
  name: "Warning",
  data: () => ({
    newScenarioName: null,
    spinnerColor: "#5CB335",
    spinnerMargin: "1px"
  }),
  props: {
    type: {
      type: String
    }
  },
  computed: {
    ...mapState({
      userProfile: state => state.userProfile,
      projectName: state => state.selectedCase.projectName,
      isFetching: state => state.isFetching,
      isLoading: state => state.isLoading,
      selectedCaseId: state => state.selectedCase.caseId
    })
  },
  methods: {
    ...mapActions("selectedCase", [
      SELECTED_CASE_ACTIONS_TYPES.SUBMIT_CASE,
      SELECTED_CASE_ACTIONS_TYPES.PUBLISH_CASE,
      SELECTED_CASE_ACTIONS_TYPES.OPEN_CASE,
      SELECTED_CASE_ACTIONS_TYPES.APPROVE_CASE_MD,
      SELECTED_CASE_ACTIONS_TYPES.APPROVE_CASE_KM
    ]),
    ...mapActions("modal", [MODAL_ACTIONS_TYPES.CLOSE_MODAL]),
    closeWarning() {
      this[MODAL_ACTIONS_TYPES.CLOSE_MODAL]({
        component: ModalComponents.WARNING
      });
    },
    confirmAction() {
      switch (this.type) {
        case "Submit":
          this[SELECTED_CASE_ACTIONS_TYPES.SUBMIT_CASE](this.selectedCaseId);
          break;
        case "Publish":
          this[SELECTED_CASE_ACTIONS_TYPES.PUBLISH_CASE](this.selectedCaseId);
          break;
        case "ApproveKM":
          this[SELECTED_CASE_ACTIONS_TYPES.APPROVE_CASE_KM](
            this.selectedCaseId
          );
          break;
        case "backToAuthor":
          this[SELECTED_CASE_ACTIONS_TYPES.OPEN_CASE](this.selectedCaseId);
          break;
        default:
          "-";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 40%;
  width: 90%;
  padding: 80px 50px;
  text-align: center;
  animation: fadein 0.4s;
}

.loadingSpinner {
  justify-self: center;
  align-self: center;
  width: 1.5em;
  height: 1.5em;
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
  font-weight: bold;
  color: var(--color-black);
}

.modalSubtitle {
  margin-bottom: 15px;
  font-size: 17px;
  font-weight: 400;
  color: var(--color-black);
}

.buttonsContainer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 35%;
  margin: auto;
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

.continue:disabled {
  background-color: var(--color-light-green);
}

.cancel {
  border: 1px solid var(--color-light-grey);
  color: var(--color-light-grey);
}
.cancel:hover {
  color: var(--color-white);
  background-color: var(--color-light-grey);
}

@media screen and (min-width: 960px) {
  .modal-content {
    align-items: flex-start;
    height: auto;
    width: 58rem;
    text-align: left;
    padding: 40px 20px 20px 40px;
  }

  .modalTitle {
    font-size: 24px;
  }

  .homePage {
    align-self: flex-end;
  }
}
</style>
