var userName = $api.getStorage(storageKey.userName)
var person = $api.getStorage(storageKey.currentPerson);
var number = 0
apiready = function() {
    api.parseTapmode();
    var tab = new auiTab({
        element: document.getElementById("tab"),
        index: 1,
        repeatClick: false
    }, function(ret) {
        $api.html($api.byId("content"), "");
        if (ret.index == 1) {
            showAdd();
        } else if (ret.index == 2) {
            showHis();
        }
    });
    showAdd();
};

function showAdd() {
    $api.html($api.byId('content'),'');
    var contentTmpl = doT.template($api.text($api.byId('tzRecord-tpl')));
    $api.html($api.byId('content'), contentTmpl({
        "currentTime": currentTime(),
        "currentDate": currentDate(),
        "nurseName": userName
    }));
    api.parseTapmode();
}

function showHis() {
    var contentTmpl = doT.template($api.text($api.byId('his-tpl')));
    $api.html($api.byId('content'), contentTmpl({}));

    $api.html($api.byId("recordContent"), "");
    common.get({
        url: config.selectVitalSigns,
        isLoading: true,
        data: {
            patientId: person.id,
            homepageId: person.homepageId,
            limit: -1
        },
        success: function(ret) {
            if (ret.content && ret.content.list && ret.content.list.length > 0) {
                //处理数据
                var data = ret.content.list;
                //根据开始时间和结束时间构造一个以时间为key的数组对象
                timeMap = getDayAll(ret.content.list);
                //var timeMap = getDayAll(startDate,endDate);
                for (var i = 0; i < data.length; i++) {
                    timeMap[truncDate(data[i].createTime)].push(data[i])
                }
                var params = {};
                for (var key in timeMap) {
                    if (timeMap[key].length > 0) {
                        params[key] = timeMap[key];
                    }
                }
                var contentTmpl = doT.template($api.text($api.byId('record-tpl')));
                $api.html($api.byId('recordContent'), contentTmpl(params));
                api.parseTapmode();
                api.hideProgress();
            } else {
                api.hideProgress();
                api.toast({
                    msg: "未查询到记录",
                    duration: config.duration,
                    location: 'bottom'
                });
            }
        }
    });

}


function openDetailWin(id) {
    api.openWin({
        name: 'win_vital_signs_detail',
        url: './win_vital_signs_detail.html',
        pageParam: {
            data: id
        }
    });
}

//如果value不会空，则放入到map中
function addMapIfNotNull(arr, key, value, existsId) {
    var map = {};
    if (value && key) {
        map["key"] = key;
        map["value"] = value;
        if (existsId) {
            map["medTemplateItemId"] = 218;
        }
        arr.push(map);
    }
}


function currentTime() {
    var date = new Date();
    var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    return hour + ":" + minute+":"+"00";
}

function currentDate() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    return year + "-" + month + "-" + day;
}


function getDayAll(datas) {
    var dateAllMap = {};
    for (var i = 0; i < datas.length; i++) {
        dateAllMap[truncDate(datas[i].createTime)] = [];
    }
    return dateAllMap;
}
function truncDate(date) {
    return date.substr(0, 10);
}

function truncTime(date) {
    return date.substr(11, 5);
}

function save(){
    common.post({
        url: config.saveVitalSigns,
        isLoading: true,
        dataType:JSON,
        data: {
            medPatientId: person.id,
            homepageId: person.homepageId,
            measureDate: $api.val($api.byId('measureDate')),
            measureTime: $api.val($api.byId('measureTime')),
            temperature: $api.val($api.byId('temperature')),
            pulse: $api.val($api.byId('pulse')),
            breathRate: $api.val($api.byId('breathRate')),
            heartRate: $api.val($api.byId('heartRate')),
            bloodPressure:$api.val($api.byId('bloodPressure')),
            input: $api.val($api.byId('input')),
            inputType:$api.val($api.byId('input_type')),
            output: $api.val($api.byId('output')),
            outputType:$api.val($api.byId('output_type')),
            nurseName: $api.val($api.byId('nurseName')),
        },
        success: function(r) {
            api.hideProgress();
            if (r && r.code === 200) {
                api.alert({
                    title: '提示',
                    msg: '保存成功！',
                }, function(ret, err) {
                    showAdd();
                });
            } else {
                api.toast({
                    msg: r.msg,
                    duration: 2000,
                    location: 'bottom'
                });
            }

        }
    });
}

function chooseTime(el) {
    api.openPicker({
        type: 'time',
        title: '时间'
    }, function (ret, err) {
        var hour = ret.hour;
        if (hour < 10) {
            hour = "0" + hour;
        }
        var minute = ret.minute;
        if (minute < 10) {
            minute = "0" + minute;
        }
        var time = hour + ":" + minute + ":00" ;
        $api.val(el, time);
    });
}
function chooseDate(el){
    api.openPicker({
        type: 'date',
        title: '日期'
    }, function (ret, err) {
        var startYear = ret.year;
        var startMonth = ret.month;
        var startDay = ret.day;
        var startDate = startYear + "-" + (startMonth < 10 ? "0" + startMonth : startMonth) + "-" + (startDay < 10 ? "0" + startDay : startDay);
        $api.val(el, startDate);
    });
}
