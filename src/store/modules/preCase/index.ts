import { PreCase } from "@/types";
import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

export default {
  namespaced: true,
  state: () => ({} as PreCase),
  actions,
  getters,
  mutations
};
