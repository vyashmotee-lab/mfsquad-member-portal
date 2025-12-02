// Firebase Config + Auth + Auto Member Record Creator

// TODO: paste your actual firebase config keys here
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_MSG",
  appId: "YOUR_APPID"
};

// Init
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Automatically create document when user logs in first time
auth.onAuthStateChanged(async (user) => {
  const userEmailSpan = document.getElementById("currentUserEmail");

  if (!user) {
    window.location.href = "/login.html"; 
    return;
  }

  if (userEmailSpan) {
    userEmailSpan.innerText = user.email;
  }

  const docRef = db.collection("members").doc(user.uid);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    await docRef.set({
      email: user.email,
      fullName: "",
      role: "member",
      isAdmin: false,
      joinedOn: new Date(),
      profilePhotoURL: "",
    });
  }
});

// Logout
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await auth.signOut();
  window.location.href = "/login.html";
});
