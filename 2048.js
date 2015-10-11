var Game = function () {
    var holst, contextCanvas, fieldSize, field, holstSize, cellSize, borderSize;
    var lastX, lastY, currentX, currentY;
    fieldSize = 4;
    var backgroundColors = { 
        'field': '#BBADA0',
        0: '#D6CDC4',
        2: '#EEE4DA',
        4: '#EDE0C8',
        8: '#F2B179',
        16: '#F59563',
        32: '#F67C5F',
        64: '#CC5A3E',
        128: '#C1C918',
        256: '#EDCC61',
        512: '#94DBFF',
        1024: '#76AFCC',
        2048: '#4F4F4F'
    }
    var fontColors = {
        2: '#4F4F4F',
        4: '#4F4F4F',
        8: '#E6E6E6',
        16: '#E6E6E6',
        32: '#E6E6E6',
        64: '#E6E6E6',
        128: '#E6E6E6',
        256: '#E6E6E6',
        512: '#E6E6E6',
        1024: '#E6E6E6',
        2048: '#E6E6E6'
    }
    this.init = function() {
        holst = document.createElement('canvas');
        configHolst();
        document.body.appendChild(holst);
        contextCanvas = holst.getContext('2d');
        createField(fieldSize);
        addRandomCell();
        draw();
        // field = [
            // [0,4,8,16],
            // [32,64,128,256],
            // [512,1024,2048,2],
            // [0,0,0,2]
        // ];
    }
    var createField = function (fieldSize) {
        field = new Array(fieldSize);
        for (var i = 0; i < fieldSize; i++) {
            field[i] = new Array(fieldSize);
            for (var i2 = 0; i2 < fieldSize; i2++) {
                field[i][i2] = 0;
            }
        }
    }
    var configHolst = function () {
        holstSize = Math.min(document.body.clientWidth, document.body.clientHeight);
        holst.width = holstSize;
        holst.height = holstSize;
        cellSize = ((holstSize / 100) * 90) / fieldSize;
        borderSize = ((holstSize / 100) * 10) / (fieldSize + 1);
    }
    this.resize = function () {
        configHolst();
        draw();
    }
    this.change = function (e) {
        var oldField = field.toString();
        if (e.type == 'keydown') {
            if (e.keyCode == 37) {
                move('left');
            } else if (e.keyCode == 38) {
                move('top');
            } else if (e.keyCode == 39) {
                move('right');
            } else if (e.keyCode == 40) {
                move('down');
            }
        } else if (e.type == 'touchstart') {
            lastX = e.touches[0].pageX;
            lastY = e.touches[0].pageY;
            
        } else if (e.type == 'touchend') {
            currentX = e.changedTouches[0].pageX;
            currentY = e.changedTouches[0].pageY;
            diffX = currentX - lastX;
            diffY = currentY - lastY;
            if (Math.abs(diffX) > 60 || Math.abs(diffY) > 60) {
                if (Math.abs(diffX) > Math.abs(diffY)) {
                    if (currentX > lastX) {
                        move('right');
                    } else {
                        move('left');
                    }
                } else {
                    if (currentY > lastY) {
                        move('down');
                    } else {
                        move('top');
                    }
                }
            }
        }
        e.preventDefault();
        var newField = field.toString();
        if (newField !== oldField) {
            addRandomCell();
            draw();
        }
    }
    var addRandomCell = function () {
        var freeCells = [], randomCell;
        for (var i = 0; i < field.length; i++) {
            for (var i2 = 0; i2 < field[i].length; i2++) {
                if (field[i][i2] == 0) {
                    freeCells.push([i, i2]);
                }
            }
        }
        if (freeCells.length > 0) {
            randomCell = getRandomInt(0, freeCells.length - 1);
            field[freeCells[randomCell][0]][freeCells[randomCell][1]] = 2;
        }
    }
    var move = function (direction) {
        var freeCell;
        if (direction == 'left') {
            for (var i = 0; i < field.length; i++) {
                freeCell = 0;
                for (var i2 = 0; i2 < field[i].length; i2++) { // сдвигаем влево всё, что больше ноля. ex: 0 2 2 4 => 2 2 4 0
                    if (field[i][i2] > 0) {
                        if (i2 > freeCell) {
                            field[i][freeCell] = field[i][i2];
                            field[i][i2] = 0;
                        }
                        freeCell+=1;
                    }
                }
                for (var i2 = 0; i2 < field[i].length - 1; i2++) { // прибавляем правое число если оно равно текущему и сдвигаем указатель за это число чтобы пропустить его, а вместо него пишем 0. ex: 2 2 4 0 => 4 0 4 0
                    if (field[i][i2] == field[i][i2+1]) {
                        field[i][i2] = field[i][i2] * 2;
                        field[i][i2+1] = 0;
                        i2+=1;
                    }
                }
                freeCell = 0;
                for (var i2 = 0; i2 < field[i].length; i2++) { // сдвигаем влево всё, что больше ноля. ex: 4 0 4 0 => 4 4 0 0
                    if (field[i][i2] > 0) {
                        if (i2 > freeCell) {
                            field[i][freeCell] = field[i][i2];
                            field[i][i2] = 0;
                        }
                        freeCell+=1;
                    }
                }
            }
        } else if (direction == 'top') {
            for (var i = 0; i < field[0].length; i++) {
                freeCell = 0;
                for (var i2 = 0; i2 < field.length; i2++) {
                    if (field[i2][i] > 0) {
                        if (i2 > freeCell) {
                            field[freeCell][i] = field[i2][i];
                            field[i2][i] = 0;
                        }
                        freeCell+=1;
                    }
                }
                for (var i2 = 0; i2 < field.length - 1; i2++) {
                    if (field[i2][i] == field[i2+1][i]) {
                        field[i2][i] = field[i2][i] * 2;
                        field[i2+1][i] = 0;
                        i2+=1;
                    }
                }
                freeCell = 0;
                for (var i2 = 0; i2 < field.length; i2++) {
                    if (field[i2][i] > 0) {
                        if (i2 > freeCell) {
                            field[freeCell][i] = field[i2][i];
                            field[i2][i] = 0;
                        }
                        freeCell+=1;
                    }
                }
            }
        } else if (direction == 'right') {
            for (var i = 0; i < field.length; i++) {
                freeCell = field[i].length - 1;
                for (var i2 = field[i].length - 1; i2 >= 0; i2--) {
                    if (field[i][i2] > 0) {
                        if (i2 < freeCell) {
                            field[i][freeCell] = field[i][i2];
                            field[i][i2] = 0;
                        }
                        freeCell-=1;
                    }
                }
                for (var i2 = field[i].length - 1; i2 > 0; i2--) {
                    if (field[i][i2] == field[i][i2-1]) {
                        field[i][i2] = field[i][i2] * 2;
                        field[i][i2-1] = 0;
                        i2-=1;
                    }
                }
                freeCell = field[i].length - 1;
                for (var i2 = field[i].length - 1; i2 >= 0; i2--) {
                    if (field[i][i2] > 0) {
                        if (i2 < freeCell) {
                            field[i][freeCell] = field[i][i2];
                            field[i][i2] = 0;
                        }
                        freeCell-=1;
                    }
                }
            }
        } else if (direction == 'down') {
            for (var i = 0; i < field[0].length; i++) {
                freeCell = field.length - 1;
                for (var i2 = field.length - 1; i2 >= 0; i2--) {
                    if (field[i2][i] > 0) {
                        if (i2 < freeCell) {
                            field[freeCell][i] = field[i2][i];
                            field[i2][i] = 0;
                        }
                        freeCell-=1;
                    }
                }
                for (var i2 = field.length - 1; i2 > 0; i2--) {
                    if (field[i2][i] == field[i2-1][i]) {
                        field[i2][i] = field[i2][i] * 2;
                        field[i2-1][i] = 0;
                        i2-=1;
                    }
                }
                freeCell = field.length - 1;
                for (var i2 = field.length - 1; i2 >= 0; i2--) {
                    if (field[i2][i] > 0) {
                        if (i2 < freeCell) {
                            field[freeCell][i] = field[i2][i];
                            field[i2][i] = 0;
                        }
                        freeCell-=1;
                    }
                }
            }
        }
    }
    var draw = function () {
        contextCanvas.fillStyle = backgroundColors['field'];
        contextCanvas.fillRect(0, 0, holst.width, holst.height);
        contextCanvas.textAlign = 'center';
        contextCanvas.textBaseline = 'middle';
        for (var i = 0; i < field.length; i++) {
            for (var i2 = 0; i2 < field[i].length; i2++) {
                contextCanvas.fillStyle = backgroundColors[field[i][i2]];
                contextCanvas.fillRect((i2 + 1) * borderSize + i2 * cellSize, (i + 1) * borderSize + i * cellSize, cellSize, cellSize);
                if (field[i][i2] > 0) {
                    contextCanvas.fillStyle = fontColors[field[i][i2]];
                    if (field[i][i2] < 1000) {
                        contextCanvas.font = (holst.width / fieldSize) / 2 +'px arial';
                    } else {
                        contextCanvas.font = (holst.width / fieldSize) / 3 +'px arial';
                    }
                    contextCanvas.fillText(field[i][i2], (i2 + 1) * borderSize + i2 * cellSize + cellSize / 2, (i + 1) * borderSize + i * cellSize + cellSize / 2);
                }
            }
        }
    }
    var getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
window.onload = function() {
    var game = new Game();
    game.init();
    window.addEventListener('keydown', game.change);
    window.addEventListener('resize', game.resize);
    window.addEventListener('touchstart', game.change);
    window.addEventListener('touchend', game.change);
}