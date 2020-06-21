<template>
  <div id="playerstable">
    <table name="players" tag="div" class="list content">
      <tr v-for="({ name, value, prev, next }, id) in players" :key="id" class="playerlist">
        <td>{{ name }}</td>
        <td>{{ prev == null ? "未投票" : type[prev] }}</td>
        <td>{{ next == null ? "未投票" : type[next] }}</td>
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
      user: {},
      name: {},
      players: [],
      type: ["沈黙", "協調", "裏切り"]
    };
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
