<template>
  <div v-if="visible" class="underlayer">
    <div class="modalContainer">
      <button v-if="showCloseButton" class="close-btn" @click="CLOSE_MODAL">
        X
      </button>
      <component :is="content" v-bind="props"></component>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { ACTIONS_TYPES, ModalComponents } from "@/store/modules/modal/types";
import LocalSessionExpired from "../modals/LocalSessionExpired";
import PermissionError from "../modals/PermissionError";
import SubmitSuccess from "../modals/SubmitSuccess";
import AddStarterTextConfirmation from "../modals/AddStarterTextConfirmation";
import AuthorSelectionModal from "../modals/AuthorSelectionModal";
import ExportSelection from "../modals/ExportSelection";
import Warning from "../modals/Warning";
import ErrorModal from "../modals/ErrorModal";
import FinancialMetric from "../modals/FinancialMetric";
import RpmMetric from "../modals/RpmMetric";

export default {
  components: {
    LocalSessionExpired,
    PermissionError,
    SubmitSuccess,
    AddStarterTextConfirmation,
    AuthorSelectionModal,
    ExportSelection,
    Warning,
    ErrorModal,
    FinancialMetric,
    RpmMetric
  },
  watch: {
    visible(newValue, prevValue) {
      // Hide body overflow to prevent scrollbars.
      const element = document.querySelector("body");
      if (newValue !== prevValue && newValue) {
        element.style.overflow = "hidden";
      } else {
        element.style.removeProperty("overflow");
      }
    }
  },
  computed: {
    ...mapState({
      visible: state => state["modal"].visible,
      content: state => state["modal"].content,
      props: state => state["modal"].props
    }),
    showCloseButton() {
      return this.content === ModalComponents.LOCAL_SESSION_EXPIRED;
    }
  },
  methods: {
    ...mapActions("modal", [ACTIONS_TYPES.CLOSE_MODAL])
  }
};
</script>

<style lang="scss" scoped>
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

.modalContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: auto;
  padding: 50px;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 24px;
  z-index: 2002;
  background: unset;
  border: unset;
  padding: unset;
  color: var(--color-medium-grey);

  &:hover {
    color: var(--color-black);
  }
}

@media screen and (min-width: 960px) {
  .modalContainer {
    align-items: flex-start;
  }
}
</style>
