<template>
  <div id="playerstable">
    <table name="players" tag="div" class="list content">
      <tr v-for="({ name, value, prev, next, hash }, id) in players" :key="id" class="playerlist">
        <td>{{ name }}</td>
        <!-- <td>{{ hash != null ? hash.substr(0, 8) : null }}</td>
        <td>{{ vhash!= null ? vhash.substr(0, 8) : null }}</td>-->
        <td>{{ hash == vhash }}</td>
        <!-- <td>{{ prev == null ? "未投票" : hash == vhash ? type[prev] : "投票済" }}</td> -->
        <td>{{ next == null ? "未投票" : hash == vhash ? type[next] : "投票済" }}</td>
        <td>{{ value }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { db } from "../plugins/firebase";

export default {
  name: "Players",
  data() {
    return {
      // user: {},
      vhash: this.$store.state.hash,
      players: [],
      type: ["沈黙", "協調", "裏切り"]
    };
  },
  mounted() {
    this.$store.watch(
      (stage, getters) => getters.hash,
      (newValue, oldValue) => {
        this.vhash = newValue;
        console.log(newValue, oldValue);
      }
    );
  },
  firestore() {
    return {
      players: db.collection("users").where("playable", "==", true)
    };
  }
};
</script>

<style>
table {
  max-width: 800px;
  width: 90%;
  margin: 20px auto;
  font-family: "hakidame";
  font-size: 30px;
  border: 3px solid;
}

td,
th {
  min-width: 40px;
  text-align: center;
}
</style>
