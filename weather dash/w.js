const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeBtn.textContent = "☀️ Light";
    } else {
        themeBtn.textContent = "🌙 Dark";
    }

});
// ===============================
// WEATHER SEARCH
// ===============================

const API_KEY = 'a932f6988cbc282c83490aa219dbea0b';


// ===============================
// 1. GET WEATHER
// ===============================

async function getWeather(city) {

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);

    const data = await response.json();

    console.log("API Response:", data);

    if (!response.ok) {
        throw new Error(data.message || "Weather request failed");
    }

    return data;
}


// ===============================
// 2. ADD FAVORITE
// ===============================

function addFavorite(city) {

    let favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.includes(city)) {
        return;
    }

    favorites.push(city);

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    loadFavorites();
}


// ===============================
// 3. LOAD FAVORITES
// ===============================

function loadFavorites() {

    const favoritesList =
        document.getElementById("favoritesList");

    const favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    favoritesList.innerHTML = "";

    favorites.forEach(function (city) {

        const button = document.createElement("button");

        button.textContent = city;

        button.addEventListener("click", function () {
            searchWeather(city);
        });

        favoritesList.appendChild(button);
    });
}


// ===============================
// 4. SEARCH WEATHER
// ===============================

async function searchWeather(city) {

    city = city.trim();

    if (city === "") {
        return;
    }

    const loading =
        document.getElementById("loading");

    const errorMsg =
        document.getElementById("errorMsg");

    const weatherCard =
        document.getElementById("weatherCard");


    try {

        // Show loading
        loading.classList.remove("hidden");

        // Hide old error
        errorMsg.classList.add("hidden");

        // Get weather
        const result = await getWeather(city);

        // Hide loading
        loading.classList.add("hidden");

        // Show weather card
        weatherCard.classList.remove("hidden");


        weatherCard.innerHTML = `

            <h2>${result.name}</h2>

            <p class="temperature">
                ${Math.round(result.main.temp)}°C
            </p>

            <p>
                Feels like:
                ${Math.round(result.main.feels_like)}°C
            </p>

            <p>
                Humidity:
                ${result.main.humidity}%
            </p>

            <p>
                Weather:
                ${result.weather[0].description}
            </p>

            <p>
                Wind:
                ${result.wind.speed} m/s
            </p>

            <button id="favoriteBtn">
                ⭐ Add to Favorites
            </button>

        `;


        // Favorite button
        document
            .getElementById("favoriteBtn")
            .addEventListener("click", function () {

                addFavorite(result.name);

            });


    } catch (error) {

        console.error("Weather Error:", error);

        loading.classList.add("hidden");

        weatherCard.classList.add("hidden");

        errorMsg.textContent =
            "Error: " + error.message;

        errorMsg.classList.remove("hidden");
    }
}


// ===============================
// 5. DEBOUNCE
// ===============================

function debounceSearch() {

    let timer;

    return function (city) {

        clearTimeout(timer);

        timer = setTimeout(function () {

            searchWeather(city);

        }, 500);
    };
}


const debouncedSearch = debounceSearch();


// ===============================
// 6. CITY INPUT
// ===============================

const cityInput =
    document.getElementById("cityInput");


cityInput.addEventListener("input", function (e) {

    const city = e.target.value;

    if (city.trim() !== "") {

        debouncedSearch(city);

    }
});


// ===============================
// 7. DOM LOADED
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    loadFavorites();


    // Search button
    document
        .getElementById("searchBtn")
        .addEventListener("click", function () {

            const city =
                document.getElementById("cityInput").value;

            searchWeather(city);

        });


    // Enter key
    cityInput.addEventListener("keydown", function (e) {

        if (e.key === "Enter") {

            searchWeather(cityInput.value);

        }

    });

});
