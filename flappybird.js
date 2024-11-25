// Set canvas and context
let board = document.getElementById("board");
let context = board.getContext("2d");

// Fixed dimensions (matching the CSS values)
let boardWidth = 1200;
let boardHeight = 600;
board.width = boardWidth;  // Set the canvas width
board.height = boardHeight;  // Set the canvas height

// Bird properties
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;  // Position the bird on the left
let birdY = boardHeight / 2;  // Position the bird in the center vertically
let birdImg = new Image();
birdImg.src = "./flappybird.png";

// Gravity and velocity
let gravity = 1.5; 
let velocity = 0;
let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
};

// Pipe properties
let pipeArray = [];
let pipeWidth = 60;
let pipeHeight = boardHeight / 3;  // Adjust pipe height relative to screen size
let pipeX = boardWidth;

// Pipe images
let topPipeImg = new Image();
topPipeImg.src = "./toppipe.png";
let bottomPipeImg = new Image();
bottomPipeImg.src = "./bottompipe.png";

// Game variables
let gameRunning = false;
let score = 0;
let frame = 0;

// Start game
window.addEventListener("keydown", (e) => {
    if (e.code === "Space") startGame();
});
board.addEventListener("click", startGame);

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        frame = 0;
        pipeArray = [];
        score = 0;
        bird.y = boardHeight / 2;  // Reset bird position
        velocity = 0;  // Reset velocity
        gameLoop();
    }
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;
    
    context.clearRect(0, 0, boardWidth, boardHeight);  // Clear the board

    // Bird movement
    bird.y += velocity;
    velocity += gravity;  // Apply gravity effect
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    // Pipe movement and generation
    if (frame % 60 === 0) {  // Add pipes every 60 frames
        let pipeGap = 150;  // Gap between top and bottom pipes
        let pipeHeightTop = Math.random() * (boardHeight - pipeGap);
        let pipeHeightBottom = boardHeight - pipeHeightTop - pipeGap;
        
        pipeArray.push({
            x: boardWidth,
            top: pipeHeightTop,
            bottom: pipeHeightBottom
        });
    }

    // Move pipes and check for collisions
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];

        // Move pipes to the left
        pipe.x -= 3;  // Speed of pipe movement

        // Draw pipes
        context.drawImage(topPipeImg, pipe.x, 0, pipeWidth, pipe.top);
        context.drawImage(bottomPipeImg, pipe.x, boardHeight - pipe.bottom, pipeWidth, pipe.bottom);

        // Check for collisions
        if (
            bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > boardHeight - pipe.bottom)
        ) {
            gameOver();
        }

        // Remove pipes that are off-screen
        if (pipe.x + pipeWidth < 0) {
            pipeArray.splice(i, 1);
            score++;  // Increment score when pipe is passed
        }
    }

    // Check for ground collision
    if (bird.y + bird.height > boardHeight) {
        gameOver();
    }

    // Display score
    context.fillStyle = "white";
    context.font = "30px Courier";
    context.fillText("Score: " + score, 20, 40);

    frame++;
    requestAnimationFrame(gameLoop);  // Request next frame
}

// Handle game over
function gameOver() {
    gameRunning = false;
    alert("Game Over! Your score: " + score);
    document.location.reload();
}

// Make bird jump on space or click
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && gameRunning) {
        velocity = -15;  // Bird jumps
    }
});

board.addEventListener('click', () => {
    if (gameRunning) {
        velocity = -15;  // Bird jumps
    }
});
