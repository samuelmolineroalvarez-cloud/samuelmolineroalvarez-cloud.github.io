const ball = document.getElementById("ball");
const gameArea = document.getElementById("game-area");
const startButton = document.getElementById("start-button");
const status = document.getElementById("status");

let x;
let y;

let velocityX = 0;
let velocityY = 0;

let beta = 0;
let gamma = 0;

let initialBeta = 0;
let initialGamma = 0;

let running = false;
let animationFrame;


// Physics settings
const acceleration = 0.08;
const friction = 0.97;
const maxVelocity = 8;
const bounce = 0.7;


// --------------------------------------------------
// Get the phone orientation
// --------------------------------------------------

function handleOrientation(event) {

    if (event.beta === null || event.gamma === null) {
        status.textContent = "No sensor data available.";
        return;
    }

    beta = event.beta;
    gamma = event.gamma;

    status.textContent =
        `Tilt: X ${gamma.toFixed(1)}° | Y ${beta.toFixed(1)}°`;
}


// --------------------------------------------------
// Physics
// --------------------------------------------------

function updateBall() {

    if (!running) {
        return;
    }

    // Difference from the calibrated position
    const tiltX = gamma - initialGamma;
    const tiltY = beta - initialBeta;


    // Tilt creates acceleration
    velocityX += tiltX * acceleration;
    velocityY += tiltY * acceleration;


    // Limit maximum speed
    velocityX = Math.max(
        -maxVelocity,
        Math.min(maxVelocity, velocityX)
    );

    velocityY = Math.max(
        -maxVelocity,
        Math.min(maxVelocity, velocityY)
    );


    // Friction
    velocityX *= friction;
    velocityY *= friction;


    // Move the marble
    x += velocityX;
    y += velocityY;


    const maxX = gameArea.clientWidth - ball.offsetWidth;
    const maxY = gameArea.clientHeight - ball.offsetHeight;


    // Left wall
    if (x <= 0) {
        x = 0;
        velocityX *= -bounce;
    }


    // Right wall
    if (x >= maxX) {
        x = maxX;
        velocityX *= -bounce;
    }


    // Top wall
    if (y <= 0) {
        y = 0;
        velocityY *= -bounce;
    }


    // Bottom wall
    if (y >= maxY) {
        y = maxY;
        velocityY *= -bounce;
    }


    // Update visual position
    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;


    animationFrame = requestAnimationFrame(updateBall);
}


// --------------------------------------------------
// Start
// --------------------------------------------------

async function startGyroscope() {

    // iPhone / iPad permission
    if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
    ) {

        try {

            const permission =
                await DeviceOrientationEvent.requestPermission();

            if (permission !== "granted") {
                status.textContent =
                    "Permission to use motion sensors was denied.";
                return;
            }

        } catch (error) {

            console.error(error);

            status.textContent =
                "Could not access motion sensors.";

            return;
        }
    }


    // Listen for phone movement
    window.addEventListener(
        "deviceorientation",
        handleOrientation
    );


    // Give the phone a moment to provide its orientation
    setTimeout(() => {

        // Current position becomes the neutral position
        initialBeta = beta;
        initialGamma = gamma;


        // Start in the middle
        x = (gameArea.clientWidth - ball.offsetWidth) / 2;
        y = (gameArea.clientHeight - ball.offsetHeight) / 2;


        velocityX = 0;
        velocityY = 0;


        ball.style.left = `${x}px`;
        ball.style.top = `${y}px`;


        running = true;

        startButton.disabled = true;

        status.textContent =
            "Marble active! Tilt your phone.";


        // Start physics loop
        animationFrame = requestAnimationFrame(updateBall);

    }, 500);
}


// --------------------------------------------------
// Button
// --------------------------------------------------

startButton.addEventListener(
    "click",
    startGyroscope
);



