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
// ==========================
// LOGIN / LOGOUT FUNCTIONS
// ==========================

// Handle login form submission
async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const errorBox = document.getElementById("loginError");

  if (errorBox) errorBox.textContent = "";

  try {
    await auth.signInWithEmailAndPassword(email, password);
    // onAuthStateChanged in this file will move the user to index.html
  } catch (err) {
    console.error(err);
    if (errorBox) errorBox.textContent = err.message;
  }
}

// Handle registration (create new member account)
async function handleRegister(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const errorBox = document.getElementById("loginError");

  if (errorBox) errorBox.textContent = "";

  try {
    // 1) Create auth user
    const cred = await auth.createUserWithEmailAndPassword(email, password);
    const user = cred.user;

    // 2) Create Firestore member document
    await db.collection("members").doc(user.uid).set({
      email: user.email,
      role: "member",
      isAdmin: false,
      joinedOn: firebase.firestore.FieldValue.serverTimestamp()
    });

    // User will now be considered logged in → onAuthStateChanged will run
  } catch (err) {
    console.error(err);
    if (errorBox) errorBox.textContent = err.message;
  }
}

// Logout helper (for the top-right logout button)
async function logout() {
  await auth.signOut();
}
Add login / register functions
