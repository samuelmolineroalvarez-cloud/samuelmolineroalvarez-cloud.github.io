const ball = document.getElementById("ball");
const gameArea = document.getElementById("game-area");
const startButton = document.getElementById("start-button");
const status = document.getElementById("status");

let x = 0;
let y = 0;

let velocityX = 0;
let velocityY = 0;

let accelerationX = 0;
let accelerationY = 0;

let running = false;
let animationFrame;


// Physics
const gravity = 0.08;
const friction = 0.985;
const bounce = 0.65;
const maxSpeed = 12;


// --------------------------------------------------
// PHONE MOTION
// --------------------------------------------------

function handleMotion(event) {

    const acceleration = event.accelerationIncludingGravity;

    if (!acceleration) {
        status.textContent = "No motion data received.";
        return;
    }

    /*
     * X = left/right tilt
     * Y = forward/backward tilt
     */

    accelerationX = acceleration.x || 0;
    accelerationY = acceleration.y || 0;

    status.textContent =
        `Motion X: ${accelerationX.toFixed(2)}
         | Y: ${accelerationY.toFixed(2)}`;
}


// --------------------------------------------------
// MARBLE PHYSICS
// --------------------------------------------------

function update() {

    if (!running) {
        return;
    }

    /*
     * Phone tilt produces acceleration.
     *
     * The minus signs compensate for the fact that
     * gravity points in the opposite direction.
     */

    velocityX -= accelerationX * gravity;
    velocityY += accelerationY * gravity;


    // Friction
    velocityX *= friction;
    velocityY *= friction;


    // Maximum speed
    velocityX = Math.max(
        -maxSpeed,
        Math.min(maxSpeed, velocityX)
    );

    velocityY = Math.max(
        -maxSpeed,
        Math.min(maxSpeed, velocityY)
    );


    // Move marble
    x += velocityX;
    y += velocityY;


    const maxX = gameArea.clientWidth - ball.offsetWidth;
    const maxY = gameArea.clientHeight - ball.offsetHeight;


    // LEFT
    if (x <= 0) {
        x = 0;
        velocityX = -velocityX * bounce;
    }


    // RIGHT
    if (x >= maxX) {
        x = maxX;
        velocityX = -velocityX * bounce;
    }


    // TOP
    if (y <= 0) {
        y = 0;
        velocityY = -velocityY * bounce;
    }


    // BOTTOM
    if (y >= maxY) {
        y = maxY;
        velocityY = -velocityY * bounce;
    }


    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;


    animationFrame = requestAnimationFrame(update);
}


// --------------------------------------------------
// START SENSOR
// --------------------------------------------------

async function startSensor() {

    /*
     * iOS requires explicit permission.
     */

    if (
        typeof DeviceMotionEvent !== "undefined" &&
        typeof DeviceMotionEvent.requestPermission === "function"
    ) {

        try {

            const permission =
                await DeviceMotionEvent.requestPermission();

            if (permission !== "granted") {

                status.textContent =
                    "Motion sensor permission denied.";

                return;
            }

        } catch (error) {

            console.error(error);

            status.textContent =
                "Error requesting motion permission.";

            return;
        }
    }


    /*
     * Start listening for motion.
     */

    window.addEventListener(
        "devicemotion",
        handleMotion
    );


    /*
     * Put the marble in the centre.
     */

    x = (gameArea.clientWidth - ball.offsetWidth) / 2;
    y = (gameArea.clientHeight - ball.offsetHeight) / 2;

    velocityX = 0;
    velocityY = 0;

    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;


    running = true;

    startButton.disabled = true;

    status.textContent =
        "Sensor active. Tilt your phone!";


    animationFrame = requestAnimationFrame(update);
}


// --------------------------------------------------
// BUTTON
// --------------------------------------------------

startButton.addEventListener(
    "click",
    startSensor
);



