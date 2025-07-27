// Clock & Greeting
const clock = document.getElementById("clock");
const greeting = document.getElementById("greeting");

function updateClock() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString();

  const hours = now.getHours();
  if (hours < 12) {
    greeting.textContent = "Good Morning 🌅";
  } else if (hours < 18) {
    greeting.textContent = "Good Afternoon ☀️";
  } else {
    greeting.textContent = "Good Evening 🌙";
  }
}
setInterval(updateClock, 1000);
updateClock();

// To-Do Logic
const addBtn = document.getElementById("add-task");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

addBtn.addEventListener("click", () => {
  const task = taskInput.value.trim();
  if (task !== "") {
    const li = document.createElement("li");
    li.textContent = task;

    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.addEventListener("click", () => li.remove());

    li.appendChild(delBtn);
    taskList.appendChild(li);
    taskInput.value = "";
  }
});

// Weather Logic (Using Open-Meteo + Nominatim)
const cityInput = document.getElementById("city-input");
const getWeatherBtn = document.getElementById("get-weather");
const weatherResult = document.getElementById("weather-result");

getWeatherBtn.addEventListener("click", async () => {
  const city = cityInput.value.trim();
  if (city === "") {
    weatherResult.innerHTML = "<p>Please enter a city name.</p>";
    return;
  }

  try {
    const coordinates = await getCoordinates(city);
    const weatherData = await getWeather(coordinates.lat, coordinates.lon);
    displayWeather(city, weatherData);
  } catch (error) {
    weatherResult.innerHTML = `<p>Error: ${error.message}</p>`;
  }
});

// Get latitude and longitude from city name
async function getCoordinates(city) {
  const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`;
  const response = await fetch(geoUrl);
  const data = await response.json();
  if (data.length === 0) throw new Error("City not found");
  return { lat: data[0].lat, lon: data[0].lon };
}

// Get weather from Open-Meteo
async function getWeather(lat, lon) {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
  const response = await fetch(weatherUrl);
  const data = await response.json();
  if (!data.current_weather) throw new Error("Weather data not found");
  return data.current_weather;
}

// Display weather in HTML
function displayWeather(city, data) {
  weatherResult.innerHTML = `
    <h3>Weather in ${city}</h3>
    <p><strong>Temperature:</strong> ${data.temperature}°C</p>
    <p><strong>Wind Speed:</strong> ${data.windspeed} m/s</p>
    <p><strong>Time:</strong> ${data.time}</p>
  `;
}

// Quote of the Day (Optional)
const quoteBox = document.getElementById("quote-box");
fetch("https://api.quotable.io/random")
  .then(res => res.json())
  .then(data => {
    quoteBox.innerHTML = `"${data.content}" — <strong>${data.author}</strong>`;
  });
