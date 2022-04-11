<template>
  <div
    :class="[
      'inputContainer',
      { inputError: error },
      { inputError: dateError }
    ]"
  >
    <input
      :class="['inputField', { inputDisabled: disabled || !editable }]"
      v-model="newValue"
      :required="required"
      @blur="handleBlur"
      @focus="handleFocus"
      @input="handleChange"
      :disabled="disabled || !editable"
      :type="type ? type : 'text'"
      :min="type === 'number' && '0'"
      :id="objectKey"
    />
    <label :class="disabled ? 'inputLabel' : 'inputLabelDisabled'">
      {{ label }}
      <span
        v-if="objectKey === 'startDate' || objectKey === 'endDate'"
        class="dateFormat"
      >
        (MM/YYYY)
      </span>
      <span
        v-if="editable && required && !requiredWithLabel"
        class="isRequiredMessage"
      >
        *
      </span>
      <span
        v-else-if="editable && requiredWithLabel"
        class="isRequiredMessageLabel"
      >
        * Required
      </span>
    </label>
    <span class="errorMsg" v-if="error">This field is required</span>
    <span class="errorMsg" v-if="dateError"
      >End Date cannot be before Start Date</span
    >
  </div>
</template>

<script>
export default {
  name: "ModalInput",
  data() {
    return {
      newValue: this.value,
      dateError: false
    };
  },
  props: {
    label: {
      type: String,
      required: true
    },
    editable: {
      type: Boolean
    },
    value: {
      type: [String, Number]
    },
    noModifications: {
      type: Boolean
    },
    type: {
      type: String
    },
    required: {
      type: Boolean
    },
    error: {
      type: Boolean
    },
    objectKey: {
      type: String
    },
    disabled: {
      type: Boolean
    },
    requiredWithLabel: {
      type: Boolean
    }
  },
  methods: {
    handleBlur(e) {
      this.newValue = this.type
        ? parseInt(this.newValue)
        : this.newValue.trim();
      if (
        (e.target.value.trim().length === 0 && this.required) ||
        this.dateError
      ) {
        this.$emit("inputError", {
          error: true,
          objectKey: this.objectKey
        });
      } else if (this.newValue !== this.value) {
        this.$emit("inputError", {
          error: false,
          objectKey: this.objectKey
        });
        this.$emit("inputModified", {
          key: this.objectKey,
          newValue: this.type ? parseInt(this.newValue) : this.newValue
        });
      }
    },
    handleFocus() {
      const element = document.getElementById(this.objectKey);
      element.parentElement.classList.remove("inputError");
      this.newValue = this.dateError ? "" : this.newValue;
      this.dateError = false;
      this.$emit("inputError", {
        error: false,
        objectKey: this.objectKey
      });
    },
    handleChange(e) {
      if (!(e.target.value.trim().length === 0 && this.required)) {
        this.$emit("inputError", {
          error: false,
          objectKey: this.objectKey
        });
        if (this.noModifications) {
          this.$emit("inputModified", {
            key: this.objectKey,
            newValue: this.type ? parseInt(this.newValue) : this.newValue
          });
          this.hasChanged = true;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.inputContainer {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  height: 63px;
  margin-bottom: 40px;
}

.inputLabel {
  position: absolute;
  pointer-events: none;
  font-family: "Roboto-Medium";
  font-size: 14px;
  top: 0;
  color: var(--color-black);
  transition: all 0.1s ease-in;
}

.inputField {
  width: 100%;
  border: 1px solid #cccccc;
  padding: 7px 5px;
  color: var(--color-black);
  border: 1px solid var(--color-grey-border);
  background: transparent;
  border-radius: 2px;
  font-size: 14px;
}

.inputDisabled,
.inputField:disabled {
  width: 100%;
  border: 1px solid #cccccc;
  padding: 7px 5px;
  color: var(--color-alix-grey);
  background-color: var(--color-white);
  border-radius: 2px;
}

.inputLabelDisabled {
  position: absolute;
  pointer-events: none;
  font-family: "Roboto-Medium";
  font-size: 14px;
  color: var(--color-alix-grey);
  top: 0;
  transition: all 0.1s ease-in;
}

.inputField:focus {
  outline: none !important;
  border: 0.1px solid var(--color-green);
}

.inputField:focus + .inputLabel {
  color: var(--color-green);
  left: 0 !important;
  top: 0 !important;
}

.inputError {
  .inputLabel {
    color: var(--color-red);
  }

  .inputField {
    border-color: var(--color-red);
  }
}

.dateFormat {
  margin-left: 5px;
  font-size: 12px;
  color: var(--color-light-grey);
}

.errorMsg {
  position: absolute;
  bottom: -30px;
  color: var(--color-red);
}

.isRequiredContainer {
  display: flex;
  align-items: center;
}

.isRequiredMessage {
  margin-left: 5px;
  color: var(--color-black);
  font-size: 14px;
}

.isRequiredMessageLabel {
  font-size: 12px;
  margin-left: 5px;
  color: var(--color-red);
}
</style>
