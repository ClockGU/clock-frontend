const repositories = {
  UndrawContentCreator: () => import("vue-undraw/UndrawContentCreator.vue"),
  UndrawWorkTime: () => import("vue-undraw/UndrawWorkTime.vue"),
  UndrawSubway: () => import("vue-undraw/UndrawSubway.vue"),
  UndrawWorkInProgress: () => import("vue-undraw/UndrawUnderConstruction.vue"),
  UndrawFinishLine: () => import("vue-undraw/UndrawFinishLine.vue"),
  UndrawDigitalNomad: () => import("vue-undraw/UndrawDigitalNomad.vue"),
  UndrawSynchronize: () => import("vue-undraw/UndrawSynchronize.vue"),
  UndrawBlankCanvas: () => import("vue-undraw/UndrawBlankCanvas.vue"),
  UndrawEmpty: () => import("vue-undraw/UndrawEmpty.vue"),
  UndrawTimeManagement: () => import("vue-undraw/UndrawTimeManagement.vue"),
  UndrawNoData: () => import("vue-undraw/UndrawNoData.vue"),
  UndrawSocialDashboard: () => import("vue-undraw/UndrawSocialDashboard.vue"),
  UndrawCalendar: () => import("vue-undraw/UndrawCalendar.vue"),
  UndrawNewsletter: () => import("vue-undraw/UndrawNewsletter.vue"),
  UndrawNotes: () => import("vue-undraw/UndrawNotes.vue"),
  UndrawConversation: () => import("vue-undraw/UndrawConversation.vue")
};

export const UndrawFactory = {
  get: (name) => repositories[name]()
};
