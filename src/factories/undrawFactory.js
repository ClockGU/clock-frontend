const repositories = {
  UndrawContentCreator: () => import("vue-undraw/UndrawContentCreator"),
  UndrawWorkTime: () => import("vue-undraw/UndrawWorkTime"),
  UndrawSubway: () => import("vue-undraw/UndrawSubway"),
  UndrawWorkInProgress: () => import("vue-undraw/UndrawUnderConstruction"),
  UndrawFinishLine: () => import("vue-undraw/UndrawFinishLine")
};

export const UndrawFactory = {
  get: name => repositories[name]()
};
