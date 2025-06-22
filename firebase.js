const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.database();

