function gameLoop() {
    window.requestAnimationFrame(gameLoop);
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
    switch(event.keyCode) {
        case 37:
            leftPressed(); break;
        case 38:
            upPressed(); break;
        case 39:
            rightPressed(); break;
        case 40:
            downPressed(); break;
    }
    cursor.render();
}

function leftPressed() {
    cursor.col -= 1;
    cursor.direction = Direction.LEFT;
}

function upPressed() {
    cursor.row -= 1;
    cursor.direction = Direction.UP;
}

function rightPressed() {
    cursor.col += 1;
    cursor.direction = Direction.RIGHT;
}

function downPressed() {
    cursor.row += 1;
    cursor.direction = Direction.DOWN;
}

function init() {
    // event listeners
    window.onresize = fitCanvas;
    document.addEventListener("keypress", keyPressHandler, false);
    fitCanvas();
    renderUi();
}

init();