var WIDTH = window.screen.availWidth,
    HEIGHT = window.screen.availHeight;
var SIZE = WIDTH / 5;
var timer;

var back = document.getElementById('back');
var can = document.getElementById('can');
var btx = back.getContext('2d');
var ctx = can.getContext('2d');
var A = {},
    B = {};
var blockList = [];

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
function moveTo(arr) {
    cancelAnimationFrame(timer);
    timer = requestAnimationFrame(function fn() {
        if (arr.length > 0) {
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            arr.forEach(function (obj, i) {
                if (obj.y + SIZE / 3 > HEIGHT - obj.toY * SIZE) {
                    arr.splice(i, 1);
                } else {
                    obj.y += SIZE / 3;
                }
                drawBlock(obj.col * SIZE, obj.y, obj.n);
            });
            timer = requestAnimationFrame(fn);
        } else {
            cancelAnimationFrame(timer);
        }
    });
}
function drawBlockXY(obj) {
    var x = obj.col * SIZE;
    var y = HEIGHT - obj.row * SIZE;
    drawBlock(x, y, obj.n);
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
function drawBlock(x, y, n) {
    ctx.fillStyle = colorArr[n];
    ctx.fillRect(x, y - SIZE, SIZE, SIZE);
    ctx.fill();
    ctx.fillStyle = '#555';
    ctx.font = SIZE - 10 + 'px 微软雅黑';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(n, x + SIZE / 2, y - SIZE / 2);
}
function newBlock() {
    setBlock(A, 1, 5, ~~(Math.random() * lv) + 1);
    drawBlockXY(A);
    setBlock(B, 2, 5, ~~(Math.random() * lv) + 1);
    drawBlockXY(B);
}

can.addEventListener('touchstart', function (e) {
    sX = e.touches[0].clientX;
    sY = e.touches[0].clientY;
}, this);
can.addEventListener('touchend', function (e) {
    var eX = e.changedTouches[0].clientX,
        eY = e.changedTouches[0].clientY;
    if (Math.abs(eX - sX) < 20 && Math.abs(eY - sY) < 20) {
        change();
    } else {
        if (eY - sY >= 20) {
            console.log('下')
            // TODO: 计算下落的y
            A.y = HEIGHT - A.row * SIZE;
            B.y = HEIGHT - B.row * SIZE;
            A.toY = 0;
            B.toY = 0;
            moveTo([A, B]);
        } else if (eX - sX >= 20) {
            horizontalMove(1);
        } else if (sX - eX >= 20) {
            horizontalMove(-1);
        }
    }
}, this);

function horizontalMove(x) {
    setBlock(A, A.col + x, A.row, A.n);
    setBlock(B, B.col + x, B.row, B.n);
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawBlockXY(A);
    drawBlockXY(B);
}
function change() {
    console.log('变换');
}