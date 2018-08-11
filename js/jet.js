// A Jet is a block that shoots lasers and can be hit by lasers.

// map of row -> map of col -> array of jets
const jetMap = new Map();

class Jet {
    constructor(row, col, direction) {
        this.row = row;
        this.col = col;
        this.direction = direction;
        this.firing = true;
        this.hit = false;
        this.futureState = null;
    }

    draw() {
        let jetImg;
        switch (this.direction) {
            case Direction.UP:
                jetImg = document.getElementById("jetUp");
                break;
            case Direction.RIGHT:
                jetImg = document.getElementById("jetRight");
                break;
            case Direction.DOWN:
                jetImg = document.getElementById("jetDown");
                break;
            case Direction.LEFT:
                jetImg = document.getElementById("jetLeft");
                break;
        }
        entityCtx.drawImage(
            jetImg, this.col * TILE_SIZE, this.row * TILE_SIZE);
    }

    // returns the coordinate of the shot target or the wall.
    findShotCoords() {
        let rowDelta, colDelta;
        let row = this.row;
        let col = this.col;
        switch (this.direction) {
            case Direction.UP:
                [rowDelta, colDelta] = [-1, 0];
                break;
            case Direction.RIGHT:
                [rowDelta, colDelta] = [0, 1];
                break;
            case Direction.DOWN:
                [rowDelta, colDelta] = [1, 0];
                break;
            case Direction.LEFT:
                [rowDelta, colDelta] = [0, -1];
                break;
        }
        row += rowDelta;
        col += colDelta;
        while(row >= 0 && col >= 0 && row < numRows && col < numCols) {
            let jet = getJets(row, col);
            if (jet.length > 0) {
                break;
            }
            row += rowDelta;
            col += colDelta;
        }
        return {row: row, col: col};
    }

    takeFutureState() {
        if (!this.futureState) {
            console.warn("Future state was null");
            return;
        }
        this.firing = this.futureState.firing;
        this.hit = this.futureState.hit;
    }
}

function numJets(row, col) {
    return getJets(row, col).length;
}

// array of jets
function getJets(row, col) {
    if (jetMap.has(row) && jetMap.get(row).has(col)) {
        return jetMap.get(row).get(col);
    }
    return [];
}

function removeJets(row, col) {
    if (jetMap.has(row)) {
        jetMap.get(row).delete(col)
    }
}

function addJet(row, col, direction) {
    if (row < 0 || col < 0 ||
        row >= numRows || col >= numCols) {
        return;
    }
    if (!jetMap.has(row)) {
        jetMap.set(row, new Map());
    }
    if (!jetMap.get(row).has(col)) {
        jetMap.get(row).set(col, []);
    }
    jetMap.get(row).get(col).push(new Jet(row, col, direction));
}

function toggleJet(row, col, direction) {
    if (getJets(row, col).find((jet) => jet.direction === direction)) {
        removeJets(row, col);
    } else {
        addJet(row, col, direction);
    }
}

function toggleJetAtCursor() {
    toggleJet(cursor.row, cursor.col, cursor.direction);
}

function forEachJet(callback) {
    jetMap.forEach((colMap) => {
        colMap.forEach((jetList) => {
            jetList.forEach(callback);
        });
    });
}

function drawJets() {
    entityCtx.clearRect(0, 0, entityCanvas.width, entityCanvas.height);
    forEachJet((jet) => jet.draw());
}