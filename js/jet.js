// A Jet is a block that shoots lasers and can be hit by lasers.

// map of row -> map of col -> array of jets
const jetMap = new Map2D();

class Jet {
    constructor(row, col, direction) {
        this.row = row;
        this.col = col;
        this.direction = direction;
        this.firing = true;
        this.hit = false;
        this.futureState = null;
    }

    draw(viewSettings) {
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
        let col = this.col - viewSettings.colOffset;
        let row = this.row - viewSettings.rowOffset;
        entityCtx.drawImage(
            jetImg, col * TILE_SIZE, row * TILE_SIZE);
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
    if (jetMap.has(row, col)) {
        return jetMap.get(row, col);
    }
    return [];
}

function removeJets(row, col) {
    jetMap.set(row, col, []);
}

function addJet(row, col, direction) {
    if (row < 0 || col < 0 ||
        row >= numRows || col >= numCols) {
        return;
    }
    if (!jetMap.has(row, col)) {
        jetMap.set(row, col, []);
    }
    jetMap.get(row, col).push(new Jet(row, col, direction));
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
    jetMap.map.forEach((colMap) => {
        colMap.forEach((jetList) => {
            jetList.forEach(callback);
        });
    });
}

function drawJets(viewSettings) {
    entityCtx.clearRect(0, 0, entityCanvas.width, entityCanvas.height);
    forEachJet((jet) => jet.draw(viewSettings));
}
