const apiKey = "a5a9be07cfbb49d09b5bb0b5fff104e2";

const privacySelect = document.getElementById("privacy-select");
const manualEntry = document.getElementById("manual-entry");
const cityInput = document.getElementById("city-input");
const getWeatherBtn = document.getElementById("get-weather");
const weatherOutput = document.getElementById("weather-output");
const unitSwitchBtn = document.getElementById("unit-switch");

let isFahrenheit = false;
let currentWeatherData = null;

privacySelect.addEventListener("change", () => {
  const choice = privacySelect.value;
  manualEntry.style.display = choice === "manual" ? "block" : "none";

  if (choice === "precise") {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        fetchWeatherByCoords(lat, lon);
      },
      () => {
        weatherOutput.textContent = "Location access denied.";
      }
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
  if (city) {
    fetchWeatherByCity(city);
  } else {
    weatherOutput.textContent = "Please enter a city name.";
  }
});

unitSwitchBtn.addEventListener("click", () => {
  isFahrenheit = !isFahrenheit;
  unitSwitchBtn.textContent = isFahrenheit ? "Switch to °C" : "Switch to °F";

  if (currentWeatherData) {
    displayWeather(currentWeatherData);
  }
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
        return;
      }
      currentWeatherData = data; // store data
      displayWeather(data);
    })
    .catch(() => {
      weatherOutput.textContent = "Failed to fetch weather data.";
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
    <h2 tabindex="0">${data.name}, ${data.sys.country}</h2>
    <p tabindex="0">${data.weather[0].main} - ${data.weather[0].description}</p>
    <p tabindex="0">Temp: ${temp.toFixed(1)}${unit}</p>
    <p tabindex="0">Humidity: ${data.main.humidity}%</p>
    <p tabindex="0">Wind: ${data.wind.speed} m/s</p>
  `;
}




