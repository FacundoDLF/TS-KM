<template>
  <button
    @mouseover="() => (needHelpButtonHover = true)"
    @mouseleave="() => (needHelpButtonHover = false)"
    class="needsHelpButton"
    :disabled="isFetchingRequest"
    v-if="this.$route.path !== '/faqs'"
    @click="handleNeedHelpButton"
  >
    <div class="col-sm-12 col-md-auto needsHelpText">Need help</div>
    <img
      v-if="needHelpButtonHover"
      class="icon"
      src="@/assets/img/faqs-logo-black.svg"
    />
    <img v-else class="icon" src="@/assets/img/faqs-logo-grey.svg" />
  </button>
</template>

<script>
export default {
  name: "FAQFloatButton",
  data() {
    return {
      needHelpButtonHover: false
    };
  },
  props: {
    isFetchingRequest: Boolean
  },
  methods: {
    handleNeedHelpButton() {
      this.goTo("/faqs");
    },
    goTo(route) {
      if (this.$route.path !== route) {
        this.$router.push(`${route}`);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.icon {
  height: 24px;
  width: 24px;
}

.iconMenu {
  width: 25px;
  height: 25px;
}

.needsHelpButton {
  position: absolute;
  bottom: 6%;
  align-self: flex-end;
  display: flex;
  justify-content: flex-end;
  flex-direction: row;
  align-items: center;
  margin: 30px 30px 20px 30px;
}

.needsHelpText {
  width: auto;
  display: flex;
  flex-wrap: nowrap;
  color: var(--color-medium-light-grey);
  font-size: 20px;
  padding-right: 10px;
}

.needsHelpButton:hover {
  .needsHelpText {
    color: var(--color-black);
  }
}
</style>
