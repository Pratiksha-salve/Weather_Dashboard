const apiKey = 'bc33ca9bd41712ad4e263715ca4988a7';
const search = document.getElementById('search-btn')

search.addEventListener('click', searching)

function searching() {
    const city = document.getElementById('city-input').value;
    
    // current weather conditions
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const localWeather = document.getElementById('local');
            localWeather.innerHTML = `<h1 class="text-2xl font-bold">${data.name}</h1>
                <p>Temperature: ${(data.main.temp - 273.15).toFixed(2)}°C</p>
                <p>Wind: ${data.wind.speed} m/s</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Condition: ${data.weather[0].description}</p>`;
        })
        .catch(error => console.log('Error:', error));
    
    // 5 day forecast
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
        .then(response => response.json())
        .then(forecast => {
            
            
            // Loop through the forecast data (forecast.list contains 40 items - every 3 hours interval)
            const weekForecast = document.getElementById("weekForecast");
            const forecastList = forecast.list;
            const dailyForecasts = [];

            // Group forecasts by day (e.g. every 24 hours)
            for (let i = 0; i < forecastList.length; i += 8) { // 8 intervals per day
                const dayData = forecastList[i];
                const day = new Date(dayData.dt_txt).toDateString();
                dailyForecasts.push(`
                    <div class="m-2 p-2 bg-gray-100 rounded-md shadow-md">
                        <h2 class="text-lg font-semibold">${day}</h2>
                        <p>Temp: ${(dayData.main.temp - 273.15).toFixed(2)}°C</p>
                        <p>Wind: ${dayData.wind.speed} m/s</p>
                        <p>Humidity: ${dayData.main.humidity}%</p>
                        <p>${dayData.weather[0].description}</p>
                        </div>
                        `);
            }       
        
        const days = document.getElementById("days");
        days.insertAdjacentHTML('afterbegin', `<h1 class="text-2xl font-semibold mb-4">5-Days Weather Forecast for ${forecast.city.name}</h1>`);
            
        weekForecast.innerHTML = dailyForecasts.join("");
    })
    .catch(error => console.log('Error:', error));
    
}
