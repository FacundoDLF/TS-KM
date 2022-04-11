/* eslint-disable @typescript-eslint/camelcase */
import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";
import { Routes } from "@/constants/routes";
import {
  PrimaryStepTab,
  User,
  UserRoles,
  PreCase,
  CaseStatus,
  SelectedCase
} from "@/types/";
import router from "@/router";
import cases from "./modules/cases";
import modal from "./modules/modal";
import notifications from "./modules/notifications";
import selectedCase from "./modules/selectedCase";
import ui from "./modules/ui";
import precase from "./modules/preCase";
import { SelectedCaseWithModulesState } from "./modules/selectedCase";
import { UIState } from "./modules/ui";
import { State as CasesState } from "./modules/cases";
import {
  SearchResult,
  SelectedCase as ISelectedCase,
  Collections
} from "@/types";

Vue.use(Vuex);

export interface RootStateWithModulesState {
  currentRoutePath: string;
  userProfile: {
    given_name: string;
    family_name: string;
  };
  user: User;
  precase: PreCase;
  isSessionExpired: boolean;
  accessToken: string;
  primaryStepTabs: PrimaryStepTab[];
  selectedCase: SelectedCaseWithModulesState;
  ui: UIState;
  cases: CasesState;
  isLoading: boolean;
  isFetching: boolean;
  isFetchingUser: boolean;
  isFetchingCasesToExport: boolean;
  userRole: UserRoles;
  collections: Collections;
  employees: object[] | [];
  isFetchingFromInfo: boolean;
  selectedCasesIds: string[] | [];
  searchResults: SearchResult[] | [];
  casesToExport: ISelectedCase[];
  selectedSearchRoute: string;
  status: CaseStatus;
}

const store = new Vuex.Store<RootStateWithModulesState>({
  state: () =>
    ({
      currentRoutePath: router.currentRoute.path,
      userProfile: {
        given_name: "",
        family_name: ""
      },
      isSessionExpired: false,
      accessToken: "",
      user: {},
      primaryStepTabs: [
        {
          title: "Available Case Data",
          id: 0,
          route: Routes.AVAILABLE_CASE_DATA,
          logo: "case-data"
        },
        {
          title: "Situation",
          id: 1,
          route: Routes.SITUATION,
          logo: "situation"
        },
        {
          title: "Approach",
          id: 2,
          route: Routes.APPROACH,
          logo: "approach"
        },
        {
          title: "Results",
          id: 3,
          route: Routes.RESULTS,
          logo: "results"
        },
        {
          title: "Preview PPT",
          id: 4,
          route: Routes.PREVIEW_PPT,
          logo: "ppt-preview"
        }
      ],
      isLoading: false,
      isFetching: false,
      isFetchingUser: false,
      isFetchingCasesToExport: false,
      isFetchingFromInfo: false,
      employees: [],
      collections: [] as any,
      searchResults: [],
      selectedCasesIds: [],
      casesToExport: [] as ISelectedCase[],
      selectedSearchRoute: ""
    } as RootStateWithModulesState),
  modules: {
    cases,
    modal,
    notifications,
    selectedCase,
    ui,
    precase
  },
  getters,
  mutations,
  actions
});

export default store;
