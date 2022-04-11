<template>
  <div v-on-clickaway="closeModal" class="modal-content">
    <h2 class="modalTittle">Select output option</h2>
    <div class="row">
      <div
        v-for="exportOption in actualExportOptions"
        :key="exportOption.title"
        class="col-3"
      >
        <img
          class="optIcon exportOption"
          @click="downloadPpt(exportOption.pptName, exportOption.pptType)"
          :src="require(`@/assets/img/${exportOption.logo}`)"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import { directive as onClickaway } from "vue-clickaway";
import {
  ACTIONS_TYPES as MODAL_ACTIONS_TYPES,
  ModalComponents
} from "@/store/modules/modal/types";
import { MUTATIONS_TYPES as GLOBAL_MUTATIONS_TYPES } from "@/store/types";
import { ACTIONS_TYPES as CASE_ACTIONS_TYPES } from "@/store/modules/selectedCase/types";
import { getPptByName, PptNames, PptTypes } from "@/helpers/generatePpt";
import { emitInsightEvent, InsightEvent } from "@/helpers/insights";

const SINGLE_MODE = 0;

export default {
  name: "ExportSelection",
  data: () => ({
    exportOptions: [
      {
        logo: "three_columns.svg",
        pptName: PptNames.ThreeColumns
      },
      {
        logo: "standard_mini_case.svg",
        pptName: PptNames.MiniCaseSummary,
        pptType: PptTypes.Multiple
      },
      {
        logo: "quotes_slide.svg",
        pptName: PptNames.QuotesSlide,
        pptType: PptTypes.Multiple
      },
      {
        logo: "impacts.svg",
        pptName: PptNames.StatsSlide,
        pptType: PptTypes.Single
      },
      {
        logo: "mini_case_table.svg",
        pptName: PptNames.MiniCaseTable,
        pptType: PptTypes.Multiple
      },
      {
        logo: "case_study.svg",
        pptName: PptNames.CaseStudy
      },
      {
        logo: "case_with_graph.svg",
        pptName: PptNames.CaseWithGraph
      }
    ]
  }),
  props: {
    mode: Number // 0-> Single, 1-> Multiple
  },
  computed: {
    ...mapGetters(["isLegacyCaseSelected"]),
    ...mapState({
      caseId: state => state.selectedCase.caseId,
      isLegacy: state => state.selectedCase.isLegacy,
      chartLocation: state =>
        state.selectedCase?.results?.secondStep?.find(
          a => a.id === "chartLocation"
        )?.answer
    }),
    actualExportMode() {
      const actualPptType = this.mode == SINGLE_MODE ? "Single" : "Multiple";
      return PptTypes[actualPptType];
    },
    actualExportOptions() {
      if (this.actualExportMode === PptTypes.Single && this.isLegacy)
        return [this.exportOptions[0]];
      else if (
        this.actualExportMode === PptTypes.Multiple &&
        this.isLegacyCaseSelected
      )
        return [this.exportOptions[0]];
      return this.exportOptions.filter(
        e => e.pptType === this.actualExportMode || !e.pptType
      );
    }
  },
  methods: {
    ...mapActions("modal", [MODAL_ACTIONS_TYPES.CLOSE_MODAL]),
    ...mapActions("selectedCase", [
      CASE_ACTIONS_TYPES.FETCH_FILE,
      CASE_ACTIONS_TYPES.DELETE_FILE
    ]),
    ...mapMutations([GLOBAL_MUTATIONS_TYPES.SET_CASES_TO_EXPORT]),
    async closeModal() {
      await this[GLOBAL_MUTATIONS_TYPES.SET_CASES_TO_EXPORT]();
      await this[MODAL_ACTIONS_TYPES.CLOSE_MODAL]({
        component: ModalComponents.EXPORT_SELECTION
      });
      await this[CASE_ACTIONS_TYPES.DELETE_FILE]();
    },
    async downloadPpt(pptName, pptType) {
      emitInsightEvent(InsightEvent.exportPpt, {
        pptName,
        pptExportType: this.actualExportMode
      });
      if (pptName === PptNames.CaseWithGraph && this.chartLocation) {
        await this[CASE_ACTIONS_TYPES.FETCH_FILE]({
          caseId: this.caseId,
          fileLocation: this.chartLocation
        });
      }
      const ppt = getPptByName(
        pptName,
        pptType ||
          (this.mode === SINGLE_MODE ? PptTypes.Single : PptTypes.Multiple)
      );
      await ppt.writeFile({ fileName: `case_preview_${Date.now()}` });
    }
  },
  directives: {
    onClickaway
  }
};
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
}
.modal-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 1400px;
  padding: 40px;
  text-align: center;
  animation: fadein 0.4s;
}

.modalTittle {
  margin-bottom: 30px;
  font-size: 28px;
}

.optionTittle {
  font-size: 18px;
  text-align: center;
}

.exportOption {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 5px;
  border: solid 2px #ccc;
}

.exportOption:hover {
  border-color: var(--color-green);
  cursor: pointer;
  .optionTittle {
    color: var(--color-green);
  }
}

.tittleContainer {
  padding: 10px 10px 20px;
  height: 70px;
}

.optIcon {
  width: 100%;
}

@media screen and (min-width: 960px) {
  .modal-content {
    align-items: flex-start;
    width: 1100px;
    text-align: left;
  }
}
</style>
