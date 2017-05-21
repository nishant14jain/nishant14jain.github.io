var emptyTileX, emptyTileY;
var moveOffsetX;
var moveOffsetY;
var emptyTile;
var size = 3;
var tileCount;
var shuffleCounter = 0;
var lastShuffled = '';
var movesCount = 0;
var clockTimer = 0;
var clockControl;
var gameOn = false;

$(document).ready(function () {
    setup();
    $(window).on('resize', function () {
        moveOffsetX = $('.tile').width() + 2;
        moveOffsetY = $('.tile').height() + 2;
    });
});

function setup() {
    tileCount = size * size;
    emptyTileX = size;
    emptyTileY = size;
    createGrid(size);
    $('.tile').click(function () {
        if ($(this).attr('id') != 'emptyTile') {
            move(this, 250);
        }
    });
}

function timer() {
    clockTimer = 0;
    clearInterval(clockControl);
    clockControl = setInterval(function () {
        clockTimer++;
        $('.timer span').html(clockTimer);
    }, 1000);
}

function newGame() {
    $('.material-icons.win,.winMsg').hide();
    gameOn = true;
    movesCount = 0;
    $('.tiles-wrapper').css('background', 'rgba(255,255,255,0.4)');
    $('.game-stats').fadeIn(500);
    shuffle();
    timer();
}

function createGrid(size) {
    var i = 1, tiles = '', posX, posY;
    for (i = 1; i <= tileCount; i++) {
        posX = ((i % size) == 0) ? size : i % size;
        posY = Math.ceil(i / size);
        if (i != tileCount) {
            tiles += '<div id="tile' + i + '" class="tile" data-pos="' + posX + ',' + posY + '"><span>' + i + '</span></div>';
        }
        else {
            tiles += '<div id="emptyTile" class="tile emptyTile" data-pos="' + posX + ',' + posY + '"><span><i class="material-icons win">&#xE876;</i></span></div>';
        }
    }
    tiles += '<div class="clearfix"></div>';
    $('.tiles-wrapper').html(tiles);
    setupGridDimensions();
}

function setupGridDimensions() {
    // resizing grid 
    $('.tile').css({
        'height': 'calc(100%/' + size + ' - 2px)',
        'width': 'calc(100%/' + size + ' - 2px)'
    });
    moveOffsetX = $('.tile').width() + 2;
    moveOffsetY = $('.tile').height() + 2;
}

function move(thisTile, duration, isShuffling, callback) {
    if (gameOn) {
        var pos = $(thisTile).attr('data-pos');
        var posX = parseInt(pos.split(',')[0]);
        var posY = parseInt(pos.split(',')[1]);
        var possible = false;

//    try moving left
        if (posX - 1 == emptyTileX && posY == emptyTileY) {
            possible = true;
            $(thisTile).animate({
                'left': '-=' + moveOffsetX //moves left
            }, duration);

            $('#emptyTile').animate({
                'left': '+=' + moveOffsetX
            }, duration, callback);
        }
//    try moving right
        if (posX + 1 == emptyTileX && posY == emptyTileY) {
            possible = true;
            $(thisTile).animate({
                'left': '+=' + moveOffsetX //moves left
            }, duration);
            $('#emptyTile').animate({
                'left': '-=' + moveOffsetX
            }, duration, callback);
        }
//    try moving up
        if (posX == emptyTileX && posY - 1 == emptyTileY) {
            possible = true;
            $(thisTile).animate({
                'top': '-=' + moveOffsetY //moves left
            }, duration);
            $('#emptyTile').animate({
                'top': '+=' + moveOffsetY
            }, duration, callback);
        }

//    try moving down
        if (posX == emptyTileX && posY + 1 == emptyTileY) {
            possible = true;
            $(thisTile).animate({
                'top': '+=' + moveOffsetY //moves left
            }, 200);
            $('#emptyTile').animate({
                'top': '-=' + moveOffsetY
            }, 200, callback);
        }

        if (possible) {
            updateLocation(thisTile, emptyTileX, emptyTileY);
            emptyTileX = posX;
            emptyTileY = posY;
            updateLocation('.emptyTile', posX, posY);
            if (!isShuffling) {
                movesCount++;
                $('.movesCount span').html(movesCount);
                check();
            }
        }
    }
}

function updateLocation(thisTile, x, y) {
    $(thisTile).attr('data-pos', x + ',' + y);
}

function shuffle() {
    if (gameOn) {
        $('.tile span').fadeOut(1000);
        // findind out the possible moves at any given state so that shuffle does not break the rules of movement.
        var options = findFreeTiles();
        var randomIndex = 0;
        // the new shuffle move should avoid the tile that was previously moved. 
        // without this, sometimes the same tile keeps alternating between 2 positions
        while (options[randomIndex] == lastShuffled) {
            randomIndex = Math.floor(Math.random() * options.length);
        }

        move(options[randomIndex], 100, true, function () {
            shuffleCounter++;
            lastShuffled = options[randomIndex];
            if (shuffleCounter < 10 * size) {
                shuffle();
            }
            else {
                shuffleCounter = 0;
                $('.tile span').fadeIn(2000);
            }
        });
    }
}


// Function to find all the tiles that are adjacent to the empty tile and are thus free to move. 
function findFreeTiles() {
    var options = new Array();
    if (emptyTileX - 1 >= 1) {
        var temp = $(".tiles-wrapper").find("[data-pos='" + (emptyTileX - 1) + "," + emptyTileY + "']").attr('id');
        options.push('#' + temp);
    }
    if (emptyTileX + 1 <= size) {
        var temp = $(".tiles-wrapper").find("[data-pos='" + (emptyTileX + 1) + "," + emptyTileY + "']").attr('id');
        options.push('#' + temp);
    }
    if (emptyTileY + 1 <= size) {
        var temp = $(".tiles-wrapper").find("[data-pos='" + emptyTileX + "," + (emptyTileY + 1) + "']").attr('id');
        options.push('#' + temp);
    }
    if (emptyTileY - 1 >= 1) {
        var temp = $(".tiles-wrapper").find("[data-pos='" + emptyTileX + "," + (emptyTileY - 1) + "']").attr('id');
        options.push('#' + temp);
    }
    return options;
}

function check() {
    var score = 0;
    for (var i = 1; i <= tileCount - 1; i++) {
        var temp = $('#tile' + i).attr('data-pos').split(',');
        var posX = parseInt(temp[0]);
        var posY = parseInt(temp[1]);
        if (i == (posY * size + posX - size)) {
            score++;
        }
    }
    if (score == tileCount - 1) {
        clearInterval(clockControl);
        $('.tiles-wrapper').animate({
            'background': '#EDC53F'
        }, 500);
        $('.tiles-wrapper').css('background', '#EDC53F');
        $('.win').fadeIn(500);
        gameOn = false;
        $('.winMsg').fadeIn(500);
    }
}

function changeDifficulty(difficulty) {
    size = difficulty;
    setup();
    newGame();
}