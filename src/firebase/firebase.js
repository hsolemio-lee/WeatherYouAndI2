import firebase from 'firebase';


class Fire {
  constructor() {
    this.init();
  }

  init = () => {
    if(!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }

  send = messages => {
    messages.forEach(item => {
      const message = {
        text: item.text,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: item.user
      }
  
      this.db.push(message);
    })
  }

  parse = message => {
    const {user, text, timestamp} = message.val();
    const {key: _id} = message;
    const createdAt = new Date(timestamp);

    return {
      _id,
      createdAt,
      text,
      user
    }
  }

  get = callback => {
    this.db.on('child_added', snapshot => callback(this.parse(snapshot)));
  }

  off() {
    this.db.off();
  }
  
  get db() {
    return firebase.database().ref('messages');
  }  

}
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

export default new Fire();

export const firestore = new firebase.firestore();
