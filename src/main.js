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
    isSignIn: true,
    uid: null,
    hash: null,
  },
  getters: {
    hash(state) {
      return state.hash;
    },
  },
  mutations: {
    setHash(state, payload) {
      state.hash = payload.hash;
    },
  },
  actions: {
    doUpdateHash({ commit }, hash) {
      commit("sethash", { hash });
    },
  },
});

new Vue({
  vuetify,
  store,
  render: (h) => h(App),
}).$mount("#app");
