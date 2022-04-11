<template>
  <div class="selectContainer" :id="inputKey">
    <h2 class="selectTitle">
      {{ title }}
      <span v-if="isRequired && !foreignKey" class="isRequiredInput">*</span>
    </h2>
    <h2 class="label" v-if="label">
      {{ label }}
      <span class="isRequiredContainer">
        <!-- <span v-if="requiredInLabel" class="isRequiredInput">*</span> -->
        <span v-if="requiredInLabel" class="isRequiredMessage">
          *
        </span>
      </span>
    </h2>
    <p v-if="editMode" class="selectDescription">
      {{ description }}
    </p>
    <p :class="{ noDescription: !description }" v-if="!editMode">
      {{ value || "-" }}
    </p>
    <MultiSelect
      v-if="editMode"
      :options="options.slice(1)"
      :disabled="disabled"
      v-model="selectedValue"
      :searchable="isSearchable"
      selectLabel=""
      selectedLabel=""
      deselectLabel=""
      :allow-empty="true"
      :close-on-select="true"
      :placeholder="options[0]"
      @input="handleChange"
      @search-change="searchChange"
      @close="$emit('onClose')"
      @open="$emit('onOpen')"
      :loading="isLoading"
    >
      <span slot="noOptions">{{ noOptsMsg ? noOptsMsg : "" }}</span>
    </MultiSelect>
    <span v-if="error" class="errorMessage"
      >This {{ foreignKey ? "field" : "question" }} is required</span
    >
    <span v-if="foreignKey" class="errorMessageModal"
      >This field is required</span
    >
  </div>
</template>

<script>
import MultiSelect from "vue-multiselect";

export default {
  name: "Select",
  data() {
    return {
      selectedValue: this.value
    };
  },
  props: {
    editMode: {
      type: Boolean,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    title: {
      type: String
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
    },
    disabled: {
      type: Boolean
    },
    foreignKey: {
      type: String
    },
    label: {
      type: String
    },
    isSearchable: {
      type: Boolean
    },
    isLoading: {
      type: Boolean
    },
    noOptsMsg: {
      type: String
    },
    requiredInLabel: {
      type: Boolean
    }
  },
  components: {
    MultiSelect
  },
  methods: {
    refreshSave() {
      this.$emit("selectedChange", {
        key: this.inputKey,
        forcedSave: this.value
      });
    },
    handleChange(value) {
      const e = {
        target: {
          value
        }
      };
      this.$emit("selectedChange", { e, key: this.inputKey });
    },
    searchChange(searchQuery) {
      if (searchQuery.trim().length >= 1) {
        this.$emit("searchDebounce", searchQuery);
      }
    }
  },
  watch: {
    value(newVal) {
      this.selectedValue = newVal;
    }
  }
};
</script>

<style lang="scss" scoped>
.noDescription {
  margin-top: 40px;
}

.selectContainer {
  position: relative;
  width: 100%;
  margin-bottom: 40px;
  margin-top: 8px;
}

.selectTitle {
  font-size: 26px;
  margin-top: 16px;
}

.isRequiredContainer {
  display: flex;
  align-items: center;
}

.isRequiredInput {
  margin-left: 5px;
  color: var(--color-red);
  font-size: 25px;
}

.isRequiredMessage {
  margin-left: 5px;
  color: var(--color-black);
  font-size: 20px;
}

.selectDescription {
  margin-bottom: 0;
  font-size: 16px;
  color: var(--color-medium-light-grey);
  margin-bottom: 10px;
}

.selectInput {
  width: 100%;
  min-height: 45px;
  border-color: var(--color-grey-border);
  border-radius: 3px;
  padding: 7px 7px 7px 10px;
}

.selectInput:focus {
  outline: none !important;
  border: 0.1px solid var(--color-green);
  box-shadow: 0 0 10px var(--color-grey-border);
}

.noDescription {
  font-size: 20px;
  margin-top: 20px;
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

.label {
  display: flex;
  align-items: center;
  font-family: "Roboto-Medium";
  font-size: 14px;
}

.inputError .label {
  color: var(--color-red);
  margin-top: -20px;
}

.inputError .errorMessageModal {
  display: block;
  margin-top: 5px;
  color: var(--color-red);
}

.errorMessageModal {
  display: none;
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
