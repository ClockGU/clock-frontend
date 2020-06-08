const repositories = {
  UndrawContentCreator: () => import("vue-undraw/UndrawContentCreator"),
  UndrawWorkTime: () => import("vue-undraw/UndrawWorkTime"),
  UndrawSubway: () => import("vue-undraw/UndrawSubway"),
  UndrawWorkInProgress: () => import("vue-undraw/UndrawUnderConstruction"),
  UndrawFinishLine: () => import("vue-undraw/UndrawFinishLine"),
  UndrawDigitalNomad: () => import("vue-undraw/UndrawDigitalNomad"),
  UndrawSynchronize: () => import("vue-undraw/UndrawSynchronize")
};

export const UndrawFactory = {
  get: name => repositories[name]()
};
