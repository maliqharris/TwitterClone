import { db, auth /*, storage */ } from "./firebase.js";
import {
  addDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
// import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

const tweetContent = document.getElementById("tweet-content");
const tweetButton = document.getElementById("tweet-button");
// const tweetPhoto = document.getElementById('tweet-photo');
const tweetsList = document.getElementById("tweets-list");
const postButton = document.getElementById("post-button");
const tweetInputContainer = document.getElementById("tweet-input-container");
const overlay = document.getElementById("overlay");
const tweetsContainer = document.getElementById("tweets-container");
let lastVisibleTweet = null;
const tweetBatchSize = 10;
let isLoading = false;
let noMoreTweets = false;
// The edit wasnt bringing up current tweet, and the username would default to null when logging in and pull up the right name when you refresh
let editingTweetId = null; // Add a variable to track the tweet being edited
let currentUsername = null; // Variable to store the  user's username

// stop bruteforce snd back to login alert
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    alert("Please login!");
    window.location.href = "login.html"; // Redirect to the login page
  } else {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    currentUsername = userDoc.data().username; // Store the username
    fetchTweets();
  }
});
// edit profile button snd to edit-profile.html
const editProfileButton = document.getElementById("editProfile-button");

if (editProfileButton) {
  editProfileButton.addEventListener("click", () => {
    window.location.href = "edit-profile.html";
  });
}

// When post button is clicked tweet input container pops up as well as overlay to create the darkening effect
postButton.addEventListener("click", () => {
  tweetContent.value = ""; // Clear the tweet content when posting a new tweet
  // tweetPhoto.value = ''; // Clear the photo input when posting a new tweet
  editingTweetId = null; // Reset the editing tweet ID when posting a new tweet
  tweetInputContainer.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

// Check when clicking edit button as well
tweetButton.addEventListener("click", async () => {
  const content = tweetContent.value;
  // const photoFile = tweetPhoto.files[0];
  // let photoURL = null;

  if (content.trim() /* || photoFile */) {
    try {
      // if (photoFile) {
      //     const storageRef = ref(storage, `tweets/${auth.currentUser.uid}/${photoFile.name}`);
      //     await uploadBytes(storageRef, photoFile);
      //     photoURL = await getDownloadURL(storageRef);
      // }

      if (editingTweetId) {
        // Update the existing tweet
        const tweetRef = doc(db, "tweets", editingTweetId);
        await updateDoc(tweetRef, {
          content,
          // photoURL
        });
        // Update the tweet fr
        const tweetElement = document.getElementById(`tweet-${editingTweetId}`);
        tweetElement.querySelector(".tweet-content").textContent = content;
        // if (photoURL) {
        //     let img = tweetElement.querySelector('.tweet-image');
        //     if (!img) {
        //         img = document.createElement('img');
        //         img.classList.add('tweet-image');
        //         tweetElement.appendChild(img);
        //     }
        //     img.src = photoURL;
        // }
      } else {
        // Add a new tweet to top
        const docRef = await addDoc(collection(db, "tweets"), {
          content,
          // photoURL,
          userId: auth.currentUser.uid,
          username: currentUsername, // Use the stored username
          createdAt: new Date(),
        });

        const newTweet = {
          id: docRef.id,
          content,
          // photoURL,
          userId: auth.currentUser.uid,
          username: currentUsername, // Use the stored username
          createdAt: new Date(),
        };
        prependTweet(newTweet);
      }

      tweetContent.value = "";
      // tweetPhoto.value = '';

      tweetInputContainer.classList.add("hidden");
      overlay.classList.add("hidden");
    } catch (error) {
      console.error(error);
    }
  }
});
// dark overlay 
overlay.addEventListener("click", () => {
  tweetInputContainer.classList.add("hidden");
  overlay.classList.add("hidden");
});

async function fetchTweets() {
  if (isLoading || noMoreTweets) return;
  isLoading = true;

  const q = query(
    collection(db, "tweets"),
    orderBy("createdAt", "desc"),
    limit(tweetBatchSize)
  );
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    lastVisibleTweet = querySnapshot.docs[querySnapshot.docs.length - 1];
    await displayTweets(querySnapshot);
  } else {
    if (!noMoreTweets) {
      const noMoreTweetsMsg = document.createElement("div");
      noMoreTweetsMsg.textContent = "No more tweets";
      noMoreTweetsMsg.className = "no-more-tweets";
      tweetsList.appendChild(noMoreTweetsMsg);
      noMoreTweets = true;
    }
  }

  isLoading = false;
}

async function displayTweets(querySnapshot) {
  for (const docSnap of querySnapshot.docs) {
    const tweet = docSnap.data();
    tweet.id = docSnap.id; // so the tweet id is there
    const userDoc = await getDoc(doc(db, "users", tweet.userId));
    const username = userDoc.data().username;

    const li = createTweetElement(tweet, username);
    tweetsList.appendChild(li);
  }
}

function createTweetElement(tweet, username) {
  const li = document.createElement("li");
  li.id = `tweet-${tweet.id}`; // Add an id to the list item
  li.innerHTML = `<span class="tweet-username">${username}:</span> <span class="tweet-content">${tweet.content}</span>`;

  // if (tweet.photoURL) {
  //     const img = document.createElement('img');
  //     img.src = tweet.photoURL;
  //     img.classList.add('tweet-image');
  //     li.appendChild(img);
  // }

  if (tweet.userId === auth.currentUser.uid) {
    const buttonContainer = document.createElement("div"); 
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", async () => {
      // fetchingg the latest tweet content from the database
      const tweetRef = doc(db, "tweets", tweet.id);
      const tweetDoc = await getDoc(tweetRef);
      if (tweetDoc.exists()) {
        const latestTweet = tweetDoc.data();
        tweetContent.value = latestTweet.content;
        // tweetPhoto.value = '';
        editingTweetId = tweet.id;
        tweetInputContainer.classList.remove("hidden");
        overlay.classList.remove("hidden");
      } else {
        console.error("Tweet not found!");
      }
    });
// delete button /async wait/ remove from database .
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", async () => {
      await deleteDoc(doc(db, "tweets", tweet.id));
      li.remove();
    });

    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);
    li.appendChild(buttonContainer);
  }

  return li;
}

// This is to make the tweets load to give that infinite scroll effect
function prependTweet(tweet) {
  const li = createTweetElement(tweet, tweet.username);
  tweetsList.prepend(li);
}

// Infinite scroll
tweetsContainer.addEventListener("scroll", () => {
  if (
    tweetsContainer.scrollTop + tweetsContainer.clientHeight >=
      tweetsContainer.scrollHeight - 100 &&
    !isLoading &&
    !noMoreTweets
  ) {
    isLoading = true;

    const loadingAlert = document.createElement("div");
    loadingAlert.textContent = "Loading more tweets...";
    loadingAlert.className = "loading-alert";
    tweetsList.appendChild(loadingAlert);

    setTimeout(async () => {
      const q = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        limit(tweetBatchSize),
        startAfter(lastVisibleTweet)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        lastVisibleTweet = querySnapshot.docs[querySnapshot.docs.length - 1];
        await displayTweets(querySnapshot);
      } else {
        if (!noMoreTweets) {
          const noMoreTweetsMsg = document.createElement("div");
          noMoreTweetsMsg.textContent = "No more tweets";
          noMoreTweetsMsg.className = "no-more-tweets";
          tweetsList.appendChild(noMoreTweetsMsg);
          noMoreTweets = true;
        }
        
      }
      isLoading = false;
      tweetsList.removeChild(loadingAlert);
    }, 500);
  }
});
