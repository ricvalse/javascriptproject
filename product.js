document.addEventListener("DOMContentLoaded", () => {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Fetch product data
    fetch("data/products.json")
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id == productId);
            if (product) {
                displayProductDetails(product);
            } else {
                showErrorMessage();
            }
        })
        .catch(error => {
            console.error('Error loading product:', error);
            showErrorMessage();
        });

    function displayProductDetails(product) {
        const productDetails = document.getElementById('product-details');
        productDetails.innerHTML = `
            <div class="product-page">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h1>${product.name}</h1>
                    <div class="price">${product.price.toString().replace(".", ",")} €</div>
                    <p class="description">${product.description || 'No description available.'}</p>
                    <button class="add-to-cart-btn" data-id="${product.id}">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;

        // Add to cart functionality
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', () => {
            addToCart(product.id);
        });
    }

    function showErrorMessage() {
        const productDetails = document.getElementById('product-details');
        productDetails.innerHTML = `
            <div class="error-message">
                <h2>Product Not Found</h2>
                <p>Sorry, the requested product could not be found.</p>
                <a href="index.html" class="back-btn">Back to Products</a>
            </div>
        `;
    }

    // Cart functionality (similar to your main script)
    function addToCart(id) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const productData = products.find(p => p.id == id);
        
        let cartItem = cart.find((item) => item.id == id);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ 
                id: productData.id,
                name: productData.name,
                price: productData.price,
                image: productData.image,
                quantity: 1 
            });
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        // Optionally show a confirmation message
        alert('Product added to cart!');
    }
});