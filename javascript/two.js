// Variables to hold cart and total price
let cart = [];
let totalPrice = 0;

// Add item to cart
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (event) => {
        const cupcake = event.target;
        const id = cupcake.getAttribute('data-id');
        const name = cupcake.getAttribute('data-name');
        const price = parseFloat(cupcake.getAttribute('data-price'));
        const quantityElement = document.getElementById(`quantity-${id}`);
        const quantity = quantityElement ? parseInt(quantityElement.value) : 1;

        if (isNaN(quantity) || quantity <= 0) {
            alert('Please enter a valid quantity');
            return;
        }

        // Update the cart
        const itemIndex = cart.findIndex(item => item.id === id);
        if (itemIndex > -1) {
            cart[itemIndex].quantity += quantity;
        } else {
            cart.push({ id, name, price, quantity });
        }
        
        updateCart();
    });
});

// Function to update the cart and total price
function updateCart() {
    const cartList = document.getElementById('cartList');
    cartList.innerHTML = '';
    totalPrice = 0;

    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} - $${item.price.toFixed(2)} x ${item.quantity}`;
        cartList.appendChild(listItem);
    });

    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
    
    // Show or hide the checkout button
    document.getElementById('checkoutButton').style.display = cart.length > 0 ? 'block' : 'none';
}

// Submit order
document.getElementById('submitOrder').addEventListener('click', () => {
    const name = document.getElementById('name').value.trim();
    const surname = document.getElementById('surname').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const payment = document.getElementById('payment').value.trim();

    if (!name || !surname || !address || !city || !phone || !payment) {
        alert('Please fill out all fields');
        return;
    }

    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before placing an order.');
        return;
    }

    // Prepare the order data to send to the backend
    const orderData = {
        name,
        surname,
        address,
        city,
        phone,
        payment,
        cart,
        totalPrice
    };

    // Send the data to the backend via POST request
    fetch('http://localhost:5047/api/order/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const orderMessage = document.getElementById('orderMessage');
        if (data.message) {
            orderMessage.innerHTML = `
                <p style="color: green;">Your order has been placed successfully!</p>
                <p>Order Summary:</p>
                <p>Name: ${name} ${surname}</p>
                <p>Address: ${address}, ${city}</p>
                <p>Phone: ${phone}</p>
                <p>Payment Method: ${payment}</p>
                <p>Total Price: $${totalPrice.toFixed(2)}</p>
            `;
            cart = [];
            updateCart();
        } else {
            orderMessage.innerHTML = `<p style="color: red;">Error: ${data.message}</p>`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('orderMessage').innerHTML = '<p style="color: red;">There was an error with your request. Please try again.</p>';
    });
});
