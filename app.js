// @ts-nocheck

/* ================================
   SECTION NAVIGATION
================================ */

function showSection(section) {
    const sections = [
        "homeSection",
        "productsSection",
        "adminSection"
    ];

    sections.forEach(function (sectionId) {
        const element =
            document.getElementById(sectionId);

        if (element) {
            element.style.display =
                sectionId === section
                    ? "block"
                    : "none";
        }
    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ================================
   THEME
================================ */

function loadTheme() {
    const savedTheme =
        localStorage.getItem("novaTheme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }

    updateThemeIcon();
}


function toggleTheme() {
    document.body.classList.toggle("dark");

    const isDark =
        document.body.classList.contains("dark");

    localStorage.setItem(
        "novaTheme",
        isDark ? "dark" : "light"
    );

    updateThemeIcon();
}


function updateThemeIcon() {
    const themeToggle =
        document.getElementById("themeToggle");

    if (!themeToggle) return;

    const isDark =
        document.body.classList.contains("dark");

    themeToggle.textContent =
        isDark ? "☀️" : "🌙";
}


/* ================================
   TOAST
================================ */

function showToast(message) {
    const toast =
        document.getElementById("toast");

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(
        window.novaToastTimer
    );

    window.novaToastTimer =
        setTimeout(function () {
            toast.classList.remove("show");
        }, 2500);
}


/* ================================
   DOM READY
================================ */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* Theme */

        loadTheme();


        /* Wishlist */

        if (typeof updateWishlistCount === "function") {
            updateWishlistCount();
        }


        /* Cart */

        if (typeof updateCartUI === "function") {
            updateCartUI();
        }


        /* Products */

        if (typeof initializeProducts === "function") {
            initializeProducts();
        }


        /* ============================
           THEME BUTTON
        ============================ */

        const themeToggle =
            document.getElementById("themeToggle");

        if (themeToggle) {
            themeToggle.addEventListener(
                "click",
                toggleTheme
            );
        }


        /* ============================
           SEARCH
        ============================ */

        const searchInput =
            document.getElementById("searchInput");

        if (searchInput) {
            searchInput.addEventListener(
                "input",
                function () {

                    if (
                        typeof applyFilters ===
                        "function"
                    ) {
                        applyFilters();
                    }
                }
            );
        }


        /* ============================
           CATEGORY FILTER
        ============================ */

        const categoryFilter =
            document.getElementById(
                "categoryFilter"
            );

        if (categoryFilter) {
            categoryFilter.addEventListener(
                "change",
                function () {

                    if (
                        typeof applyFilters ===
                        "function"
                    ) {
                        applyFilters();
                    }
                }
            );
        }


        /* ============================
           SORT
        ============================ */

        const sortSelect =
            document.getElementById(
                "sortSelect"
            );

        if (sortSelect) {
            sortSelect.addEventListener(
                "change",
                function () {

                    if (
                        typeof applyFilters ===
                        "function"
                    ) {
                        applyFilters();
                    }
                }
            );
        }


        /* ============================
           PRODUCT FORM
        ============================ */

        const productForm =
            document.getElementById(
                "productForm"
            );

        if (productForm) {
            productForm.addEventListener(
                "submit",
                function (event) {

                    if (
                        typeof saveProduct ===
                        "function"
                    ) {
                        saveProduct(event);
                    }
                }
            );
        }


        /* ============================
           MODAL BACKDROPS
        ============================ */

        const authModal =
            document.getElementById(
                "authModal"
            );

        if (authModal) {
            authModal.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target ===
                        authModal
                    ) {
                        closeAuth();
                    }
                }
            );
        }


        const productModal =
            document.getElementById(
                "productModal"
            );

        if (productModal) {
            productModal.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target ===
                        productModal
                    ) {
                        closeProductModal();
                    }
                }
            );
        }


        const cartOverlay =
            document.getElementById(
                "cartOverlay"
            );

        if (cartOverlay) {
            cartOverlay.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target ===
                        cartOverlay
                    ) {
                        closeCart();
                    }
                }
            );
        }


        /* ============================
           ESCAPE KEY
        ============================ */

        document.addEventListener(
            "keydown",
            function (event) {

                if (event.key !== "Escape") {
                    return;
                }

                if (
                    typeof closeCart ===
                    "function"
                ) {
                    closeCart();
                }

                if (
                    typeof closeAuth ===
                    "function"
                ) {
                    closeAuth();
                }

                if (
                    typeof closeProductModal ===
                    "function"
                ) {
                    closeProductModal();
                }
            }
        );

    }
);