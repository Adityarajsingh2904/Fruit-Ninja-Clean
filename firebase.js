const firebaseConfig = window.FIREBASE_CONFIG || {
  apiKey: "AIzaSyAw2CIQwGddayi1XUY2Qlc7zZFB3hVburY",
  authDomain: "fruit-ninja-cb70e.firebaseapp.com",
  databaseURL: "https://fruit-ninja-cb70e-default-rtdb.firebaseio.com",
  projectId: "fruit-ninja-cb70e",
  storageBucket: "fruit-ninja-cb70e.appspot.com",
  messagingSenderId: "58196438037",
  appId: "1:58196438037:web:8930f8457c363fd472b21c",
  measurementId: "G-E3MST60L29"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.database();
