document.addEventListener("DOMContentLoaded", () => {
  const cartItemsList = document.getElementById("cart-items-list");
  const cartTotal = document.getElementById("cart-total");
  const clearCartButton = document.getElementById("clear-cart");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function loadCart() {
    cartItemsList.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartItemsList.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }

    cart.forEach((item) => {
      const cartItem = document.createElement("li");
      cartItem.textContent = `Item ${item.id} x${item.quantity}`;
      cartItemsList.appendChild(cartItem);
      total += item.quantity * 10; // Placeholder price, should be fetched from product data
    });

    cartTotal.textContent = total.toFixed(2);
  }

  clearCartButton.addEventListener("click", () => {
    localStorage.removeItem("cart");
    cart = [];
    loadCart();
  });

  loadCart();
});
