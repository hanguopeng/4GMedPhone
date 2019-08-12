var person = $api.getStorage(storageKey.currentPerson);
var personInfo = null;
var patientId = person.id;
apiready = function () {
    api.parseTapmode();
    checkBox()
    var tab = new auiTab({
        element: document.getElementById("tab"),
        index: 1,
        repeatClick: false
    }, function (ret) {
        $api.html($api.byId("content"), "");
        if (ret.index == 1) {
            checkBox()
            showAdd();
        } else if (ret.index == 2) {
            showHis();
        }
    });
    showAdd();

}

function showAdd() {
    common.get({
        url: config.patientDetailUrl + patientId + '/' + person.homepageId,
        isLoading: true,
        success: function (ret) {
            ret.content.pgrq = currentTime();
            var storageUserName = $api.getStorage(storageKey.userName);
            ret.content.pgr = storageUserName;
            //alert(JSON.stringify())
            personInfo = ret.content;

            $api.html($api.byId('content'), "");
            var contentTmpl = doT.template($api.text($api.byId('add-tpl')));
            $api.html($api.byId('content'), contentTmpl(personInfo));

        }
    });
    api.parseTapmode();
}

//历史展示
function showHis() {

    var contentTmpl = doT.template($api.text($api.byId('his-tpl')));
    $api.html($api.byId('content'), contentTmpl({}));
    api.parseTapmode();
    api.hideProgress();

}

function currentDate() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    return year + "-" + month + "-" + day;
}

function createDate() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    return year + "-" + month + "-" + day + " " + hour + ":" + minute;
}

function currentTime() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    return year + "-" + month + "-" + day + " " + hour + ":" + minute;
}

function nextTime() {
    var curDate = new Date();
    var date = new Date(curDate.getTime() + 24 * 60 * 60 * 1000);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    return year + "-" + month + "-" + day + "T" + hour + ":" + minute;
}


//分时段信息保存
function saveAddRecord() {
    //上传的数据集合
    var data = [];
    var hzgx = $api.val($api.byId('hzgx'));
    var yi = $("input[name='yi']:checked").val();
    var er = $("input[name='er']:checked").val();
    var san = $("input[name='san']:checked").val();
    var si = $("input[name='si']:checked").val();
    var wu = $("input[name='wu']:checked").val();
    var liu = $("input[name='liu']:checked").val();
    var qi = $("input[name='qi']:checked").val();
    var ba = $("input[name='ba']:checked").val();
    var jiu = $("input[name='jiu']:checked").val();
    var shi = $("input[name='shi']:checked").val();
    var shiyi = $("input[name='shiyi']:checked").val();
    var shier = $("input[name='shier']:checked").val();

    var shisan = $("input[name='shisan']:checked").val();
    var shisi = $("input[name='shisi']:checked").val();
    var shiwu = $("input[name='shiwu']:checked").val();
    var shiliu = $("input[name='shiliu']:checked").val();
    var shiqi = $("input[name='shiqi']:checked").val();
    var shiba = $("input[name='shiba']:checked").val();
    var shijiu = $("input[name='shijiu']:checked").val();
    var ershi = $("input[name='ershi']:checked").val();
    var gaowei = $("input[name='gaowei']:checked").val();
    var leijipingfen = $("input[name='leijipingfen']").val();
    var gaowei1 = $("input[name='gaowei1']:checked").val();
    var gaowei2 = $("input[name='gaowei2']:checked").val();
    var gaowei3 = $("input[name='gaowei3']:checked").val();
    var gaowei4 = $("input[name='gaowei4']:checked").val();
    var gaowei5 = $("input[name='gaowei5']:checked").val();
    var gaowei6 = $("input[name='gaowei6']:checked").val();
    var gaowei7 = $("input[name='gaowei7']:checked").val();
    var gaowei8 = $("input[name='gaowei8']:checked").val();
    var gaowei9 = $("input[name='gaowei9']:checked").val();
    var huanzhejiashuqianming = $("input[name='huanzhejiashuqianming']").val();


    var yaowu = "";
    var yaowuList = $("input[name='yaowu']");
    for (var i = 0; i < yaowuList.length; i++) {
        if (yaowuList[i].checked) {
            yaowu += yaowuList[i].value + ",";
        }
    }
    var rolloutcanal = "";
    var rolloutcanalList = $("input[name='rolloutcanal']");
    for (var i = 0; i < rolloutcanalList.length; i++) {
        if (rolloutcanalList[i].checked) {
            rolloutcanal += rolloutcanalList[i].value + ",";
        }
    }

    addMapIfNotNull(data, "yi", yi, true);
    addMapIfNotNull(data,"hzgx",hzgx,true);
    addMapIfNotNull(data, "er", er, true);
    addMapIfNotNull(data, "san", san, true);
    addMapIfNotNull(data, "si", si, true);
    addMapIfNotNull(data, "wu", wu, true);
    addMapIfNotNull(data, "liu", liu, true);
    addMapIfNotNull(data, "qi", qi, true);
    addMapIfNotNull(data, "ba", ba, true);
    addMapIfNotNull(data, "jiu", jiu, true);
    addMapIfNotNull(data, "shi", shi, true);
    addMapIfNotNull(data, "shiyi", shiyi, true);
    addMapIfNotNull(data, "shier", shier, true);
    addMapIfNotNull(data, "shisan", shisan, true);
    addMapIfNotNull(data, "shisi", shisi, true);
    addMapIfNotNull(data, "shiwu", shiwu, true);
    addMapIfNotNull(data, "shiliu", shiliu, true);
    addMapIfNotNull(data, "shiqi", shiqi, true);
    addMapIfNotNull(data, "shiba", shiba, true);
    addMapIfNotNull(data, "shijiu", shijiu, true);
    addMapIfNotNull(data, "ershi", ershi, true);
    addMapIfNotNull(data, "yaowu", yaowu, true);
    addMapIfNotNull(data, "gaowei", gaowei, true);
    addMapIfNotNull(data, "leijipingfen", leijipingfen, true);
    addMapIfNotNull(data, "gaowei1", gaowei1, true);
    addMapIfNotNull(data, "gaowei2", gaowei2, true);
    addMapIfNotNull(data, "gaowei3", gaowei3, true);
    addMapIfNotNull(data, "gaowei4", gaowei4, true);
    addMapIfNotNull(data, "gaowei5", gaowei5, true);
    addMapIfNotNull(data, "gaowei6", gaowei6, true);
    addMapIfNotNull(data, "gaowei7", gaowei7, true);
    addMapIfNotNull(data, "gaowei8", gaowei8, true);
    addMapIfNotNull(data, "gaowei9", gaowei9, true);
    addMapIfNotNull(data, "huanzhejiashuqianming", huanzhejiashuqianming, true);
    var params = {};
    var person = $api.getStorage(storageKey.currentPerson);
    params.medPatientId = person.id;
    params.medTemplateId = 224;
    params.itemList = data;
    params.measureDate = currentTime() + ":00";

    api.confirm({
        title: '提示',
        msg: '确定保存吗？',
        buttons: ['确定', '取消']
    }, function (ret, err) {
        if (ret.buttonIndex == 1) {
            common.post({
                url: config.nursePlanUrl,
                isLoading: true,
                text: "正在保存...",
                data: JSON.stringify(params),
                success: function (ret) {
                    api.hideProgress();
                    api.alert({
                        title: '提示',
                        msg: '保存成功！',
                    }, function (ret, err) {
                        showAdd();
                    });
                }
            });

        }
    });
}

function checkNull(val, msg) {
    if (!val) {
        api.toast({
            msg: msg,
            duration: 2000,
            location: 'bottom'
        });
        return true;
    }

    return false;
}

//如果value不会空，则放入到map中
function addMapIfNotNull(arr, key, value, existsId) {
    var map = {};
    if (value && key) {
        map["key"] = key;
        map["value"] = value;
        if (existsId) {
            map["medTemplateItemId"] = 224;
        }
        arr.push(map);
    }
}

function openDetailWin(el) {
    var data = JSON.parse($(el).find(".json-span").first().text());
    api.openWin({
        name: 'win_fallAndFallIntoBed_detail',
        url: './win_fallAndFallIntoBed_detail.html',
        pageParam: {
            data: data
        }
    });

}

//打开日期选择
function picker() {
    api.openPicker({
        type: 'date',
        title: '开始时间'
    }, function (ret, err) {
        var startYear = ret.year;
        var startMonth = ret.month;
        var startDay = ret.day;
        var startDate = startYear + "-" + (startMonth < 10 ? "0" + startMonth : startMonth) + "-" + (startDay < 10 ? "0" + startDay : startDay);
        api.openPicker({
            type: 'date',
            title: '结束时间'
        }, function (ret1, err1) {
            var endYear = ret1.year;
            var endMonth = ret1.month;
            var endDay = ret1.day;
            var endDate = endYear + "-" + (endMonth < 10 ? "0" + endMonth : endMonth) + "-" + (endDay < 10 ? "0" + endDay : endDay);
            $api.val($api.byId("dateRange"), startDate + "~" + endDate);
        });
    });
}

//打开日期选择
function pickerSearch() {
    api.openPicker({
        type: 'date',
        title: '开始时间'
    }, function (ret, err) {
        var startYear = ret.year;
        var startMonth = ret.month;
        var startDay = ret.day;
        var startDate = startYear + "-" + (startMonth < 10 ? "0" + startMonth : startMonth) + "-" + (startDay < 10 ? "0" + startDay : startDay);
        api.openPicker({
            type: 'date',
            title: '结束时间'
        }, function (ret1, err1) {
            var endYear = ret1.year;
            var endMonth = ret1.month;
            var endDay = ret1.day;
            var endDate = endYear + "-" + (endMonth < 10 ? "0" + endMonth : endMonth) + "-" + (endDay < 10 ? "0" + endDay : endDay);
            $api.val($api.byId("dateRange"), startDate + "~" + endDate);
        });
    });
}

function showHis(){
    var contentTmpl = doT.template($api.text($api.byId('his-tpl')));
    $api.html($api.byId('content'), contentTmpl({}));
    api.parseTapmode();
    api.hideProgress();
    common.post({
        //url:config.nursePlanUrl+"?patientId="+person.id+"&templateIdList=204&limit=-1",
        url:config.nursePlanUrl+"/listDetails/json",
        isLoading:true,
        data:JSON.stringify({
            patientId: person.id,
            limit: -1,
            templateList:[{"templateCode":"fallAndFallIntoBed","templateVersion":1}]
        }),
        success: function (ret) {
            //alert(JSON.stringify(ret.content));
            if (ret.content && ret.content.list && ret.content.list.length > 0) {
                //处理数据
                //alert(JSON.stringify(ret.content.list));
                var data = ret.content.list;
                var contentTmpl = doT.template($api.text($api.byId('record-tpl')));
                $api.html($api.byId('recordContent'), contentTmpl(data));
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

function onlyNum(obj) {
    var inp = $api.val(obj);
    if (/^\d+(\.\d+)?$/.test(obj.value)) {
        obj.value = "";
        api.toast({
            msg: "请正确填写生命体征",
            duration: config.duration,
            location: 'bottom'
        });
    }
}

function getDayAll(begin, end) {
    var dateAllMap = {};
    var ab = begin.split("-");
    var ae = end.split("-");
    var db = new Date();
    db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
    var de = new Date();
    de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
    var unixDb = db.getTime();
    var unixDe = de.getTime();
    for (var k = unixDb; k <= unixDe;) {
        var date = new Date(k);
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var tmp = date.getFullYear() + '-' + (month < 10 ? ("0" + month) : month) + '-' + (day < 10 ? ("0" + day) : day);
        dateAllMap[tmp] = [];
        k = k + 24 * 60 * 60 * 1000;
    }
    return dateAllMap;
}

function truncDate(date) {
    return date.substr(0, 10);
}

function truncTime(date) {
    return date.substr(11, 5);
}
function checkBox() {
    var params = {};
    params.queryCode = "patient_relation";
    params.addAllFlag = false;
    params.loadSonFlag = false;
    params.nullFlag = false;
    common.post({
        url:config.dictUrl,
        isLoading: true,
        data:JSON.stringify(params),
        dataType:JSON,
        success:function(ret){
            var item = ret.content;
            //alert(JSON.stringify(item));
            console.log(JSON.stringify(item));
            //alert(item.length);
            $api.html($api.byId("hzgx"), "");
            /*$api.html($api.byId("hzgx"), "<option value=''>请选择</option>");*/
            var contentTmpl = doT.template($api.text($api.byId("hzjsgx-tpl")));
            $api.html($api.byId("hzgx"), contentTmpl(item));
        }
    });
}

function sum() {
    var sumRecord = 0;
    //  var sumRecord = 0;
    var countGaowei = 0;
    if ($("input[name='yi']:checked").val()==1) {
        sumRecord += 1
    }
    if ($("input[name='san']:checked").val()==1) {
        sumRecord += 1
    }
    if ($("input[name='liu']:checked").val()==1) {
        sumRecord += 1
    }
    if ($("input[name='shiyi']:checked").val()==1) {
        sumRecord += 1
    }
    if ($("input[name='shier']:checked").val()==1) {
        sumRecord += 1
    }
    if ($("input[name='shisan']:checked").val()==1) {
        sumRecord += 1
    }
    if ($("input[name='shisi']:checked").val()==1) {
        sumRecord += 1
    }
    if ($("input[name='shiqi']:checked").val()==1) {
        sumRecord += 1
    }
    if ($("input[name='shiba']:checked").val()==1) {
        sumRecord += 1
    }
    if ($("input[name='shijiu']:checked").val()==1) {
        sumRecord += 1
    }
    if ($("input[name='ershi']:checked").val()==1) {
        sumRecord += 1
    }

    if ($("input[name='ba']:checked").val()==3) {
        sumRecord += 3
    }
    if ($("input[name='jiu']:checked").val()==2) {
        sumRecord += 2
    }
    if ($("input[name='shi']:checked").val()==2) {
        sumRecord += 2
    }if ($("input[name='shiwu']:checked").val()==2) {
        sumRecord += 2
    }
    if ($("input[name='shiliu']:checked").val()==3) {
        sumRecord += 3
    }

    if ($("input[name='er']:checked").val()==4) {
        countGaowei += 1
    }
    if ($("input[name='si']:checked").val()==4) {
        countGaowei += 1
    }
    if ($("input[name='wu']:checked").val()==4) {
        countGaowei += 1
    }
    if ($("input[name='qi']:checked").val()==4) {
        countGaowei += 1
    }
    $("input[name='leijipingfen']").val(sumRecord)
    if (countGaowei > 0) {
        $("input[name='gaowei']").attr("checked","checked")
    }
    if (countGaowei < 0) {
        $("input[name='gaowei']").removeAttr("checked")
    }

}