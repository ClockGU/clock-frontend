import MessageService from "@/services/message";

const state = {
  messages: [],
  status: "idle"
};

const getters = {
  loading: (state) => state.status === "loading",
  messages: (state) => state.messages
};

const mutations = {
  setMessages(state, payload) {
    state.messages = payload;
  }
};

const actions = {
  setMessages({ commit }, payload) {
    commit("setMessages", payload);
  },
  async queryMessage({ commit }) {
    state.status = "loading";
    try {
      const response = await MessageService.list();
      commit("setMessages", response.data);

      //sort by valid_from date or ID (= message last entered)
      //.sort((a, b) => new Date(a.date) - new Date(b.date));
      //.sort((a, b) => b.id - a.id);

      response.data.sort((a, b) => b.id - a.id);

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
