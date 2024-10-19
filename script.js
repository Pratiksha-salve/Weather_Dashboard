const apiKey = 'bc33ca9bd41712ad4e263715ca4988a7';
const search = document.getElementById('search-btn')

search.addEventListener('click', searching)

function searching(){
    const city = document.getElementById('city-input').value;
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const localWeather = document.getElementById('local');
            localWeather.innerHTML = `<h1>${data.name}</h1>
                <p>Temperature: ${data.main.temp - 273.15}°C</p>
                <p>Wind: ${visibility.wind.speed}m/s</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>${weather.description}</p>`;
        })
        .catch(error => console.log('Error:', error));
};