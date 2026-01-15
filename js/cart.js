// cart.js
import { db } from "./firebase.js";
import { collection, getDocs, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Load cart products
async function loadCart() {
    const cartContainer = document.getElementById("cartContainer");
    const cartIds = JSON.parse(localStorage.getItem("cart")) || [];
    cartContainer.innerHTML = "";

    let total = 0;
    const snap = await getDocs(collection(db, "products"));
    snap.forEach(docSnap => {
        if (!cartIds.includes(docSnap.id)) return;
        const p = docSnap.data();
        total += Number(p.price);
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <p>${p.name} - ₵${p.price}</p>
            <button onclick="removeFromCart('${docSnap.id}')">Remove</button>
        `;
        cartContainer.appendChild(div);
    });
    document.getElementById("totalPrice").textContent = total;
}

window.removeFromCart = function(id) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = cart.indexOf(id);
    if (index > -1) cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
};

loadCart();
