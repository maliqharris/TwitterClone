import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, deleteUser, onAuthStateChanged, EmailAuthProvider, updatePassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const loginButton = document.getElementById('login-button');
const signupButton = document.getElementById('signup-button');
const logoutButton = document.getElementById('logout-button');
const updateProfileButton = document.getElementById('update-profile-button');
// const deleteAccountButton = document.getElementById('delete-account-button');

// Authorize login , check password and email , async fetch -----------------------------------------------------
if (loginButton) {
    loginButton.addEventListener('click', async () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = 'tweets.html';
        } catch (error) {
            console.error('Error logging in:', error);
        }
    });
}

// Create the user with the Username and email---------------------------------------------------------------------
if (signupButton) {
    signupButton.addEventListener('click', async () => {
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const username = document.getElementById('signup-username').value;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", userCredential.user.uid), { username });
            await updateProfile(userCredential.user, { displayName: username });
            window.location.href = 'tweets.html';
        } catch (error) {
            console.error('Error signing up:', error);
        }
        
    });
}

// Logs out send to login, catvh error---------------------------------------------------------------------------
if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
        try {
            await signOut(auth);
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Error logging out:', error);
        }
    });
}

// Update username as well as password, wait for type-----------------------------------------------------------
if (updateProfileButton) {
    updateProfileButton.addEventListener('click', async () => {
        const newUsername = document.getElementById('profile-username').value;
        try {
            await updateProfile(auth.currentUser, { displayName: newUsername });
            await updateDoc(doc(db, "users", auth.currentUser.uid), { username: newUsername });
            alert('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    });
}

// Deleteing the accoount, not needed commented out ------------------------------------------------------------
// if (deleteAccountButton) {
//     deleteAccountButton.addEventListener('click', async () => {
//         const user = auth.currentUser;
//         try {
//             await deleteUser(user);
//             window.location.href = 'index.html';
//         } catch (error) {
//             if (error.code === 'auth/requires-recent-login') {
//                 const password = prompt('Please enter your password for re-authentication');
//                 if (password) {
//                     const credential = EmailAuthProvider.credential(user.email, password);
//                     await signInWithEmailAndPassword(auth, user.email, password);
//                     await deleteUser(user);
//                     window.location.href = 'index.html';
//                 }
//             } else {
//                 console.error('Error deleting account:', error);
//             }
//         }
//     });
// }
// 

// ----------If not logged in, cant brute force it, - say please login------------------------------------------
onAuthStateChanged(auth, async user => {
    if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        document.getElementById('username-display').textContent = userDoc.data().username;
    } else {
        const currentPath = window.location.pathname;
        if (currentPath.includes('edit-profile.html')) {
            alert("Please login!");
            window.location.href = 'login.html';
        }
    }
});
