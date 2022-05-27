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
const Privacy = () => import("@/components/gdpr/Privacy");
const ViewDashboard = () => import("@/views/ViewDashboard");
const LoggingIn = () => import("@/views/LoggingIn");
const Onboarding = () => import("@/views/Onboarding");
const FAQ = () => import("@/views/FAQ");
const NotFound = () => import("@/views/NotFound");
const Reporting = () => import("@/views/Reporting");
const PrivacyAgreement = () => import("@/views/PrivacyAgreement");

import { RequiredDataGuard } from "@/router/guards";

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
        component: Onboarding
      },
      {
        path: "/impressum",
        name: "imprint",
        component: Imprint,
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
        beforeEnter: RequiredDataGuard,
        beforeUpdate: RequiredDataGuard
      },
      {
        path: "/:type/:year/:month/:day/:contract?",
        name: "calendar",
        component: ViewCalendar,
        props: true,
        beforeEnter: RequiredDataGuard,
        beforeUpdate: RequiredDataGuard
      },
      {
        path: "/shifts/:contract?",
        name: "shiftList",
        component: ViewShifts,
        beforeEnter: RequiredDataGuard,
        beforeUpdate: RequiredDataGuard
      },
      {
        path: "/contracts/create",
        name: "createContract",
        component: ViewContractList
      },
      {
        path: "/contracts/:uuid/edit",
        name: "editContract",
        component: ViewContractList,
        props: true
      },
      {
        path: "/contracts/",
        name: "contractList",
        component: ViewContractList
      },
      {
        path: "/select/",
        name: "contractSelect",
        component: ViewContractList
      },
      {
        path: "/reports/:contract?",
        name: "reporting",
        component: Reporting,
        beforeEnter: RequiredDataGuard,
        beforeUpdate: RequiredDataGuard
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
        beforeEnter: RequiredDataGuard,
        beforeUpdate: RequiredDataGuard
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
