<template>
  <div
    :class="[
      { viewModeContainer: !editMode },
      'MultiSelectContainer',
      { containerInModal: foreignKey },
      { inputError: selectionError }
    ]"
    :id="inputKey"
  >
    <h2 :class="foreignKey ? 'inputLabel' : 'selectTitle'">
      {{ title }}
      <span v-if="isRequired && editMode" class="isRequiredContainer">
        <!-- <span class="isRequiredInput">*</span> -->
        <span class="isRequiredMessage">
          *
        </span>
      </span>
    </h2>
    <p class="selectDescription" v-if="description && editMode">
      {{ description }}
    </p>
    <div v-if="editMode" class="multiSelectDropdown">
      <MultiSelect
        :options="options"
        v-model="selectedValue"
        :placeholder="placeholder"
        :multiple="true"
        :searchable="isSearchable"
        selectLabel=""
        selectedLabel=""
        deselectLabel=""
        :trackBy="trackBy"
        :group-values="groupValues || ''"
        :group-label="groupLabel || ''"
        :label="label || ''"
        :allow-empty="true"
        :close-on-select="false"
        @input="handleOptionClick"
        @search-change="searchChange"
        @select="pushValue"
        @remove="removeValue"
        @open="$emit('onOpen')"
        @close="$emit('onClose')"
        :loading="isLoading"
        :disabled="isDisable"
      >
        <span slot="noOptions">{{ noOptsMsg ? noOptsMsg : "" }}</span>
      </MultiSelect>
    </div>
    <ul v-if="!editMode" class="option-list">
      <li class="option-li" v-for="(option, index) in value" :key="index">
        {{ typeof option === "object" ? option[label] : option }}
        <span v-if="option[label] == 'Other' && option.otherSpecify">
          - "{{ option.otherSpecify }}"</span
        >
      </li>
    </ul>
    <p v-if="!editMode && value.length < 1">-</p>
    <span v-if="isRequired" class="errorMessage">
      This {{ foreignKey ? "field" : "question" }} is required
    </span>
  </div>
</template>

<script>
import { directive as onClickaway } from "vue-clickaway";
import MultiSelect from "vue-multiselect";

export default {
  name: "Select",
  data() {
    return {
      isOpen: false,
      selectionError: false,
      selectedValue: [...this.value]
    };
  },
  components: {
    MultiSelect
  },
  props: {
    value: {
      type: Array,
      required: true
    },
    options: {
      type: Array,
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
    foreignKey: {
      type: String
    },
    placeholder: {
      type: String
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
    editMode: {
      type: Boolean
    },
    disabled: {
      type: Boolean
    },
    isSearchable: {
      type: Boolean,
      default: true
    },
    isLoading: {
      type: Boolean
    },
    noOptsMsg: {
      type: String
    },
    isDisable: {
      type: Boolean
    },
    label: {
      type: String
    },
    groupValues: {
      type: String
    },
    groupLabel: {
      type: String
    },
    trackBy: {
      type: String
    }
  },
  computed: {
    noValue() {
      return this.value.length === 0;
    }
  },
  mounted() {
    this.$emit("checkValue", {
      isEmpty: this.value.length === 0,
      key: this.inputKey
    });
  },
  methods: {
    refreshSave() {
      this.$emit("selectedChange", {
        key: this.inputKey,
        forcedSave: this.value
      });
    },
    handleOptionClick() {
      const forcedSave = this.selectedValue;
      this.$emit("selectedChange", {
        forcedSave,
        key: this.inputKey,
        foreignKey: this.foreignKey
      });
      this.$emit("checkValue", {
        isEmpty: forcedSave.length === 0,
        key: this.inputKey
      });
      this.selectionError = forcedSave.length === 0;
    },
    searchChange(searchQuery) {
      if (searchQuery.trim().length >= 1) {
        this.$emit("searchDebounce", searchQuery);
      }
    },
    pushValue(selectedValue) {
      this.$emit("questionSelected", selectedValue);
    },
    removeValue(removedValue) {
      this.$emit("questionRemoved", removedValue);
    }
  },
  directives: {
    onClickaway
  },
  watch: {
    value(newVal) {
      this.selectedValue = newVal;
    }
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="scss" scoped>
.MultiSelectContainer {
  position: relative;
  width: 100%;
  margin-bottom: 40px;
  margin-top: 10px;
}

.inputError {
  .inputLabel {
    color: var(--color-red);
  }
  .multiSelectDropdown {
    .modalInput {
      border: solid 1px var(--color-light-red);
      color: var(--color-white);
    }
  }
  .errorMessage {
    display: inline;
    position: absolute;
    bottom: -30px;
    left: 0;
    color: var(--color-red);
  }
}

.option-li {
  font-size: 15px;
}

.containerInModal {
  position: relative;
  width: 100%;
  margin-top: 4px;
}

.viewModeContainer {
  margin-bottom: 0px;
}

.selectTitle {
  display: flex;
  font-family: "Roboto-Medium";
  font-size: 17px;
  font-weight: 700;
  align-items: center;
}

.inputLabel {
  display: flex;
  font-family: "Roboto-Medium";
  align-items: center;
  font-size: 14px;
  margin-bottom: 5px;
}

.isRequiredContainer {
  display: flex;
  align-items: center;
}

.isRequiredInput {
  margin-left: 5px;
  color: var(--color-red);
  font-size: 12px;
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

.multiSelectDropdown {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  .multiselect__tags {
    font-size: 16px;
    .multiselect__tag {
      margin-bottom: 0px;
      background-color: var(--color-black);
    }
  }
}

.selectInput {
  display: flex;
  align-items: center;
  position: relative;
  width: 90%;
  height: 45px;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 0px 35px 0 15px;
  cursor: default;
  overflow-x: hidden;
}

.selectInput:focus {
  outline: none !important;
  border: 0.1px solid var(--color-green);
  box-shadow: 0 0 10px var(--color-grey-border);
}

.modalInput {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  height: 45px;
  border: 1px solid var(--color-grey-border);
  border-radius: 3px;
  padding: 0px 35px 0 15px;
  cursor: default;
  overflow-x: hidden;
}

.modalInput:focus {
  outline: none !important;
  border: 0.1px solid var(--color-green);
  box-shadow: 0 0 10px var(--color-grey-border);
}

.customPlaceholder {
  white-space: nowrap;
}

.bannerContainer {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.buttonBanner {
  width: 200%;
  position: absolute;
  display: flex;
}

.option-list {
  font-size: 20px;
  list-style: disc;
}

.arrowImg {
  pointer-events: none;
  position: absolute;
  top: 0;
  bottom: 0;
  right: -4px;
  width: 38px;
  height: 100%;
}

.options {
  position: absolute;
  z-index: 11;
  width: 90%;
  max-height: 300px;
  overflow: auto;
  border-radius: 0px 0px 2px 2px;
  border: 1px solid var(--color-grey-text);
  background-color: var(--color-white);
}

.options:hover {
  cursor: pointer;
}

.modalOptions {
  position: absolute;
  z-index: 11;
  width: 100%;
  max-height: 300px;
  overflow: auto;
  border-radius: 0px 0px 2px 2px;
  border: 1px solid var(--color-grey-text);
  background-color: var(--color-white);
}

.modalOptions:hover {
  cursor: pointer;
}

.placeholder {
  color: var(--color-medium-light-grey);
  font-size: 14px;
  width: 100%;
  padding: 10px 0 10px 15px;
  margin: 0;
}

.multiselect__input::placeholder {
  font-size: 14px;
}

.option {
  width: 100%;
  padding: 10px 0 10px 15px;
  margin: 0;
  color: var(--color-black);
}

.option:hover {
  color: var(--color-white);
  background-color: var(--color-green);
}

.selectedOption {
  background-color: var(--color-green);
  color: var(--color-white);
  position: relative;
  display: flex;
  justify-content: space-between;
  padding-right: 15px;
}

.selectHide {
  display: none;
}

.selectedItem {
  white-space: nowrap;
  padding-right: 20px;
}

.error {
  outline: none !important;
  border: 0.1px solid var(--color-red) !important;
  box-shadow: 0 0 10px var(--color-grey-border);
}

.errorMessage {
  display: none;
}

.multiselect__option--selected {
  background-color: var(--color-light-green);
  color: white;
}

.multiselect__option--selected::after {
  color: white;
}
</style>
