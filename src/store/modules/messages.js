import formatDistance from "date-fns/formatDistance";
import subDays from "date-fns/subDays";
import { v4 as uuidv4 } from "uuid";

const state = {
  messages: []
};

const mutations = {
  ADD_MESSAGE(state, payload) {
    state.messages.push(payload);
  },
  DELETE_MESSAGE(state, payload) {
    state.messages = state.messages.filter(message => message.uuid !== payload);
  },
  CLEAR_MESSAGES(state) {
    state.messages = [];
  }
};

const actions = {
  addMessage({ commit, state }, message) {
    const expires =
      message.expires === undefined ? new Date() : message.expires;
    const payload = {
      ...message,
      created: subDays(new Date(), state.messages.length),
      expires,
      uuid: uuidv4()
    };
    commit("ADD_MESSAGE", payload);
  },
  deleteMessage({ commit }, uuid) {
    commit("DELETE_MESSAGE", uuid);
  },
  clearMessages({ commit }) {
    commit("CLEAR_MESSAGES");
  }
};

const getters = {
  getMessages(state) {
    return state.messages
      .map(message => {
        const now = new Date();
        const distance = formatDistance(message.created, now);
        return {
          ...message,
          createdReadable: `${distance} ago`
        };
      })
      .sort((a, b) => {
        return a.created < b.created;
      });
  },
  numberOfMessages(state) {
    return state.messages.length;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
