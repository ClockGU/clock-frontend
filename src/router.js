import Vue from "vue";
import Router from "vue-router";
import Calendar from "./views/Calendar.vue";
import CreateShift from "./views/CreateShift";
import ShiftList from "./views/ShiftList";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "c",
      component: Calendar
    },
    {
      path: "/:type/:year/:month/:day",
      name: "calendar",
      component: Calendar,
      props: true
    },
    {
      path: "/shifts/",
      name: "shiftList",
      component: ShiftList
    },
    {
      path: "shifts/:uuid/edit",
      name: "editShift",
      component: CreateShift,
      props: true
    },
    {
      path: "/shifts/create",
      name: "createShift",
      component: CreateShift
    }
  ]
});
