const apiKey = "15f596d322eb1df7a7a31a4a21bc1a40";
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";

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

// Weather Logic
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
    const response = await fetch(`${weatherUrl}?q=${city}&appid=${apiKey}&units=metric`);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    weatherResult.innerHTML = `<p>Error: ${error.message}</p>`;
  }
});

function displayWeather(data) {
  const { name } = data;
  const { temp, humidity } = data.main;
  const { speed } = data.wind;
  const description = data.weather[0].description;

  weatherResult.innerHTML = `
    <h3>Weather in ${name}</h3>
    <p><strong>Temperature:</strong> ${temp}°C</p>
    <p><strong>Description:</strong> ${description}</p>
    <p><strong>Humidity:</strong> ${humidity}%</p>
    <p><strong>Wind Speed:</strong> ${speed} m/s</p>
  `;
}

// Quote of the Day (Optional)
const quoteBox = document.getElementById("quote-box");
fetch("https://api.quotable.io/random")
  .then(res => res.json())
  .then(data => {
    quoteBox.innerHTML = `"${data.content}" — <strong>${data.author}</strong>`;
  });
