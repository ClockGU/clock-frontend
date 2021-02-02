const Home = () => import("@/views/Home");
const ViewLogin = () => import("@/views/ViewLogin");
const ViewCalendar = () => import("@/views/ViewCalendar.vue");
// const ViewShiftList = () => import("@/views/ViewShiftList");
const Shifts = () => import("@/views/Shifts");
const ViewContractForm = () => import("@/views/ViewContractForm");
const ViewContractList = () => import("@/views/ViewContractList");
const ViewHelp = () => import("@/views/ViewHelp");
const Settings = () => import("@/views/Settings");
const ViewDebug = () => import("@/views/ViewDebug");
const Landing = () => import("@/views/Landing");
const Imprint = () => import("@/views/Imprint");
const Privacy = () => import("@/views/Privacy");
const Dashboard = () => import("@/components/Dashboard");
const LoggingIn = () => import("@/views/LoggingIn");
const Onboarding = () => import("@/views/Onboarding");
const FAQ = () => import("@/views/FAQ");
const NotFound = () => import("@/views/NotFound");
const Reporting = () => import("@/views/Reporting");
const PrivacyAgreement = () => import("@/views/PrivacyAgreement");

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
      { path: "/onboarding",
        name: "onboarding",
        component: Onboarding },
      {
        path: "/impressum",
        name: "imprint",
        component: Imprint,
        meta: { public: true }
      },
      {
        path: "/datenschutz",
        name: "privacy",
        component: Privacy,
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
        component: Dashboard
      },
      {
        path: "/:type/:year/:month/:day/:contract?",
        name: "calendar",
        component: ViewCalendar,
        props: true
      },
      {
        path: "/shifts/:contract?",
        name: "shiftList",
        component: Shifts
      },
      {
        path: "/contracts/create",
        name: "createContract",
        component: ViewContractForm
      },
      {
        path: "/contracts/:uuid/edit",
        name: "editContract",
        component: ViewContractForm,
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
        component: Reporting
      },
      {
        path: "/settings",
        name: "settings",
        component: Settings
      },
      {
        path: "/debug/:contract?",
        name: "debug",
        component: ViewDebug
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
