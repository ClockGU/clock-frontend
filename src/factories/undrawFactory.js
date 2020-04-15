const repositories = {
  UndrawContentCreator: () =>
    import(/*webpackIgnore: true*/ "vue-undraw/UndrawContentCreator"),
  UndrawWorkTime: () =>
    import(/*webpackIgnore: true*/ "vue-undraw/UndrawWorktime")
};

export const UndrawFactory = {
  get: name => repositories[name]
};
