<template>
  <div id="twitter-signin">
    <div v-if="user.uid" key="login">
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
      user: {}, // ツイッターのログイン情報
      players: [], // ゲームに参加しているプレイヤー情報
    };
  },
  created() {
    // 状態が変化したときに読み込む
    firebase.auth().onAuthStateChanged((user) => {
      this.user = user ? user : {};
      if (this.user.uid) {
        console.log(user);
        const crypto = require("crypto");
        const hash = crypto
          .createHash("sha256")
          .update(user.uid, "utf8")
          .digest("hex");
        // db.collection("users")
        //   .doc()
        //   .set({
        //     name: user.displayName,
        //     hash: hash,
        //     photo: user.photoURL,
        //     prev: null,
        //     next: null,
        //     value: 0,
        //     playable: true,
        //   });
        db.collection("users")
          .doc(user.uid)
          .set(
            {
              name: user.displayName,
              hash: hash,
              photo: user.photoURL,
              prev: null,
              next: null,
              // value: 0,
              playable: true,
            },
            { merge: true }
          );
      }
    });
  },
  methods: {
    signIn() {
      const provider = new firebase.auth.TwitterAuthProvider();
      firebase.auth().signInWithPopup(provider);
    },
    signOut() {
      db.collection("users")
        .doc(this.user.uid)
        .set({});
      firebase.auth().signOut();
    },
    firestore() {
      return {
        players: db.collection("users"),
      };
    },
  },
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
