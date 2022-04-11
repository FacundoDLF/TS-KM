<template>
  <div
    :class="[
      'inputContainer',
      { dense: dense },
      { onlyMonth: onlyMonth },
      { inputError: error },
      { inputError: dateError }
    ]"
  >
    <h2 v-if="title" class="richTextTitle">
      {{ title }}
      <span v-if="required && editable" class="isRequiredContainer">
        <!-- <span class="isRequiredInput">*</span> -->
        <span class="isRequiredMessage">
          *
        </span>
      </span>
    </h2>
    <label v-else-if="label" class="inputLabel" :for="objectKey">
      {{ label }}
      <span
        v-if="editable && required && requiredWithLabel"
        class="isRequiredMessageLabel"
      >
        * Required
      </span>
      <span
        v-else-if="editable && required && !title && !requiredWithLabel"
        class="isRequiredMessage"
      >
        *
      </span>
    </label>
    <b-form-datepicker
      v-if="!onlyMonth"
      :class="['inputField', { inputDisabled: disabled || !editable }]"
      placeholder="Select a date"
      v-model="newValue"
      :required="required"
      size="sm"
      :reset-button="clearable"
      dropright
      selected-variant="success"
      @input="handleChange"
      :min="minDate"
      :disabled="disabled || !editable"
    />
    <VueMonthlyPicker
      v-else
      class="pickerContainer"
      placeHolder="Choose a date"
      v-model="newValue"
      @input="handleChange"
      :monthLabels="[
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ]"
      dateFormat="MM/YYYY"
      :label="label"
      :disabled="disabled || !editable"
    />
    <input type="hidden" :value="actualValue" :id="objectKey" />
    <span class="errorMsg" v-if="error && !dateError">
      This field is required
    </span>
    <span class="errorMsg" v-if="dateError">
      End Date cannot be before Start Date
    </span>
  </div>
</template>

<script>
import VueMonthlyPicker from "vue-monthly-picker";
import moment from "moment";
export default {
  name: "DateInput",
  data() {
    return {
      newValue: this.value || null,
      dateError: false
    };
  },
  props: {
    label: {
      type: String,
      required: true
    },
    title: String,
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
    clearable: {
      type: Boolean
    },
    required: {
      type: Boolean
    },
    requiredWithLabel: {
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
    minDate: {
      type: Date
    },
    onlyMonth: {
      type: Boolean,
      required: false
    },
    dense: {
      type: Boolean,
      required: false
    }
  },
  components: {
    VueMonthlyPicker
  },
  computed: {
    actualValue() {
      return this.newValue ? new Date(this.newValue).toISOString() : "";
    }
  },
  methods: {
    handleChange(e) {
      if (e) {
        if (typeof this.newValue !== "string" && this.minDate) {
          if (
            new Date(moment(e).toISOString()).getMonth() ===
            new Date(this.minDate.toISOString()).getMonth()
          ) {
            this.newValue = moment(e)
              .add(29, "days")
              .toISOString();
          } else {
            moment(e).toISOString();
          }
        } else {
          this.newValue = new Date(e).toISOString();
        }
        this.dateError =
          this.newValue &&
          this.minDate &&
          new Date(this.newValue) < this.minDate;
        if (this.dateError) {
          this.$emit("inputError", {
            error: this.dateError,
            objectKey: this.objectKey
          });
        } else {
          this.$emit("inputError", {
            error: false,
            objectKey: this.objectKey
          });
        }
      }
      this.$emit("inputModified", {
        key: this.objectKey,
        newValue: e ? this.newValue : null
      });
    }
  },
  watch: {
    value(newValue) {
      this.newValue = newValue;
    },
    minDate(newVal) {
      const minDate = new Date(newVal);
      const endDate = new Date(this.newValue);
      this.dateError = endDate < minDate;
      if (this.dateError)
        this.$emit("inputError", {
          error: this.dateError,
          objectKey: this.objectKey
        });
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .b-calendar-grid {
  border-color: var(--color-green) !important;
}
/deep/ .form-control.focus {
  border-color: var(--color-green) !important;
  box-shadow: 0 0 0 0.1rem var(--color-light-green) !important;
}

/deep/ .form-control:focus {
  border-color: var(--color-green) !important;
  box-shadow: 0 0 0 0.1rem var(--color-light-green) !important;
}
.inputContainer {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  height: 75px;
  margin-bottom: 40px;
}

.dense {
  height: 52px !important;
}

.inputLabel {
  position: absolute;
  pointer-events: none;
  font-size: 14px;
  font-family: "Roboto-Medium";
  top: 0;
  color: var(--color-black);
  transition: all 0.1s ease-in;
}

.month-year-display input .placeholder {
  color: #727272;
}

.inputField {
  width: 100%;
  border: 1px solid black !important;
  padding: 10px 5px !important;
  color: var(--color-black) !important;
  border: 1px solid var(--color-grey-border) !important;
  background: transparent !important;
  border-radius: 5px !important;
}

.inputDisabled,
.inputField:disabled {
  width: 100%;
  border: 1px solid var(--color-grey-border);
  padding: 10px 5px;
  background-color: #dddddd;
  border-radius: 5px;
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

.pickerContainer {
  padding: 4px 0;
}

.onlyMonth {
  height: 60px;
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

.richTextTitle {
  display: flex;
  font-size: 17px;
  font-weight: 700;
  align-items: center;
}

.isRequiredMessage {
  margin-left: 5px;
  color: var(--color-black);
  font-size: 20px;
}

.isRequiredMessageLabel {
  font-size: 12px;
  margin-left: 5px;
  color: var(--color-red);
}
</style>
