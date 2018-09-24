// Lasers emit from jets, and stop at jets and turn them off.
// Ideally the jets would have been stored in a treeset
// so that the laser length calculation would be efficient
// but it doesn't really matter atm, since the calculations
// only happens once per second.

class Laser {
    constructor(startRow, startCol, endRow, endCol) {
        this.startRow = startRow;
        this.startCol = startCol;
        this.endRow = endRow;
        this.endCol = endCol;
    }
}

let lasers = [];

// calculates lasers and changes state of the affected jets
function calculateLasers() {
    lasers = [];

    // init the future state the jet will go into after the hit calculations
    forEachJet((jet) => {
        jet.futureState = new Jet(jet.row, jet.col, jet.direction);
        jet.futureState.hit = false;
    });
    // do the hit calculations
    forEachJet((jet) => {
        if (jet.firing) {
            let shotCoords = jet.findShotCoords();
            let targets = getJets(shotCoords.row, shotCoords.col);
            targets.forEach((target) => target.futureState.hit = true);
            lasers.push(new Laser(jet.row, jet.col, shotCoords.row, shotCoords.col));
        }
    });
    // set the firing statuses
    forEachJet((jet) => {
        jet.futureState.firing = !jet.futureState.hit;
    });
    forEachJet((jet) => jet.takeFutureState());
}

function drawLasers(viewSettings) {
    const halfTile = TILE_SIZE / 2;

    effectCtx.clearRect(0, 0, effectCanvas.width, effectCanvas.height);
    effectCtx.strokeStyle = LASER_COLOR;
    effectCtx.lineWidth = 2;  
    effectCtx.beginPath();
    lasers.forEach((laser) => {
        let sc = laser.startCol - viewSettings.colOffset;
        let sr = laser.startRow - viewSettings.rowOffset;
        let ec = laser.endCol - viewSettings.colOffset;
        let er = laser.endRow - viewSettings.rowOffset;
        const sx = sc * TILE_SIZE + halfTile;
        const sy = sr * TILE_SIZE + halfTile;
        const ex = ec * TILE_SIZE + halfTile;
        const ey = er * TILE_SIZE + halfTile;
        effectCtx.moveTo(sx, sy);
        effectCtx.lineTo(ex, ey);
    });

    effectCtx.stroke();
}
