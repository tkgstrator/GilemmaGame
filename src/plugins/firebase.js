import Vue from 'vue'
import { firestorePlugin } from 'vuefire'
import firebase from 'firebase/app';
import 'firebase/firestore';

Vue.use(firestorePlugin)

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDLtTk6gdcnZOcNfGv-TqH0422deqnOq3Y",
    authDomain: "dilemmagame-608cc.firebaseapp.com",
    databaseURL: "https://dilemmagame-608cc.firebaseio.com",
    projectId: "dilemmagame-608cc",
    storageBucket: "dilemmagame-608cc.appspot.com",
    messagingSenderId: "897994908936",
    appId: "1:897994908936:web:43349f53639b4afc71b8bd",
    measurementId: "G-QHMXKLB8EQ"

});

export const db = firebaseApp.firestore();