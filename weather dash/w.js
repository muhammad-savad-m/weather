// const themeBtn = document.getElementById("themeBtn");

// themeBtn.addEventListener("click", function () {

//     document.body.classList.toggle("dark");

// });
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

const API_KEY = "YOUR_API_KEY_HERE";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const weatherCard = document.getElementById("weatherCard");
const loading = document.getElementById("loading");
const errorMsg = document.getElementById("errorMsg");


// ===============================
// GET WEATHER FROM API
// ===============================

async function getWeather(city) {

    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
        throw new Error("City not found");
    }

    const data = await response.json();

    return data;
}


// ===============================
// DISPLAY WEATHER
// ===============================

function displayWeather(data) {

    weatherCard.innerHTML = `

        <div class="weather-main">

            <div>
                <h2>${data.name}, ${data.sys.country}</h2>

                <p>
                    ${data.weather[0].description}
                </p>

                <h1 class="temperature">
                    ${Math.round(data.main.temp)}°C
                </h1>
            </div>

        </div>


        <div class="weather-details">

            <div class="detail">
                <strong>Feels Like</strong>
                <p>${Math.round(data.main.feels_like)}°C</p>
            </div>

            <div class="detail">
                <strong>Humidity</strong>
                <p>${data.main.humidity}%</p>
            </div>

            <div class="detail">
                <strong>Wind Speed</strong>
                <p>${data.wind.speed} m/s</p>
            </div>

            <div class="detail">
                <strong>Pressure</strong>
                <p>${data.main.pressure} hPa</p>
            </div>

        </div>

    `;

    weatherCard.classList.remove("hidden");
}


// ===============================
// SEARCH WEATHER
// ===============================

async function searchWeather(city) {

    try {

        // Show loading
        loading.classList.remove("hidden");

        // Hide previous error
        errorMsg.classList.add("hidden");

        // Hide old weather
        weatherCard.classList.add("hidden");


        // Get weather
        const data = await getWeather(city);


        // Display weather
        displayWeather(data);

    }

    catch (error) {

        errorMsg.textContent = error.message;

        errorMsg.classList.remove("hidden");

    }

    finally {

        // Hide loading
        loading.classList.add("hidden");

    }

}


// ===============================
// SEARCH BUTTON
// ===============================

searchBtn.addEventListener("click", function () {

    const city = cityInput.value.trim();


    if (city === "") {

        errorMsg.textContent = "Please enter a city name";

        errorMsg.classList.remove("hidden");

        return;
    }


    searchWeather(city);

});