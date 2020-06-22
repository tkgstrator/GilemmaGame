import Vue from "vue";
import Vuex from "vuex";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import "./plugins/firebase";
import "./assets/sass/style.scss";

Vue.config.productionTip = false;

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    uid: null,
    hash: null,
    isHost: null,
  },
  getters: {
    hash(state) {
      return state.hash;
    },
    // uid(state) {
    //   return state.uid;
    // },
  },
  mutations: {
    setHash(state, payload) {
      state.hash = payload.hash;
    },
    // setUid(state, payload) {
    //   state.uid = payload.uid;
    // },
  },
  actions: {
    doUpdateHash({ commit }, hash) {
      commit("sethash", { hash });
    },
    // doUpdateUid({ commit }, uid) {
    //   commit("setuid", { uid });
    // },
  },
});

new Vue({
  vuetify,
  store,
  render: (h) => h(App),
}).$mount("#app");
