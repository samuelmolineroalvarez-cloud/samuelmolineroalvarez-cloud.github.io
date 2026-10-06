const ball = document.getElementById("ball");
const gameArea = document.getElementById("game-area");
const startButton = document.getElementById("start-button");
const status = document.getElementById("status");

let ballX = 0;
let ballY = 0;

const speed = 0.5;

function moveBall(event) {
    // gamma = rotation from left to right
    // beta = rotation from front to back

    const gamma = event.gamma;
    const beta = event.beta;

    if (gamma === null || beta === null) {
        status.textContent = "Gyroscope data is not available.";
        return;
    }

    // Convert phone inclination into movement
    ballX += gamma * speed;
    ballY += beta * speed;

    const areaWidth = gameArea.clientWidth;
    const areaHeight = gameArea.clientHeight;

    const ballSize = ball.offsetWidth;

    // Keep the ball inside the game area
    const minX = ballSize / 2;
    const maxX = areaWidth - ballSize / 2;

    const minY = ballSize / 2;
    const maxY = areaHeight - ballSize / 2;

    ballX = Math.max(minX, Math.min(maxX, areaWidth / 2 + ballX));
    ballY = Math.max(minY, Math.min(maxY, areaHeight / 2 + ballY));

    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;
}

async function startGyroscope() {

    // iPhone/iPad require permission
    if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
        try {
            const permission = await DeviceOrientationEvent.requestPermission();

            if (permission !== "granted") {
                status.textContent = "Permission to use the gyroscope was denied.";
                return;
            }
        } catch (error) {
            status.textContent = "Could not access the gyroscope.";
            return;
        }
    }

    // Start listening to the phone's orientation
    window.addEventListener("deviceorientation", moveBall);

    status.textContent = "Gyroscope active! Tilt your phone.";
    startButton.disabled = true;
}

// Start button
startButton.addEventListener("click", startGyroscope);

// Initial position
ballX = gameArea.clientWidth / 2;
ballY = gameArea.clientHeight / 2;

ball.style.left = `${ballX}px`;
ball.style.top = `${ballY}px`;





