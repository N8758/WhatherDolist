// ==== Theme Toggle ====
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  themeIcon.src = document.body.classList.contains('dark-mode')
    ? "icons/dark-mode.png"
    : "icons/light-mode.png";
});

// ==== To-Do List with LocalStorage ====
const taskInput = document.getElementById('task-input');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');

// Load tasks from localStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(text => addTask(text));
}

// Save tasks to localStorage
function saveTasks() {
  const tasks = Array.from(taskList.children).map(li =>
    li.firstChild.textContent.trim()
  );
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add a task
function addTask(taskText) {
  if (!taskText) return;

  const li = document.createElement('li');
  li.innerHTML = `
    <span>${escapeHTML(taskText)}</span>
    <img src="icons/delete-task.png" class="delete-btn" style="width: 20px; height: 20px;">
  `;

  li.querySelector('.delete-btn').addEventListener('click', () => {
    li.remove();
    saveTasks();
  });

  taskList.appendChild(li);
  saveTasks();
}

// Handle add task
addTaskButton.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  if (!taskText) return alert("⚠️ Please enter a task!");
  addTask(taskText);
  taskInput.value = '';
});

// Add task on Enter
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTaskButton.click();
});

loadTasks();

// ==== Weather Fetch (Open-Meteo) ====
const getWeatherButton = document.getElementById('get-weather');
const cityInput = document.getElementById('city-input');
const weatherResult = document.getElementById('weather-result');

getWeatherButton.addEventListener('click', fetchWeather);
cityInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') fetchWeather();
});

async function fetchWeather() {
  const city = cityInput.value.trim();
  if (!city) {
    weatherResult.innerHTML = `<p>⚠️ Please enter a city name.</p>`;
    return;
  }

  weatherResult.innerHTML = `<p>Loading...</p>`;

  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      weatherResult.innerHTML = `<p>❌ City not found: ${escapeHTML(city)}.</p>`;
      return;
    }

    const { latitude, longitude, name } = geoData.results[0];

    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
    const weatherData = await weatherRes.json();

    const { temperature, weathercode } = weatherData.current_weather;
    const condition = getWeatherCondition(weathercode);
    const icon = getWeatherIcon(condition);

    const time = new Date().toLocaleString();

    weatherResult.innerHTML = `
      <h3>${escapeHTML(name)}</h3>
      <p>${time}</p>
      <p>🌡 ${temperature}°C - ${condition}</p>
      <img src="icons/${icon}" alt="${condition}" style="width: 40px; height: 40px;">
    `;
  } catch (error) {
    console.error("Weather fetch error:", error);
    weatherResult.innerHTML = `<p>⚠️ Error fetching weather. Please try again later.</p>`;
  }
}

// === Weather Code to Description ===
function getWeatherCondition(code) {
  const conditions = {
    0: "Clear",
    1: "Clear",
    2: "Partly Cloudy",
    3: "Cloudy",
    45: "Fog",
    48: "Fog",
    51: "Drizzle",
    53: "Drizzle",
    55: "Drizzle",
    61: "Rain",
    63: "Rain",
    65: "Heavy Rain",
    71: "Snow",
    73: "Snow",
    75: "Heavy Snow",
    95: "Thunderstorm"
  };
  return conditions[code] || "Cloudy";
}

// === Weather Condition to Icon ===
function getWeatherIcon(condition) {
  const icons = {
    "Clear": "clear-sky.png",
    "Partly Cloudy": "cloudy.png",
    "Cloudy": "cloudy.png",
    "Fog": "cloudy.png",
    "Drizzle": "rain.png",
    "Rain": "rain.png",
    "Heavy Rain": "rain.png",
    "Snow": "snow.png",
    "Heavy Snow": "snow.png",
    "Thunderstorm": "storm.png"
  };
  return icons[condition] || "cloudy.png";
}

// === Sanitize HTML ===
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, match => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[match]
  ));
}
