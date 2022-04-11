<template>
  <div class="fileComponent">
    <h2 :class="[{ noDescription: editMode }, 'fileFieldTitle']">
      {{ title }}
      <span v-if="isRequired" class="isRequiredInput">*</span>
    </h2>
    <div v-if="editMode" class="uploadFile">
      <span class="fieldDescription">
        {{ description }}
      </span>
      <div v-if="!file && !answer" class="fileInput">
        <b-form-file
          v-model="file"
          accept=".jpg, .png"
          placeholder="Choose an image or drop it here..."
          drop-placeholder="Drop file here..."
          ref="file-input"
          :required="false"
          @input="handleFile"
          class="formFile"
        ></b-form-file>
        <div v-if="error" class="errorMsg">
          The file exceeds the maximum size of 500kb
        </div>
      </div>
      <div v-else>
        <div class="fileListContainer">
          <span>
            Chart uploaded:
          </span>
          <button :disabled="isFetching">
            <b-spinner v-if="isFetching" class="spinner" small />
            <span @click="downloadFile" class="fileItem">
              {{ (file && file.name) || answer || "-" }}
            </span>
          </button>
          <button class="clearBtn" @click="clearFile()">
            <img class="clearBtnImg" src="@/assets/img/close-red.svg" alt="" />
          </button>
        </div>
      </div>
    </div>
    <div v-else class="downloadFile">
      <div v-if="file || answer">
        <h3 class="readModaDescription">
          There's already an image for you to see, Would you like to download
          it?
        </h3>
        <button
          :disabled="isFetching"
          @click="downloadFile()"
          class="downloadBtn"
        >
          <span v-if="!isFetching">Download Chart</span>
          <b-spinner v-else small />
        </button>
      </div>
      <div v-else>
        -
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { ACTIONS_TYPES as RESULTS_ACTIONS_TYPES } from "@/store/modules/selectedCase/results/types";
import { ACTIONS_TYPES as SELECTED_CASE_ACTIONS_TYPES } from "@/store/modules/selectedCase/types";
import { SecondaryStep } from "@/types";

export default {
  name: "FilesComponent",
  data() {
    return {
      file: null,
      error: false,
      isFetching: false
    };
  },
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    caseId: {
      type: String,
      required: true
    },
    isRequired: {
      type: Boolean
    },
    inputKey: {
      type: String,
      required: true
    },
    route: {
      type: String
    },
    answer: {
      type: String
    }
  },
  computed: {
    ...mapState({
      editMode: state => state.selectedCase.editMode,
      base64File: state => state.selectedCase.file
    })
  },
  beforeDestroy() {
    if (this.base64File) {
      this[SELECTED_CASE_ACTIONS_TYPES.DELETE_FILE]();
    }
  },
  methods: {
    ...mapActions("selectedCase/results", [
      RESULTS_ACTIONS_TYPES.CHANGE_RESULTS_FIELD
    ]),
    ...mapActions("selectedCase", [
      SELECTED_CASE_ACTIONS_TYPES.UPLOAD_CHART,
      SELECTED_CASE_ACTIONS_TYPES.FETCH_FILE,
      SELECTED_CASE_ACTIONS_TYPES.DELETE_FILE
    ]),
    async handleFile() {
      const formData = new FormData();
      if (this.file && this.file?.size < 500000) {
        this.error = false;
        formData.append("file", this.file);
        await this[SELECTED_CASE_ACTIONS_TYPES.UPLOAD_CHART]({
          formData,
          caseId: this.caseId,
          key: this.inputKey,
          step: SecondaryStep.thirdStep
        });
      } else if (this.file) {
        this.error = this.file && this.file.size > 500000;
        this.clearFile();
      }
    },
    clearFile() {
      this.file = null;
      this[RESULTS_ACTIONS_TYPES.CHANGE_RESULTS_FIELD]({
        key: this.inputKey,
        value: "",
        step: SecondaryStep.thirdStep,
        forcedSave: true
      });
      this[SELECTED_CASE_ACTIONS_TYPES.DELETE_FILE]();
    },
    async downloadFile() {
      if (!this.isFetching) {
        this.isFetching = true;
        if (!this.base64File || !this.base64File.data) {
          await this[SELECTED_CASE_ACTIONS_TYPES.FETCH_FILE]({
            caseId: this.caseId,
            fileLocation: this.route
          });
        }
        const a = document.createElement("a");
        a.href = "data:image/png;base64," + this.base64File.data;
        a.download = "Image";
        a.click();
        this.isFetching = false;
      }
    }
  }
};
</script>

<style lang="scss">
.fileComponent {
  position: relative;
  width: 100%;
  margin-bottom: 10px;
  min-height: 200px;
}

.uploadFile {
  width: 100%;
}

.fileFieldTitle {
  font-size: 17px;
  font-weight: 700;
}

.noDescription {
  margin-bottom: 30px;
}

.fieldDescription {
  margin-bottom: 5px;
  font-size: 16px;
  color: var(--color-medium-light-grey);
}

.custom-file-label {
  border-color: #ced4da;
}

.fileListContainer {
  display: flex;
  align-content: center;
  width: 100%;
  margin-top: 15px;
}

.formFile {
  width: 100%;
}

.fileItem {
  margin-left: 10px;
  color: var(--color-green);
}

.clearBtn {
  margin-left: 10px;
  color: var(--color-red);
}

.clearBtnImg {
  width: 20px;
  height: 20px;
  margin-bottom: 2px;
}

.readModaDescription {
  font-size: 18px;
  color: var(--color-medium-light-grey);
}

.spinner-border {
  color: var(--color-green);
}

.spinner {
  margin-left: 15px;
  margin-bottom: 2px;
}

.downloadBtn {
  padding: 10px;
  min-width: 170px;
  margin-top: 20px;
  background: var(--color-green);
  color: white;
  span {
    text-transform: uppercase;
  }
  .spinner-border {
    color: var(--color-white);
  }
}

.errorMsg {
  color: var(--color-red);
}
</style>
