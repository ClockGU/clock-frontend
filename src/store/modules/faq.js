import FaqService from "@/services/faq";

const state = {
  faqs: [],
  status: "idle"
};

const getters = {
  loading: (state) => state.status === "loading",
  status: (state) => state.status,
  faqs: (state) => state.faqs
};

const mutations = {
  setFaqs(state, payload) {
    state.faqs = payload;
  },
  setStatus(state, status) {
    state.status = status;
  }
};

const actions = {
  setFaqs({ commit }, payload) {
    commit("setFaqs", payload);
  },
  async queryFaq({ commit }) {
    state.status = "loading";
    try {
      const response = await FaqService.list();
      commit("setFaqs", response.data);
      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject();
    } finally {
      commit("setStatus", "idle");
    }
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
