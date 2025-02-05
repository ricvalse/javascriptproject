document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.getElementById("products-container");
  const cartButton = document.getElementById("cart-button");
  const cartPopup = document.getElementById("cart-popup");
  const closeCartButton = document.getElementById("close-cart");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let products = [];

  // Fetch and load products
  fetch("data/products.json")
    .then(response => response.json())
    .then(data => {
      products = data;
      displayProducts(products);
      console.log("Products loaded:", products); // Debug log
    })
    .catch(error => console.error('Error loading products:', error));


  function displayProducts(products) {
    productsContainer.innerHTML = "";
    products.forEach((product) => {
      const productElement = document.createElement("div");
      productElement.classList.add("product");
      productElement.innerHTML = `
                <a href="product.html?id=${product.id}" class="product-link">
                <img src="${product.image}" alt="${product.name}">
                <p>${product.name}</p>
                <div class="price-and-cart">
                <h3>${product.price.toString().replace(".", ",")} €</h3>
                <a href="#" class="add-to-cart" data-id="${product.id}">
                <span class="material-symbols-outlined">shopping_bag_speed</span></a>
                </div>
            `;
      productsContainer.appendChild(productElement);
    });
  }



  function setupFilters(products) {
    document.getElementById("search-bar").addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm)
      );
      displayProducts(filteredProducts);
    });

    document.querySelectorAll(".filter-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const category = button.dataset.category;
        const filteredProducts =
          category === "all"
            ? products
            : products.filter((product) => product.category === category);
        displayProducts(filteredProducts);
      });
    });
  }

  // Cart Functionality
  productsContainer.addEventListener("click", (e) => {
    const addToCartButton = e.target.closest(".add-to-cart");
    if (addToCartButton) {
      const productId = addToCartButton.dataset.id;
      addToCart(productId);
    }
  });

  function addToCart(id) {
    const productData = products.find(p => p.id == id);
    console.log(productData);
    console.log(products);
    let cartItem = cart.find((item) => item.id == id);
    if (cartItem) {
      cartItem.quantity++;
    } else {
      cart.push({ id: productData.id,
                  name: productData.name,
        price: productData.price,
        image: productData.image,
        quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
    showCartPopup();
  }

  function updateCartDisplay() {
    cartItemsContainer.innerHTML = "";
    let total = 0;
    cart.forEach((item) => {
      const cartItem = document.createElement("li");
      cartItem.classList.add("cart-item");
      cartItem.innerHTML = `
        <div class="cart-item-details">
          <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}" class="cart-thumbnail">
          </div>
          <div class="cart-item-info">
            <span class="item-name">${item.name}</span>
            <div class="item-controls">
              <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
              <span class="item-quantity">${item.quantity}</span>
              <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
            </div>
            <div class="item-price">
              <span class="price-per-item">${item.price.toFixed(2)} €</span>
              <span class="item-total">${(item.price * item.quantity).toFixed(2)} €</span>
            </div>
          </div>
          <button class="remove-item" data-id="${item.id}">×</button>
        </div>
      `;
      cartItemsContainer.appendChild(cartItem);
      total += item.price * item.quantity; // Placeholder price, should be fetched from data
    });
    cartTotal.textContent = total.toFixed(2);
    setupCartItemListeners();
  }

  function setupCartItemListeners() {
    // Quantity adjustment buttons
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const action = e.target.dataset.action;
            updateQuantity(id, action);
        });
    });

    // Remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            removeFromCart(id);
        });
    });
}

function updateQuantity(id, action) {
    const cartItem = cart.find(item => item.id == id);
    if (!cartItem) return;

    if (action === 'increase') {
        cartItem.quantity++;
    } else if (action === 'decrease') {
        cartItem.quantity--;
        if (cartItem.quantity <= 0) {
            removeFromCart(id);
            return;
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id != id);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartDisplay();
  
  // If cart is empty, you might want to hide the popup
  if (cart.length === 0) {
      hideCartPopup();
  }
}

  function showCartPopup() {
    cartPopup.classList.add("visible");
    document.body.classList.add("overlay-active");
  }

  function hideCartPopup() {
    cartPopup.classList.remove("visible");
    document.body.classList.remove("overlay-active");
  }

  cartButton.addEventListener("click", showCartPopup);
  closeCartButton.addEventListener("click", hideCartPopup);
  document.addEventListener("click", (e) => {
    if (e.target === cartPopup) hideCartPopup();
  });

  updateCartDisplay();
});
