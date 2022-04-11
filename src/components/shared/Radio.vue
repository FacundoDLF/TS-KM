<template>
  <div class="radioContainer">
    <h2 class="radioTitle">
      {{ title }}
      <span v-if="isRequired" class="isRequiredInput">*</span>
    </h2>
    <div class="radioRow">
      <span class="radioDescription">
        {{ description }}
      </span>
    </div>
    <div class="radioButton">
      <button
        @click="onOptionSelected(true)"
        id="yes"
        class="selectButton"
        type="button"
        :class="{ radioButtonSelected: value }"
      >
        <div v-if="value" class="radioButtonSelectedCheck" />
      </button>
      <label class="radioLabel">Yes</label>
      <button
        @click="onOptionSelected(false)"
        id="no"
        class="selectButton"
        type="button"
        :class="{ radioButtonSelected: !value }"
      >
        <div v-if="!value" class="radioButtonSelectedCheck" />
      </button>
      <label class="radioLabel">No</label>
    </div>
    <span v-if="error" class="errorMessage">This question is required</span>
  </div>
</template>

<script>
export default {
  name: "Radio",
  props: {
    value: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    inputKey: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    isRequired: {
      type: Boolean
    },
    error: {
      type: String
    }
  },
  methods: {
    onOptionSelected(value) {
      this.$emit("radioChange", { value, key: this.inputKey });
    }
  }
};
</script>

<style lang="scss" scoped>
.radioContainer {
  position: relative;
  width: 100%;
}

.radioTitle {
  font-size: 26px;
}

.radioDescription {
  margin-bottom: 0;
  font-size: 16px;
  color: var(--color-medium-light-grey);
  margin-bottom: 10px;
}

.radioButton {
  display: flex;
  align-items: center;
}

.selectButton {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
  width: 20px;
  height: 20px;
  border: solid 1px var(--color-medium-light-grey);
  border-radius: 50%;
}

.radioButtonSelected {
  border-color: var(--color-green);
}

.radioButtonSelectedCheck {
  border-radius: 50%;
  height: 85%;
  width: 85%;
  background: var(--color-green);
}

.radioLabel {
  margin: 0 20px 0 0;
  color: var(--color-dark-grey-border);
}

.isRequiredInput {
  color: var(--color-red);
  font-size: 30px;
}

.error {
  outline: none !important;
  border: 0.1px solid var(--color-red) !important;
  box-shadow: 0 0 10px var(--color-grey-border);
}

.errorMessage {
  position: absolute;
  bottom: -30px;
  left: 0;
  color: var(--color-red);
}
</style>
