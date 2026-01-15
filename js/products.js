// products.js
import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Load products from Firestore
async function loadProducts() {
    const productsContainer = document.getElementById("products");
    productsContainer.innerHTML = "";
    const snap = await getDocs(collection(db, "products"));

    snap.forEach(docSnap => {
        const p = docSnap.data();
        const card = document.createElement("div");
        card.className = "product-card";
        card.dataset.productId = docSnap.id;
        card.innerHTML = `
            <img src="${p.image}" alt="${p.name}" class="product-image">
            <h3 class="product-name">${p.name}</h3>
            <p class="product-price">₵${p.price}</p>
            <div class="product-buttons">
                <button class="add-to-cart-btn" data-id="${docSnap.id}">Add to Cart</button>
                <button class="remove-from-cart-btn" data-id="${docSnap.id}">Remove</button>
            </div>
        `;
        productsContainer.appendChild(card);
    });
    attachCartEvents();
}

// Add/Remove Cart Logic
function attachCartEvents() {
    const addBtns = document.querySelectorAll(".add-to-cart-btn");
    const removeBtns = document.querySelectorAll(".remove-from-cart-btn");

    addBtns.forEach(btn => {
        btn.onclick = () => {
            const card = btn.closest(".product-card");
            card.classList.add("in-cart");
            const productId = btn.dataset.id;
            addToCart(productId);
        };
    });

    removeBtns.forEach(btn => {
        btn.onclick = () => {
            const card = btn.closest(".product-card");
            card.classList.remove("in-cart");
            const productId = btn.dataset.id;
            removeFromCart(productId);
        };
    });
}

// Cart storage in localStorage
function getCart() { return JSON.parse(localStorage.getItem("cart")) || []; }
function setCart(cart) { localStorage.setItem("cart", JSON.stringify(cart)); updateCartCount(); }

function addToCart(id) {
    const cart = getCart();
    if (!cart.includes(id)) cart.push(id);
    setCart(cart);
}

function removeFromCart(id) {
    const cart = getCart();
    const index = cart.indexOf(id);
    if (index > -1) cart.splice(index, 1);
    setCart(cart);
}

function updateCartCount() {
    document.getElementById("cartCount").textContent = getCart().length;
}

// Initialize
loadProducts();
updateCartCount();
