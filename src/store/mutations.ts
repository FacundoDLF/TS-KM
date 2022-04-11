import { MUTATIONS_TYPES } from "./types";
import { RootStateWithModulesState } from "./";
import { User } from "@/types";
import { SelectedCase, PreCase, SearchResult, Collections } from "@/types";

export default {
  [MUTATIONS_TYPES.SET_SELECTED_CASE]: (
    state: RootStateWithModulesState,
    value: SelectedCase
  ) => (state["selectedCase"] = { ...state["selectedCase"], ...value }),
  [MUTATIONS_TYPES.SET_PRECASE]: (
    state: RootStateWithModulesState,
    value: PreCase
  ) => (state["precase"] = { ...state["precase"], ...value }),
  [MUTATIONS_TYPES.SET_CURRENT_ROUTE]: (
    state: RootStateWithModulesState,
    value: string
  ) => (state["currentRoutePath"] = value),
  [MUTATIONS_TYPES.SET_USER]: (state: RootStateWithModulesState, value: User) =>
    (state["user"] = value),
  [MUTATIONS_TYPES.SET_USER_PROFILE]: (
    state: RootStateWithModulesState,
    value: {
      given_name: string;
      family_name: string;
    }
  ) => (state["userProfile"] = value),
  [MUTATIONS_TYPES.SET_ACCESS_TOKEN]: (
    state: RootStateWithModulesState,
    value: string
  ) => (state["accessToken"] = value),
  [MUTATIONS_TYPES.SET_IS_FETCHING]: (
    state: RootStateWithModulesState,
    value: boolean
  ) => (state["isFetching"] = value),
  [MUTATIONS_TYPES.SET_IS_FETCHING_USER]: (
    state: RootStateWithModulesState,
    value: boolean
  ) => (state["isFetchingUser"] = value),
  [MUTATIONS_TYPES.SET_IS_FETCHING_CASES_TO_EXPORT]: (
    state: RootStateWithModulesState,
    value: boolean
  ) => (state["isFetchingCasesToExport"] = value),
  [MUTATIONS_TYPES.SET_IS_FETCHING_FROM_INFO]: (
    state: RootStateWithModulesState,
    value: boolean
  ) => (state["isFetchingFromInfo"] = value),
  [MUTATIONS_TYPES.SET_IS_SESSION_EXPIRED]: (
    state: RootStateWithModulesState,
    value: boolean
  ) => (state["isSessionExpired"] = value),
  [MUTATIONS_TYPES.SET_COLLECTIONS]: (
    state: RootStateWithModulesState,
    value: Collections
  ) => (state["collections"] = value),
  [MUTATIONS_TYPES.SET_EMPLOYEES]: (
    state: RootStateWithModulesState,
    value: object[]
  ) => (state["employees"] = value),
  [MUTATIONS_TYPES.ADD_CASE_TO_SELECTION]: (
    state: RootStateWithModulesState,
    value: string
  ) => (state["selectedCasesIds"] = [...state["selectedCasesIds"], value]),
  [MUTATIONS_TYPES.REMOVE_CASE_FROM_SELECTION]: (
    state: RootStateWithModulesState,
    value: string
  ) =>
    (state["selectedCasesIds"] = state["selectedCasesIds"].filter(
      (selectedCase: string) => selectedCase !== value
    )),
  [MUTATIONS_TYPES.SET_SEARCH_RESULTS]: (
    state: RootStateWithModulesState,
    value: SearchResult[]
  ) => (state["searchResults"] = value),
  [MUTATIONS_TYPES.SET_SEARCH_ROUTE]: (
    state: RootStateWithModulesState,
    value: string
  ) => (state["selectedSearchRoute"] = value),
  [MUTATIONS_TYPES.SET_CASES_TO_EXPORT]: (
    state: RootStateWithModulesState,
    value?: SelectedCase[]
  ) => (state["casesToExport"] = value || []),
  [MUTATIONS_TYPES.SET_CASE_SELECTION]: (state: RootStateWithModulesState) =>
    (state["selectedCasesIds"] = [])
};
