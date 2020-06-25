<template>
  <div id="counter">
    <p v-if="rule==null ? true : !rule.mode" class="timer" @click="showRule()">プレイヤーの投票を待っています.</p>
    <p v-else class="timer" @click="gameClear()">第{{ gameTurn }}ターン 残り時間{{ timeRemind }}秒</p>
  </div>
</template>

<script>
import { db } from "../plugins/firebase";

export default {
  name: "Timer",
  data() {
    return {
      rule: null, // サーバから取得する情報
      timeRemind: null, // 表示する時間
      gameTurn: null,
      timerObj: null,
      start_time: null,
      players: []
    };
  },
  watch: {
    // 常にアップデートされているruleの内容が変更された時に実行
    rule: {
      immediate: true,
      handler() {
        // 実行する処理
        // ルールがセットされているときだけ実行する
        if (this.rule != null) {
          // 初期時間をセットし、リロードしてもズレないようにする
          if (this.rule.start_time != null) {
            this.start_time = this.rule.start_time;
            // ゲーム開始からの経過時間を取得
            const elapsedTime = parseInt(
              (new Date().getTime() - this.rule.start_time) / 1000
            );
            // 現在第何ゲーム目かを計算する
            this.gameTurn = parseInt(elapsedTime / 30) + 1;
            // サーバからゲーム開始時刻を読み込んで保存（これによって全員が共通の値を持てる）
            this.timeRemind = 29 - (elapsedTime % 30);
            console.log("GameInfo:", this.gameTurn, this.timeRemind);
            this.timeStart();
          }
        }
      }
    }
  },
  firestore() {
    return {
      // 標準ルールを取得
      rule: db.collection("rules").doc("mMNTKGPxpraq8z0KnCTB"),
      players: db.collection("users").where("playable", "==", true)
    };
  },
  methods: {
    timeStart() {
      if (this.timerObj == null) {
        let self = this;
        this.timerObj = setInterval(function() {
          self.timeCount();
        }, 1000);
      }
    },
    timeCount() {
      const elapsedTime = parseInt(
        (new Date().getTime() - this.start_time) / 1000
      );
      this.gameTurn = parseInt(elapsedTime / 30) + 1;
      this.timeRemind = 29 - (elapsedTime % 30);
      if (this.timeRemind == 0) {
        this.calcValue();
      }
      // console.log("Game+Time:", this.gameTurn, this.timeRemind);
    },
    gameClear() {
      // タイマーを初期化する
      console.log("Game Clear");
      db.collection("rules")
        .doc("mMNTKGPxpraq8z0KnCTB")
        .update({ mode: false });
      clearInterval(this.timerObj);
      this.timerObj = null;
    },
    calcValue() {
      if (this.players.length == 0) {
        this.gameClear();
        return;
      }
      console.log("GameInfo", this.players[0].id, this.$store.state.hash);
      // 指定秒数経過後に点数を計算する
      if (this.players[0].hash == this.$store.state.hash) {
        // 参加しているプレイヤーで最もIDが若いプレイヤーをホストとする
        // 未投票のプレイヤーを除外する
        db.collection("users")
          .where("next", "==", null)
          .get()
          .then(function(players) {
            players.forEach(player => {
              db.collection("users")
                .doc(player.id)
                .update({ playable: false });
            });
          });
        // それぞれ選択したプレイヤー数をカウント
        const p0 = this.players.filter(function(player) {
          return player["next"] == 0;
        }).length;
        const p1 = this.players.filter(function(player) {
          return player["next"] == 1;
        }).length;
        const p2 = this.players.filter(function(player) {
          return player["next"] == 2;
        }).length;
        const total = p0 + p1 + p2;

        console.log("GameInfo", p0, p1, p2);

        // 全プレイヤーの投票を一つずつズラす
        db.collection("users")
          .get()
          .then(function(players) {
            players.forEach(player => {
              const prev = player.data()["next"];
              db.collection("users")
                .doc(player.id)
                .update({ prev: prev, next: null });
            });
          });

        // 沈黙プレイヤーは無条件にポイントを失う
        db.collection("users")
          .where("next", "==", 0)
          .get()
          .then(function(players) {
            players.forEach(player => {
              const value = player.data()["value"] - total * 10;
              // console.log("Value", player.data()["value"], "=>", value);
              db.collection("users")
                .doc(player.id)
                .update({ value: value });
            });
          });
        // どの交渉が成立したかを検証する
        if (p1 * 2 >= total) {
          // 半数以上が協調したので、とりあえず協調が成立
          if (p2 != 0) {
            // 裏切り者がいたので、裏切りが成立
            db.collection("users")
              .where("next", "==", 2)
              .get()
              .then(function(players) {
                players.forEach(player => {
                  const value = player.data()["value"] + p1 * 20;
                  // console.log("Value", player.data()["value"], "=>", value);
                  db.collection("users")
                    .doc(player.id)
                    .update({ value: value });
                });
              });
          }
          // 裏切り者がいなければ、協調が成立
          else {
            db.collection("users")
              .where("next", "==", 1)
              .get()
              .then(function(players) {
                players.forEach(player => {
                  const value = player.data()["value"] + p1 * 20;
                  db.collection("users")
                    .doc(player.id)
                    .update({ value: value });
                });
              });
          }
        } else {
          // 協調が成立しなかった場合
          if (p2 != 0) {
            // 裏切り者に制裁が下される
            db.collection("users")
              .where("next", "==", 2)
              .get()
              .then(function(players) {
                players.forEach(player => {
                  const value = player.data()["value"] - p1 * 20;
                  // console.log("Value", player.data()["value"], "=>", value);
                  db.collection("users")
                    .doc(player.id)
                    .update({ value: value });
                });
              });
          }
          if (p0 * 2 <= total) {
            // 沈黙を選んだプレイヤーが半数以下
            db.collection("users")
              .where("next", "==", 0)
              .get()
              .then(function(players) {
                players.forEach(player => {
                  const value = player.data()["value"] + total * 20;
                  // console.log("Value", player.data()["value"], "=>", value);
                  db.collection("users")
                    .doc(player.id)
                    .update({ value: value });
                });
              });
          }
        }
      }
    }
  }
};
</script>

<style>
.timer {
  margin: 20px auto;
  text-align: center;
  font-family: "hakidame";
  font-size: 26px;
}
</style>