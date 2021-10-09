var canvasWidth
var canvasHeight;
var columns
var rows;
var board;
var nextStateOfBoard;
var cellWidth;
var hasStarted;
var iteration;
var statusPara;
var iterationPara;
var alive = 1;
var dead = 0;

function setup() {
    canvasWidth = windowWidth - 10;
    canvasHeight = windowHeight - 100;
    cellWidth = 15;
    createCanvas(canvasWidth, canvasHeight);
    columns = floor(width / cellWidth);
    rows = floor(height / cellWidth);
    board = getEmpty2DArray(columns, rows);
    nextStateOfBoard = getEmpty2DArray(columns, rows);
    iteration = 0;
    hasStarted = false;
    statusPara = createP();
    iterationPara = createP();
    renderButtons();
    renderStatus();
    renderIteration();
}

function renderButtons() {
    const startButton = createButton('Start');
    startButton.position(canvasWidth / 2 - 60, canvasHeight + cellWidth);
    startButton.mousePressed(startGame);
    const stopButton = createButton('Stop');
    stopButton.position(canvasWidth / 2, canvasHeight + cellWidth);
    stopButton.mousePressed(stopGame);
    const resetButton = createButton('Reset');
    resetButton.position(canvasWidth / 2 + 60, canvasHeight + cellWidth);
    resetButton.mousePressed(resetGame);
}

function renderStatus() {
    let status = hasStarted ? 'Running' : 'Stopped';
    statusPara.remove();
    statusPara = createP('Status: ' + status);
    statusPara.style('font-size', '16px');
    statusPara.position(canvasWidth / 2 - 120, canvasHeight + cellWidth + 20);
}

function renderIteration() {
    iterationPara.remove();
    iterationPara = createP('Iteration: ' + String(iteration));
    iterationPara.style('font-size', '16px');
    iterationPara.position(canvasWidth / 2 + 60, canvasHeight + cellWidth + 20);
}

function draw() {
    if (hasStarted) {
        generate();
    }
    render();
}

function render() {
    background(255);
    for (var i = 0; i < columns; i++) {
        for (var j = 0; j < rows; j++) {
            if (board[i][j] === alive) {
                fill(0);
            }
            else {
                fill(255);
            }
            stroke(0);
            rect(i * cellWidth, j * cellWidth, cellWidth - 1, cellWidth - 1);
        }
    }
    renderStatus();
    renderIteration();
}

function mousePressed() {
    if (mouseX <= canvasWidth && mouseY <= canvasHeight) {
        toggleCell(mouseX, mouseY);
    }
}

function toggleCell(fullscreenX, fullscreenY) {
    var posX = floor(fullscreenX / cellWidth);
    var poxY = floor(fullscreenY / cellWidth);
    board[posX][poxY] = board[posX][poxY] ^ 1;
}

function clearBoard(board) {
    for (var i = 0; i < columns; i++) {
        for (var j = 0; j < rows; j++) {
            board[i][j] = dead;
        }
    }
}

function startGame() {
    hasStarted = true;
}

function stopGame() {
    hasStarted = false;
}

function resetGame() {
    clearBoard(board);
    stopGame();
    iteration = 0;
}

function getEmpty2DArray(a) {
    const array = new Array(columns);
    for (var i = 0; i < columns; i++) {
        array[i] = new Array(rows);
        for (var j = 0; j < rows; j++) {
            array[i][j] = dead;
        }
    }
    return array;
}

function copy2DArray(toArray, fromArray) {
    for (var i = 0; i < columns; i++) {
        for (var j = 0; j < rows; j++) {
            toArray[i][j] = fromArray[i][j];
        }
    }
}

/*
    Any live cell with fewer than two live neighbours dies, as if by underpopulation.
    Any live cell with two or three live neighbours lives on to the next generation.
    Any live cell with more than three live neighbours dies, as if by overpopulation.
    Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
*/

function generate() {
    clearBoard(nextStateOfBoard);
    for (var i = 0; i < columns; i++) {
        for (var j = 0; j < rows; j++) {
            const aliveNeighoursCount = getAliveNeighbours(i, j);
            if (board[i][j] === alive && aliveNeighoursCount < 2) {
                nextStateOfBoard[i][j] = dead;
            }
            else if (board[i][j] === alive && aliveNeighoursCount < 4) {
                nextStateOfBoard[i][j] = alive;
            }
            else if (board[i][j] === alive && aliveNeighoursCount >= 4) {
                nextStateOfBoard[i][j] = dead;
            }
            else if (board[i][j] === dead && aliveNeighoursCount == 3) {
                nextStateOfBoard[i][j] = alive;
            }
        }
    }
    copy2DArray(board, nextStateOfBoard);
    iteration++;
}

function getAliveNeighbours(x, y) {
    const offsets = [-1, 0, 1];
    var aliveCount = 0
    for (const indX of offsets) {
        for (const indY of offsets) {
            if (
                !(indX === 0 && indY === 0) &&
                isValidCell(x + indX, y + indY) &&
                board[x + indX][y + indY] === alive
            ) {
                aliveCount++;
            }
        }
    }
    return aliveCount;
}

function isValidCell(x, y) {
    return x >= 0 && x < columns && y >= 0 && y < rows;
}
