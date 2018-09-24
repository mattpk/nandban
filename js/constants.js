const JETS_PER_TILE = 2;
const TILE_SIZE = 32;
const CURSOR_COLOR = '#BE90D4';
const LASER_COLOR = 'blue';
const SELECT_COLOR = 'pink';
const SELECTED_COLOR = 'red';
const PASTE_BOX_COLOR = 'green';

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
const backgroundCtx = backgroundCanvas.getContext("2d");

// global enums
const Direction = {
    LEFT: 0,
    UP: 1,
    RIGHT: 2,
    DOWN: 3
}

const CursorMode = {
    NORMAL: 0,
    SELECT: 1,
    SELECTED: 2,
    YANKED: 3
}

// game
const GAME_TICK = 50;

// data structures
class Map2D {
    constructor() {
        this.map = new Map();
    }

    has(x, y) {
        return this.map.has(x) && this.map.get(x).has(y);
    }

    get(x, y) {
        if (this.has(x, y)) {
            return this.map.get(x).get(y);
        }
        return null;
    }

    set(x, y, thing) {
        if (!this.map.has(x)) {
            this.map.set(x, new Map());
        }
        this.map.get(x).set(y, thing);
    }

    clear() {
        this.map = new Map();
    }
}
