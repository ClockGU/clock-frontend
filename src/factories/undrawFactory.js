const repositories = {
  UndrawContentCreator: () => import("vue-undraw/UndrawContentCreator"),
  UndrawWorkTime: () => import("vue-undraw/UndrawWorkTime")
};

export const UndrawFactory = {
  get: name => repositories[name]()
};
