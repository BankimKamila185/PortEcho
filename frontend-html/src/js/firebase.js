// Firebase configuration and initialization
const firebaseConfig = {
  apiKey: "AIzaSyDxKkJicZZttdCJ4TmGpYvqmqek5W7yqZ8",
  authDomain: "portecho-demo.firebaseapp.com",
  projectId: "portecho-demo",
  storageBucket: "portecho-demo.appspot.com",
  messagingSenderId: "585403259773",
  appId: "1:585403259773:web:69ed047e89a4e0a5ab5aee"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export Firebase services
const db = firebase.firestore();
const auth = firebase.auth();

export { firebase, db, auth };