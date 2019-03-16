import { getField, updateField } from "vuex-map-fields";

const state = {
  shifts: []
};

const getters = {
  getField
};

const mutations = {
  updateField
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};
