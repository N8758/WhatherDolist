const apiKey = "15f596d322eb1df7a7a31a4a21bc1a40";
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";

const weatherForm = document.querySelector("form");
const cityInput = document.querySelector("#city");
const weatherDiv = document.querySelector("#weather");

weatherForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const city = cityInput.value.trim();

    if (city === "") {
        weatherDiv.innerHTML = "<p>Please enter a city name.</p>";
        return;
    }

    try {
        const response = await fetch(`${weatherUrl}?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        weatherDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    }
});

function displayWeather(data) {
    const { name } = data;
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    const description = data.weather[0].description;

    weatherDiv.innerHTML = `
        <h2>Weather in ${name}</h2>
        <p><strong>Temperature:</strong> ${temp}°C</p>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Humidity:</strong> ${humidity}%</p>
        <p><strong>Wind Speed:</strong> ${speed} m/s</p>
    `;
}
