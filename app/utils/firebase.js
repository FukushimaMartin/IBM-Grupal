import firebase from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCACBh-97BvGzHy2x2dnbuX_jIzSDa45RI",
    authDomain: "app-clima-2f8eb.firebaseapp.com",
    projectId: "app-clima-2f8eb",
    storageBucket: "app-clima-2f8eb.appspot.com",
    messagingSenderId: "843756607029",
    appId: "1:843756607029:web:35ce15c5dcb934369e437c"
  };

export const firebaseApp = firebase.initializeApp(firebaseConfig);