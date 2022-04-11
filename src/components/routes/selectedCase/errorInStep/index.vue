<template>
  <div class="container">
    <h1 class="title">
      Please complete all the required questions.
    </h1>
    <ErrorStep1 />
  </div>
</template>
<script>
import Vue from "vue";
import ErrorStep1 from "./ErrorStep1";

const Component = Vue.extend({
  name: "ErrorInStep",
  components: {
    ErrorStep1
  }
});

export default Component;
</script>
<style lang="scss" scoped>
.StepContainer {
  display: flex;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  animation: fadein 0.4s;
}

.title {
  color: var(--color-black);
  font-size: 23px !important;
  font-weight: 700;
  margin: 50px 0px 30px 0px;
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
