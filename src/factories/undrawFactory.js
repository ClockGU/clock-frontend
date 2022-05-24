const repositories = {
  UndrawContentCreator: () => import("vue-undraw/UndrawContentCreator"),
  UndrawWorkTime: () => import("vue-undraw/UndrawWorkTime"),
  UndrawSubway: () => import("vue-undraw/UndrawSubway"),
  UndrawWorkInProgress: () => import("vue-undraw/UndrawUnderConstruction"),
  UndrawFinishLine: () => import("vue-undraw/UndrawFinishLine"),
  UndrawDigitalNomad: () => import("vue-undraw/UndrawDigitalNomad"),
  UndrawSynchronize: () => import("vue-undraw/UndrawSynchronize"),
  UndrawBlankCanvas: () => import("vue-undraw/UndrawBlankCanvas"),
  UndrawEmpty: () => import("vue-undraw/UndrawEmpty"),
  UndrawTimeManagement: () => import("vue-undraw/UndrawTimeManagement"),
  UndrawNoData: () => import("vue-undraw/UndrawNoData"),
  UndrawSocialDashboard: () => import("vue-undraw/UndrawSocialDashboard"),
  UndrawCalendar: () => import("vue-undraw/UndrawCalendar"),
  UndrawNewsletter: () => import("vue-undraw/UndrawNewsletter"),
  UndrawNotes: () => import("vue-undraw/UndrawNotes")
};

export const UndrawFactory = {
  get: (name) => repositories[name]()
};
