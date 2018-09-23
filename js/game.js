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
    numRows = Math.ceil(document.body.clientHeight / TILE_SIZE);
    numCols = Math.ceil(document.body.clientWidth / TILE_SIZE);
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
        case 'KeyR':
            cursorSelectMode();
            break;
        case 'KeyT':
            cursorNormalMode();
            break;
    }
    cursor.render();
}

function cursorSelectMode() {
    cursor.toggleSelect();
}

function cursorNormalMode() {
    cursor.normalMode();
}

function cursorLeft() {
    cursor.update(Direction.LEFT)
}

function cursorUp() {
    cursor.update(Direction.UP);
}

function cursorRight() {
    cursor.update(Direction.RIGHT);
}

function cursorDown() {
    cursor.update(Direction.DOWN);
}


function importFromString(jsonString) {
    jetMap.clear();
    let entries = JSON.parse(jsonString);
    entries.forEach((entry) => {
        let jet = new Jet(entry.row, entry.col, entry.direction);
        jet.firing = entry.firing;
        jet.hit = entry.hit;
        if (!jetMap.has(entry.row, entry.col)) {
            jetMap.set(entry.row, entry.col, []);
        }
        jetMap.get(entry.row, entry.col).push(jet);
    });
}

function exportToString() {
    let json = [];
    forEachJet((jet) => {
        json.push({
            row: jet.row,
            col: jet.col,
            hit: jet.hit,
            direction: jet.direction,
            firing: jet.firing,
        });
    });
    return JSON.stringify(json);
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
