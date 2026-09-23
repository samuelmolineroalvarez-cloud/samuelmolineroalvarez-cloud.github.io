const API_KEY = "YOUR_API_KEY";

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
