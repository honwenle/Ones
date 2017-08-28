var storeRecord = {
    readRecord: function () {
        var json = localStorage.getItem('record');
        return JSON.parse(json);
    },
    saveRecord: function (a, b, list, lv) {
        var data = {
            a: a,
            b: b,
            list: list,
            lv: lv
        };
        var json = JSON.stringify(data);
        localStorage.setItem('record', json);
    },
    newGame: function () {
        localStorage.setItem('record', '{}');
        location.reload();
    },
    goonGame: function () {
        menu.style.display = 'none';
    },
    readHigh: function () {
        var json = localStorage.getItem('high');
        return JSON.parse(json);
    },
    gameOver: function () {
        var high = this.readHigh() || {};
        var newhigh = {
            num: Math.max((high.num || 0), lv+1),
            score: Math.max((high.score || 0), score)
        };
        over.style.display = 'block';
        highnum.innerHTML = newhigh.num;
        highscore.innerHTML = newhigh.score;
        var json = JSON.stringify(newhigh);
        localStorage.setItem('high', json);
    }
}
var re = storeRecord.readRecord() || {};
var menu = document.getElementById('menu');
var hasOld = re && re.list && JSON.stringify(re.list) != '{}';
if (hasOld) {
    menu.style.display = 'block';
}
function hideOver () {
    if (overmenu.style.display == 'block') {
        overmenu.style.display = 'none';
    } else {
        overmenu.style.display = 'block';
    }
}