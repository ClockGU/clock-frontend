import Vue from "vue";
import Router from "vue-router";
import CalendarView from "./views/CalendarView.vue";
import CreateShift from "./views/CreateShift";
import ContractFormView from "./views/ContractFormView";
import ShiftList from "./views/ShiftList";
import ContractList from "./views/ContractList";
import ClockInOut from "./views/ClockInOut";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "c",
      component: CalendarView
    },
    {
      path: "/:type/:year/:month/:day",
      name: "calendar",
      component: CalendarView,
      props: true
    },
    {
      path: "/shifts/",
      name: "shiftList",
      component: ShiftList
    },
    {
      path: "/shifts/:uuid/edit",
      name: "editShift",
      component: CreateShift,
      props: true
    },
    {
      path: "/shifts/create",
      name: "createShift",
      component: CreateShift
    },
    {
      path: "/contracts/",
      name: "contractList",
      component: ContractList
    },
    {
      path: "/contracts/create",
      name: "createContract",
      component: ContractFormView
    },
    {
      path: "/contracts/:uuid/edit",
      name: "editContract",
      component: ContractFormView,
      props: true
    },
    {
      path: "/clock",
      name: "clockInOut",
      component: ClockInOut
    }
  ]
});
