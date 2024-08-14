
import { auth, db } from './firebase.js';
import { updateProfile, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
// Gets you back to tweeets-----------------------------------------------------------------
document.getElementById('back-button').addEventListener('click', () => {
    window.location.href = 'tweets.html';
});
// get user and email to edit-----------------------------------------------------------------
async function loadUserProfile() {
    if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        const userData = userDoc.data();
        document.getElementById('profile-username').value = userData.username;
        document.getElementById('profile-email').value = userData.email;
    }
}
// alert and update username-----------------------------------------------------------------
document.getElementById('update-profile-button').addEventListener('click', async () => {
    const username = document.getElementById('profile-username').value;
    if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: username });
        await updateDoc(doc(db, "users", auth.currentUser.uid), { username });
        alert('Profile updated');
    }
});
// authorize/ change password / reauthorize / and alert
document.getElementById('change-password-button').addEventListener('click', async () => {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;

    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, currentPassword);

    try {
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        alert('Password updated');
    } catch (error) {
        console.error(error);
        alert("Password not  match!");
    }
});
// gets current data on user
loadUserProfile();
