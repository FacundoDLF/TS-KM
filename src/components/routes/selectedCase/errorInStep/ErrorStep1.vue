<template>
  <div class="warningContainer">
    <img
      :src="require('@/assets/img/error-step-logo-secondary.svg')"
      class="icon"
    />
    <span class="text"
      >The sections marked in red have uncompleted required fields. Complete the
      required fields to submit the case.</span
    >
  </div>
</template>
<script>
import Vue from "vue";
import { ACTIONS_TYPES as GLOBAL_ACTIONS_TYPES } from "@/store/types";
import { mapGetters, mapActions } from "vuex";

const Component = Vue.extend({
  name: "ErrorStep1",
  computed: {
    ...mapGetters("selectedCase", ["errorsInForm"])
  },
  methods: {
    ...mapActions([GLOBAL_ACTIONS_TYPES.ROUTER_REPLACE])
  },
  mounted() {
    if (!this.errorsInForm) {
      this[GLOBAL_ACTIONS_TYPES.ROUTER_REPLACE]("/situation/1");
    }
  }
});

export default Component;
</script>
<style lang="scss" scoped>
.warningContainer {
  display: flex;
  border: 1px solid #cb282e;
  background-color: #fff5f6;
  border-radius: 8px;
  align-items: center;
  padding: 10px;
}

.text {
  font-size: 15px;
  font-weight: 500;
  margin-left: 10px;
}

.icon {
  height: 25px;
  width: 25px;
}
</style>
