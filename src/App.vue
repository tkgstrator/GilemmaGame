<template>
  <v-app>
    <v-container>
      <Top />
      <OAuth />
      <Players />
    </v-container>
  </v-app>
</template>

<script>
// import Dilemma from './components/Dilemma'
import Top from "./components/Top";
import OAuth from "./components/OAuth";
import Players from "./components/Players";

export default {
  name: "App",
  components: {
    OAuth,
    Top,
    Players,
  },
};
</script>

<style>
.container #twitter-signin {
  text-align: center;
}
</style>
