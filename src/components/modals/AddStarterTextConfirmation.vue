<template>
  <div class="modal-content">
    <h1 class="modalTitle">Sample text ideas</h1>
    <b-carousel
      class="carouselContainer"
      controls
      img-width="1024"
      img-height="300"
      :interval="1000 * 1000"
      v-model="slide"
    >
      <b-carousel-slide
        img-blank
        v-for="(item, index) in filterStartTexts"
        :key="item.id"
      >
        <div
          :class="[
            item.starterText.length < 381
              ? 'textContainerSmall'
              : 'textContainerLarge'
          ]"
        >
          <h1 class="sampleTitle">
            Example {{ index + 1 }}/{{ filterStartTexts.length }}, Community -
            {{ item.community }}
          </h1>
          <p class="toContinue">{{ item.starterText }}</p>
        </div>
      </b-carousel-slide>
    </b-carousel>
    <div class="buttons">
      <button class="cancel" @click="closeModal">Cancel</button>
      <button class="continue" @click="addStarterText(slide)">
        Insert
      </button>
    </div>
  </div>
</template>
<script>
import { MUTATIONS_TYPES } from "@/store/modules/modal/types";
import { mapMutations, mapState } from "vuex";
import { emitInsightEvent, InsightEvent } from "@/helpers/insights";
export default {
  data: () => ({
    newScenarioName: null,
    spinnerColor: "#5CB335",
    spinnerMargin: "1px",
    slide: 0
  }),
  props: {
    retryAddStarterText: Function,
    inputKey: String
  },
  computed: {
    ...mapState({
      collections: state => state.collections
    }),
    filterByInputKey() {
      return this.collections.starterTexts.map(i => i[this.inputKey]);
    },
    filterStartTexts() {
      return this.collections.starterTexts.map(i => ({
        starterText: i[this.inputKey],
        community: i.community,
        id: i.starterTextId
      }));
    }
  },
  methods: {
    ...mapMutations("modal", [MUTATIONS_TYPES.SET_MODAL_VISIBILITY]),
    closeModal() {
      this[MUTATIONS_TYPES.SET_MODAL_VISIBILITY](false);
    },
    addStarterText(slide) {
      emitInsightEvent(InsightEvent.addTextExample, {
        inputKey: this.inputKey
      });
      this.retryAddStarterText(this.filterByInputKey[slide]);
      this.$clipboard(this.filterByInputKey[slide]);
      this.closeModal();
    }
  }
};
</script>
<style lang="scss" scoped>
.modalTitle {
  font-size: 24px;
  align-self: flex-start;
  margin-left: 6%;
  margin-bottom: 0;
}
.starterTextPreview {
  max-height: 150px;
  overflow-y: auto;
  font-size: 16px;
  font-style: oblique;
}
.sampleTitle {
  color: var(--color-black);
  text-align: center;
  align-self: flex-start;
  font-size: 18px;
}
.textContainerSmall {
  height: 130px;
  align-items: flex-start;
  display: flex;
  flex-direction: column;
}
.textContainerLarge {
  height: 180px;
  align-items: center;
  display: flex;
  flex-direction: column;
}
.continue,
.cancel {
  text-align: center;
  text-transform: uppercase;
  font-size: 14px;
  width: 100px;
  padding: 10px 15px;
  margin: 10px;
}
.continue {
  color: var(--color-white);
  background-color: var(--color-green);
}
.continue:hover {
  background-color: var(--color-light-green);
}
.cancel {
  border: 1px solid var(--color-light-grey);
  color: var(--color-light-grey);
}
.cancel:hover {
  color: var(--color-white);
  background-color: var(--color-light-grey);
}
.modal-content {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
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
.toContinue {
  text-align: left;
  font-size: 14px;
  color: var(--color-medium-grey);
}
.bold {
  font-weight: bold;
}
.buttons {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  align-self: flex-end;
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
