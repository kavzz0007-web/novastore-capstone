// @ts-nocheck

const API_URL = "https://fakestoreapi.com/products";

const FALLBACK_PRODUCTS = [
    {
        id: 101,
        title: "Premium Wireless Headphones",
        price: 2999,
        category: "electronics",
        image: "https://via.placeholder.com/400x400?text=Headphones",
        rating: {
            rate: 4.8,
            count: 120
        },
        description: "Premium wireless headphones with clear sound."
    },
    {
        id: 102,
        title: "Smart Watch",
        price: 2499,
        category: "electronics",
        image: "https://via.placeholder.com/400x400?text=Smart+Watch",
        rating: {
            rate: 4.5,
            count: 95
        },
        description: "Modern smartwatch for everyday use."
    },
    {
        id: 103,
        title: "Classic Casual Shirt",
        price: 1299,
        category: "men's clothing",
        image: "https://via.placeholder.com/400x400?text=Shirt",
        rating: {
            rate: 4.4,
            count: 76
        },
        description: "Comfortable and stylish casual shirt."
    },
    {
        id: 104,
        title: "Elegant Women's Jacket",
        price: 1999,
        category: "women's clothing",
        image: "https://via.placeholder.com/400x400?text=Jacket",
        rating: {
            rate: 4.7,
            count: 88
        },
        description: "Elegant jacket suitable for modern outfits."
    }
];

async function fetchProducts() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("API request failed");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Invalid API response");
        }

        return data;

    } catch (error) {

        console.warn(
            "API unavailable. Using fallback products.",
            error
        );

        showToast(
            "API unavailable. Demo products loaded."
        );

        return FALLBACK_PRODUCTS;
    }
}