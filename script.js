const apiKey = 'bc33ca9bd41712ad4e263715ca4988a7';
const search = document.getElementById('search-btn'); //get search button
const location = document.getElementById('location-btn') //get location button


// Search button event listener
search.addEventListener('click', function () {
    const cityInput = document.getElementById('city-input');
    const city = cityInput.value;
    if (city) {
        fetchWeatherByCity(city);// Pass the city value to the function
        cityInput.value =''; // Clear the input field
    } else {
        alert("Please enter a city name.");
    }
});


//location button event listener
location.addEventListener('click',()=>{
    navigator.geolocation.getCurrentPosition(success,error);

    const success = (position) => {
        console.log(position)
    }
    const error = () => {
        console.log('unable to get location')
    }
});

function fetchWeatherByCity(city) {

    const fiveDays = document.getElementById("weather5Days");
    fiveDays.innerHTML = ''; // Clears previous forecasts and the title

    // Fetch current weather conditions
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const todayWeather = document.getElementById('weatherToday');
            const iconURL = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

            todayWeather.innerHTML = `<div>
                <h1 class="text-2xl font-bold">${data.name}</h1>
                <p>Temperature: ${(data.main.temp - 273.15).toFixed(2)}°C</p>
                <p>Wind: ${data.wind.speed} m/s</p>
                <p>Humidity: ${data.main.humidity}%</p></div>
                <div>
                <img src="${iconURL}" alt="${data.weather[0].description} icon" />
                <p><b>${data.weather[0].description}</b></p></div>`;
        })
        .catch(error => console.log('Error:', error));

    // Fetch 5 day forecast
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
        .then(response => response.json())
        .then(forecast => {
            // Insert title for the 5-day forecast
            fiveDays.insertAdjacentHTML('afterbegin', `<h1 class="text-2xl font-semibold mb-4">5-Days Weather Forecast for ${forecast.city.name}</h1>`);

            // Create a div for the 5-day forecast tiles
            const weekForecast = document.createElement('div');
            weekForecast.classList.add('p-2', 'grid', 'grid-cols-1', 'md:grid-cols-3', 'lg:grid-cols-5', 'gap-2');
            fiveDays.appendChild(weekForecast); // Append this div to the fiveDays section

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

}