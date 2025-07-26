// login.js
const form = document.getElementById("login-form");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Check if the user exists (in localStorage)
  const user = JSON.parse(localStorage.getItem(email));

  if (!user || user.password !== password) {
    document.getElementById("error").textContent = "Invalid email or password.";
    return;
  }

  // Save session
  localStorage.setItem("loggedInUser", email);

  // Redirect to shop
  window.location.href = "shop.html";
});
