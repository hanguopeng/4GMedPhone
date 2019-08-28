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
    var contentTmpl = doT.template($api.text($api.byId('add-tpl')));
    $api.html($api.byId('content'), contentTmpl({
        person: person,
        "currentTime": currentTime(),
        "currentDate": currentDate(),
        "userName": userName
    }));
    api.parseTapmode();
    var collapse = new auiCollapse({
        autoHide: false //是否自动隐藏已经展开的容器
    });
}

function showHis() {
    var contentTmpl = doT.template($api.text($api.byId('his-tpl')));
    $api.html($api.byId('content'), contentTmpl({}));

    $api.html($api.byId("recordContent"), "");
    common.get({
        url: config.selectParentMaterial,
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
        name: 'win_material_detail',
        url: './win_material_detail.html',
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

function picker(el, id) {
    api.openPicker({
        type: 'date',
        title: '日期'
    }, function(ret, err) {
        var startYear = ret.year;
        var startMonth = ret.month;
        var startDay = ret.day;
        var date = startYear + "-" + (startMonth < 10 ? "0" + startMonth : startMonth) + "-" + (startDay < 10 ? "0" + startDay : startDay);
        api.openPicker({
            type: 'time',
            title: '时间'
        }, function(ret1, err1) {
            var hour = ret1.hour;
            if (hour < 10) {
                hour = "0" + hour;
            }
            var minute = ret1.minute;
            if (minute < 10) {
                minute = "0" + minute;
            }
            var time = hour + ":" + minute+":"+"00";
            $api.val(el, date + " " + time);

            $(id).css("color", "#ccc2c2");
            $(id).one("click", function() {
                $(el).val("");
                $(id).css("color", "#ffffff");
            });
        });
    });
}

function currentTime() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    return year + "-" + month + "-" + day + " " + hour + ":" + minute+":"+"00";
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

function addOne() {
    var materialId = $("#materialId").val();
    if(materialId == 0){
        common.post({
            url: config.saveParentMaterial,
            isLoading: false,
            data: JSON.stringify({
                medPatientId: person.id,
                createUserName: userName,
                homepageId: person.homepageId
            }),
            success: function(r) {
                $("#materialId").val(r.content.id);
            }
        });
    }
    $("#body").append("<tr name='data'>"+
        "<td><input type='text' name='materialName"+number+"' style='text-align:center;height:25px;'/></td>"+
        "<td><input type='text' name='price"+number+"' style='text-align:center;height:25px;'/></td>"+
        "<td><input type='text' name='signature"+number+"' style='text-align:center;height:25px;'/></td>"+
        "</tr>");
    number++;
}

function save(){
    var materialId = $("#materialId").val();
    if(materialId!=0){
        var doctorName = $api.val($api.byId('doctorName'))
        var doctorSignatureTime = $api.val($api.byId('doctorSignatureTime'))
        var nurseName = $api.val($api.byId('nurseName'))
        var signatureTime = $api.val($api.byId('signatureTime'))
        common.post({
            url: config.updateParentMaterial,
            isLoading: false,
            dataType:JSON,
            data: {
                id: materialId,
                doctorName: doctorName,
                doctorSignatureTime: doctorSignatureTime,
                signatureTime: signatureTime,
                nurseName: nurseName
            },
            success: function(r) {
                for (var i=0; i<number; i++){
                    var materialName = $("input[name='materialName"+i+"']").val();
                    var price = $("input[name='price"+i+"']").val();
                    var signature = $("input[name='signature"+i+"']").val();
                    common.post({
                        url: config.saveSonMaterial,
                        isLoading: false,
                        dataType:JSON,
                        data: {
                            signature: signature,
                            materialName: materialName,
                            price: price,
                            id: materialId,
                            medPatientId: person.id,
                            homepageId: person.homepageId,
                            createUserName: userName,
                            doctorName: doctorName,
                            doctorSignatureTime: doctorSignatureTime,
                            signatureTime: signatureTime,
                            nurseName: nurseName,
                            createTime: currentTime()
                        },
                        success: function(r) {
                            api.hideProgress();
                        }
                    });
                }
            }
        });
        api.alert({
            title: '提示',
            msg: '保存成功！',
        }, function(ret, err) {
            number = 0
            showAdd();
        });
    }else{
        api.toast({
            msg: '没有可保存得项，请先新增数据！',
            duration: config.duration,
            location: 'bottom'
        });
    }
}
