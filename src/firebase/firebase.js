import firebase from 'firebase/app';
import 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAF2vIPr6RYFUuWcfbBKXo1C0GBl3jsOlQ",
    authDomain: "weatheryouandi.firebaseapp.com",
    databaseURL: "https://weatheryouandi.firebaseio.com",
    projectId: "weatheryouandi",
    storageBucket: "weatheryouandi.appspot.com",
    messagingSenderId: "400247724525",
    appId: "1:400247724525:web:f7517e53193c63e38e2fe4",
    measurementId: "G-RKNMX4JK3P"
  };

  firebase.initializeApp(firebaseConfig);

  const firestore = new firebase.firestore();

  export {firestore};