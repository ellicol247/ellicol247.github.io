const apiKey = "a5a9be07cfbb49d09b5bb0b5fff104e2";

const privacySelect = document.getElementById("privacy-select");
const manualEntry = document.getElementById("manual-entry");
const cityInput = document.getElementById("city-input");
const getWeatherBtn = document.getElementById("get-weather");
const weatherOutput = document.getElementById("weather-output");
const unitSwitchBtn = document.getElementById("unit-switch");
const saveCityBtn = document.getElementById("save-city");
const savedCitiesContainer = document.getElementById("saved-cities-container");

let isFahrenheit = false;
let currentWeatherData = null;
let savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];


privacySelect.addEventListener("change", () => {
  const choice = privacySelect.value;
  manualEntry.style.display = choice === "manual" ? "block" : "none";

  if (choice === "precise") {
    navigator.geolocation.getCurrentPosition(
      pos => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
      () => (weatherOutput.textContent = "Location access denied.")
    );
  } else if (choice === "city") {
    fetch("https://ipapi.co/json/")
      .then(res => res.json())
      .then(data => {
        if (data.city) {
          fetchWeatherByCity(data.city);
        } else {
          weatherOutput.textContent = "Could not detect city from IP.";
        }
      })
      .catch(() => {
        weatherOutput.textContent = "Failed to detect city.";
      });
  }
});

getWeatherBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) fetchWeatherByCity(city);
  else weatherOutput.textContent = "Please enter a city name.";
});

unitSwitchBtn.addEventListener("click", () => {
  isFahrenheit = !isFahrenheit;
  unitSwitchBtn.textContent = isFahrenheit ? "Switch to °C" : "Switch to °F";
  if (currentWeatherData) displayWeather(currentWeatherData);
  displaySavedCities();
});

saveCityBtn.addEventListener("click", () => {
  if (!currentWeatherData) return;

  const cityName = currentWeatherData.name;
  if (savedCities.some(c => c.name === cityName)) return;

  savedCities.push({ name: cityName, data: currentWeatherData });
  localStorage.setItem("savedCities", JSON.stringify(savedCities));
  displaySavedCities();
});

function fetchWeatherByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  fetchWeather(url);
}

function fetchWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  fetchWeather(url);
}

function fetchWeather(url) {
  weatherOutput.textContent = "Loading weather...";
  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) {
        weatherOutput.textContent = "Error: " + data.message;
        saveCityBtn.disabled = true;
        return;
      }
      currentWeatherData = data;
      displayWeather(data);
      saveCityBtn.disabled = false;
    })
    .catch(() => {
      weatherOutput.textContent = "Failed to fetch weather data.";
      saveCityBtn.disabled = true;
    });
}

function displayWeather(data) {
  let temp = data.main.temp;
  let unit = "°C";
  if (isFahrenheit) {
    temp = (temp * 9) / 5 + 32;
    unit = "°F";
  }

  weatherOutput.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p>${data.weather[0].main} - ${data.weather[0].description}</p>
    <p>Temp: ${temp.toFixed(1)}${unit}</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind: ${data.wind.speed} m/s</p>
  `;
}

function displaySavedCities() {
  savedCitiesContainer.innerHTML = "";

  savedCities.forEach((item, index) => {
    const data = item.data;
    let temp = data.main.temp;
    let unit = "°C";
    if (isFahrenheit) {
      temp = (temp * 9) / 5 + 32;
      unit = "°F";
    }

    const card = document.createElement("div");
    card.className = "saved-card";
    card.innerHTML = `
      <div class="card-header">
        <h4 class="city-name" data-city="${data.name}" title="Click to view">${data.name}, ${data.sys.country}</h4>
        <button class="remove-btn" title="Remove city" data-index="${index}">Delete</button>
      </div>
      <p>${data.weather[0].main}</p>
      <p>${temp.toFixed(1)}${unit}</p>
    `;
    savedCitiesContainer.appendChild(card);
  });

  // remove saved cities
  document.querySelectorAll(".remove-btn").forEach(btn =>
    btn.addEventListener("click", e => {
      const idx = e.target.dataset.index;
      savedCities.splice(idx, 1);
      localStorage.setItem("savedCities", JSON.stringify(savedCities));
      displaySavedCities();
    })
  );

  // click city to reload
  document.querySelectorAll(".city-name").forEach(el =>
    el.addEventListener("click", e => {
      const city = e.target.dataset.city;
      fetchWeatherByCity(city);
      window.scrollTo({ top: 0, behavior: "smooth" });
    })
  );
}

displaySavedCities();

