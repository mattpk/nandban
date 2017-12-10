const TILE_SIZE = 32;
const CURSOR_COLOR = '#BE90D4';

// canvases
const uiCanvas = document.getElementById("ui-layer");
const effectCanvas = document.getElementById("effect-layer");
const entityCanvas = document.getElementById("entity-layer");
const backgroundCanvas = document.getElementById("background-layer");
const canvases = [uiCanvas, effectCanvas, entityCanvas, backgroundCanvas];

// drawing contexts
const uiCtx = uiCanvas.getContext("2d");
const effectCtx = effectCanvas.getContext("2d");
const entityCtx = entityCanvas.getContext("2d");
const backgroundCtx = entityCanvas.getContext("2d");

// global enums
const Direction = {
    LEFT: 0,
    UP: 1,
    RIGHT: 2,
    DOWN: 3
}