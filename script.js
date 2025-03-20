// Light/Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeIcon.src = document.body.classList.contains('dark-mode') ? "icons/dark-mode.png" : "icons/light-mode.png";
});

// To-Do List Logic (Fully Fixed)
const taskInput = document.getElementById('task-input');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');

addTaskButton.addEventListener('click', () => {
    let taskText = taskInput.value.trim();
    if (taskText === "") {
        alert("Please enter a task!"); // Alert if input is empty
        return;
    }

    let li = document.createElement('li');
    li.innerHTML = `
        ${taskText} 
        <img src="icons/delete-task.png" class="delete-btn" style="width: 20px; height: 20px;">
    `;

    taskList.appendChild(li);
    taskInput.value = ""; // Clear input after adding

    // Add event listener for delete button
    li.querySelector(".delete-btn").addEventListener("click", () => {
        li.remove();
    });
});

// Weather App Logic (Using Open-Meteo - No API Key Required)
const getWeatherButton = document.getElementById('get-weather');
const cityInput = document.getElementById('city-input');
const weatherResult = document.getElementById('weather-result');

getWeatherButton.addEventListener('click', async () => {
    let city = cityInput.value.trim();
    if (city === "") {
        weatherResult.innerHTML = `<p>⚠️ Please enter a city name.</p>`;
        return;
    }

    try {
        // Get latitude and longitude for the city
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
        const geoData = await geoResponse.json();

        if (!geoData.results) {
            weatherResult.innerHTML = `<p>❌ City not found: ${city}. Try again.</p>`;
            return;
        }

        let lat = geoData.results[0].latitude;
        let lon = geoData.results[0].longitude;

        // Fetch weather data using lat/lon
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const weatherData = await weatherResponse.json();

        let temperature = weatherData.current_weather.temperature + "°C";
        let condition = getWeatherCondition(weatherData.current_weather.weathercode);
        let icon = getWeatherIcon(condition);

        weatherResult.innerHTML = `
            <h3>${geoData.results[0].name}</h3>
            <p>🌡 ${temperature} - ${condition}</p>
            <img src="icons/${icon}" alt="${condition}" style="width: 40px; height: 40px;">
        `;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        weatherResult.innerHTML = `<p>⚠️ Error fetching weather data. Please try again later.</p>`;
    }
});

// Function to convert weather code to condition
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

// Function to get weather icon
function getWeatherIcon(condition) {
    const weatherIcons = {
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
    return weatherIcons[condition] || "cloudy.png";
}
