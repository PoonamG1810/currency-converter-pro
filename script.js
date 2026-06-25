// ================================
// DOM Elements
// ================================

const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");

const fromFlag = document.getElementById("fromFlag");
const toFlag = document.getElementById("toFlag");

const convertBtn = document.getElementById("convertBtn");
const swapBtn = document.getElementById("swapBtn");

const result = document.getElementById("result");
const exchangeRate = document.getElementById("exchangeRate");

const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

const themeToggle = document.getElementById("themeToggle");
const favoritesList =
document.getElementById("favoritesList");

const addFavoriteBtn =
document.getElementById("addFavoriteBtn");

// ================================
// Currency List
// ================================

const currencies = [
    { code: "USD", name: "US Dollar", country: "US" },
    { code: "INR", name: "Indian Rupee", country: "IN" },
    { code: "EUR", name: "Euro", country: "EU" },
    { code: "GBP", name: "British Pound", country: "GB" },
    { code: "JPY", name: "Japanese Yen", country: "JP" },
    { code: "AUD", name: "Australian Dollar", country: "AU" },
    { code: "CAD", name: "Canadian Dollar", country: "CA" },
    { code: "SGD", name: "Singapore Dollar", country: "SG" },
    { code: "AED", name: "UAE Dirham", country: "AE" },
    { code: "CHF", name: "Swiss Franc", country: "CH" }
];

// ================================
// Populate Dropdowns
// ================================

function loadCurrencies() {

    currencies.forEach(currency => {

        const option1 = document.createElement("option");
        option1.value = currency.code;
        option1.textContent =
            `${currency.code} - ${currency.name}`;

        const option2 = option1.cloneNode(true);

        fromCurrency.appendChild(option1);
        toCurrency.appendChild(option2);

    });

    fromCurrency.value = "USD";
    toCurrency.value = "INR";

    updateFlags();
}

loadCurrencies();

// ================================
// Searchable Dropdowns
// ================================

new TomSelect("#fromCurrency");
new TomSelect("#toCurrency");

// ================================
// Update Flags
// ================================

function updateFlags() {

    const fromObj =
        currencies.find(c =>
            c.code === fromCurrency.value);

    const toObj =
        currencies.find(c =>
            c.code === toCurrency.value);

    if (fromObj) {
        fromFlag.src =
            `https://flagsapi.com/${fromObj.country}/flat/64.png`;
    }

    if (toObj) {
        toFlag.src =
            `https://flagsapi.com/${toObj.country}/flat/64.png`;
    }
}

fromCurrency.addEventListener("change", updateFlags);
toCurrency.addEventListener("change", updateFlags);

// ================================
// Theme
// ================================

if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark");
    themeToggle.textContent = "☀️ Light Mode";

}

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "☀️ Light Mode";

    } else {

        localStorage.setItem("theme", "light");
        themeToggle.textContent = "🌙 Dark Mode";

    }

});


// ================================
// History
// ================================

function loadHistory() {

    const history =
        JSON.parse(
            localStorage.getItem("currencyHistory")
        ) || [];

    historyList.innerHTML = "";

    history.forEach(item => {

        const li =
            document.createElement("li");

        li.textContent = item;

        historyList.appendChild(li);

    });

}

loadHistory();

function saveHistory(text) {

    let history =
        JSON.parse(
            localStorage.getItem("currencyHistory")
        ) || [];

    history.unshift(text);

    if (history.length > 15) {
        history.pop();
    }

    localStorage.setItem(
        "currencyHistory",
        JSON.stringify(history)
    );

    loadHistory();
}

clearHistoryBtn.addEventListener("click", () => {

    localStorage.removeItem(
        "currencyHistory"
    );

    historyList.innerHTML = "";

});

// ================================
// Currency Conversion
// ================================

async function convertCurrency() {

    const amount =
        Number(amountInput.value);

    if (!amount || amount <= 0) {

        alert("Please enter a valid amount.");
        return;

    }

    const from = fromCurrency.value;
    const to = toCurrency.value;

    try {

        convertBtn.disabled = true;
        convertBtn.textContent =
            "Converting...";

        const response =
            await fetch(
                `https://open.er-api.com/v6/latest/${from}`
            );

        if (!response.ok) {
            throw new Error(
                "Failed to fetch rates"
            );
        }

        const data =
            await response.json();

        const rate =
            data.rates[to];

        const converted =
            (amount * rate).toFixed(2);

        result.textContent =
            `${amount} ${from} = ${converted} ${to}`;

        exchangeRate.textContent =
            `1 ${from} = ${rate.toFixed(4)} ${to}`;

        saveHistory(
            `${amount} ${from} → ${converted} ${to}`
        );

    }
    catch (error) {

        console.error(error);

        result.textContent =
            "❌ Conversion failed";

        exchangeRate.textContent =
            "Please try again later.";

    }
    finally {

        convertBtn.disabled = false;
        convertBtn.textContent =
            "Convert Currency";

    }

}

// ================================
// Convert Button
// ================================

convertBtn.addEventListener(
    "click",
    convertCurrency
);

// ================================
// Enter Key Support
// ================================

amountInput.addEventListener(
    "keydown",
    (e) => {

        if (e.key === "Enter") {
            convertCurrency();
        }

    }
);

// ================================
// Swap Button
// ================================

swapBtn.addEventListener("click", () => {

    const temp =
        fromCurrency.value;

    fromCurrency.value =
        toCurrency.value;

    toCurrency.value =
        temp;

    updateFlags();

});

// ================================
// Auto Refresh Flags
// ================================

updateFlags();
// ================================
// Favorites
// ================================

function loadFavorites(){

    const favorites =
    JSON.parse(
        localStorage.getItem("favorites")
    ) || [];

    favoritesList.innerHTML = "";

    favorites.forEach(pair => {

        const li =
        document.createElement("li");

        li.textContent = pair;

        li.addEventListener("click", () => {

            const parts =
            pair.split(" → ");

            fromCurrency.value = parts[0];
            toCurrency.value = parts[1];

            updateFlags();

        });

        favoritesList.appendChild(li);

    });

}

loadFavorites();

addFavoriteBtn.addEventListener("click", () => {

    let favorites =
    JSON.parse(
        localStorage.getItem("favorites")
    ) || [];

    const pair =
    `${fromCurrency.value} → ${toCurrency.value}`;

    if(!favorites.includes(pair)){

        favorites.push(pair);

        localStorage.setItem(
            "favorites",
            JSON.stringify(favorites)
        );

        loadFavorites();

    }

});