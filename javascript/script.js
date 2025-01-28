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


// Attach an event listener to the form
document.querySelector('.login-form').addEventListener('submit', async function (event) {
    event.preventDefault();  // Prevent the form from reloading the page

    // Get the values of email and password fields
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    // Prepare the data to be sent in the POST request
    const loginData = {
        email: email,
        password: password
    };

    try {
        // Send the login data via fetch API (AJAX request)
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)  // Send data as JSON
        });

        // Check if the response was successful
        if (response.ok) {
            // If successful, parse the JSON response
            const data = await response.json();
            alert('Login successful! Token: ' + data.token);  // You can handle this response as needed
            // Optionally, you can redirect the user to another page
            // window.location.href = '/home';  // Example redirect
        } else {
            // If not successful, handle the error response
            const errorData = await response.json();
            alert('Login failed: ' + errorData.message || 'Invalid credentials');
        }
    } catch (error) {
        // Handle any errors that occur during the fetch request
        alert('Error: ' + error.message);
    }
});



// Handle Review Submission
document.querySelector('.review-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form from actually submitting

    // Get form data
    const username = document.querySelector('#username').value.trim();
    const rating = document.querySelector('#rating').value;
    const review = document.querySelector('#review').value.trim();

    // Create a review object
    const reviewData = {
        username,
        rating,
        review,
        date: new Date().toISOString() // Add timestamp
    };

    // Save review to local storage
    let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    reviews.push(reviewData);
    localStorage.setItem('reviews', JSON.stringify(reviews));

    // Clear form fields
    document.querySelector('.review-form').reset();

    alert('Review submitted successfully!');
});

// Handle Login Submission
document.querySelector('.login-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form from actually submitting

    // Get login data
    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value.trim();

    // Save login data to local storage (Note: Do NOT store passwords in plain text in a real application)
    localStorage.setItem('loginData', JSON.stringify({ email, password }));

    // Clear form fields
    document.querySelector('.login-form').reset();

    alert('Logged in successfully!');
});

// Handle showing the registration form
document.querySelector('a[href="/register"]').addEventListener('click', function (e) {
    e.preventDefault(); // Prevent default link behavior

    // Create a registration form dynamically
    const registrationForm = `
        <h3>Register</h3>
        <form class="register-form">
            <label for="reg-name">Name:</label>
            <input type="text" id="reg-name" name="name" placeholder="Your name" required>

            <label for="reg-surname">Surname:</label>
            <input type="text" id="reg-surname" name="surname" placeholder="Your surname" required>

            <label for="reg-email">Email:</label>
            <input type="email" id="reg-email" name="email" placeholder="Your email" required>

            <label for="reg-password">Password:</label>
            <input type="password" id="reg-password" name="password" placeholder="Your password" required>

            <button type="submit">Register</button>
        </form>
    `;

    // Replace the login section with the registration form
    const loginSection = document.querySelector('.login-section');
    loginSection.innerHTML = registrationForm;

    // Handle registration form submission
    document.querySelector('.register-form').addEventListener('submit', function (e) {
        e.preventDefault();

        // Get registration data
        const name = document.querySelector('#reg-name').value.trim();
        const surname = document.querySelector('#reg-surname').value.trim();
        const email = document.querySelector('#reg-email').value.trim();
        const password = document.querySelector('#reg-password').value.trim();

        // Create user object
        const userData = { name, surname, email, password };

        // Save user data to local storage
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));

        // Clear form fields
        document.querySelector('.register-form').reset();

        alert('Registration successful! Please log in.');

        // Optionally, redirect back to the login form
        location.reload();
    });
});


// Function to display reviews
function displayReviews() {
    const reviewsList = document.querySelector('#reviews-list');
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];

    // Clear current reviews display
    reviewsList.innerHTML = '';

    if (reviews.length === 0) {
        reviewsList.innerHTML = '<p>No reviews submitted yet.</p>';
        return;
    }

    // Create HTML for each review
    reviews.forEach((review, index) => {
        const reviewHTML = `
            <div class="review-item" id="review-${index}">
                <p><strong>${review.username}</strong> (${review.date.split('T')[0]})</p>
                <p>Rating: ${'⭐'.repeat(review.rating)}</p>
                <p>${review.review}</p>
            </div>
            <hr>
        `;
        reviewsList.innerHTML += reviewHTML;
    });

}

document.querySelectorAll('.delete-review').forEach(button => {
    button.addEventListener('click', function () {
        const reviewIndex = this.getAttribute('data-index');
        deleteReview(reviewIndex);
    });
});


// Delete review
function deleteReview(index) {
let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
reviews.splice(index, 1); 
localStorage.setItem('reviews', JSON.stringify(reviews)); 
displayReviews(); 
}


document.addEventListener('DOMContentLoaded', displayReviews);

document.querySelector('.review-form').addEventListener('submit', function () {
    displayReviews(); 
});

// Initialize cart array to hold selected items
let cart = [];

// Handle Add to Cart Button
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function () {
        const cupcakeId = this.getAttribute('data-id');
        const cupcakeName = this.getAttribute('data-name');
        const cupcakePrice = parseFloat(this.getAttribute('data-price'));
        const quantityInput = document.querySelector(`#quantity-${cupcakeId}`);
        const quantity = parseInt(quantityInput.value);

        // Add to cart
        addToCart(cupcakeId, cupcakeName, cupcakePrice, quantity);
    });
});

// Add an item to the cart
function addToCart(id, name, price, quantity) {
    // Check if the item already exists in the cart
    const existingItemIndex = cart.findIndex(item => item.id === id);
    if (existingItemIndex !== -1) {
        // Update the quantity if the item already exists in the cart
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item to the cart
        cart.push({ id, name, price, quantity });
    }

    // Update the cart display
    updateCart();
}

// Update cart display and total price
function updateCart() {
    const cartList = document.querySelector('#cartList');
    const totalPriceElem = document.querySelector('#totalPrice');
    cartList.innerHTML = ''; // Clear current cart items
    let totalPrice = 0;

    cart.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} - $${item.price} x ${item.quantity}`;
        cartList.appendChild(listItem);
        totalPrice += item.price * item.quantity;
    });

    totalPriceElem.textContent = totalPrice.toFixed(2);
    document.getElementById('checkoutButton').style.display = 'inline-block'; // Show checkout button
}

// Handle the checkout button (optional functionality)
document.getElementById('checkoutButton').addEventListener('click', function () {
    generateReceipt();
});

// Generate and display receipt
function generateReceipt() {
    const orderSummary = document.getElementById('orderSummary');
    let receiptHTML = '<h3>Receipt:</h3><ul>';

    cart.forEach(item => {
        receiptHTML += `<li>${item.name} - $${item.price} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</li>`;
    });

    let totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    receiptHTML += `<li><strong>Total Price: $${totalPrice.toFixed(2)}</strong></li>`;
    receiptHTML += '</ul>';

    // Show the receipt
    orderSummary.innerHTML = receiptHTML;

    // Optionally, clear the cart after checkout
    cart = [];
    updateCart(); // Refresh cart
}


function addToCart(cupcakeName, price) {
    alert(cupcakeName + " has been added to your cart for €" + price);
}
