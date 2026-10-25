// =========================================================
// NOXI LOGIN — FIREBASE AUTHENTICATION
// =========================================================


// =========================================================
// FIREBASE IMPORTS
// =========================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


// =========================================================
// FIREBASE CONFIG
// =========================================================

const firebaseConfig = {

    apiKey: "AIzaSyBJwpmz-jhUIjhGtppjMr5lpoHPPb3YAHI",

    authDomain: "noxi-fd090.firebaseapp.com",

    projectId: "noxi-fd090",

    storageBucket: "noxi-fd090.firebasestorage.app",

    messagingSenderId: "417528220149",

    appId: "1:417528220149:web:21125c4001b7a5257438bc",

    measurementId: "G-970WVZZ8GC"
};


// =========================================================
// INITIALIZE FIREBASE
// =========================================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


// =========================================================
// ELEMENTS
// =========================================================

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const loginBtn =
    document.getElementById("loginBtn");

const signupBtn =
    document.getElementById("signupBtn");

const loginStatus =
    document.getElementById("loginStatus");


// =========================================================
// STATUS MESSAGE
// =========================================================

function showStatus(message) {

    loginStatus.textContent = message;
}


// =========================================================
// LOGIN
// =========================================================

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;


    if (!email || !password) {

        showStatus(
            "Email aur password enter karo."
        );

        return;
    }


    loginBtn.disabled = true;

    loginBtn.textContent = "LOGGING IN...";

    showStatus("");


    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );


        // ==================== SUCCESS ====================

        window.location.href = "/noxi";


    } catch (error) {

        console.error(
            "Login Error:",
            error
        );

        showStatus(
            getFirebaseErrorMessage(error)
        );

    } finally {

        loginBtn.disabled = false;

        loginBtn.textContent = "LOGIN";
    }

});


// =========================================================
// CREATE ACCOUNT
// =========================================================

signupBtn.addEventListener("click", async () => {

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;


    if (!email || !password) {

        showStatus(
            "Account banane ke liye email aur password enter karo."
        );

        return;
    }


    signupBtn.disabled = true;

    signupBtn.textContent = "Creating...";

    showStatus("");


    try {

        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );


        // ==================== ACCOUNT CREATED ====================

        showStatus(
            "Account created! Noxi open ho raha hai..."
        );


        setTimeout(() => {

            window.location.href = "/noxi";

        }, 700);


    } catch (error) {

        console.error(
            "Signup Error:",
            error
        );

        showStatus(
            getFirebaseErrorMessage(error)
        );

    } finally {

        signupBtn.disabled = false;

        signupBtn.textContent =
            "Create account";
    }

});


// =========================================================
// FIREBASE ERROR HANDLER
// =========================================================

function getFirebaseErrorMessage(error) {

    switch (error.code) {

        case "auth/invalid-credential":
            return "Email ya password galat hai.";

        case "auth/invalid-email":
            return "Email address sahi nahi hai.";

        case "auth/email-already-in-use":
            return "Is email se account already bana hua hai.";

        case "auth/weak-password":
            return "Password thoda strong rakho.";

        case "auth/user-not-found":
            return "Is email se account nahi mila.";

        case "auth/wrong-password":
            return "Password galat hai.";

        case "auth/too-many-requests":
            return "Bahut attempts ho gaye. Thodi der baad try karo.";

        default:
            return "Kuch problem hui. Dobara try karo.";
    }
}
