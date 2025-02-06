import products from "./data/products.js";

let cart = [];

// Function to update the cart display
// Function to update cart display from localStorage
// Function to update cart display from localStorage
function updateCartDisplay() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cartItemsContainer.innerHTML = "";
  let totalPrice = 0;
  let totalItems = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;
    totalItems += item.quantity;

    const cartItemDiv = document.createElement("div");
    cartItemDiv.classList.add("cart-item");

    cartItemDiv.innerHTML = `
            <span class="cart-item-name">${item.name}</span>
            <div>
                <button class="quantity-btn decrease-btn" data-name="${
                  item.name
                }">-</button>
                <span class="cart-item-quantity">${item.quantity}</span>
                <button class="quantity-btn increase-btn" data-name="${
                  item.name
                }">+</button>
            </div>
            <span class="cart-item-price">€${itemTotal.toFixed(2)}</span>
        `;

    cartItemsContainer.appendChild(cartItemDiv);
  });

  cartTotal.textContent = totalPrice.toFixed(2);
  cartCount.textContent = totalItems;

  // Add event listeners to new buttons after DOM update
  document.querySelectorAll(".increase-btn").forEach((button) => {
    button.addEventListener("click", () =>
      changeQuantity(button.dataset.name, 1)
    );
  });

  document.querySelectorAll(".decrease-btn").forEach((button) => {
    button.addEventListener("click", () =>
      changeQuantity(button.dataset.name, -1)
    );
  });
}

// Function to handle quantity changes
// Function to handle quantity changes
function changeQuantity(productName, amount) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Find the index of the product in the cart
  const productIndex = cart.findIndex((item) => item.name === productName);
  if (productIndex !== -1) {
    cart[productIndex].quantity += amount;

    // Remove item if quantity becomes zero or less
    if (cart[productIndex].quantity <= 0) {
      cart.splice(productIndex, 1);
    }
  }

  // Save updated cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Refresh the cart UI
  updateCartDisplay();
}

// Show cart if redirected from product details page
document.addEventListener("DOMContentLoaded", () => {
  updateCartDisplay();

  // Check if URL has showCart parameter
  const params = new URLSearchParams(window.location.search);
  if (params.get("showCart") === "true") {
    document.getElementById("cart-container").style.display = "block";
  }
});

// Function to add products to the cart
function addToCart(product) {
  const existingProduct = cart.find((item) => item.name === product.name);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  // Show cart when an item is added
  document.getElementById("cart-container").style.display = "block";
  updateCartDisplay();
}

// Function to display products
function displayProducts(filteredProducts) {
  const productsContainer = document.getElementById("products-container");
  productsContainer.innerHTML = "";

  filteredProducts.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    productCard.innerHTML = `
            <img src="${product.image}" alt="${
      product.name
    }" class="product-image"/>
            <h3 class="product-name">${product.name}</h3>
            <div class="price_btn">
              <p class="product-price">${product.price
                .toString()
                .replace(".", ",")} €</p>
              <button class="view-details-btn"><span class="material-symbols-outlined">shopping_cart</span></button>
            </div>
        `;

    // Add event listener to the entire product card
    productCard.addEventListener("click", () => {
      const productDetailsURL = `product-details.html?name=${encodeURIComponent(
        product.name
      )}&image=${encodeURIComponent(
        product.image
      )}&description=${encodeURIComponent(
        product.description
      )}&price=${encodeURIComponent(product.price)}`;
      window.location.href = productDetailsURL;
    });

    productsContainer.appendChild(productCard);
  });
}

// Event listeners for category and search filters
document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("search-bar");
  const filterButtons = document.querySelectorAll(".filter-btn");

  // Function to filter products by category
  function filterProductsByCategory(category) {
    const filteredProducts = products.filter((product) => {
      if (category === "all") return true;
      return product.category === category;
    });
    displayProducts(filteredProducts);
  }

  // Function to filter products by search query
  function filterProductsBySearch(query) {
    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    displayProducts(filteredProducts);
  }

  // Search bar functionality
  searchBar.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const searchQuery = e.target.value;
      filterProductsBySearch(searchQuery);
    }
  });

  // Category filter buttons
  filterButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const category = e.target.getAttribute("data-category");
      filterProductsByCategory(category);
    });
  });

  // Initial display of products
  displayProducts(products);
});

// Cart button to toggle cart visibility
const cartButton = document.getElementById("cart-button");
const cartContainer = document.getElementById("cart-container");
cartButton.addEventListener("click", () => {
  cartContainer.style.display =
    cartContainer.style.display === "none" ? "block" : "none";
});

// Close cart button
document.getElementById("close-cart").addEventListener("click", () => {
  cartContainer.style.display = "none";
});

// Category-specific header images
const categoryImages = {
  all: "assets/images/frontpage.jpg",
  electronics: "assets/images/electronics.jpg",
  clothing: "assets/images/accessories.jpg",
  // Add more categories and images as needed
};

// Function to update the header image
function updateHeaderImage(category) {
  const headerImageDiv = document.querySelector(".frontpage-image");
  if (categoryImages[category]) {
    headerImageDiv.style.background = `url("${categoryImages[category]}") no-repeat center center`;
    headerImageDiv.style.backgroundSize = "cover";
  }
}

// Add event listeners to filter buttons
document.querySelectorAll(".filter-btn").forEach((button) => {
  button.addEventListener("click", (e) => {
    const category = e.target.getAttribute("data-category");
    updateHeaderImage(category);
  });
});

document.getElementById("go-to-cart").addEventListener("click", () => {
  window.location.href = "cart.html";
});
