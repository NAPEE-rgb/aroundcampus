// admin.js
import { db, auth } from "./firebase.js";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- AUTH CHECK ---
onAuthStateChanged(auth, user => {
  if (!user) window.location.href = "login.html";
});

// --- CLOUDINARY UPLOAD FUNCTION ---
async function uploadImageToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "myshop_products"); // Your unsigned preset
  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dvyqgl6wo/image/upload",
    { method: "POST", body: formData }
  );

  if (!response.ok) throw new Error("Cloudinary upload failed");
  const data = await response.json();
  return data.secure_url; // URL stored in Firestore
}

// --- UPLOAD PRODUCT ---
document.getElementById("uploadBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value.trim();
  const price = document.getElementById("price").value.trim();
  const desc = document.getElementById("desc").value.trim();
  const category = document.getElementById("category").value.trim();
  const file = document.getElementById("image").files[0];

  if (!name || !price || !desc || !category || !file) return alert("All fields required");

  try {
    // Upload image to Cloudinary
    const imageURL = await uploadImageToCloudinary(file);

    // Save product info to Firestore
    await addDoc(collection(db, "products"), {
      name,
      price: Number(price),
      description: desc,
      category,
      image: imageURL,
      createdAt: new Date()
    });

    alert("Product added successfully");
    loadProducts();

  } catch (err) {
    console.error(err);
    alert("Upload failed. Check console for details.");
  }
});

// --- LOAD PRODUCTS ---
async function loadProducts() {
  const list = document.getElementById("productList");
  list.innerHTML = "<p style='text-align:center;'>Loading products...</p>";

  try {
    const snap = await getDocs(collection(db, "products"));
    list.innerHTML = "";

    snap.forEach(docSnap => {
      const p = docSnap.data();
      list.innerHTML += `
        <div class="product">
          <img src="${p.image}" width="100">
          <input type="text" value="${p.name}" id="name-${docSnap.id}">
          <input type="number" value="${p.price}" id="price-${docSnap.id}">
          <textarea id="desc-${docSnap.id}">${p.description}</textarea>
          <input type="text" value="${p.category}" id="category-${docSnap.id}">
          <button onclick="updateProduct('${docSnap.id}')">Update</button>
          <button onclick="deleteProduct('${docSnap.id}')">Delete</button>
        </div>`;
    });

  } catch (err) {
    console.error(err);
    list.innerHTML = "<p style='color:red;text-align:center;'>Failed to load products</p>";
  }
}
loadProducts();

// --- UPDATE PRODUCT ---
window.updateProduct = async (id) => {
  const name = document.getElementById(`name-${id}`).value.trim();
  const price = document.getElementById(`price-${id}`).value.trim();
  const desc = document.getElementById(`desc-${id}`).value.trim();
  const category = document.getElementById(`category-${id}`).value.trim();

  try {
    const docRef = doc(db, "products", id);
    await updateDoc(docRef, { name, price: Number(price), description: desc, category });
    alert("Product updated");
    loadProducts();
  } catch (err) {
    console.error(err);
    alert("Update failed");
  }
};

// --- DELETE PRODUCT ---
window.deleteProduct = async (id) => {
  if (confirm("Delete this product?")) {
    try {
      await deleteDoc(doc(db, "products", id));
      alert("Product deleted");
      loadProducts();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }
};

// --- LOAD ORDERS ---
async function loadOrders() {
  const list = document.getElementById("orderList");
  list.innerHTML = "<p style='text-align:center;'>Loading orders...</p>";

  try {
    const snap = await getDocs(collection(db, "orders"));
    list.innerHTML = "";

    snap.forEach(docSnap => {
      const order = docSnap.data();
      list.innerHTML += `
        <div class="order">
          <p><strong>User:</strong> ${order.userEmail}</p>
          <p><strong>Total:</strong> ₵${order.total}</p>
          <p><strong>Ref:</strong> ${order.ref}</p>
          <p><strong>Products:</strong></p>
          <ul>${order.products.map(p => `<li>${p.name} - ₵${p.price} × ${p.quantity}</li>`).join("")}</ul>
          <hr>
        </div>`;
    });

  } catch (err) {
    console.error(err);
    list.innerHTML = "<p style='color:red;text-align:center;'>Failed to load orders</p>";
  }
}
loadOrders();
