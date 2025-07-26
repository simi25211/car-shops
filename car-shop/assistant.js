// ===============================
// Car Shop Smart Assistant (Fixed Version)
// Works on all pages (Shop, Customizer, Cart, Reviews)
// ===============================

// -------------------------------
// Helper Functions
// -------------------------------
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}
function getViewedCars() {
    return JSON.parse(localStorage.getItem("viewedCars")) || [];
}
function addViewedCar(car) {
    let viewed = getViewedCars();
    if (!viewed.includes(car)) {
        viewed.push(car);
        localStorage.setItem("viewedCars", JSON.stringify(viewed));
    }
}

// -------------------------------
// Floating Pop-up Assistant
// -------------------------------
function createAssistantPopup() {
    // Prevent duplicates
    if (document.getElementById("assistant-popup")) return;

    const popup = document.createElement("div");
    popup.id = "assistant-popup";
    popup.innerHTML = `
        <div id="assistant-header">Car Shop Assistant</div>
        <div id="assistant-body">Hi! I can help you find cars and upgrades.</div>
        <button id="assistant-toggle">×</button>
    `;
    document.body.appendChild(popup);

    // Restore previous visibility state
    if (localStorage.getItem("assistantHidden") === "true") {
        popup.classList.add("hidden");
    }

    // Toggle open/close and save state
    const toggle = document.getElementById("assistant-toggle");
    toggle.addEventListener("click", () => {
        popup.classList.toggle("hidden");
        localStorage.setItem("assistantHidden", popup.classList.contains("hidden"));
    });

    updateAssistantSuggestions();
}

// -------------------------------
// Sidebar Recommendations (Shop Page Only)
// -------------------------------
function createSidebarRecommendations() {
    // Only show on shop page (look for a container unique to shop.html)
    if (!document.querySelector(".shop-container")) return;

    const sidebar = document.createElement("aside");
    sidebar.id = "recommend-sidebar";
    sidebar.innerHTML = `<h3>Recommended for You</h3><ul id="recommend-list"></ul>`;
    document.body.appendChild(sidebar);

    updateSidebarSuggestions();
}

// -------------------------------
// Customizer Tips (Customizer Page Only)
// -------------------------------
function setupCustomizerTips() {
    const container = document.querySelector(".customizer-container");
    if (!container) return;

    const tipsBox = document.createElement("div");
    tipsBox.id = "customizer-tips";
    tipsBox.innerText = "Tip: Choose your favorite options!";
    container.appendChild(tipsBox);

    const colorSelect = document.getElementById("color-select");
    const rimsSelect = document.getElementById("rims-select");
    const interiorSelect = document.getElementById("interior-select");

    function updateTips() {
        let tip = "";
        if (colorSelect?.value === "red") {
            tip = "Red cars look great with Sport Rims!";
        } else if (colorSelect?.value === "black") {
            tip = "Black cars are often upgraded with Premium Interiors.";
        }
        if (rimsSelect?.value === "Luxury") {
            tip += " Luxury rims are trending this month.";
        }
        tipsBox.innerText = tip || "Tip: Customize your dream car!";
    }

    colorSelect?.addEventListener("change", updateTips);
    rimsSelect?.addEventListener("change", updateTips);
    interiorSelect?.addEventListener("change", updateTips);
}

// -------------------------------
// Update Assistant Suggestions
// -------------------------------
function updateAssistantSuggestions() {
    const cart = getCart();
    const viewed = getViewedCars();
    const assistantBody = document.getElementById("assistant-body");
    if (!assistantBody) return;

    if (cart.length > 0) {
        assistantBody.innerHTML = `You have ${cart.length} car(s) in your cart.<br>
        Most buyers also consider <b>Range Rover Sport</b> or <b>BMW X5</b>.`;
    } else if (viewed.length > 0) {
        assistantBody.innerHTML = `Since you viewed <b>${viewed[viewed.length - 1]}</b>, 
        you might also like <b>Tesla Model S</b> or <b>Toyota Corolla</b>.`;
    } else {
        assistantBody.innerHTML = "Need help finding the perfect car? I can suggest options!";
    }
}

// -------------------------------
// Sidebar Suggestion Content
// -------------------------------
function updateSidebarSuggestions() {
    const recommendList = document.getElementById("recommend-list");
    if (!recommendList) return;

    const suggestions = [
        "Upgrade to Sport Rims (+₦500,000)",
        "Premium Interior for Luxury SUVs",
        "People also like BMW X5",
        "Red cars are trending this week"
    ];

    recommendList.innerHTML = suggestions.map(item => `<li>${item}</li>`).join("");
}

// -------------------------------
// Initialize on Page Load
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
    createAssistantPopup();
    createSidebarRecommendations();
    setupCustomizerTips();
});
