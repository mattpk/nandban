function gameLoop() {
    calculateLasers();
    renderUi();
    drawJets();
    drawLasers();
    setTimeout(() => window.requestAnimationFrame(gameLoop), GAME_TICK);
}

// TODO make the cursor a ghost of what it will place
function renderUi() {
    cursor.render();
}

function drawBackground() {
    function drawBackgroundDot(x, y) {
        backgroundCtx.beginPath();
        backgroundCtx.arc(x, y, 1, 0, 2 * Math.PI, false);
        backgroundCtx.fillStyle = CURSOR_COLOR;
        backgroundCtx.fill();
    }
    for (let x = 0; x < document.body.clientWidth; x+=TILE_SIZE) {
        for (let y = 0; y < document.body.clientHeight; y+=TILE_SIZE) {
            drawBackgroundDot(x, y);
        }
    }    
}

// fits canvas to window width and height
function fitCanvas() {
    canvases.forEach(function(canvas) {
        canvas.width = document.body.clientWidth;
        canvas.height = document.body.clientHeight;    
    });
    drawBackground();
}

function keyPressHandler(event) {
    switch(event.code) {
        case 'Space':
            toggleJetAtCursor();
            drawJets();
            break;
        case 'KeyA':
        case 'ArrowLeft':
            cursorLeft();
            break;
        case 'KeyW':
        case 'ArrowUp':
            cursorUp();
            break;
        case 'KeyD':
        case 'ArrowRight':
            cursorRight();
            break;
        case 'KeyS':
        case 'ArrowDown':
            cursorDown();
            break;
    }
    cursor.render();
}

function cursorLeft() {
    cursor.col -= 1;
    cursor.direction = Direction.LEFT;
}

function cursorUp() {
    cursor.row -= 1;
    cursor.direction = Direction.UP;
}

function cursorRight() {
    cursor.col += 1;
    cursor.direction = Direction.RIGHT;
}

function cursorDown() {
    cursor.row += 1;
    cursor.direction = Direction.DOWN;
}

function init() {
    // event listeners
    window.onresize = fitCanvas;
    document.addEventListener("keydown", keyPressHandler, false);
    fitCanvas();
    renderUi();
    gameLoop();
}

init();