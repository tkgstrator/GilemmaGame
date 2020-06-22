<template>
  <div id="twitter-signin">
    <div v-if="this.$store.state.hash" key="login">
      <li class="signout" @click="signOut">ゲームから離脱する</li>
    </div>
    <div v-else key="logout">
      <li class="signin" @click="signIn">ゲームに参加する</li>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import { db } from "../plugins/firebase";

export default {
  // ここで扱う情報一覧
  data() {
    return {
      vuid: null,
      user: {}, // ツイッターのログイン情報
      players: [] // ゲームに参加しているプレイヤー情報
    };
  },
  created() {
    // 状態が変化したときに読み込む
    firebase.auth().onAuthStateChanged(user => {
      this.user = user ? user : {};
      if (this.user.uid != this.$store.state.uid) {
        const crypto = require("crypto");
        const date = new Date().getTime().toString();
        // const date = this.$store.state.hash;
        const hash = crypto
          .createHash("sha256")
          .update(date, "utf8")
          .digest("hex");
        db.collection("users")
          .doc(user.uid)
          .set(
            {
              name: user.displayName,
              hash: hash,
              photo: user.photoURL,
              prev: null,
              next: null,
              value: 0,
              playable: true
            },
            { merge: true }
          );
        this.$store.state.uid = this.user.uid; // ログイン時に全コンポーネントにuidを共有
        this.$store.state.hash = hash; // ログイン時に全コンポーネントにhashを共有
      }
    });
  },
  methods: {
    signIn() {
      // サインイン
      if (this.$store.state.uid == null) {
        const provider = new firebase.auth.TwitterAuthProvider();
        firebase.auth().signInWithPopup(provider);
      } else {
        // 部屋に入室した場合、現在時刻から新たなハッシュを作成
        const crypto = require("crypto");
        const date = new Date().getTime().toString();
        // const date = this.$store.state.hash;
        const hash = crypto
          .createHash("sha256")
          .update(date, "utf8")
          .digest("hex");
        console.log("Calc New Hash:" + date + "=>" + hash);
        this.$store.state.hash = hash;

        // 初期化した状態で入室する
        db.collection("users")
          .doc(this.user.uid)
          .set(
            { hash: hash, playable: true, value: 0, prev: null, next: null },
            { merge: true }
          );
      }
    },
    signOut() {
      // サインアウトではなく、単純にPlayableをオフにアップデートすればよい
      this.$store.state.hash = null;
      db.collection("users")
        .doc(this.user.uid)
        .update({ playable: false });
      // firebase.auth().signOut();
    },
    firestore() {
      return {
        players: db.collection("users").where("playable", "==", true)
      };
    }
  }
};
</script>

<style>
#twitter-signin {
  display: block;
  margin: 0 auto;
}

.signin,
.signout {
  display: inline-block;
  /* text-align: center; */
  margin: 0 auto;
  font-family: "hakidame";
  font-size: 28px;
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

.signin:hover {
  background: red;
  color: white;
}
</style>
