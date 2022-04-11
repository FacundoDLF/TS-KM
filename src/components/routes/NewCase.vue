<template>
  <div class="container">
    <div v-if="!getUserName()" class="spinnerContainer">
      <div class="spinner">
        <b-spinner />
      </div>
    </div>
    <div v-else class="authorSelection">
      <h2>Hi {{ getUserName() }}</h2>
      <p>
        To get started, click the start button and select the case author and
        the team members
      </p>
      <button @click="openSelectionModal" class="startButton">Start</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import router from "@/router";
import { ACTIONS_TYPES as PRECASE_ACTIONS_TYPES } from "@/store/modules/preCase/types";
import { ACTIONS_TYPES as GLOBAL_ACTIONS_TYPES } from "@/store/types";

export default {
  name: "NewCase",
  computed: {
    ...mapState({
      user: state => state.user
    })
  },
  methods: {
    ...mapActions([GLOBAL_ACTIONS_TYPES.FETCH_COLLECTIONS]),
    ...mapActions("precase", [PRECASE_ACTIONS_TYPES.FETCH_PRECASE]),
    getUserName() {
      const { 0: userName } = this.user.name ? this.user.name.split(" ") : "";
      return userName;
    },
    async openSelectionModal() {
      await this[PRECASE_ACTIONS_TYPES.FETCH_PRECASE](
        router.currentRoute.params.id
      );
      await this[GLOBAL_ACTIONS_TYPES.FETCH_COLLECTIONS]();
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  align-self: center;
}

.spinnerContainer {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.authorSelection {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  p {
    color: var(--color-light-grey);
  }
}

.startButton {
  width: 126px;
  height: 36px;
  background-color: var(--color-green);
  color: white;
  text-transform: uppercase;
}
</style>
