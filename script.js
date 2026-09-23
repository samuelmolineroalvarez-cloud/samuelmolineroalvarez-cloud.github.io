const API_KEY = "f023fa58fdb0065d1e7b17d248d169ab";

const url =
    `https://api.openweathermap.org/data/2.5/weather?q=Lahti&units=metric&appid=${API_KEY}`;

fetch(url)
    .then(response => response.json())
    .then(data => {
        const temperature = data.main.temp;

        document.getElementById("temperature").textContent =
            `Temperature: ${temperature} °C`;
    })
    .catch(error => {
        document.getElementById("temperature").textContent =
            "Could not obtain temperature data.";

        console.error(error);
    });
