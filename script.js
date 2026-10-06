const ball = document.getElementById("ball");
const gameArea = document.getElementById("game-area");
const startButton = document.getElementById("start-button");
const status = document.getElementById("status");

let x = 0;
let y = 0;

const sensitivity = 0.15;

function moveBall(event) {

    const beta = event.beta;
    const gamma = event.gamma;

    if (beta === null || gamma === null) {
        status.textContent = "No sensor data available.";
        return;
    }

    // Move according to the phone's inclination
    x += gamma * sensitivity;
    y += beta * sensitivity;

    const maxX = gameArea.clientWidth - ball.offsetWidth;
    const maxY = gameArea.clientHeight - ball.offsetHeight;

    // Keep the ball inside the area
    x = Math.max(0, Math.min(maxX, x));
    y = Math.max(0, Math.min(maxY, y));

    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;

    status.textContent =
        `Beta: ${beta.toFixed(1)}° | Gamma: ${gamma.toFixed(1)}°`;
}


async function startGyroscope() {

    // Required by iOS
    if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
        const permission =
            await DeviceOrientationEvent.requestPermission();

        if (permission !== "granted") {
            status.textContent = "Sensor permission denied.";
            return;
        }
    }

    // Start sensor
    window.addEventListener("deviceorientation", moveBall);

    // Start ball in the middle
    x = (gameArea.clientWidth - ball.offsetWidth) / 2;
    y = (gameArea.clientHeight - ball.offsetHeight) / 2;

    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;

    status.textContent = "Gyroscope active!";
    startButton.disabled = true;
}




