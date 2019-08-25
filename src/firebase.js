import firebase from 'firebase/app';
import "firebase/auth";
import 'firebase/app';
import 'firebase/database';
import 'firebase/storage';

const config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

// Initialize Firebase
firebase.initializeApp(config);

const firebaseDB = firebase.database();
const firebaseMatches = firebaseDB.ref('matches');
const firebasePlayers = firebaseDB.ref('players');
const firebasePromotions = firebaseDB.ref('promotions');
const firebaseTeams = firebaseDB.ref('teams');

export {
  firebase,
  firebaseDB,
  firebaseMatches,
  firebasePlayers,
  firebasePromotions,
  firebaseTeams
}