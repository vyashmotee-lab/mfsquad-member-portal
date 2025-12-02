// Firebase Config + Auth + Auto Member Record Creator

// TODO: paste your actual firebase config keys here
const firebaseConfig = {
apiKey: "AIzaSyDal4qdGUMs5M2vOWc_0SlJMjAVRfBlDtk",
  authDomain: "mfsquad-ea7df.firebaseapp.com",
  projectId: "mfsquad-ea7df",
  storageBucket: "mfsquad-ea7df.firebasestorage.app",
  messagingSenderId: "871834118204",
  appId: "1:871834118204:web:7f7bb9f37410a88f7efb39",
  measurementId: "G-3EKLRLNMXQ"
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
