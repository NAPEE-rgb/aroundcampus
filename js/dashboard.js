// dashboard.js
import { auth, db } from "./firebase.js";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// HTML elements
const ordersContainer = document.getElementById("ordersContainer");
const userEmailSpan = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");

// Listen for auth state
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // If not logged in, redirect to login
    window.location.href = "login.html";
    return;
  }

  // Show user email
  userEmailSpan.textContent = user.email;

  // Load user orders
  loadOrders(user.email);
});

// Load orders from Firestore
async function loadOrders(email) {
  ordersContainer.innerHTML = "<p style='text-align:center;'>Loading orders...</p>";

  try {
    const q = query(
      collection(db, "orders"),
      where("userEmail", "==", email),
      orderBy("timestamp", "desc")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      ordersContainer.innerHTML =
        "<p style='text-align:center;'>You have no orders yet.</p>";
      return;
    }

    ordersContainer.innerHTML = "";

    snapshot.forEach((doc) => {
      const order = doc.data();

      const orderDiv = document.createElement("div");
      orderDiv.className = "order-card";

      let productsHTML = "";
      order.products.forEach((p) => {
        productsHTML += `
          <li>
            ${p.name} — ₵${p.price} × ${p.quantity}
          </li>
        `;
      });

      orderDiv.innerHTML = `
        <h3>Order Ref: ${order.ref}</h3>
        <ul>${productsHTML}</ul>
        <p><strong>Total:</strong> ₵${order.total}</p>
        <p><small>${new Date(order.timestamp.seconds * 1000).toLocaleString()}</small></p>
      `;

      ordersContainer.appendChild(orderDiv);
    });

  } catch (error) {
    console.error(error);
    ordersContainer.innerHTML =
      "<p style='text-align:center;color:red;'>Failed to load orders</p>";
  }
}

// Logout
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});
