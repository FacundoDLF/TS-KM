import { MUTATIONS_TYPES, ModalComponents } from "./types";
import { State } from "./";

export default {
  [MUTATIONS_TYPES.SET_MODAL_VISIBILITY]: (state: State, value: boolean) =>
    (state["visible"] = value),
  [MUTATIONS_TYPES.SET_MODAL_CONTENT]: (state: State, value: ModalComponents) =>
    (state["content"] = value),
  [MUTATIONS_TYPES.SET_MODAL_COMPONENT_PROPS]: (state: State, value: any) =>
    (state["props"] = value)
};
