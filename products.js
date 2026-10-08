// @ts-nocheck

let products = [];
let filteredProducts = [];

let wishlist =
    JSON.parse(localStorage.getItem("novaWishlist")) || [];


/* ================================
   INITIALIZE PRODUCTS
================================ */

async function initializeProducts() {
    showLoading();

    try {
        const savedProducts =
            JSON.parse(localStorage.getItem("novaProducts"));

        if (Array.isArray(savedProducts) && savedProducts.length > 0) {
            products = savedProducts;
        } else {
            products = await fetchProducts();
            saveProducts();
        }

        filteredProducts = [...products];

        createCategories();
        renderProducts(filteredProducts);
        renderFeatured();
        renderAdminTable();
        updateProductStats();
        updateWishlistCount();

    } catch (error) {
        console.error("Product initialization error:", error);

        products = [];
        filteredProducts = [];

        renderProducts([]);
        showToast("Unable to load products.");
    }

    hideLoading();
}


/* ================================
   SAVE PRODUCTS
================================ */

function saveProducts() {
    localStorage.setItem(
        "novaProducts",
        JSON.stringify(products)
    );
}


/* ================================
   CATEGORY FILTER
================================ */

function createCategories() {
    const categoryFilter =
        document.getElementById("categoryFilter");

    if (!categoryFilter) return;

    const categories = [
        ...new Set(
            products.map(function (product) {
                return product.category;
            })
        )
    ];

    categoryFilter.innerHTML =
        '<option value="all">All Categories</option>';

    categories.forEach(function (category) {
        const option = document.createElement("option");

        option.value = category;
        option.textContent = formatCategory(category);

        categoryFilter.appendChild(option);
    });
}


function formatCategory(category) {
    if (!category) return "Other";

    return category
        .replace(/['"]/g, "")
        .replace(/\b\w/g, function (letter) {
            return letter.toUpperCase();
        });
}


/* ================================
   RENDER PRODUCTS
================================ */

function renderProducts(list) {
    const grid =
        document.getElementById("productGrid");

    const emptyState =
        document.getElementById("emptyState");

    if (!grid) return;

    grid.innerHTML = "";

    if (!list || list.length === 0) {
        if (emptyState) {
            emptyState.style.display = "block";
        }

        return;
    }

    if (emptyState) {
        emptyState.style.display = "none";
    }

    list.forEach(function (product) {
        grid.insertAdjacentHTML(
            "beforeend",
            createProductCard(product)
        );
    });
}


/* ================================
   PRODUCT CARD
================================ */

function createProductCard(product) {
    const isWishlisted =
        wishlist.includes(product.id);

    const rating =
        product.rating && product.rating.rate
            ? Number(product.rating.rate).toFixed(1)
            : "4.5";

    const image =
        product.image ||
        "https://via.placeholder.com/400x400?text=Product";

    return `
        <article class="product-card">

            <div class="product-image-wrap">

                <img
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(product.title || "Product")}"
                    class="product-image"
                    loading="lazy"
                    onerror="this.src='https://via.placeholder.com/400x400?text=Product'"
                >

                <button
                    class="wishlist-btn ${isWishlisted ? "active" : ""}"
                    onclick="toggleWishlist(${product.id})"
                    aria-label="Add to wishlist"
                >
                    ${isWishlisted ? "♥" : "♡"}
                </button>

            </div>

            <div class="product-content">

                <span class="product-category">
                    ${escapeHTML(
                        formatCategory(product.category)
                    )}
                </span>

                <h3 class="product-title">
                    ${escapeHTML(product.title || "Untitled Product")}
                </h3>

                <div class="product-rating">
                    <span>★</span>
                    <strong>${rating}</strong>
                </div>

                <div class="product-bottom">

                    <strong class="product-price">
                        ${convertPrice(product.price)}
                    </strong>

                    <button
                        class="add-cart-btn"
                        onclick="addToCart(${product.id})"
                    >
                        Add
                    </button>

                </div>

                <button
                    class="details-btn"
                    onclick="openProductModal(${product.id}, false)"
                >
                    View Details
                </button>

            </div>

        </article>
    `;
}


/* ================================
   FEATURED PRODUCTS
================================ */

function renderFeatured() {
    const grid =
        document.getElementById("featuredGrid");

    if (!grid) return;

    grid.innerHTML = "";

    const featured = products.slice(0, 4);

    featured.forEach(function (product) {
        grid.insertAdjacentHTML(
            "beforeend",
            createProductCard(product)
        );
    });
}


/* ================================
   FILTER + SEARCH + SORT
================================ */

function applyFilters() {
    const searchInput =
        document.getElementById("searchInput");

    const categoryFilter =
        document.getElementById("categoryFilter");

    const sortSelect =
        document.getElementById("sortSelect");

    const searchTerm =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

    const category =
        categoryFilter
            ? categoryFilter.value
            : "all";

    const sort =
        sortSelect
            ? sortSelect.value
            : "default";

    filteredProducts = products.filter(
        function (product) {

            const title =
                String(product.title || "").toLowerCase();

            const productCategory =
                String(product.category || "").toLowerCase();

            const matchesSearch =
                title.includes(searchTerm);

            const matchesCategory =
                category === "all" ||
                product.category === category;

            return (
                matchesSearch &&
                matchesCategory
            );
        }
    );


    /* Sorting */

    if (sort === "price-low") {
        filteredProducts.sort(function (a, b) {
            return Number(a.price) - Number(b.price);
        });
    }

    if (sort === "price-high") {
        filteredProducts.sort(function (a, b) {
            return Number(b.price) - Number(a.price);
        });
    }

    if (sort === "name") {
        filteredProducts.sort(function (a, b) {
            return String(a.title || "")
                .localeCompare(
                    String(b.title || "")
                );
        });
    }

    if (sort === "rating") {
        filteredProducts.sort(function (a, b) {
            const ratingA =
                a.rating && a.rating.rate
                    ? Number(a.rating.rate)
                    : 0;

            const ratingB =
                b.rating && b.rating.rate
                    ? Number(b.rating.rate)
                    : 0;

            return ratingB - ratingA;
        });
    }

    renderProducts(filteredProducts);
}


/* ================================
   WISHLIST
================================ */

function toggleWishlist(id) {
    id = Number(id);

    const index = wishlist.indexOf(id);

    if (index === -1) {
        wishlist.push(id);
        showToast("Added to wishlist ♥");
    } else {
        wishlist.splice(index, 1);
        showToast("Removed from wishlist");
    }

    localStorage.setItem(
        "novaWishlist",
        JSON.stringify(wishlist)
    );

    updateWishlistCount();

    renderProducts(filteredProducts);
    renderFeatured();
}


function showWishlist() {
    const wishlistProducts =
        products.filter(function (product) {
            return wishlist.includes(
                Number(product.id)
            );
        });

    filteredProducts = wishlistProducts;

    renderProducts(wishlistProducts);

    const searchInput =
        document.getElementById("searchInput");

    if (searchInput) {
        searchInput.value = "";
    }

    const categoryFilter =
        document.getElementById("categoryFilter");

    if (categoryFilter) {
        categoryFilter.value = "all";
    }

    const sortSelect =
        document.getElementById("sortSelect");

    if (sortSelect) {
        sortSelect.value = "default";
    }

    showSection("products");

    if (wishlistProducts.length === 0) {
        showToast("Your wishlist is empty.");
    }
}


function updateWishlistCount() {
    const count =
        document.getElementById("wishlistCount");

    if (!count) return;

    count.textContent = wishlist.length;
}


/* ================================
   PRODUCT MODAL
================================ */

function openProductModal(id, isEdit) {
    const modal =
        document.getElementById("productModal");

    const form =
        document.getElementById("productForm");

    if (!modal || !form) return;

    const product =
        products.find(function (item) {
            return Number(item.id) === Number(id);
        });

    if (isEdit && !product) {
        return;
    }

    const editId =
        document.getElementById("editProductId");

    const title =
        document.getElementById("productTitle");

    const price =
        document.getElementById("productPrice");

    const category =
        document.getElementById("productCategory");

    const rating =
        document.getElementById("productRating");

    const image =
        document.getElementById("productImage");

    const description =
        document.getElementById("productDescription");

    if (isEdit && product) {

        if (editId) {
            editId.value = product.id;
        }

        if (title) {
            title.value = product.title || "";
        }

        if (price) {
            price.value = product.price || "";
        }

        if (category) {
            category.value = product.category || "";
        }

        if (rating) {
            rating.value =
                product.rating && product.rating.rate
                    ? product.rating.rate
                    : 4.5;
        }

        if (image) {
            image.value = product.image || "";
        }

        if (description) {
            description.value =
                product.description || "";
        }

    } else {

        form.reset();

        if (editId) {
            editId.value = "";
        }

        if (rating) {
            rating.value = "4.5";
        }
    }

    modal.classList.add("active");
}


function closeProductModal() {
    const modal =
        document.getElementById("productModal");

    if (!modal) return;

    modal.classList.remove("active");
}


/* ================================
   SAVE / UPDATE PRODUCT
================================ */

function saveProduct(event) {
    event.preventDefault();

    const editId =
        document.getElementById("editProductId");

    const title =
        document.getElementById("productTitle");

    const price =
        document.getElementById("productPrice");

    const category =
        document.getElementById("productCategory");

    const rating =
        document.getElementById("productRating");

    const image =
        document.getElementById("productImage");

    const description =
        document.getElementById("productDescription");

    if (!title || !price || !category) {
        return;
    }

    const titleValue =
        title.value.trim();

    const priceValue =
        Number(price.value);

    const categoryValue =
        category.value.trim();

    const ratingValue =
        Number(rating ? rating.value : 4.5);

    const imageValue =
        image
            ? image.value.trim()
            : "";

    const descriptionValue =
        description
            ? description.value.trim()
            : "";

    if (!titleValue) {
        showToast("Enter a product name.");
        return;
    }

    if (!priceValue || priceValue < 0) {
        showToast("Enter a valid price.");
        return;
    }

    if (!categoryValue) {
        showToast("Enter a category.");
        return;
    }


    /* Update existing product */

    if (editId && editId.value) {

        const id =
            Number(editId.value);

        const index =
            products.findIndex(function (product) {
                return Number(product.id) === id;
            });

        if (index !== -1) {

            products[index] = {
                ...products[index],

                title: titleValue,

                price: priceValue,

                category: categoryValue,

                image:
                    imageValue ||
                    "https://via.placeholder.com/400x400?text=Product",

                rating: {
                    rate:
                        ratingValue || 4.5,
                    count:
                        products[index].rating &&
                        products[index].rating.count
                            ? products[index].rating.count
                            : 0
                },

                description:
                    descriptionValue ||
                    "A quality product from NovaStore."
            };

            showToast("Product updated successfully.");
        }

    } else {

        /* Create new product */

        const newProduct = {

            id: Date.now(),

            title: titleValue,

            price: priceValue,

            category: categoryValue,

            image:
                imageValue ||
                "https://via.placeholder.com/400x400?text=Product",

            rating: {
                rate:
                    ratingValue || 4.5,
                count: 0
            },

            description:
                descriptionValue ||
                "A quality product from NovaStore."
        };

        products.push(newProduct);

        showToast("Product added successfully.");
    }

    saveProducts();

    filteredProducts = [...products];

    createCategories();
    renderProducts(filteredProducts);
    renderFeatured();
    renderAdminTable();
    updateProductStats();

    closeProductModal();
}


/* ================================
   DELETE PRODUCT
================================ */

function deleteProduct(id) {
    id = Number(id);

    const product =
        products.find(function (item) {
            return Number(item.id) === id;
        });

    if (!product) return;

    const confirmed =
        confirm(
            `Delete "${product.title}"?`
        );

    if (!confirmed) {
        return;
    }

    products =
        products.filter(function (item) {
            return Number(item.id) !== id;
        });

    wishlist =
        wishlist.filter(function (item) {
            return Number(item) !== id;
        });

    localStorage.setItem(
        "novaWishlist",
        JSON.stringify(wishlist)
    );

    saveProducts();

    filteredProducts = [...products];

    createCategories();
    renderProducts(filteredProducts);
    renderFeatured();
    renderAdminTable();
    updateProductStats();
    updateWishlistCount();

    showToast("Product deleted.");
}


/* ================================
   ADMIN TABLE
================================ */

function renderAdminTable() {
    const table =
        document.getElementById("adminTable");

    if (!table) return;

    table.innerHTML = "";

    if (products.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    No products available.
                </td>
            </tr>
        `;

        return;
    }

    products.forEach(function (product) {

        const rating =
            product.rating &&
            product.rating.rate
                ? Number(product.rating.rate).toFixed(1)
                : "4.5";

        table.insertAdjacentHTML(
            "beforeend",
            `
            <tr>

                <td>
                    <img
                        src="${escapeHTML(
                            product.image || ""
                        )}"
                        alt="Product"
                        class="admin-product-image"
                        onerror="this.src='https://via.placeholder.com/60x60?text=Product'"
                    >
                </td>

                <td>
                    ${escapeHTML(
                        product.title || "Untitled"
                    )}
                </td>

                <td>
                    ${convertPrice(product.price)}
                </td>

                <td>
                    ${rating} ★
                </td>

                <td>

                    <button
                        class="admin-edit-btn"
                        onclick="openProductModal(${product.id}, true)"
                    >
                        Edit
                    </button>

                    <button
                        class="admin-delete-btn"
                        onclick="deleteProduct(${product.id})"
                    >
                        Delete
                    </button>

                </td>

            </tr>
            `
        );
    });
}


/* ================================
   PRODUCT STATISTICS
================================ */

function updateProductStats() {

    const statProducts =
        document.getElementById("statProducts");

    const statCart =
        document.getElementById("statCart");

    const statWishlist =
        document.getElementById("statWishlist");

    const statUser =
        document.getElementById("statUser");


    if (statProducts) {
        statProducts.textContent =
            products.length;
    }


    if (statCart) {

        const cart =
            JSON.parse(
                localStorage.getItem("novaCart")
            ) || [];

        const cartCount =
            cart.reduce(
                function (total, item) {
                    return total +
                        Number(item.quantity || 0);
                },
                0
            );

        statCart.textContent =
            cartCount;
    }


    if (statWishlist) {
        statWishlist.textContent =
            wishlist.length;
    }


    if (statUser) {

        const user =
            JSON.parse(
                localStorage.getItem("novaUser")
            );

        statUser.textContent =
            user
                ? user.name || user.email
                : "Guest";
    }
}


/* ================================
   PRICE FORMAT
================================ */

function convertPrice(price) {
    const numericPrice =
        Number(price);

    if (Number.isNaN(numericPrice)) {
        return "₹0";
    }

    /*
       Fake Store API uses USD-style prices.
       Convert approximately to INR.
    */

    const rupees =
        numericPrice * 83;

    return rupees.toLocaleString(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    );
}


/* ================================
   HTML ESCAPE
================================ */

function escapeHTML(value) {

    if (value === null ||
        value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* ================================
   LOADING
================================ */

function showLoading() {

    const loading =
        document.getElementById("loading");

    const grid =
        document.getElementById("productGrid");

    if (loading) {
        loading.style.display = "grid";
    }

    if (grid) {
        grid.style.display = "none";
    }
}


function hideLoading() {

    const loading =
        document.getElementById("loading");

    const grid =
        document.getElementById("productGrid");

    if (loading) {
        loading.style.display = "none";
    }

    if (grid) {
        grid.style.display = "grid";
    }
}