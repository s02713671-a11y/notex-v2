// =========================================================
// NOTEX AUTHENTICATION
// =========================================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


// ==================== FIREBASE CONFIG ====================

const firebaseConfig = {
    apiKey: "AIzaSyBJwpmz-jhUIjhGtppjMr5lpoHPPb3YAHI",
    authDomain: "noxi-fd090.firebaseapp.com",
    projectId: "noxi-fd090",
    storageBucket: "noxi-fd090.firebasestorage.app",
    messagingSenderId: "417528220149",
    appId: "1:417528220149:web:21125c4001b7a5257438bc",
    measurementId: "G-970WVZZ8GC"
};


// ==================== FIREBASE INIT ====================

const app =
    initializeApp(firebaseConfig);

const auth =
    getAuth(app);


// ==================== LOGOUT ====================

const logoutBtn =
    document.getElementById("notexLogoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async function () {

            try {

                await signOut(auth);

                window.location.href = "/";

            } catch (error) {

                console.error(
                    "NoteX Logout Error:",
                    error
                );

                alert(
                    "Logout nahi ho paya. Dobara try karo."
                );

            }

        }
    );

}

// ==================== NOTEX LOGIN PROTECTION ====================

onAuthStateChanged(auth, function (user) {

    const currentPath =
        window.location.pathname;

    if (!user && currentPath === "/notex") {

        window.location.href = "/";

    }

});