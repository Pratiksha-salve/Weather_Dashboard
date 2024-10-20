const apiKey = 'bc33ca9bd41712ad4e263715ca4988a7';
const search = document.getElementById('search-btn');

search.addEventListener('click', searching);

function searching() {

    const cityInput = document.getElementById('city-input'); // Get the input element
    const city = cityInput.value; // Get the current value of the input
    if (city === '') {
        return alert("Please enter a city name.");
    }

    // Clear the previous forecast data
    const days = document.getElementById("days");
    days.innerHTML = ''; // Clears previous forecasts and the title

    // current weather conditions
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const localWeather = document.getElementById('local');
            const iconURL = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

            localWeather.innerHTML = `<div>
                <h1 class="text-2xl font-bold">${data.name}</h1>
                <p>Temperature: ${(data.main.temp - 273.15).toFixed(2)}°C</p>
                <p>Wind: ${data.wind.speed} m/s</p>
                <p>Humidity: ${data.main.humidity}%</p></div>
                <div>
                <img src="${iconURL}" alt="${data.weather[0].description} icon" />
                <p><b>${data.weather[0].description}</b></p></div>`;
        })
        .catch(error => console.log('Error:', error));

    // 5 day forecast
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
        .then(response => response.json())
        .then(forecast => {
            // Insert title for the 5-day forecast
            days.insertAdjacentHTML('afterbegin', `<h1 class="text-2xl font-semibold mb-4">5-Days Weather Forecast for ${forecast.city.name}</h1>`);

            // Create a div for the 5-day forecast tiles
            const weekForecast = document.createElement('div');
            weekForecast.classList.add('p-2', 'grid', 'grid-cols-1', 'md:grid-cols-3', 'lg:grid-cols-5', 'gap-2');
            days.appendChild(weekForecast); // Append this div to the days section
            
            const forecastList = forecast.list;
            const dailyForecasts = [];

            // Group forecasts by day (e.g., every 24 hours)
            for (let i = 0; i < forecastList.length; i += 8) { // 8 intervals per day
                const dayData = forecastList[i];
                const day = new Date(dayData.dt_txt).toDateString();
                const url = `https://openweathermap.org/img/wn/${dayData.weather[0].icon}.png`;

                dailyForecasts.push(`
                    <div class="m-2 p-2 bg-blue-100 rounded-md shadow-md text-sm">
                        <h2 class="text-sm font-semibold">${day}</h2>
                        <p><b>${dayData.weather[0].description}</b></p>
                        <img src="${url}" alt="${dayData.weather[0].description} icon" />
                        <p>Temp: ${(dayData.main.temp - 273.15).toFixed(2)}°C</p>
                        <p>Wind: ${dayData.wind.speed} m/s</p>
                        <p>Humidity: ${dayData.main.humidity}%</p>
                    </div>
                `);
            }
            weekForecast.innerHTML = dailyForecasts.join(""); // Insert forecast into the weekForecast div
        })
        .catch(error => console.log('Error:', error));

    cityInput.value = ''; // Clear the input field
}
