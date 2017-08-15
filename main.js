var back = document.getElementById('back');
var can = document.getElementById('can');
var btx = back.getContext('2d');
var ctx = can.getContext('2d');
var A = {},
    B = {};
var blockList = [];
var WIDTH = can.clientWidth,
    HEIGHT = can.clientHeight;
var SIZE = WIDTH / 5;
var timer;


var lv = 2;

back.width = WIDTH;
back.height = HEIGHT;
can.width = WIDTH;
can.height = HEIGHT;

var colorArr = ['#555', '#fee', '#f66', '#f22', '#f60', '#ff2'];
drawBack();
newBlock();

function drawBack() {
    btx.fillStyle = '#0f92bb';
    btx.fillRect(0, 0, WIDTH, HEIGHT - 5 * SIZE);
}
function checkClear() {
    blockList.forEach(function (obj) {
        if (obj.review) {
            checkBlock(obj);
            obj.review = false;
        }
    });
}
function checkBlock(obj) {
    // 检查该点的延伸是否能消除
}
function moveTo(arr) {
    cancelAnimationFrame(timer);
    timer = requestAnimationFrame(function fn() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        if (arr.length > 0) {
            arr.forEach(function (obj, i) {
                if (obj.y + SIZE / 3 > HEIGHT - obj.toY * SIZE) {
                    obj.review = true;
                    arr.splice(i, 1);
                } else {
                    obj.y += SIZE / 3;
                }
                drawBlock(obj.col * SIZE, obj.y, obj.n);
            });
            timer = requestAnimationFrame(fn);
        } else {
            cancelAnimationFrame(timer);
            blockList.forEach(function (obj) {
                drawBlockXY(obj, btx);
            });
            checkClear();
            newBlock();
        }
    });
}
function drawBlockXY(obj, context) {
    var x = obj.col * SIZE;
    var y = HEIGHT - obj.row * SIZE;
    drawBlock(x, y, obj.n, context);
}
function setBlock(obj, x, y, n) {
    obj.col = x;
    obj.row = y;
    obj.n = n;
    blockList[getID(x, y)] = obj;
}
function getID(x, y) {
    return x + y * 5;
}
function drawBlock(x, y, n, context) {
    _ctx = context || ctx
    _ctx.fillStyle = colorArr[n];
    _ctx.fillRect(x, y - SIZE, SIZE, SIZE);
    _ctx.fill();
    _ctx.fillStyle = '#555';
    _ctx.font = SIZE - 10 + 'px 微软雅黑';
    _ctx.textAlign = 'center';
    _ctx.textBaseline = 'middle';
    _ctx.fillText(n, x + SIZE / 2, y - SIZE / 2);
}
function newBlock() {
    A = {
        col: 1,
        row: 5,
        n: ~~(Math.random() * lv) + 1
    };
    drawBlockXY(A);
    B = {
        col: 2,
        row: 5,
        n: ~~(Math.random() * lv) + 1
    };
    drawBlockXY(B);
}

can.addEventListener('touchstart', function (e) {
    e.preventDefault();
    sX = e.touches[0].clientX;
    sY = e.touches[0].clientY;
}, this);
can.addEventListener('touchend', function (e) {
    var eX = e.changedTouches[0].clientX,
        eY = e.changedTouches[0].clientY;
    if (Math.abs(eX - sX) < 20 && Math.abs(eY - sY) < 20) {
        change();
    } else {
        if (eY - sY >= 20 && (eY - sY) > Math.abs(eX - sX)) {
            verticalMove();
        } else if (eX - sX >= 20) {
            horizontalMove(1);
        } else if (sX - eX >= 20 ) {
            horizontalMove(-1);
        }
    }
}, this);
document.onkeyup = function (e) {
    switch (e.keyCode) {
        case 37:
            horizontalMove(-1);
            break;
        case 38:
            change();
            break;
        case 39:
            horizontalMove(1);
            break;
        case 40:
            verticalMove();
        default:
            break;
    }
}

function calcTo(Z) {
    var ct = 0;
    for (var i = 0; i < 5; i++) {
        if (blockList[getID(Z.col, i)]) {
            ct ++
        }
    }
    Z.toY = ct;
    setBlock(Z, Z.col, Z.toY, Z.n);
}
function verticalMove() {
    A.y = HEIGHT - A.row * SIZE;
    B.y = HEIGHT - B.row * SIZE;
    calcTo(A.y > B.y ? A : B);
    calcTo(A.y > B.y ? B : A);
    moveTo([A, B]);
}
function horizontalMove(x) {
    if (A.col + x < 0 || B.col + x < 0 || A.col + x >= 5 || B.col + x >= 5) {
        return false;
    }
    A.col += x;
    B.col += x;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawBlockXY(A);
    drawBlockXY(B);
}
function change() {
    if (A.row == B.row) {
        if (A.col < B.col) {
            A.col += 1;
            A.row += 1;
        } else {
            B.col += 1;
            B.row += 1;
        }
    } else {
        if (A.row > B.row) {
            A.row -= 1;
            B.col -= 1;
            B.col = Math.abs(B.col);
        } else {
            B.row -= 1;
            A.col -= 1;
            A.col = Math.abs(A.col);
        }
    }
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawBlockXY(A);
    drawBlockXY(B);
}