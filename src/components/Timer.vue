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
      start_time: Number
    };
  },
  watch: {
    // 常にアップデートされているruleの内容が変更された時に実行
    rule: {
      immediate: true,
      handler() {
        // 実行する処理
        if (this.rule != null && this.rule.mode) {
          // ルールがnullでなく、かつモードがTrueのときに実行する
          // 初期時間をセットし、リロードしてもズレないようにする
          if (this.$store.state.start_time == null) {
            // 最初の一回だけ実行するメソッド
            // ゲーム開始からの経過時間を取得
            const elapsedTime = parseInt(
              (new Date().getTime() - this.rule.start_time) / 1000
            );
            // 現在第何ゲーム目かを計算する
            this.gameTurn = parseInt(elapsedTime / 30);
            // サーバからゲーム開始時刻を読み込んで保存（これによって全員が共通の値を持てる）
            this.$store.state.start_time =
              this.rule.start_time + this.$store.state.game_turn * 30 * 1000;
            this.timeRemind = 30 - (elapsedTime % 30);
            console.log("Game Start");
            this.timeStart();
          }
        }
      }
    }
  },
  mounted() {
    // データベースの変更をチェック
    db.collection("users")
      .where("playable", "==", true)
      .onSnapshot(function(users) {
        db.collection("users")
          .where("playable", "==", true)
          .where("next", "==", 1)
          .get()
          .then(wait => {
            // データベースに協調が成立してゲーム開始したこと通知する
            // 最初の一回だけにしたいけど、簡単に書く方法はあるのだろうか？
            if (users.size == wait.size) {
              db.collection("rules")
                .doc("mMNTKGPxpraq8z0KnCTB")
                .update({
                  mode: users.size == wait.size,
                  start_time: new Date().getTime()
                });
            }
          });
      });
  },
  created() {
    // this.time = 180;
  },
  computed: {},
  firestore() {
    return {
      // 標準ルールを取得
      rule: db.collection("rules").doc("mMNTKGPxpraq8z0KnCTB")
    };
  },
  methods: {
    timeStart() {
      if (this.timerObj == null) {
        let self = this;
        this.timerObj = setInterval(function() {
          self.timeCount();
        }, 200);
      }
    },
    timeCount() {
      const elapsedTime = parseInt(
        (new Date().getTime() - this.$store.state.start_time) / 1000
      );
      this.gameTurn = parseInt(elapsedTime / 30);
      this.timeRemind = 30 - (elapsedTime % 30);
      console.log("Game+Time:", this.gameTurn, this.timeRemind);
    },
    gameClear() {
      // タイマーを初期化する
      console.log("Game Clear");
      this.timerObj == null;
    },
    calcValue() {
      // 指定秒数経過後に点数を計算する
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