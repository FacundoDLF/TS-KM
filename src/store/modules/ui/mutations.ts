import { MUTATIONS_TYPES } from "./types";
import { UIState } from "./";
import { Message } from "@/types";

export default {
  [MUTATIONS_TYPES.SET_MESSAGE]: (state: UIState, value: Message) =>
    (state["message"] = value),
  [MUTATIONS_TYPES.SET_MENU_OPEN]: (state: UIState, value: boolean) =>
    (state["isMenuOpen"] = value),
  [MUTATIONS_TYPES.SHOWN_CLIENT_INFO]: (state: UIState, value: boolean) =>
    (state["shownClientInfo"] = value),
  [MUTATIONS_TYPES.SHOWN_INTRO_STEPS]: (state: UIState, value: boolean) =>
    (state["shownIntroSteps"] = value)
};
