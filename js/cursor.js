let numRows;
let numCols;
let cursor = {
    row: 0, col: 0,
    direction: Direction.RIGHT,
    mode: CursorMode.NORMAL,
    rowSelectBegin: 0, colSelectBegin: 0,
    rowSelectEnd: 0, colSelectEnd: 0
};

cursor.render = function(viewSettings) {
    const legLen = TILE_SIZE / 6;
    const tickLen = legLen;
    const halfTile = TILE_SIZE / 2;
    let col = this.col - viewSettings.colOffset
    let row = this.row - viewSettings.rowOffset
    let x = col * TILE_SIZE;
    let y = row * TILE_SIZE;

    uiCtx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
    uiCtx.beginPath();

    if (this.mode == CursorMode.SELECT
        || this.mode == CursorMode.SELECTED
        || this.mode == CursorMode.YANKED) {

        if (this.mode == CursorMode.SELECT) {
            uiCtx.strokeStyle = SELECT_COLOR;
        }
        else {
            uiCtx.strokeStyle = SELECTED_COLOR;
        }
        uiCtx.lineWidth = 1;

        let box = this.getSelection();
        let r1 = box.r1 - viewSettings.rowOffset;
        let c1 = box.c1 - viewSettings.colOffset;
        let r2 = box.r2 - viewSettings.rowOffset;
        let c2 = box.c2 - viewSettings.colOffset;

        let x1 = c1 * TILE_SIZE;
        let y1 = r1 * TILE_SIZE;
        let x2 = c2 * TILE_SIZE;
        let y2 = r2 * TILE_SIZE;

        uiCtx.moveTo(x1-1,y1-1);
        uiCtx.lineTo(x2+1,y1-1);
        uiCtx.lineTo(x2+1,y2+1);
        uiCtx.lineTo(x1-1,y2+1);
        uiCtx.lineTo(x1-1,y1-1);
        uiCtx.stroke();
        if (this.mode == CursorMode.YANKED) {
            uiCtx.strokeStyle = PASTE_BOX_COLOR;
            let nr1 = r1 + cursor.row - box.r1;
            let nc1 = c1 + cursor.col - box.c1;
            let nr2 = r2 + cursor.row - box.r1;
            let nc2 = c2 + cursor.col - box.c1;

            let x1 = nc1 * TILE_SIZE;
            let y1 = nr1 * TILE_SIZE;
            let x2 = nc2 * TILE_SIZE;
            let y2 = nr2 * TILE_SIZE;

            uiCtx.beginPath();
            uiCtx.moveTo(x1-1,y1-1);
            uiCtx.lineTo(x2+1,y1-1);
            uiCtx.lineTo(x2+1,y2+1);
            uiCtx.lineTo(x1-1,y2+1);
            uiCtx.lineTo(x1-1,y1-1);
            uiCtx.stroke();
        }
    }

    uiCtx.beginPath();
    uiCtx.strokeStyle = CURSOR_COLOR;
    uiCtx.lineWidth = 2;

    // top left corner
    uiCtx.moveTo(x, y + legLen);
    uiCtx.lineTo(x, y);
    uiCtx.lineTo(x + legLen, y);
    // top right corner
    uiCtx.moveTo(x + TILE_SIZE - legLen, y);
    uiCtx.lineTo(x + TILE_SIZE, y);
    uiCtx.lineTo(x + TILE_SIZE, y + legLen);
    // bottom right corner
    uiCtx.moveTo(x + TILE_SIZE, y + TILE_SIZE - legLen);
    uiCtx.lineTo(x + TILE_SIZE, y + TILE_SIZE);
    uiCtx.lineTo(x + TILE_SIZE - legLen, y + TILE_SIZE);
    // bottom left corner
    uiCtx.moveTo(x + legLen, y + TILE_SIZE);
    uiCtx.lineTo(x, y + TILE_SIZE);
    uiCtx.lineTo(x, y + TILE_SIZE - legLen);

    // direction tick
    switch(this.direction) {
        case Direction.LEFT:
            uiCtx.moveTo(x, y + halfTile);
            uiCtx.lineTo(x + tickLen, y + halfTile);
            break;
        case Direction.UP:
            uiCtx.moveTo(x + halfTile, y);
            uiCtx.lineTo(x + halfTile, y + tickLen);
            break;
        case Direction.RIGHT:
            uiCtx.moveTo(x + TILE_SIZE - tickLen, y + halfTile);
            uiCtx.lineTo(x + TILE_SIZE, y + halfTile);
            break;
        case Direction.DOWN:
            uiCtx.moveTo(x + halfTile, y + TILE_SIZE - tickLen);
            uiCtx.lineTo(x + halfTile, y + TILE_SIZE);
            break;
    }

    uiCtx.stroke();
}

cursor.toggleSelect = function() {
    switch(this.mode) {
        case CursorMode.NORMAL:
        case CursorMode.SELECTED:
            this.rowSelectBegin = this.row;
            this.colSelectBegin = this.col;
            this.rowSelectEnd = this.row;
            this.colSelectEnd = this.col;
            this.mode = CursorMode.SELECT;
            break;
        case CursorMode.SELECT:
            this.mode = CursorMode.SELECTED;
            break;
    }
}

cursor.normalMode = function() {
    this.mode = CursorMode.NORMAL;
}

cursor.update = function(dir) {
    switch(dir) {
        case Direction.UP:
            this.row -= 1;
            break;
        case Direction.RIGHT:
            this.col += 1;
            break;
        case Direction.DOWN:
            this.row += 1;
            break;
        case Direction.LEFT:
            this.col -= 1;
            break;
    }
    this.direction = dir;
    if (this.mode == CursorMode.SELECT) {
        this.rowSelectEnd = this.row;
        this.colSelectEnd = this.col;
    }
}

cursor.getSelection = function() {
    let r1 = Math.min(this.rowSelectBegin, this.rowSelectEnd);
    let c1 = Math.min(this.colSelectBegin, this.colSelectEnd);
    let r2 = Math.max(this.rowSelectBegin, this.rowSelectEnd) + 1;
    let c2 = Math.max(this.colSelectBegin, this.colSelectEnd) + 1;
    return {r1: r1, c1: c1, r2: r2, c2: c2};
}

cursor.yanked = function() {
    if (this.mode == CursorMode.SELECT) {
        this.mode = CursorMode.YANKED;
    }
}
