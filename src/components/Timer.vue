<template>
  <div id="counter">
    <p class="timer" @click="showRule()">残り時間{{ rule==null ? null : rule.turn}}秒</p>
  </div>
</template>

<script>
import { db } from "../plugins/firebase";

export default {
  name: "Timer",
  data() {
    return {
      rule: null,
      mode: Boolean
    };
  },
  mounted() {
    // データベースの変更をチェック
    db.collection("users")
      .where("playable", "==", true)
      .onSnapshot(function(users) {
        db.collection("users")
          .where("next", "==", 1)
          .get()
          .then(wait => {
            this.mode = users.size == wait.size;
          });
      });
  },
  firestore() {
    return {
      // 標準ルールを取得
      rule: db.collection("rules").doc("mMNTKGPxpraq8z0KnCTB")
    };
  },
  methods: {
    showRule() {
      console.log(this.rule);
    }
  }
};
</script>

<style>
.timer {
  text-align: center;
}
</style>