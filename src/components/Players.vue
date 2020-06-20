<template>
  <div id="players">
    <transition-group name="players" tag="div" class="list content">
      <section
        v-for="{ name, value } in players"
        :key="value"
        class="playerlist"
      >
        <div class="name">{{ name }}</div>
      </section>
    </transition-group>
  </div>
</template>

<script>
import { db } from "../plugins/firebase";

export default {
  name: "Players",
  data() {
    return {
      user: {},
      name: {},
      players: [],
    };
  },
  firestore() {
    return {
      players: db.collection("users"),
    };
  },
};
</script>
