const Home = () => import("@/views/Home");
const ViewLogin = () => import("@/views/ViewLogin");
const ViewCalendar = () => import("@/views/ViewCalendar.vue");
const ViewShifts = () => import("@/views/ViewShifts");
const ViewContractList = () => import("@/views/ViewContractList");
const ViewHelp = () => import("@/views/ViewHelp");
const Settings = () => import("@/views/Settings");
const ViewDebug = () => import("@/views/ViewDebug");
const Landing = () => import("@/views/Landing");
const Imprint = () => import("@/views/Imprint");
const ViewDashboard = () => import("@/views/ViewDashboard");
const LoggingIn = () => import("@/views/LoggingIn");
const Onboarding = () => import("@/views/Onboarding");
const FAQ = () => import("@/views/FAQ");
const NotFound = () => import("@/views/NotFound");
const Reporting = () => import("@/views/Reporting");
const PrivacyAgreement = () => import("@/views/PrivacyAgreement");
const ViewGdprText = () => import("@/views/ViewGdprText");

import { initializeDataGuard } from "@/router/guards";

export const routes = [
  {
    path: "*",
    redirect: { name: "404" }
  },
  {
    path: "/",
    component: Home,
    children: [
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
        path: "/help",
        name: "help",
        component: ViewHelp,
        meta: {
          public: true
        }
      },
      {
        path: "/dashboard/:contract?",
        name: "dashboard",
        component: ViewDashboard,
        beforeEnter: initializeDataGuard
      },
      {
        path: "/:type/:year/:month/:day/:contract?",
        name: "calendar",
        component: ViewCalendar,
        props: true,
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
      }
    ]
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
