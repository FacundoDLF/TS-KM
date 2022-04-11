<template>
  <div class="pptButton" id="pptExtracts">
    <button @click="previewPpt" class="button">
      Preview PPT
    </button>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import {
  ACTIONS_TYPES as MODAL_ACTIONS_TYPES,
  ModalComponents
} from "@/store/modules/modal/types";
import { emitInsightEvent, InsightEvent } from "@/helpers/insights";

export default {
  name: "PptPreviewButton",
  methods: {
    ...mapActions("modal", [MODAL_ACTIONS_TYPES.OPEN_MODAL]),
    previewPpt() {
      emitInsightEvent(InsightEvent.previewPpt);
      this[MODAL_ACTIONS_TYPES.OPEN_MODAL]({
        component: ModalComponents.PREVIEW_PPT
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.pptButton {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: fixed;
  top: 0;
  margin-top: 50px;
  right: 200px;
  z-index: 5;
}

.button {
  font-size: 12px;
  padding: 5px 15px 5px 8px;
  height: 29px;
  border: none;
  background-color: var(--color-green);
  color: var(--color-white);
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.3);
}

.cardHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.edit {
  margin-right: 14px;
  color: var(--color-green);
  cursor: pointer;
}

.content {
  display: flex;
  flex-direction: column;
  width: 850px;
  background-color: var(--color-white);
  color: var(--color-black);
  padding: 25px;
  -webkit-box-shadow: 0px 5px 10px 10px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0px 5px 10px 10px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 5px 10px 10px rgba(0, 0, 0, 0.1);
  animation: fadein 0.6s;
}

@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
