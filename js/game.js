let viewSettings = {rowOffset: 0, colOffset: 0};
let yanked = [];

function gameLoop() {
    calculateLasers();
    renderUi(viewSettings);
    drawJets(viewSettings);
    drawLasers(viewSettings);
    setTimeout(() => window.requestAnimationFrame(gameLoop), GAME_TICK);
}

// TODO make the cursor a ghost of what it will place
function renderUi(viewSettings) {
    cursor.render(viewSettings);
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
    let updateCursorOrOffset;
    if (event.shiftKey) {
        updateCursorOrOffset = updateOffset;
    }
    else {
        updateCursorOrOffset = function(dir) {
            cursor.update(dir);
        }
    }
    switch(event.code) {
        case 'Space':
            toggleJetAtCursor();
            drawJets(viewSettings);
            break;
        case 'KeyA':
        case 'ArrowLeft':
            updateCursorOrOffset(Direction.LEFT);
            break;
        case 'KeyW':
        case 'ArrowUp':
            updateCursorOrOffset(Direction.UP);
            break;
        case 'KeyD':
        case 'ArrowRight':
            updateCursorOrOffset(Direction.RIGHT);
            break;
        case 'KeyS':
        case 'ArrowDown':
            updateCursorOrOffset(Direction.DOWN);
            break;
        case 'KeyV':
            cursor.toggleSelect();
            break;
        case 'KeyY':
            yank();
            break;
        case 'KeyP':
            paste();
            break;
        case 'Escape':
            cursor.normalMode();
            break;
    }
    cursor.render(viewSettings);
}

function updateOffset(dir) {
    switch(dir) {
      case Direction.LEFT:
          viewSettings.colOffset -= 1;
          break;
      case Direction.UP:
          viewSettings.rowOffset -= 1;
          break;
      case Direction.RIGHT:
          viewSettings.colOffset += 1;
          break;
      case Direction.DOWN:
          viewSettings.rowOffset += 1;
          break;
    }
}

function yank() {
    yanked = [];
    if (cursor.mode == CursorMode.NORMAL)
        return;
    let box = cursor.getSelection();
    cursor.yanked();
    forEachJet((jet) => {
        if (box.r1 <= jet.row && jet.row < box.r2
            && box.c1 <= jet.col && jet.col < box.c2) {
            yanked.push({row: jet.row-box.r1, col: jet.col-box.c1, direction: jet.direction});
        }
    });
}

function paste() {
    if (cursor.mode != CursorMode.YANKED) {
        return;
    }
    let r;
    let c;
    let box = cursor.getSelection();
    for (r = cursor.row; r < cursor.row + box.r2 - box.r1; ++r) {
        for (c = cursor.col; c < cursor.col + box.c2 - box.c1; ++c) {
            removeJets(r, c);
        }
    }
    yanked.forEach((jetInfo) => {
         addJet(jetInfo.row + cursor.row, jetInfo.col + cursor.col, jetInfo.direction);
    });
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
    gameLoop();
}

init();
