<template>
  <div>
    <ul v-if="this.$store.state.isHost == true" class="master">
      <li>Game Start</li>
    </ul>
    <ul v-if="this.$store.state.uid != null" class="negotiation">
      <li @click="onVote(0)">沈黙</li>
      <li @click="onVote(1)">協調</li>
      <li @click="onVote(2)">裏切</li>
    </ul>
  </div>
</template>

<script>
// import firebase from "firebase";
import { db } from "../plugins/firebase";

export default {
  name: "Vote",
  data() {
    return {
      event: Number
    };
  },
  methods: {
    onVote(event) {
      console.log(this.$store.state.uid, event);
      db.collection("users")
        .doc(this.$store.state.uid)
        .set({ next: event }, { merge: true });
    }
  }
};
</script>

<style>
.negotiation {
  padding: 0;
  text-align: center;
}

.master {
  padding: 20px;
  text-align: center;
}

li {
  font-size: 30px;
  display: inline-block;
  font-family: "hakidame";
  color: red;
  background-color: white;
  list-style: none;
  padding: 0.3em 1em;
  text-decoration: none;
  border: solid 2px red;
  border-radius: 3px;
  transition: 0.4s;
  cursor: pointer;
  -ms-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}

li:hover {
  background: red;
  color: white;
}
</style>