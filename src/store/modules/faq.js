import FaqService from "@/services/faq";
import { sortByPrioritization } from "@/utils";

const state = {
  faqs: [],
  status: "idle"
};

const getters = {
  loading: (state) => state.status === "loading",
  faqs(state) {
    let faqArray = [];
    for (let faq of Object.values(state.faqs)) {
      faqArray.push(faq);
    }
    return sortByPrioritization(faqArray);
  }
  // faqs: (state) => state.faqs
};

const mutations = {
  setFaqs(state, payload) {
    state.faqs = payload;
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
      return Promise.reject(error);
    } finally {
      state.status = "idle";
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
