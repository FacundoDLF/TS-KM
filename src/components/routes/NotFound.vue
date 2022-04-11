<template>
  <div class="col-center container">
    <h3>Not Found</h3>
  </div>
</template>

<script>
import Vue from "vue";

const Component = Vue.extend({
  name: "NotFound",
  beforeCreate() {
    this.$router.push("/my-cases");
  }
});

export default Component;
</script>

<style scoped lang="scss">
.container {
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 400px;
}
</style>
