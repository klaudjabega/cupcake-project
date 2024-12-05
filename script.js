document.addEventListener('DOMContentLoaded', function () {
    console.log("JavaScript loaded successfully");

    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    const cupcakeCards = document.querySelectorAll('.card');
    const cartCount = document.getElementById("cart-count");
    const cartContainer = document.getElementById("cart-items-container");
    const checkoutButton = document.getElementById("checkoutButton");
    const orderForm = document.getElementById("orderForm");
    const orderSummary = document.getElementById("orderSummary");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log("Initial cart:", cart);

    // Search functionality
    function searchCupcakes() {
        console.log("Search initiated");
        const searchTerm = searchInput.value.toLowerCase();
        cupcakeCards.forEach(card => {
            const cupcakeName = card.querySelector('h3').textContent.toLowerCase();
            card.style.display = cupcakeName.includes(searchTerm) ? 'block' : 'none';
        });
    }

    // Add event listeners for search
    searchButton.addEventListener('click', searchCupcakes);
    searchInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchCupcakes();
        }
    });

    // Update the cart
    function updateCart() {
        console.log("Updating cart...");
        if (cart.length === 0) {
            cartContainer.innerHTML = "<p>Your cart is empty. Add some cupcakes!</p>";
            if (checkoutButton) checkoutButton.style.display = "none";
        } else {
            let cartHTML = "<ul>";
            let total = 0;

            cart.forEach(item => {
                cartHTML += `<li>${item.name} - €${item.price.toFixed(2)}</li>`;
                total += item.price;
            });

            cartHTML += `</ul><p>Total: €${total.toFixed(2)}</p>`;
            cartContainer.innerHTML = cartHTML;
            if (checkoutButton) checkoutButton.style.display = "block";
        }

        if (cartCount) cartCount.textContent = cart.length;
    }

    // Add items to cart
    function addToCart(name, price) {
        console.log("Adding to cart:", name, price);
        cart.push({ name, price });
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
    }

    // Show the order form
    function displayOrderForm() {
        console.log("Displaying order form");
        if (orderForm) orderForm.style.display = "block";
    }

    // Calculate delivery fee
    function calculateDeliveryFee(city) {
        return city.toLowerCase() === "tirana" ? 2.0 : 3.0;
    }

    // Submit the order
    function submitOrder() {
        console.log("Submitting order...");
        const name = document.getElementById("name").value;
        const surname = document.getElementById("surname").value;
        const address = document.getElementById("address").value;
        const city = document.getElementById("city").value;
        const phone = document.getElementById("phone").value;
        const payment = document.getElementById("payment").value;

        if (!name || !surname || !address || !city || !phone || !payment) {
            alert("Please fill out all the fields.");
            return;
        }

        if (cart.length === 0) {
            alert("Your cart is empty. Add cupcakes to your cart before submitting.");
            return;
        }

        const deliveryFee = calculateDeliveryFee(city);
        let totalAmount = cart.reduce((total, item) => total + item.price, 0) + deliveryFee;

        orderSummary.innerHTML = `
            <h3>Order Summary</h3>
            <p><strong>Name:</strong> ${name} ${surname}</p>
            <p><strong>Address:</strong> ${address}, ${city}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Payment Method:</strong> ${payment}</p>
            <h4>Items Ordered:</h4>
            <ul>
                ${cart.map(item => `<li>${item.name} - €${item.price.toFixed(2)}</li>`).join('')}
            </ul>
            <p><strong>Delivery Fee:</strong> €${deliveryFee.toFixed(2)}</p>
            <p><strong>Total Amount: €${totalAmount.toFixed(2)}</strong></p>
            <p>Thank you for your order! Your cupcakes will be delivered within 48 hours.</p>
        `;

        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
    }

    // Add event listeners to buttons
    const addToCartButtons = document.querySelectorAll('.addtocart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const cupcake = e.target.closest('.cupcake');
            const cupcakeName = cupcake.querySelector('h3').textContent;
            const cupcakePrice = parseFloat(cupcake.querySelector('.price').textContent.replace('€', ''));

            addToCart(cupcakeName, cupcakePrice);
        });
    });

    if (checkoutButton) {
        checkoutButton.addEventListener('click', displayOrderForm);
    }

    const submitOrderButton = document.getElementById("submitOrder");
    if (submitOrderButton) {
        submitOrderButton.addEventListener('click', submitOrder);
    }

    // Initialize cart
    updateCart();
});
