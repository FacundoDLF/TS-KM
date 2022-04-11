<template>
  <div class="modal-content">
    <h1 class="modalTitle">There was an error</h1>
    <h2 class="modalSubtitle">Your token has expired</h2>
    <p class="toContinue">
      Please update your enviroment variable
      <span class="bold">VUE_APP_TOKEN</span>
    </p>
  </div>
</template>

<script>
export default {
  data: () => ({
    newScenarioName: null,
    spinnerColor: "#5CB335",
    spinnerMargin: "1px"
  })
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
  font-size: 24px !important;
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

.bold {
  font-weight: bold;
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
}
</style>
