const API_KEY = "a74c3c31385c4ff89fa180808261602";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const currentWeatherDiv = document.getElementById("currentWeather");
const forecastCardsDiv = document.getElementById("forecastCards");
const insightsDiv = document.getElementById("insights");

const unitC = document.getElementById("unitC");
const unitF = document.getElementById("unitF");

let currentUnit = "C";

searchBtn.addEventListener("click", () => {
  fetchWeather(cityInput.value);
});

unitC.addEventListener("click", () => {
  currentUnit = "C";
  unitC.classList.add("active");
  unitF.classList.remove("active");
  fetchWeather(cityInput.value);
});

unitF.addEventListener("click", () => {
  currentUnit = "F";
  unitF.classList.add("active");
  unitC.classList.remove("active");
  fetchWeather(cityInput.value);
});

async function fetchWeather(city) {
  if (!city) return;

  const res = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=5`
  );
  const data = await res.json();

  if (data.error) {
    currentWeatherDiv.innerHTML = "City not found";
    return;
  }

  showWeather(data);
  showForecast(data);
  showInsights(data);
}

/* 🌡 Weather Display */
function showWeather(data) {
  const temp =
    currentUnit === "C"
      ? data.current.temp_c
      : data.current.temp_f;

  currentWeatherDiv.innerHTML = `
    <h2>${data.location.name}</h2>
    <img src="${data.current.condition.icon}">
    <strong>${temp}°${currentUnit}</strong>
    <p>${data.current.condition.text}</p>
  `;
}

/* 📅 Forecast */
function showForecast(data) {
  forecastCardsDiv.innerHTML = "";

  data.forecast.forecastday.forEach(day => {
    forecastCardsDiv.innerHTML += `
      <div class="forecast-card">
        <p>${new Date(day.date).toLocaleDateString('en-US',{weekday:'short'})}</p>
        <img src="${day.day.condition.icon}">
        <p>${day.day.maxtemp_c}°</p>
      </div>
    `;
  });
}

/* 🧠 SMART LOGIC */

function getSmartAdvice(temp, condition) {
  condition = condition.toLowerCase();

  if (temp > 35) return "🔥 Extreme heat. Stay indoors.";
  if (temp > 28) return "☀️ Warm. Stay hydrated.";
  if (condition.includes("rain")) return "🌧 Carry umbrella.";
  if (condition.includes("mist")) return "🌫 Low visibility.";
  return "🌤 Good weather.";
}

function getTrend(data) {
  const temps = data.forecast.forecastday.map(d => d.day.maxtemp_c);

  if (temps[4] > temps[0]) return "📈 Warming trend";
  if (temps[4] < temps[0]) return "📉 Cooling trend";
  return "➖ Stable weather";
}

function getActivity(temp) {
  if (temp > 32) return "🥵 Avoid outdoor workouts";
  if (temp < 15) return "🧥 Cold for outdoor activity";
  return "🏃 Good for outdoor activity";
}

/* 📊 INSIGHTS */
function showInsights(data) {
  const temp = data.current.temp_c;
  const condition = data.current.condition.text;

  insightsDiv.innerHTML = `
    <p><strong>💡 Insight:</strong> ${getSmartAdvice(temp, condition)}</p>
    <p><strong>📊 Trend:</strong> ${getTrend(data)}</p>
    <p><strong>🎯 Activity:</strong> ${getActivity(temp)}</p>
    <p><strong>🧠 Summary:</strong> Today is ${condition}, ${temp}°C in ${data.location.name}.</p>
  `;
}