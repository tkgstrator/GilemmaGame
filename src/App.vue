<template>
  <v-app>
    <v-container>
      <Top />
      <OAuth />
    </v-container>
  </v-app>
</template>

<script>
// import Dilemma from './components/Dilemma'
import Top from "./components/Top";
import OAuth from "./components/OAuth";

export default {
  name: "App",
  components: {
    OAuth,
    Top,
  },
};
</script>

<style>
.container #twitter-signin {
  text-align: center;
}
</style>
