<template>
  <div
    :class="[
      {
        biggerContainer: bigger && editMode
      },
      'richTextContainer'
    ]"
    :id="`${this.inputKey}IntroJs`"
  >
    <h2 :class="[{ noDescription: editMode }, 'richTextTitle']">
      <span>
        {{ title }}
        <span v-if="isRequired && editMode">
          <span class="isRequiredInput">*</span>
        </span>
      </span>
    </h2>
    <div class="richTextRow" v-if="editMode">
      <span class="richTextDescription">
        {{ description }}
      </span>
      <div class="addStarter">
        <span
          v-if="filterByInputKey.length"
          @mouseover="$root.$emit('bv::show::tooltip', `${inputKey} tooltip`)"
          @mouseout="$root.$emit('bv::hide::tooltip', `${inputKey} tooltip`)"
          @click="addStarterText"
          class="addStarterTextButton"
        >
          see sample text ideas
        </span>
      </div>
    </div>
    <div :id="`${this.inputKey} containerTextarea`">
      <textarea
        :disabled="disabled"
        v-if="editMode"
        :id="`${this.inputKey} textAreaId`"
        :value="value"
        @input="handleTextChange($event.target.value)"
        @blur="handleBlur"
        :class="[{ bigger }, { error }, 'richTextInput']"
        :style="height"
        :maxlength="!lengthLimit || maxLength"
        :lenghLimit="this.inputKey.lenghLimit"
      />
      <span
        :id="inputKey"
        v-if="maxLength && editMode"
        class="remainingCharacters"
        :key="remainingCharacters"
      >
        {{ remainingCharacters }}
      </span>
    </div>
    <b-tooltip
      :target="`${this.inputKey} containerTextarea`"
      :ref="`${this.inputKey} containerTextarea`"
      triggers="manual"
      variant="light"
      custom-class="customTool"
      placement="right"
    >
      <div class="tooltipContainer">
        <button class="closeTooltip" @click="onClose">x</button>
        <div class="textContainer">
          Your input exceeds the expected content limit that would ensure the
          generated output is clear and legible for display in case outputs.
          Take a look at sample text ideas.
        </div>
      </div>
    </b-tooltip>
    <span v-if="!editMode">{{ value || "-" }}</span>
    <span v-if="error && editMode" class="errorMessage"
      >This question is required</span
    >
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
import { ACTIONS_TYPES as SELECTED_CASE_ACTIONS_TYPES } from "@/store/modules/selectedCase/types";

const DEFAULT_HEIGHT = 80;
const ROW_HEIGHT = 32;
const CHARACTERS_PER_ROW = 90;

export default {
  name: "RichTextInput",
  data() {
    return {
      remainingCharacters: this.maxLength - this.value.length
    };
  },
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    inputKey: {
      type: String,
      required: true
    },
    maxLength: {
      type: Number
    },
    description: {
      type: String
    },
    isRequired: {
      type: Boolean
    },
    bigger: {
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
    lengthLimit: {
      type: Number
    }
  },
  computed: {
    ...mapState({
      starterText: state => state.selectedCase?.starterText,
      collections: state => state.collections
    }),
    ...mapGetters("selectedCase", ["inputStarterText"]),
    height() {
      const height = this.lengthLimit
        ? ROW_HEIGHT * Math.ceil(this.lengthLimit / CHARACTERS_PER_ROW)
        : DEFAULT_HEIGHT;
      return {
        height: height + "px"
      };
    },
    filterByInputKey() {
      return this.collections.starterTexts.filter(i => i[this.inputKey]);
    },
    hasStarterText() {
      return this.inputStarterText(this.inputKey) != null;
    }
  },
  methods: {
    onOpen() {
      this.$refs[`${this.inputKey} containerTextarea`].$emit("open");
      document.getElementById(`${this.inputKey} textAreaId`).style.borderColor =
        "#F0A348";
    },
    onClose() {
      this.$refs[`${this.inputKey} containerTextarea`].$emit("close");
      document.getElementById(`${this.inputKey} textAreaId`).style.borderColor =
        "#5cb247";
    },
    ...mapActions("selectedCase", [
      SELECTED_CASE_ACTIONS_TYPES.ADD_STARTER_TEXT
    ]),
    addStarterText() {
      this[SELECTED_CASE_ACTIONS_TYPES.ADD_STARTER_TEXT](this.inputKey);
    },
    refreshSave() {
      this.$emit("myBlur", { key: this.inputKey, forcedSave: this.value });
    },
    handleTextChange(text) {
      if (this.maxLength) {
        document.getElementById(this.inputKey).innerHTML =
          this.maxLength - text.length;
        if (document.getElementById(this.inputKey).innerHTML <= 10) {
          document
            .getElementById(this.inputKey)
            .classList.add("remainingCharactersWarning");
        } else {
          document
            .getElementById(this.inputKey)
            .classList.remove("remainingCharactersWarning");
        }
      }
      text.length > this.lengthLimit ? this.onOpen() : this.onClose();
    },
    handleBlur(e) {
      this.$emit("myBlur", { e, key: this.inputKey });
      this.onClose();
    }
  },
  watch: {
    value(newVal) {
      this.remainingCharacters = this.maxLength - newVal.length;
      if (
        document.getElementById(this.inputKey) &&
        this.maxLength &&
        this.remainingCharacters <= 10
      ) {
        document
          .getElementById(this.inputKey)
          .classList.add("remainingCharactersWarning");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.disabled {
  color: var(--color-light-grey) !important;
}

.icon {
  cursor: pointer;
}
.richTextContainer {
  position: relative;
  width: 80%;
  margin-bottom: 40px;
}

.biggerContainer {
  min-height: 150px;
}

.richTextTitle {
  display: flex;
  font-size: 17px;
  font-weight: 700;
}

#containerTextarea {
  display: flex;
}

.tooltip.b-tooltip {
  margin: 0px 10px;
  background-color: white !important;
  z-index: 111;
}

.customTool {
  background-color: white !important;
  // width:10%;
  border: 1px solid #ce7309;
}

.tooltipInputOpen {
  display: none;
}

.tooltipInputClose {
  display: flex;
}

.closeTooltip {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  color: var(--color-black);
  font-weight: bold;
}

.textContainer {
  width: 100%;
  background-color: white !important;
  margin-bottom: 20px;
  text-align: left;
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

.richTextRow {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 10px;
}

.richTextDescription {
  flex: 3;
  margin-bottom: 0;
  font-size: 15px;
  font-weight: 400;
  color: var(--color-black);
  line-height: 22px;
}

.addStarter {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.addStarterTextButton {
  font-size: 12px;
  color: var(--color-green);
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
}

.noDescription {
  margin-bottom: 10px;
}

.icon {
  margin-left: 10px;
  margin-right: 10px;
}

.richTextInput {
  width: 100%;
  border-color: var(--color-grey-border);
  border-radius: 3px;
  padding: 7px 7px 7px 10px;
}

.richTextInput:focus {
  outline: none !important;
  border: 0.1px solid var(--color-green);
  box-shadow: 0 0 10px var(--color-grey-border);
}

.bigger {
  height: 195px;
}

.remainingCharacters {
  position: absolute;
  bottom: 4%;
  right: 1%;
}

.remainingCharactersWarning {
  color: var(--color-red);
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
