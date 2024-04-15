const Home = () => import("@/views/Home.vue");
const ViewLogin = () => import("@/views/ViewLogin.vue");
const ViewCalendar = () => import("@/views/ViewCalendar.vue");
const ViewShifts = () => import("@/views/ViewShifts.vue");
const ViewContractList = () => import("@/views/ViewContractList.vue");
const Settings = () => import("@/views/Settings.vue");
const ViewDebug = () => import("@/views/ViewDebug.vue");
const Landing = () => import("@/views/Landing.vue");
const Imprint = () => import("@/views/Imprint.vue");
const ViewDashboard = () => import("@/views/ViewDashboard.vue");
const LoggingIn = () => import("@/views/LoggingIn.vue");
const Onboarding = () => import("@/views/Onboarding.vue");
const FAQ = () => import("@/views/FAQ.vue");
const NotFound = () => import("@/views/NotFound.vue");
const Reporting = () => import("@/views/Reporting.vue");
const PrivacyAgreement = () => import("@/views/PrivacyAgreement.vue");
const ViewGdprText = () => import("@/views/ViewGdprText.vue");

import { initializeDataGuard } from "@/router/guards";

export const routes = [
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "404" }
  },
  {
    path: "/404",
    name: "404",
    component: NotFound,
    meta: { public: true }
  },
  {
    path: "/",
    name: "home",
    component: Landing,
    meta: { public: true, onlyWhenLoggedOut: true }
  },
  {
    path: "/faq",
    name: "faq",
    component: FAQ,
    meta: { public: true }
  },
  {
    path: "/onboarding",
    name: "onboarding",
    component: Onboarding,
    beforeEnter: initializeDataGuard
  },
  {
    path: "/impressum",
    name: "imprint",
    component: Imprint,
    meta: { public: true }
  },
  {
    path: "/privacy",
    name: "privacy",
    component: ViewGdprText,
    meta: { public: true }
  },
  {
    path: "/logging-in",
    name: "loggingIn",
    component: LoggingIn,
    meta: { public: true, onlyWhenLoggedOut: true }
  },
  {
    path: "/dashboard/:contract?",
    name: "dashboard",
    component: ViewDashboard,
    beforeEnter: initializeDataGuard
  },
  {
    path: "/calendar",
    name: "calendar",
    component: ViewCalendar,
    beforeEnter: initializeDataGuard
  },
  {
    path: "/shifts/:contract?",
    name: "shiftList",
    component: ViewShifts,
    beforeEnter: initializeDataGuard
  },
  {
    path: "/contracts/create",
    name: "createContract",
    component: ViewContractList,
    beforeEnter: initializeDataGuard
  },
  {
    path: "/contracts/:uuid/edit",
    name: "editContract",
    component: ViewContractList,
    props: true,
    beforeEnter: initializeDataGuard
  },
  {
    path: "/contracts/",
    name: "contractList",
    component: ViewContractList,
    beforeEnter: initializeDataGuard
  },
  {
    path: "/select/",
    name: "contractSelect",
    component: ViewContractList,
    beforeEnter: initializeDataGuard
  },
  {
    path: "/reports/:contract?",
    name: "reporting",
    component: Reporting,
    beforeEnter: initializeDataGuard
  },
  {
    path: "/settings",
    name: "settings",
    component: Settings
  },
  {
    path: "/debug/:contract?",
    name: "debug",
    component: ViewDebug,
    beforeEnter: initializeDataGuard
  },
  {
    path: "/privacyagreement",
    name: "privacyagreement",
    component: PrivacyAgreement
  },
  {
    path: "/login",
    name: "login",
    component: ViewLogin,
    meta: {
      public: true,
      onlyWhenLoggedOut: true
    }
  }
];
