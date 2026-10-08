// @ts-nocheck

let authMode = "login";

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("novaUser")) || null;
}

function saveUser(user) {
    localStorage.setItem("novaUser", JSON.stringify(user));
    updateAuthUI();
}

function logoutUser() {
    localStorage.removeItem("novaUser");
    updateAuthUI();
    showToast("Logged out successfully.");
}

function updateAuthUI() {
    const authButton = document.getElementById("authButton");
    const currentUser = getCurrentUser();

    if (!authButton) return;

    if (currentUser) {
        authButton.textContent = "Logout";
        authButton.onclick = logoutUser;
    } else {
        authButton.textContent = "Login";
        authButton.onclick = openAuth;
    }

    const statUser = document.getElementById("statUser");

    if (statUser) {
        statUser.textContent = currentUser
            ? currentUser.name || currentUser.email
            : "Guest";
    }
}

function openAuth() {
    const modal = document.getElementById("authModal");

    if (!modal) return;

    modal.classList.add("active");

    const emailInput = document.getElementById("emailInput");

    if (emailInput) {
        emailInput.focus();
    }
}

function closeAuth() {
    const modal = document.getElementById("authModal");

    if (!modal) return;

    modal.classList.remove("active");
}

function toggleAuthMode() {
    authMode = authMode === "login" ? "register" : "login";

    const title = document.getElementById("authTitle");
    const submitButton = document.getElementById("authSubmit");
    const switchButton = document.getElementById("switchAuth");
    const nameField = document.getElementById("nameField");

    if (authMode === "register") {
        if (title) title.textContent = "Create Account";
        if (submitButton) submitButton.textContent = "Register";
        if (switchButton) {
            switchButton.textContent = "Already have an account? Login";
        }

        if (nameField) {
            nameField.style.display = "block";
        }
    } else {
        if (title) title.textContent = "Welcome Back";
        if (submitButton) submitButton.textContent = "Login";
        if (switchButton) {
            switchButton.textContent = "Don't have an account? Register";
        }

        if (nameField) {
            nameField.style.display = "none";
        }
    }
}

function setAuthMode(mode) {
    authMode = mode === "register" ? "register" : "login";
    toggleAuthMode();
}

function handleAuth(event) {
    event.preventDefault();

    const nameInput = document.getElementById("nameInput");
    const emailInput = document.getElementById("emailInput");
    const passwordInput = document.getElementById("passwordInput");

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value.trim() : "";

    if (!email || !password) {
        showToast("Please enter email and password.");
        return;
    }

    if (authMode === "register" && !name) {
        showToast("Please enter your name.");
        return;
    }

    if (password.length < 4) {
        showToast("Password must contain at least 4 characters.");
        return;
    }

    const user = {
        name: name || email.split("@")[0],
        email: email,
        loggedIn: true
    };

    saveUser(user);

    closeAuth();

    if (authMode === "register") {
        showToast("Account created successfully!");
    } else {
        showToast("Login successful!");
    }

    const form = document.getElementById("authForm");

    if (form) {
        form.reset();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const authForm = document.getElementById("authForm");
    const switchButton = document.getElementById("switchAuth");

    if (authForm) {
        authForm.addEventListener("submit", handleAuth);
    }

    if (switchButton) {
        switchButton.addEventListener("click", toggleAuthMode);
    }

    updateAuthUI();
    setAuthMode("login");
});