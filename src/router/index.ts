import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import MyCases from "@/components/routes/MyCases.vue";
import index from "@/components/routes/selectedCase/index.vue";
import NotFound from "@/components/routes/NotFound.vue";
import CaseProfile from "@/components/routes/CaseProfile.vue";
import NewCase from "@/components/routes/NewCase.vue";
import GuidedSearch from "@/components/routes/GuideSearch.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/search",
    name: "Search",
    component: GuidedSearch
  },
  {
    path: "/my-cases",
    name: "MyCases",
    component: MyCases
  },
  {
    path: "/my-cases/:id",
    name: "Case",
    component: index
  },
  {
    path: "/my-cases/:id/:primaryStep",
    name: "PrimaryStep",
    component: index
  },
  {
    path: "/my-cases/:id/:primaryStep/:secondaryStep",
    name: "SecondaryStep",
    component: index
  },
  {
    path: "/case-profile/:id",
    name: "CaseProfile",
    component: CaseProfile
  },
  {
    path: "/new-case/:id",
    name: "NewCase",
    component: NewCase
  },
  {
    path: "*",
    component: NotFound
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
