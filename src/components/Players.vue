<template>
  <div id="playerstable">
    <table name="players" tag="div" class="list content">
      <tr
        v-for="({ name, value, prev, next }, id) in players"
        :key="id"
        class="playerlist"
      >
        <td>{{ name }}</td>
        <td>{{ prev == null ? "未投票" : "投票済" }}</td>
        <td>{{ next == null ? "未投票" : "投票済" }}</td>
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
    };
  },
  firestore() {
    return {
      players: db.collection("users"),
    };
  },
};
</script>

<style>
table {
  width: 90%;

  margin: 3.5vw auto;
  font-family: "hakidame";
  font-size: 3vw;
  border: 3px solid;
}

td,
th {
  min-width: 40px;
  text-align: center;
}
</style>
