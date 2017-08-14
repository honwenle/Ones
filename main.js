var back = document.getElementById('back');
var can = document.getElementById('can');
var btx = back.getContext('2d');
var ctx = can.getContext('2d');

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
function moveTo(y) {
    cancelAnimationFrame(timer);
    timer = requestAnimationFrame(function fn() {
        if (parseInt(myDiv.style.width) < 500) {
            myDiv.style.width = parseInt(myDiv.style.width) + 5 + 'px';
            myDiv.innerHTML = parseInt(myDiv.style.width) / 5 + '%';
            timer = requestAnimationFrame(fn);
        } else {
            cancelAnimationFrame(timer);
        }
    });
}
function drawBlock(x, y, n) {
    ctx.fillStyle = colorArr[n];
    ctx.fillRect(x * SIZE, window.screen.availHeight - y * SIZE - SIZE, SIZE, SIZE);
    ctx.fill();
    ctx.fillStyle = '#555';
    ctx.font = SIZE - 10 + 'px 微软雅黑';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(n, x * SIZE + SIZE / 2, window.screen.availHeight - y * SIZE - SIZE / 2);
}
function newBlock() {
    drawBlock(1, 5, ~~(Math.random() * lv) + 1);
    drawBlock(2, 5, ~~(Math.random() * lv) + 1);
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