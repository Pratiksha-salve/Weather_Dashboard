const apiKey = 'bc33ca9bd41712ad4e263715ca4988a7';
const search = document.getElementById('search-btn'); //get search button


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


function fetchWeatherByCity(city) {

    const fiveDays = document.getElementById("weather5Days");
    fiveDays.innerHTML = ''; // Clears previous forecasts and the title

    // Fetch current weather conditions
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const todayWeather = document.getElementById('weatherToday');
            const iconURL = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

                        // Set background color based on weather condition
                        let backgroundColor = '';
                        switch (data.weather[0].main) {
                            case 'Clear':
                                backgroundColor = 'bg-sky-200';
                                break;
                            case 'Clouds':
                                backgroundColor = 'bg-gray-300';
                                break;
                            case 'Rain':
                                backgroundColor = 'bg-blue-500';
                                break;
                            case 'Snow':
                                backgroundColor = 'bg-white';
                                break;
                            case 'Thunderstorm':
                                backgroundColor = 'bg-purple-300';
                                break;
                            default:
                                backgroundColor = 'bg-gray-100'; // Default color
                                break;
                        }
            
                        // Update the background color of the div
                        todayWeather.className = `rounded transition-colors duration-300 shadow-lg rounded-lg p-4 flex flex-row justify-between ${backgroundColor}`;

            todayWeather.innerHTML = `<div>
                <h1 class="text-2xl font-bold">${data.name}</h1>
                <p>Temperature: ${(data.main.temp - 273.15).toFixed(2)}°C</p>
                <p>Wind: ${data.wind.speed} m/s</p>
                <p>Humidity: ${data.main.humidity}%</p></div>
                <div>
                <img src="${iconURL}" alt="${data.weather[0].description} icon" />
                <p><b>${data.weather[0].description}</b></p></div>`;

            // Store current weather data in localStorage
            localStorage.setItem('currentWeather', JSON.stringify(data));
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

                let backgroundColor = '';
        switch (dayData.weather[0].main) {
            case 'Clear':
                backgroundColor = 'bg-sky-200';
                break;
            case 'Clouds':
                backgroundColor = 'bg-gray-300';
                break;
            case 'Rain':
                backgroundColor = 'bg-blue-300';
                break;
            case 'Snow':
                backgroundColor = 'bg-white';
                break;
            case 'Thunderstorm':
                backgroundColor = 'bg-purple-300';
                break;
            default:
                backgroundColor = 'bg-gray-100'; // Default color
                break;
        }

                dailyForecasts.push(`
                    <div class="flex flex-row md:flex-col m-2 p-2 ${backgroundColor} rounded-md shadow-md text-base md:text-sm justify-evenly lg:justify-start items-center lg:items-start">
                <div>
                    <h2 class="text-sm font-semibold mb-2">${day}</h2>
                    <p>Temp: ${(dayData.main.temp - 273.15).toFixed(2)}°C</p>
                    <p>Wind: ${dayData.wind.speed} m/s</p>
                    <p>Humidity: ${dayData.main.humidity}%</p>
                </div>
                <div class="flex justify-center flex-col md:flex-col-reverse md:items-start mt-2">
                    <img src="${url}" alt="${dayData.weather[0].description} icon" />
                    <p><b>${dayData.weather[0].description}</b></p>
                </div>
                </div>
                `);
            }
            weekForecast.innerHTML = dailyForecasts.join(""); // Insert forecast into the weekForecast div
            
            // Store 5-day forecast data in localStorage
            localStorage.setItem('fiveDayForecast', JSON.stringify(forecast));

        })
        .catch(error => console.log('Error:', error));

}


const locationbtn = document.getElementById('location-btn'); // Get location button

// Add event listener for the location button
locationbtn.addEventListener('click', fetchWeatherByLocation);

function fetchWeatherByLocation() {
    console.log("Button clicked");

    const success = (position) => {
        const latitude = position.coords.latitude;  // Access latitude
        const longitude = position.coords.longitude; // Access longitude

        // Fetch reverse geocoding data
        fetch(`https://api-bdc.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
            .then(res => res.json())
            .then(cityName => {
                const city = cityName.city; // get the city name

                fetchWeatherByCity(city) //give the weather.
            })
            .catch(error => console.log('Error:', error));
    };

    const error = () => {
        console.log("Error retrieving location");
    };

    // Request the user's location with high accuracy enabled
    const options = {
        enableHighAccuracy: true, // Request high accuracy
        timeout: 10000,           // Timeout in milliseconds
        maximumAge: 0             // No caching
    };

    navigator.geolocation.getCurrentPosition(success, error, options); // gets users location
}


// Function to load data from localStorage and display it on the page
function loadWeatherFromLocalStorage() {
    const currentWeather = JSON.parse(localStorage.getItem('currentWeather'));
    const fiveDayForecast = JSON.parse(localStorage.getItem('fiveDayForecast'));

    if (currentWeather) {
        const todayWeather = document.getElementById('weatherToday');
        const iconURL = `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`;

        // Set background color based on weather condition
        let backgroundColor = '';
        switch (currentWeather.weather[0].main) {
            case 'Clear':
                backgroundColor = 'bg-sky-200';
                break;
            case 'Clouds':
                backgroundColor = 'bg-gray-300';
                break;
            case 'Rain':
                backgroundColor = 'bg-blue-300';
                break;
            case 'Snow':
                backgroundColor = 'bg-white';
                break;
            case 'Thunderstorm':
                backgroundColor = 'bg-purple-300';
                break;
            default:
                backgroundColor = 'bg-gray-100'; // Default color
                break;
        }

        // Update the background color of the div
        todayWeather.className = `rounded transition-colors duration-300 shadow-lg rounded-lg p-4 flex flex-row justify-between ${backgroundColor}`;

        todayWeather.innerHTML = `<div>
            <h1 class="text-2xl font-bold">${currentWeather.name}</h1>
            <p>Temperature: ${(currentWeather.main.temp - 273.15).toFixed(2)}°C</p>
            <p>Wind: ${currentWeather.wind.speed} m/s</p>
            <p>Humidity: ${currentWeather.main.humidity}%</p>
            </div>
            <div>
            <img src="${iconURL}" alt="${currentWeather.weather[0].description} icon" />
            <p><b>${currentWeather.weather[0].description}</b></p>
            </div>`;
    }

    if (fiveDayForecast) {
        const fiveDays = document.getElementById("weather5Days");
        fiveDays.innerHTML = `<h1 class="text-2xl font-semibold mb-4">5-Days Weather Forecast for ${fiveDayForecast.city.name}</h1>`;

        const weekForecast = document.createElement('div');
        weekForecast.classList.add('p-2', 'grid', 'grid-cols-1', 'md:grid-cols-3', 'lg:grid-cols-5', 'gap-2');
        fiveDays.appendChild(weekForecast);

        const forecastList = fiveDayForecast.list;
        const dailyForecasts = [];

        // Group forecasts by day (e.g., every 24 hours)
        for (let i = 0; i < forecastList.length; i += 8) { // 8 intervals per day
            const dayData = forecastList[i];
            const day = new Date(dayData.dt_txt).toDateString();
            const url = `https://openweathermap.org/img/wn/${dayData.weather[0].icon}.png`;

            let backgroundColor = '';
        switch (dayData.weather[0].main) {
            case 'Clear':
                backgroundColor = 'bg-sky-200';
                break;
            case 'Clouds':
                backgroundColor = 'bg-gray-300';
                break;
            case 'Rain':
                backgroundColor = 'bg-sky-300';
                break;
            case 'Snow':
                backgroundColor = 'bg-white';
                break;
            case 'Thunderstorm':
                backgroundColor = 'bg-purple-300';
                break;
            default:
                backgroundColor = 'bg-gray-100'; // Default color
                break;
        }

            dailyForecasts.push(`
                <div class="flex flex-row md:flex-col m-2 p-2 ${backgroundColor} rounded-md shadow-md text-base md:text-sm justify-evenly lg:justify-start items-center lg:items-start">
                <div>
                    <h2 class="text-sm font-semibold mb-2">${day}</h2>
                    <p>Temp: ${(dayData.main.temp - 273.15).toFixed(2)}°C</p>
                    <p>Wind: ${dayData.wind.speed} m/s</p>
                    <p>Humidity: ${dayData.main.humidity}%</p>
                </div>
                <div class="flex justify-center flex-col md:flex-col-reverse md:items-start mt-2">
                    <img src="${url}" alt="${dayData.weather[0].description} icon" />
                    <p><b>${dayData.weather[0].description}</b></p>
                </div>
                </div>
            `);
        }
        weekForecast.innerHTML = dailyForecasts.join(""); // Insert forecast into the weekForecast div
    }
}

// Call loadWeatherFromLocalStorage when the page loads
window.onload = loadWeatherFromLocalStorage;
