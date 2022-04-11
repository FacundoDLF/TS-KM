import { Routes } from "@/constants/routes";
import { ACTIONS_TYPES as APPROACH_ACTIONS_TYPES } from "@/store/modules/selectedCase/approach/types";
import { ACTIONS_TYPES as SITUATION_ACTIONS_TYPES } from "@/store/modules/selectedCase/situation/types";
import { ACTIONS_TYPES as RESULTS_ACTIONS_TYPES } from "@/store/modules/selectedCase/results/types";

const getChangeFieldAction = (routeName: string): string => {
  switch (routeName) {
    case Routes.APPROACH:
      return `approach/${APPROACH_ACTIONS_TYPES.CHANGE_APPROACH_FIELD}`;
    case Routes.SITUATION:
      return `situation/${SITUATION_ACTIONS_TYPES.CHANGE_SITUATION_FIELD}`;
    default:
      return `results/${RESULTS_ACTIONS_TYPES.CHANGE_RESULTS_FIELD}`;
  }
};
export default getChangeFieldAction;
