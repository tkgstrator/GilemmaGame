<template>
  <v-app>
    <v-container>
      <Top />
      <OAuth />
      <Timer />
      <Players />
      <Vote />
    </v-container>
  </v-app>
</template>

<script>
// import Dilemma from './components/Dilemma'
import Top from "./components/Top";
import OAuth from "./components/OAuth";
import Players from "./components/Players";
import Vote from "./components/Vote";
import Timer from "./components/Timer";

export default {
  name: "App",
  components: {
    OAuth,
    Top,
    Players,
    Vote,
    Timer
  }
  // data() {
  //   return {
  //     isSignIn: true
  //   };
  // }
  // data: () => ({
  //   isSignIn: true
  // })
};
</script>

<style>
.container #twitter-signin {
  text-align: center;
}
</style>
