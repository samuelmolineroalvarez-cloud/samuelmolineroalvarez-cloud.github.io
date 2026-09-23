const API_KEY = "f023fa58fdb0065d1e7b17d248d169ab";

const url =
    `https://api.openweathermap.org/data/4.0/onecall/current?lat=60.9827&lon=25.6615&units=metric&appid=${API_KEY}`;

fetch(url)
    .then(response => response.json())
    .then(data => {
        const temperature = data.data[0].temp;

        document.getElementById("temperature").textContent =
            `Temperature: ${temperature} °C`;
    })
    .catch(error => {
        console.error(error);
        document.getElementById("temperature").textContent =
            "Error obtaining temperature";
    });
