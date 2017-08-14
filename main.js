var back = document.getElementById('back');
var can = document.getElementById('can');
var btx = back.getContext('2d');
var ctx = can.getContext('2d');
var timer;
var A = {},
    B = {};
var blockList = [];

var lv = 2;

back.width = window.screen.availWidth;
back.height = window.screen.availHeight;
can.width = window.screen.availWidth;
can.height = window.screen.availHeight;

var SIZE = window.screen.availWidth / 5;
var colorArr = ['#555', '#fee', '#f66', '#f22', '#f60', '#ff2'];
drawBack();
newBlock();

function drawBack() {
    btx.fillStyle = '#0f92bb';
    btx.fillRect(0, 0, window.screen.availWidth, window.screen.availHeight - 5 * SIZE);
}
function moveTo(obj, toY) {
    obj.y = window.screen.availHeight - obj.row * SIZE;
    cancelAnimationFrame(timer);
    timer = requestAnimationFrame(function fn() {
        if (obj.y < window.screen.availHeight - toY * SIZE) {
            ctx.clearRect(obj.col * SIZE, 0, window.screen.availWidth, window.screen.availHeight);
            obj.y += 25;
            drawBlock(obj.col * SIZE, obj.y, obj.n);
            timer = requestAnimationFrame(fn);
        } else {
            cancelAnimationFrame(timer);
        }
    });
}
function drawBlockXY(obj) {
    var x = obj.col * SIZE;
    var y = window.screen.availHeight - obj.row * SIZE;
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
        } else if (eX - sX >= 20) {
            console.log('右')
        } else if (sX - eX >= 20) {
            console.log('左')
        }
    }
}, this);

function change() {
    console.log('变换');
}