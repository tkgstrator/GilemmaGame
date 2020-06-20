import Vue from "vue";
import Vuex from "vuex";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import "./plugins/firebase";
import "./assets/sass/style.scss";

Vue.config.productionTip = false;

Vue.use(Vuex);

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
