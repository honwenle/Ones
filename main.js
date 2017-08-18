var back = document.getElementById('back');
var can = document.getElementById('can');
var btx = back.getContext('2d');
var ctx = can.getContext('2d');
var A = {},
    B = {};
var blockList = {};
var WIDTH = can.clientWidth,
    HEIGHT = can.clientHeight;
var SIZE = WIDTH / 5;
var timer;
var group = 0,
    groups = [];
var canPlay = true;

var lv = 2;

back.width = WIDTH;
back.height = HEIGHT;
can.width = WIDTH;
can.height = HEIGHT;
var noclip = 0;
var colorArr = ['#555', '#f6e6ce', '#faa297', '#eb4951', '#ff942a', '#ff2', '#a6aa3d', '#cde967', '#2a8e52', '#3cc6b0', '#5986c4', '#6c629f'];
drawBack();
newBlock();

function drawBack() {
    btx.fillStyle = '#0f92bb';
    btx.fillRect(0, 0, WIDTH, HEIGHT - 5 * SIZE);
}
// 把连接在一起的归为一组
function checkClear() {
    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 7; j++) {
            var o = blockList[getID(i, j)],
                d = blockList[getID(i, j-1)],
                l = blockList[getID(i-1, j)],
                u = blockList[getID(i, j+1)],
                r = blockList[getID(i+1, j)];
            if (o) {
                if (!o.group) {
                    o.group = group + 1;
                }
                if (u && u.n == o.n) {
                    if (u.group) {
                        o.group = u.group;
                    } else {
                        u.group = o.group;
                    }
                }
                if (r && r.n == o.n) {
                    r.group = o.group;
                }
                groups[o.group] = groups[o.group] || [];
                groups[o.group].push(getID(i, j));
                group = Math.max(group, o.group);
            } else {
                break;
            }
        }
    }
    clearBlock();
}
// 把组成员大于3个的消除，把最下左角的格子生成面值+1
function clearBlock() {
    var hasClear = false;
    groups.forEach(function (arr) {
        if (arr.length >= 3) {
            hasClear = true;
            var min = arr[0], n = blockList[arr[0]].n;
            arr.forEach(function (n) {
                min = Math.min(n, min);
                delete blockList[n];
            });
            var xy = getXY(min);
            setBlock({}, xy.x, xy.y, n+1);
            lv = n+1 > 2 ? Math.max(lv, n) : lv;
        }
    });
    btx.clearRect(0, 0, WIDTH, HEIGHT);
    drawBack();
    for (var i in blockList) {
        blockList[i].group = undefined;
        drawBlockXY(blockList[i], btx);
    }
    groups = [];
    group = 0;
    if (hasClear) {
        dropBlock()
    } else {
        for (var i = 5; i < 7; i++) {
            for (var j = 0; j < 5; j++) {
                if (blockList[getID(j, i)]) {
                    alert('GameOver')
                    window.location.reload();
                    return false;
                }
            }
        }
        newBlock();
    }
}
function dropBlock() {
    var dropList = [];
    for (var i = 0; i < 5; i++) {
        var ct = 0;
        for (var j = 0; j < 7; j++) {
            var obj = blockList[getID(i,j)];
            if (obj) {
                if (ct > 0) {
                    delete blockList[getID(i,j)];
                    obj.y = HEIGHT - obj.row * SIZE;
                    obj.toY = obj.row - ct;
                    dropList.push(obj);
                }
            } else {
                ct++;
            }
        }
    }
    dropList.forEach(function (obj) {
        setBlock(obj, obj.col, obj.toY, obj.n);
    });
    if (dropList.length > 0) {
        moveTo(dropList);
    } else {
        checkClear();
    }
}
function moveTo(arr) {
    cancelAnimationFrame(timer);
    timer = requestAnimationFrame(function fn() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        if (arr.length > 0) {
            arr.forEach(function (obj, i) {
                if (obj.y + SIZE / 5 > HEIGHT - obj.toY * SIZE) {
                    arr.splice(i, 1);
                    drawBlockXY(obj, btx);
                } else {
                    obj.y += SIZE / 5;
                }
                drawBlock(obj.col * SIZE, obj.y, obj.n);
            });
            timer = requestAnimationFrame(fn);
        } else {
            cancelAnimationFrame(timer);
            for (var i in blockList) {
                drawBlockXY(blockList[i], btx);
            }
            checkClear();
        }
    });
}
function drawFlip(x, y, s, n) {
    _ctx = ctx;
    _ctx.save();
    _ctx.fillStyle = colorArr[n];
    _ctx.scale(s, 1);
    _ctx.fillRect(x * SIZE/s - SIZE/2 + SIZE/s/2, HEIGHT - y * SIZE - SIZE, SIZE, SIZE);
    _ctx.fill();
    _ctx.fillStyle = '#555';
    _ctx.font = SIZE - 10 + 'px 微软雅黑';
    _ctx.textAlign = 'center';
    _ctx.textBaseline = 'middle';
    _ctx.fillText(n, x * SIZE/s + SIZE/s/2, HEIGHT - y * SIZE - SIZE/2);
    _ctx.restore();
}
function flipShow(arr) {
    cancelAnimationFrame(timer);
    timer = requestAnimationFrame(function fn() {
        if (arr.length > 0) {
            // ctx.clearRect(0, 0, WIDTH, HEIGHT);
            arr.forEach(function (obj, i) {
                if (obj.scale >= 1) {
                    arr.splice(i, 1);
                } else {
                    obj.scale += .05;
                }
                drawFlip(obj.col, obj.row, obj.scale, obj.n);
            });
            timer = requestAnimationFrame(fn);
        } else {
            cancelAnimationFrame(timer);
        }
    });
}
function flipHide() {}
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
function getXY(n) {
    return {
        x: n % 5,
        y: ~~(n / 5)
    };
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
        scale: 0,
        n: ~~(Math.random() * lv) + 1
    };
    B = {
        col: 2,
        row: 5,
        scale: 0,
        n: ~~(Math.random() * lv) + 1
    };
    flipShow([A, B]);
    canPlay = true;
}

can.addEventListener('touchstart', function (e) {
    e.preventDefault();
    sX = e.touches[0].clientX;
    sY = e.touches[0].clientY;
}, this);
can.addEventListener('touchend', function (e) {
    if (!canPlay) {
        return false
    }
    var eX = e.changedTouches[0].clientX,
        eY = e.changedTouches[0].clientY;
    if (Math.abs(eX - sX) < 20 && Math.abs(eY - sY) < 20) {
        change();
    } else {
        if (eY - sY >= 20 && (eY - sY) > Math.abs(eX - sX)) {
            canPlay = false;
            verticalMove();
        } else if (eX - sX >= 20) {
            horizontalMove(1);
        } else if (sX - eX >= 20 ) {
            horizontalMove(-1);
        }
    }
}, this);
document.onkeyup = function (e) {
    if (!canPlay) {
        return false
    }
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
            canPlay = false;
            verticalMove();
            break;
        default:
            break;
    }
}

function calcTo(Z) {
    var ct = 0;
    for (var i = 0; i < 7; i++) {
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