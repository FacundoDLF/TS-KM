<template>
  <div class="modal-content">
    <h1 v-if="type === 'rejectSucces'">
      Case successfully rejected
    </h1>
    <h1 v-if="type === 'reopenCase'" class="modalTitle">
      You have successfully reopened
      <span class="projectName">{{ projectName }}</span>
    </h1>
    <h1 v-if="type === 'publishCase'" class="modalTitle">
      Thank you for publishing the case.
      <br />
      <span class="modalSubtitle">
        This case will now be available firm-wide.
      </span>
      <br />
      <h2 class="modalSubtitle">
        Recently published cases can take up to an hour to be available for
        search
      </h2>
    </h1>
    <h1 v-if="type === 'approveCase'" class="modalTitle">
      Thank you for submitting the case.
      <br />
      <span class="modalSubtitle">
        The supervising MD will now review and publish the case.
      </span>
    </h1>
    <h1 v-if="type === 'submitCase'" class="modalTitle">
      Thank you for submitting the case
    </h1>
    <h1 v-if="type === 'submitSucces'" class="modalTitle">
      Thank you for selecting the Case Author
    </h1>
    <button class="homePage" @click="goToHomePage">Go to Home page</button>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { ACTIONS_TYPES as GLOBAL_ACTIONS_TYPES } from "@/store/types";
import {
  ACTIONS_TYPES as MODAL_ACTIONS_TYPES,
  ModalComponents
} from "@/store/modules/modal/types";

export default {
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
      projectName: state => state.selectedCase.projectName
    })
  },
  methods: {
    ...mapActions([GLOBAL_ACTIONS_TYPES.ROUTER_REPLACE]),
    ...mapActions("modal", [MODAL_ACTIONS_TYPES.CLOSE_MODAL]),
    goToHomePage() {
      this[MODAL_ACTIONS_TYPES.CLOSE_MODAL]({
        component: ModalComponents.SUBMIT_SUCCESS
      });
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
  padding: 50px 30px;
  text-align: center;
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

.modalTitle {
  margin-bottom: 10px;
  font-size: 23px;
  font-weight: 700;
  color: var(--color-black);
}

.projectName {
  color: var(--color-green);
}

.modalSubtitle {
  margin-bottom: 15px;
  font-size: 17px;
  font-weight: 400;
  color: var(--color-black);
}

.toContinue {
  font-size: 20px;
  color: var(--color-medium-grey);
}

.homePage {
  text-align: center;
  text-transform: uppercase;
  font-size: 14px;
  padding: 10px 50px;
  margin-top: 10px;
  color: var(--color-white);
  background-color: var(--color-green);
}

.homePage:hover {
  background-color: var(--color-light-green);
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
    align-self: center;
  }
}
</style>
