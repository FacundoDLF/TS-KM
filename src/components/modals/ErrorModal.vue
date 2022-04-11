<template>
  <div class="modal-content">
    <h1 class="modalTitle">There was an error</h1>
    <h2 class="modalSubtitle">
      Something went wrong
    </h2>
    <button class="homePage" @click="goToHomePage">Go to Home page</button>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { ACTIONS_TYPES as GLOBAL_ACTIONS_TYPES } from "@/store/types";
import {
  ACTIONS_TYPES as MODAL_ACTIONS_TYPES,
  ModalComponents
} from "@/store/modules/modal/types";
import { Routes } from "@/constants/routes";

export default {
  name: "ErrorModal",
  methods: {
    ...mapActions([GLOBAL_ACTIONS_TYPES.ROUTER_REPLACE]),
    ...mapActions("modal", [MODAL_ACTIONS_TYPES.CLOSE_MODAL]),
    goToHomePage() {
      this[GLOBAL_ACTIONS_TYPES.ROUTER_REPLACE](Routes.MY_CASES);
      window.location.reload();
      this[MODAL_ACTIONS_TYPES.CLOSE_MODAL]({
        component: ModalComponents.PERMISSION_ERROR
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
  font-size: 24px;
  font-weight: bold;
  color: var(--color-black);
}

.modalSubtitle {
  margin-bottom: 15px;
  font-size: 20px;
  color: var(--color-red);
}

.toContinue {
  font-size: 18px;
  color: var(--color-medium-grey);
}

.homePage {
  text-align: center;
  text-transform: uppercase;
  font-size: 14px;
  padding: 10px 15px;
  margin-top: 10px;
  color: var(--color-white);
  background-color: var(--color-red);
}

.homePage:hover {
  background-color: var(--color-light-red);
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
