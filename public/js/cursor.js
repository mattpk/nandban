let cursor = {row: 0, col: 0, direction: Direction.RIGHT};

cursor.render = function() {
    const legLen = TILE_SIZE / 6;
    let x = this.col * TILE_SIZE;
    let y = this.row * TILE_SIZE;

    uiCtx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);

    uiCtx.strokeStyle = CURSOR_COLOR; 
    uiCtx.lineWidth = 2;  
    uiCtx.beginPath();
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

    uiCtx.stroke();
}
