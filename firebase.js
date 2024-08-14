
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
// import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
// import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";


// const firebaseConfig = {
//     apiKey: "AIzaSyDJilGhbUwHk4dJ-xXLUcZU36b-hXMv258",
//     authDomain: "twitter-daec1.firebaseapp.com",
//     projectId: "twitter-daec1",
//     storageBucket: "twitter-daec1.appspot.com",
//     messagingSenderId: "1090175444378",
//     appId: "1:1090175444378:web:37065b7b251034e00dc623"
// };


// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// export { auth, db };



// firebase.js
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
// import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
// import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";


// const firebaseConfig = {
//     apiKey: "AIzaSyDJilGhbUwHk4dJ-xXLUcZU36b-hXMv258",
//     authDomain: "twitter-daec1.firebaseapp.com",
//     projectId: "twitter-daec1",
//     storageBucket: "twitter-daec1.appspot.com",
//     messagingSenderId: "1090175444378",
//     appId: "1:1090175444378:web:37065b7b251034e00dc623"
// };

// // Initialize 
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// export { auth, db };


// Import auth and app
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

// firebase config stuff
const firebaseConfig = {
    apiKey: "AIzaSyDJilGhbUwHk4dJ-xXLUcZU36b-hXMv258",
    authDomain: "twitter-daec1.firebaseapp.com",
    projectId: "twitter-daec1",
    storageBucket: "twitter-daec1.appspot.com",
    messagingSenderId: "1090175444378",
    appId: "1:1090175444378:web:37065b7b251034e00dc623"
};

// Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
