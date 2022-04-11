<template>
  <div class="clientInformationContainer">
    <button
      @click="openModal"
      class="clientInformationButton"
      id="showClientData"
    >
      Show Available Case Data
    </button>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { ACTIONS_TYPES as UI_ACTION_TYPES } from "../../store/modules/ui/types";
import { directive as onClickaway } from "vue-clickaway";
import { ACTIONS_TYPES as MODAL_ACTIONS_TYPES } from "@/store/modules/modal/types";
import { ACTIONS_TYPES as SELECTED_CASE_ACTIONS_TYPES } from "@/store/modules/selectedCase/types";
import { UserRoles, CaseStatus } from "@/types";
import _ from "lodash";

export default {
  name: "ClientInformation",
  data() {
    return {
      updatingCase: false
    };
  },
  computed: {
    ...mapState({
      isShowClientInformation: state => state.ui.isShowClientInformation,
      selectedCase: state => state.selectedCase,
      isFetchingFromInfo: state => state.isFetchingFromInfo
    }),
    ...mapGetters("selectedCase", ["userRole"]),
    getIsReviewer() {
      return this.userRole === UserRoles.reviewer;
    },
    getIsAuthor() {
      return this.userRole === UserRoles.author;
    },
    isSubmitted() {
      return this.selectedCase.status === CaseStatus.submitted;
    },
    isOpen() {
      return this.selectedCase.status === CaseStatus.opened;
    }
  },
  methods: {
    ...mapActions("ui", [
      UI_ACTION_TYPES.SHOW_CLIENT_INFO,
      UI_ACTION_TYPES.HIDE_CLIENT_INFO
    ]),
    ...mapActions("modal", [
      MODAL_ACTIONS_TYPES.OPEN_MODAL,
      MODAL_ACTIONS_TYPES.CLOSE_MODAL
    ]),
    ...mapActions("selectedCase", [
      SELECTED_CASE_ACTIONS_TYPES.UPDATE_CASE_DETAILS
    ]),
    hide() {
      this[UI_ACTION_TYPES.HIDE_CLIENT_INFO]();
    },
    getShowValue(key) {
      return _.isEmpty(this.selectedCase[key]);
    },
    formatDate(date) {
      const enteringDate = new Date(date);
      const month = enteringDate.getMonth() + 1;
      const year = enteringDate.getFullYear();
      return `${month < 10 ? "0" + month : month}/${year}`;
    }
  },
  directives: {
    onClickaway
  }
};
</script>

<style lang="scss" scoped>
.clientInformationContainer {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: fixed;
  top: 0;
  margin-top: 50px;
  right: 0;
  z-index: 5;
}

.clientInformationButton {
  font-size: 12px;
  padding: 5px 15px 5px 15px;
  border: none;
  background-color: var(--color-green);
  color: var(--color-white);
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.3);
}
</style>
