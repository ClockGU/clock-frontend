import FaqService from "@/services/faq";
import { sortByPrioritization } from "@/utils";

const state = {
  faqs: [],
  status: "idle"
};

const getters = {
  loading: (state) => state.status === "loading",
  faqs(state) {
    let faqArrayWithHeading = [];
    let faqArrayNoHeading = [];

    for (let faq of Object.values(state.faqs)) {
      if (!faq.faq_heading) faqArrayNoHeading.push(faq);
      else faqArrayWithHeading.push(faq);
    }

    let groupedfaqArray = Object;

    if (faqArrayWithHeading !== []) {
      groupedfaqArray = Object.groupBy(
        faqArrayWithHeading,
        ({ faq_heading }) => faq_heading.prio_level
      );
    }

    groupedfaqArray["0"] = faqArrayNoHeading;

    for (let group in groupedfaqArray) {
      groupedfaqArray[group] = sortByPrioritization(groupedfaqArray[group]);
    }

    return groupedfaqArray;
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
