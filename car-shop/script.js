// ------------------- CART FUNCTIONALITY -------------------

// Load cart from localStorage
function loadCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add car to cart (always include image!)
function addToCart(name, price, image = "placeholder.jpg") {
    let cart = loadCart();
    let existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1, image });
    }
    saveCart(cart);
    alert(name + " added to cart!");
}

// Display cart items on cart.html
function displayCart() {
    const cart = loadCart();
    const tableBody = document.querySelector("#cart-table tbody");
    const totalElem = document.getElementById("cart-total");
    tableBody.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {
        let subtotal = item.price * item.quantity;
        total += subtotal;

        let row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <img src="${item.image || 'placeholder.jpg'}" 
                     alt="${item.name}" 
                     style="max-width:80px; border-radius:6px; margin-right:5px;">
                ${item.name}
            </td>
            <td>₦${item.price.toLocaleString()}</td>
            <td>
                <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                ${item.quantity}
                <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
            </td>
            <td>₦${subtotal.toLocaleString()}</td>
            <td><button class="btn" onclick="removeFromCart(${index})">Remove</button></td>
        `;
        tableBody.appendChild(row);
    });

    totalElem.textContent = "₦" + total.toLocaleString();
}

// Update quantity
function updateQuantity(index, change) {
    let cart = loadCart();
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        saveCart(cart);
        displayCart();
    }
}

// Remove item from cart
function removeFromCart(index) {
    let cart = loadCart();
    cart.splice(index, 1);
    saveCart(cart);
    displayCart();
}

// Attach add-to-cart buttons
document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
        const name = button.getAttribute("data-name");
        const price = parseInt(button.getAttribute("data-price"));
        const image = button.getAttribute("data-image") || "placeholder.jpg"; // <-- ensure image
        addToCart(name, price, image);
    });
});

// Display cart if we’re on cart.html
if (window.location.pathname.includes("cart.html")) {
    displayCart();
}

// ------------------- REVIEWS FUNCTIONALITY -------------------

function loadReviews() {
    return JSON.parse(localStorage.getItem("reviews")) || [];
}

function saveReviews(reviews) {
    localStorage.setItem("reviews", JSON.stringify(reviews));
}

function displayReviews() {
    const reviews = loadReviews();
    const list = document.getElementById("reviews-list");
    if (!list) return;
    list.innerHTML = "";

    reviews.forEach(review => {
        const div = document.createElement("div");
        div.classList.add("review-item");

        div.innerHTML = `
            <h3>${review.name}</h3>
            <p>${review.text}</p>
            ${review.image ? `<img src="${review.image}" alt="Review Image">` : ""}
            ${review.video ? `<video controls src="${review.video}"></video>` : ""}
        `;

        list.appendChild(div);
    });
}

// Handle review form
const reviewForm = document.getElementById("review-form");
if (reviewForm) {
    reviewForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const name = document.getElementById("username").value.trim();
        const text = document.getElementById("review-text").value.trim();
        const imageFile = document.getElementById("review-image").files[0];
        const videoFile = document.getElementById("review-video").files[0];

        if (!name || !text) {
            alert("Please fill in your name and review text.");
            return;
        }

        const readerPromises = [];

        const encodeFile = (file) => new Promise(resolve => {
            if (!file) return resolve(null);
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
        });

        readerPromises.push(encodeFile(imageFile));
        readerPromises.push(encodeFile(videoFile));

        Promise.all(readerPromises).then(([image, video]) => {
            const reviews = loadReviews();
            reviews.push({ name, text, image, video });
            saveReviews(reviews);

            reviewForm.reset();
            displayReviews();
        });
    });

    displayReviews();
}

// ------------------- CART COUNTER (NAVBAR) -------------------
function updateCartCount() {
    const cart = loadCart();
    const countElem = document.getElementById("cart-count");
    if (countElem) {
        let totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
        countElem.textContent = totalQty;
    }
}
updateCartCount();

["click", "input"].forEach(event =>
    document.addEventListener(event, updateCartCount)
);

// ------------------- CHECKOUT PAGE -------------------
function displayCheckout() {
    if (!window.location.pathname.includes("checkout.html")) return;

    const cart = loadCart();
    const tableBody = document.querySelector("#checkout-table tbody");
    const totalElem = document.getElementById("checkout-total");
    tableBody.innerHTML = "";

    let total = 0;
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        let row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <img src="${item.image || 'placeholder.jpg'}" 
                     alt="${item.name}" 
                     style="max-width:80px; border-radius:6px; margin-right:5px;">
                ${item.name}
            </td>
            <td>${item.quantity}</td>
            <td>₦${item.price.toLocaleString()}</td>
            <td>₦${subtotal.toLocaleString()}</td>
        `;
        tableBody.appendChild(row);
    });

    totalElem.textContent = "₦" + total.toLocaleString();

    const form = document.getElementById("checkout-form");
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        saveCart([]); 
        updateCartCount();
        tableBody.innerHTML = "";
        totalElem.textContent = "₦0";
        document.getElementById("order-success").style.display = "block";
    });
}
displayCheckout();
