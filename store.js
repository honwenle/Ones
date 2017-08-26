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
    }
}
var re = storeRecord.readRecord() || {};
var menu = document.getElementById('menu');
var hasOld = re && re.list && JSON.stringify(re.list) != '{}';
if (hasOld) {
    menu.style.display = 'block';
}