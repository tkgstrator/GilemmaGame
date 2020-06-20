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
export default {
  // ここで扱う情報一覧
  data() {
    return {
      user: {},
    };
  },
  created() {
    // 状態が変化したときに読み込む
    firebase.auth().onAuthStateChanged((user) => {
      this.user = user ? user : {};
    });
  },
  methods: {
    signIn() {
      const provider = new firebase.auth.TwitterAuthProvider();
      firebase.auth().signInWithPopup(provider);
    },
    signOut() {
      firebase.auth().signOut();
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
