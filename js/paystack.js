// paystack.js
const PAYSTACK_PUBLIC_KEY = "pk_live_21389645ae0ae2eadb7b6e33b61307e1887da7a2";

document.getElementById("checkoutBtn").addEventListener("click", async () => {
    const cartIds = JSON.parse(localStorage.getItem("cart")) || [];
    if (cartIds.length === 0) return alert("Your cart is empty!");

    // Fetch products to calculate total
    let totalAmount = 0;
    for (let id of cartIds) {
        const res = await fetch(`https://firestore.googleapis.com/v1/projects/around-campus-af30e/databases/(default)/documents/products/${id}`);
        const data = await res.json();
        totalAmount += Number(data.fields.price.integerValue || data.fields.price.stringValue);
    }

    // Convert to kobo for Paystack
    const amountInKobo = totalAmount * 100;

    // Initialize Paystack
    const handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: "customer@example.com", // replace with logged in user's email
        amount: amountInKobo,
        currency: "GHS",
        callback: function(response){
            alert(`Payment successful! Reference: ${response.reference}`);
            localStorage.removeItem("cart");
            window.location.href = "cart.html"; // refresh cart
        },
        onClose: function(){
            alert("Payment cancelled");
        }
    });
    handler.openIframe();
});
