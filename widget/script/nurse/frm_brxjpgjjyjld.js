var person = $api.getStorage(storageKey.currentPerson);
var personInfo = null;
var patientId = person.id;
apiready = function () {
    api.parseTapmode();

    //定义点击tab切换本地和云端音频
    var tab = new auiTab({
        element: document.getElementById("tab"),
        index: 1,
        repeatClick: false
    }, function (ret) {
        $api.html($api.byId("content"), "");
        if (ret.index == 1) {
            showAdd();
        } else if (ret.index == 2) {
            showHis();
        }
    });
    showAdd();

}

function showAdd() {
    common.get({
        url: config.patientDetailUrl + patientId,
        isLoading: true,
        success: function (ret) {
            ret.content.pgrq = currentTime();
            var storageUserName = $api.getStorage(storageKey.loginName);
            ret.content.pgr = storageUserName;

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

    var diagnosis = $("input[name='diagnosis']").val();
    var explainTime = $("input[name='explainTime']").val();
    var explainObject = $("input[name='explainObject']:checked").val();
    var explainObjectOther = $("input[name='explainObjectOther']").val();
    var language = $("input[name='language']:checked").val();
    var languageOther = $("input[name='languageOther']").val();
    var country = $("input[name='country']").val();
    var educationalStatus = $("input[name='educationalStatus']:checked").val();
    var explainType = $("input[name='explainType']:checked").val();
    var explainTypeOther = $("input[name='explainTypeOther']").val();
    var learningMotivation = $("input[name='learningMotivation']:checked").val();
    var learningDisorder = $("input[name='learningDisorder']:checked").val();
    var learningDisorderOther = $("input[name='learningDisorderOther']").val();
    var learningDisorderWay = $("input[name='learningDisorderWay']").val();
    var explainWay = $("input[name='explainWay']:checked").val();
    var explainWayOther = $("input[name='explainWayOther']").val();
    var explainWayWay = $("input[name='explainWayWay']").val();
    var explainSignature = $("input[name='explainSignature']:checked").val();
    var signatureOther = $("input[name='signatureOther']").val();
    var signature = $("input[name='signature']").val();
    var agreeFlag = $("input[name='agreeFlag']:checked").val();
    var give = $("input[name='give']:checked").val();
    var patientsSignature = $("input[name='patientsSignature']").val();
    var selfAppraisal = $("input[name='selfAppraisal']:checked").val();
    var selfAppraisalSignature = $("input[name='selfAppraisalSignature']").val();
    var review = $("input[name='review']:checked").val();
    var explainTimeBottom = $("input[name='explainTimeBottom']").val();



    addMapIfNotNull(data, "diagnosis", diagnosis, true);
    addMapIfNotNull(data, "explainTime", explainTime, true);
    addMapIfNotNull(data, "explainObject", explainObject, true);
    addMapIfNotNull(data, "explainObjectOther", explainObjectOther, true);
    addMapIfNotNull(data, "language", language, true);
    addMapIfNotNull(data, "languageOther", languageOther, true);
    addMapIfNotNull(data, "country", country, true);
    addMapIfNotNull(data, "educationalStatus", educationalStatus, true);
    addMapIfNotNull(data, "explainType", explainType, true);
    addMapIfNotNull(data, "explainTypeOther", explainTypeOther, true);
    addMapIfNotNull(data, "learningMotivation", learningMotivation, true);
    addMapIfNotNull(data, "learningDisorder", learningDisorder, true);
    addMapIfNotNull(data, "learningDisorderOther", learningDisorderOther, true);
    addMapIfNotNull(data, "learningDisorderWay", learningDisorderWay, true);
    addMapIfNotNull(data, "explainWay", explainWay, true);
    addMapIfNotNull(data, "explainWayOther", explainWayOther, true);
    addMapIfNotNull(data, "explainWayWay", explainWayWay, true);
    addMapIfNotNull(data, "explainSignature", explainSignature, true);
    addMapIfNotNull(data, "signatureOther", signatureOther, true);
    addMapIfNotNull(data, "signature", signature, true);
    addMapIfNotNull(data, "agreeFlag", agreeFlag, true);
    addMapIfNotNull(data, "give", give, true);
    addMapIfNotNull(data, "patientsSignature", patientsSignature, true);
    addMapIfNotNull(data, "selfAppraisal", selfAppraisal, true);
    addMapIfNotNull(data, "selfAppraisalSignature", selfAppraisalSignature, true);
    addMapIfNotNull(data, "review", review, true);
    addMapIfNotNull(data, "explainTimeBottom", explainTimeBottom, true);


    if (checkNull(diagnosis, "请输入诊断") || checkNull(explainTime, "请输入说明日期") ||
        checkNull(explainObject, "请输入说明对象") || checkNull(language, "请输入语言") ||
        checkNull(country, "请输入国籍") || checkNull(educationalStatus, "请输入教育程度") ||
        checkNull(explainType, "请输入说明类型") || checkNull(learningMotivation, "请输入学习动机") ||
        checkNull(learningDisorder, "请输入学习障碍") || checkNull(explainWay, "请输入说明方式") ||
        checkNull(selfAppraisal, "请输入说明者签名") || checkNull(agreeFlag, "请输入说明内容") ||
        checkNull(explainSignature, "请输入说明对象自我批评") || checkNull(review, "请输入回顾或追踪")
    ) {
        return;
    }

    var params = {};
    var person = $api.getStorage(storageKey.currentPerson);
    params.medPatientId = person.id;
    params.medTemplateId = 9;
    params.itemList = data;
    params.measureDate= currentTime()+":00";

    api.confirm({
        title: '提示',
        msg: '确定保存吗？',
        buttons: ['确定', '取消']
    }, function (ret, err) {
        if (ret.buttonIndex == 1) {
            common.post({
                url: config.nurseLogCreate,
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
            map["medTemplateItemId"] = 9;
        }
        arr.push(map);
    }
}

function openDetailWin(el) {
    var data = JSON.parse($(el).find(".json-span").first().text());
    api.openWin({
        name: 'win_brxjpgjjyjld_detail',
        url: './win_brxjpgjjyjld_detail.html',
        pageParam: {
            data: data
        }
    });

}

function chooseDate(){
    api.openPicker({
        type: 'date',
        title: '开始时间'
    }, function (ret, err) {
        var startYear = ret.year;
        var startMonth = ret.month;
        var startDay = ret.day;
        var startDate = startYear + "-" + (startMonth < 10 ? "0" + startMonth : startMonth) + "-" + (startDay < 10 ? "0" + startDay : startDay);
        $api.val($api.byId("explainTime"), startDate);
    });
}

function chooseDateTime(){
    api.openPicker({
        type: 'date',
        title: '开始时间'
    }, function (ret, err) {
        var startYear = ret.year;
        var startMonth = ret.month;
        var startDay = ret.day;
        var startDate = startYear + "-" + (startMonth < 10 ? "0" + startMonth : startMonth) + "-" + (startDay < 10 ? "0" + startDay : startDay);
        api.openPicker({
            type: 'time',
            title: '时间'
        }, function(ret1, err1){
            var hour = ret1.hour;
            if(hour < 10){
                hour = "0"+hour;
            }
            var minute = ret1.minute;
            if(minute < 10){
                minute = "0"+minute;
            }
            var time = hour + ":" + minute;
            $api.val($api.byId("explainTime"), startDate+" "+time);
        });

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
function pickerSearch(){
    api.openPicker({
        type: 'date',
        title: '开始时间'
    }, function(ret, err){
        var startYear = ret.year;
        var startMonth = ret.month;
        var startDay = ret.day;
        var startDate = startYear + "-" + (startMonth<10? "0"+startMonth:startMonth) + "-" + (startDay<10?"0"+startDay:startDay);
        api.openPicker({
            type: 'date',
            title: '结束时间'
        }, function(ret1, err1){
            var endYear = ret1.year;
            var endMonth = ret1.month;
            var endDay = ret1.day;
            var endDate = endYear + "-" + (endMonth<10?"0"+endMonth:endMonth) + "-" + (endDay<10?"0"+endDay:endDay);
            $api.val($api.byId("dateRange"),startDate+"~"+endDate);
        });
    });
}

function search() {
    $api.html($api.byId("recordContent"), "");
    var dateRange = $api.val($api.byId("dateRange"));
    if (!dateRange) {
        api.toast({
            msg: '请选择日期',
            duration: config.duration,
            location: 'bottom'
        });
        return;
    }
    var fields = dateRange.split("~");
    var startDate = fields[0];
    var endDate = fields[1];
    var person = $api.getStorage(storageKey.currentPerson);
    $api.html($api.byId("recordContent"), "");
    common.post({
        url: config.nurseLogCommon,
        isLoading: true,
        data:JSON.stringify({
            patientId: person.id,
            beginTime: startDate+" 00:00:00",
            endTime: endDate+" 23:59:59",
            limit: -1,
            templateList:[{"templateCode":"educationRecordSheet","templateVersion":1}]
        }),
        success: function (ret) {
            if (ret.content && ret.content.list && ret.content.list.length > 0) {
                //处理数据
                var data = ret.content.list;
                //根据开始时间和结束时间构造一个以时间为key的数组对象
                var timeMap = getDayAll(startDate, endDate);
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
