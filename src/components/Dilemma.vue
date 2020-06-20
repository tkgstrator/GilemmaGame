<template>
  <v-list three-line>
    <template v-for="(user, index) in users">
      <v-list-item
          :key="index"
          value
      >
        <!-- <v-list-item-avatar>
          <img :src="comment.avatar">
        </v-list-item-avatar> -->

        <v-list-item-content>
          <v-list-item-subtitle class="text--primary subheading">{{user.value}}</v-list-item-subtitle>
          <v-list-item-subtitle>
            {{user.value}}
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action>
        </v-list-item-action>
      </v-list-item>
      <v-divider :key="user.id"></v-divider>
    </template>
  </v-list>
</template>

<script>
  import {db} from '../plugins/firebase';

  export default {
    name: "Dilemma",
    data: () => ({
      users: [],
    }),
    firestore() {
      return {
        // firestoreのcommentsコレクションを参照
        users: db.collection('users').orderBy('value')
      }
    },
  }
</script>