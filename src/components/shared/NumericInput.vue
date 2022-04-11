<template>
  <div class="numericContainer">
    <h2 class="numericTitle">
      {{ title }}
      <span v-if="isRequired && editMode">
        <span class="isRequiredInput">*</span>
      </span>
      <div class="cashTypeLabel">{{ inputLabel || "" }}</div>
    </h2>
    <p v-if="editMode" class="numericDescription">
      {{ description }}
    </p>
    <div v-if="!editMode" class="noDescription">
      <p>
        {{ value || "-" }}
        <span v-if="isCashAmount && value" class="cashTypeText"
          >USD Millions</span
        >
      </p>
    </div>
    <input
      v-else
      :value="value"
      min="0"
      :class="[{ error }, 'numericInput']"
      :disabled="disabled"
      type="number"
      step="0.01"
      @blur="handleBlur"
    />
    <span v-if="error" class="errorMessage">This question is required</span>
  </div>
</template>

<script>
export default {
  name: "NumericInput",
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    inputKey: {
      type: String,
      required: true
    },
    isCashAmount: {
      type: Boolean
    },
    editMode: {
      type: Boolean,
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
    },
    disabled: {
      type: Boolean
    },
    inputLabel: {
      type: String
    }
  },
  methods: {
    refreshSave() {
      this.$emit("numericChange", {
        key: this.inputKey,
        forcedSave: this.value
      });
    },
    handleBlur(e) {
      if (
        this.title === "Number Claims Settled" ||
        this.title === "Number Claimants"
      ) {
        e.target.value = `${parseInt(e.target.value)}`;
      }
      this.$emit("numericChange", { e, key: this.inputKey });
    }
  }
};
</script>

<style lang="scss" scoped>
.noDescription {
  margin-top: 20px;
  font-size: 20px;
}

.cashTypeText {
  font-family: var(--secondary-font);
  margin-left: 10px;
}

.cashTypeLabel {
  font-family: var(--secondary-font);
  font-size: 18px;
}

.numericContainer {
  position: relative;
  width: 100%;
  margin-bottom: 40px;
}

.numericTitle {
  display: flex;
  font-size: 17px;
  font-weight: 700;
}

.isRequiredInput {
  margin-left: 5px;
  color: var(--color-black);
  font-size: 20px;
}

.isRequiredMessage {
  color: var(--color-red);
  font-size: 15px;
}

.numericDescription {
  margin-bottom: 0;
  font-size: 16px;
  color: var(--color-medium-light-grey);
  margin-bottom: 10px;
}

.numericInput {
  width: 100%;
  min-height: 45px;
  border: 1px solid var(--color-grey-border);
  border-radius: 3px;
  padding: 7px 7px 7px 10px;
}

.numericInput:focus {
  outline: none !important;
  border: 0.1px solid var(--color-green);
  box-shadow: 0 0 10px var(--color-grey-border);
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

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
