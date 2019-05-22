var person = $api.getStorage(storageKey.currentPerson);
var personInfo = null;
var patientId = person.id;
apiready = function () {
    api.parseTapmode();

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
    var zrzya = $("input[name='zylvl']:checked").val();
    var zrzyb = $("input[name='jslvl']:checked").val();
    var recordperson = $("input[name='recordPerson']").val();
    var diagnosis = $("input[name='diagnosis']").val();
    var rollout = $("input[name='rollout']").val();
    var rolloutt = $("input[name='rolloutt']").val();
    var rolloutp = $("input[name='rolloutp']").val();
    var rolloutr = $("input[name='rolloutr']").val();
    var rolloutspo2 = $("input[name='rolloutspo2']").val();
    var rolloutep1 = $("input[name='rolloutep1']").val();
    var rolloutep2 = $("input[name='rolloutep2']").val();
    var rolloutconsciousness = $("input[name='rolloutconsciousness']:checked").val();
    var rolloutskinCase= "" ;
    var rolloutskinCaseList = $("input[name='rolloutskinCase']");
    for(var i=0;i<rolloutskinCaseList.length;i++){
        if(rolloutskinCaseList[i].checked){
            rolloutskinCase += rolloutskinCaseList[i].value+",";
        }
    }

    var rolloutskinCaseAcreage = $("input[name='rolloutskinCaseAcreage']").val();
    var rolloutskinCaseDepth = $("input[name='rolloutskinCaseDepth']").val();
    var rolloutmedicineCure = $("input[name='rolloutmedicineCure']").val();
    var rollouttransfusionCure = $("input[name='rollouttransfusionCure']").val();
    var rolloutotherCure = $("input[name='rolloutotherCure']").val();
    var rolloutcanal = "" ;
    var rolloutcanalList = $("input[name='rolloutcanal']");
    for(var i=0;i<rolloutcanalList.length;i++){
        if(rolloutcanalList[i].checked){
            rolloutcanal += rolloutcanalList[i].value+",";
        }
    }
    var rolloutcanalOther = $("input[name='rolloutcanalOther']").val();
    var rolloutInstruments = "" ;
    var rolloutInstrumentsList =$("input[name='rolloutInstruments']");
    for(var i=0;i<rolloutInstrumentsList.length;i++){
        if(rolloutInstrumentsList[i].checked){
            rolloutInstruments += rolloutInstrumentsList[i].value+",";
        }
    }
    var rolloutdoctorA = $("input[name='rolloutdoctorA']").val();
    var rolloutnurseA = $("input[name='rolloutnurseA']").val();
    var rolloutrolloutTimeA = $("input[name='rolloutrolloutTimeA']").val();
    var rolloutnurseB = $("input[name='rolloutnurseB']").val();
    var rolloutrolloutTimeB = $("input[name='rolloutrolloutTimeB']").val();

    var rollin = $("input[name='rollin']").val();
    var rollint = $("input[name='rollint']").val();
    var rollinp = $("input[name='rollinp']").val();
    var rollinr = $("input[name='rollinr']").val();
    var rollinspo2 = $("input[name='rollinspo2']").val();
    var rollinep1 = $("input[name='rollinep1']").val();
    var rollinep2 = $("input[name='rollinep2']").val();
    var rollinconsciousness = $("input[name='rollinconsciousness']:checked").val();
    var rollinskinCase = "";
    var rollinskinCaseList = $("input[name='rollinskinCase']");
    for(var i=0;i<rollinskinCaseList.length;i++){
        if(rollinskinCaseList[i].checked){
            rollinskinCase += rollinskinCaseList[i].value+",";
        }
    }
    var rollinskinCaseAcreage = $("input[name='rollinskinCaseAcreage']").val();
    var rollinskinCaseDepth = $("input[name='rollinskinCaseDepth']").val();
    var rollinmedicineCure = $("input[name='rollinmedicineCure']").val();
    var rollintransfusionCure = $("input[name='rollintransfusionCure']").val();
    var rollinotherCure = $("input[name='rollinotherCure']").val();
    var rollincanal = "";
    var rollincanalList = $("input[name='rollincanal']");
    for(var i=0;i<rollincanalList.length;i++){
        if(rollincanalList[i].checked){
            rollincanal += rollincanalList[i].value+",";
        }
    }
    var rollincanalOther = $("input[name='rollincanalOther']").val();
    var rollinInstruments ;
    var rollinInstrumentsList = $("input[name='rollinInstruments']");
    for(var i=0;i<rollinInstrumentsList.length;i++){
        if(rollinInstrumentsList[i].checked){
            rollinInstruments += rollinInstrumentsList[i].value+",";
        }
    }
    var rollindoctorA = $("input[name='rollindoctorA']").val();
    var rollinnurseA = $("input[name='rollinnurseA']").val();
    var rollinrolloutTimeA = $("input[name='rollinrolloutTimeA']").val();
    var rollinnurseB = $("input[name='rollinnurseB']").val();
    var rollinrolloutTimeB = $("input[name='rollinrolloutTimeB']").val();
    if(zrzya){
        if(zrzya=="A级"){
            if(checkNull(rolloutdoctorA,"请输入转运医生和转运护士")){
                return;
            }
        }else{
            if(checkNull(rolloutnurseA,"请输入转运护士")){
                return;
            }
        }
    }
    if(zrzyb){
        if(zrzyb=="A级"){
            if(checkNull(rollindoctorA,"请输入转运医生和转运护士")){
                return;
            }
        }else{
            if(checkNull(rollinnurseB,zrzyb=="请输入转运护士")){
                return;
            }
        }
    }

    addMapIfNotNull(data, "recordperson",recordperson,true);
    addMapIfNotNull(data, "diagnosis", diagnosis, true);
    addMapIfNotNull(data, "rollout", rollout, true);
    addMapIfNotNull(data, "rolloutt", rolloutt, true);
    addMapIfNotNull(data, "rolloutp", rolloutp, true);
    addMapIfNotNull(data, "rolloutr", rolloutr, true);
    addMapIfNotNull(data, "rolloutspo2", rolloutspo2, true);
    addMapIfNotNull(data, "rolloutep1", rolloutep1, true);
    addMapIfNotNull(data, "rolloutep2", rolloutep2, true);
    addMapIfNotNull(data, "rolloutconsciousness", rolloutconsciousness, true);
    addMapIfNotNull(data, "rolloutskinCase", rolloutskinCase, true);
    addMapIfNotNull(data, "rolloutskinCaseAcreage", rolloutskinCaseAcreage, true);
    addMapIfNotNull(data, "rolloutskinCaseDepth", rolloutskinCaseDepth, true);
    addMapIfNotNull(data, "rolloutmedicineCure", rolloutmedicineCure, true);
    addMapIfNotNull(data, "rollouttransfusionCure", rollouttransfusionCure, true);
    addMapIfNotNull(data, "rolloutotherCure", rolloutotherCure, true);
    addMapIfNotNull(data, "rolloutcanal", rolloutcanal, true);
    addMapIfNotNull(data, "rolloutcanalOther", rolloutcanalOther, true);
    addMapIfNotNull(data, "rolloutInstruments", rolloutInstruments, true);
    addMapIfNotNull(data, "rolloutdoctorA", rolloutdoctorA, true);
    addMapIfNotNull(data, "rolloutnurseA", rolloutnurseA, true);
    addMapIfNotNull(data, "rolloutrolloutTimeA", rolloutrolloutTimeA, true);
    addMapIfNotNull(data, "rolloutnurseB", rolloutnurseB, true);
    addMapIfNotNull(data, "rolloutrolloutTimeB", rolloutrolloutTimeB, true);

    addMapIfNotNull(data, "rollin", rollin, true);
    addMapIfNotNull(data, "rollint", rollint, true);
    addMapIfNotNull(data, "rollinp", rollinp, true);
    addMapIfNotNull(data, "rollinr", rollinr, true);
    addMapIfNotNull(data, "rollinspo2", rollinspo2, true);
    addMapIfNotNull(data, "rollinep1", rollinep1, true);
    addMapIfNotNull(data, "rollinep2", rollinep2, true);
    addMapIfNotNull(data, "rollinconsciousness", rollinconsciousness, true);
    addMapIfNotNull(data, "rollinskinCase", rollinskinCase, true);
    addMapIfNotNull(data, "rollinskinCaseAcreage", rollinskinCaseAcreage, true);
    addMapIfNotNull(data, "rollinskinCaseDepth", rollinskinCaseDepth, true);
    addMapIfNotNull(data, "rollinmedicineCure", rollinmedicineCure, true);
    addMapIfNotNull(data, "rollintransfusionCure", rollintransfusionCure, true);
    addMapIfNotNull(data, "rollinotherCure", rollinotherCure, true);
    addMapIfNotNull(data, "rollincanal", rollincanal, true);
    addMapIfNotNull(data, "rollincanalOther", rollincanalOther, true);
    addMapIfNotNull(data, "rollinInstruments", rollinInstruments, true);
    addMapIfNotNull(data, "rollindoctorA", rollindoctorA, true);
    addMapIfNotNull(data, "rollinnurseA", rollinnurseA, true);
    addMapIfNotNull(data, "rollinrolloutTimeA", rollinrolloutTimeA, true);
    addMapIfNotNull(data, "rollinnurseB", rollinnurseB, true);
    addMapIfNotNull(data, "rollinrolloutTimeB", rollinrolloutTimeB, true);

    if (checkNull(diagnosis, "请输入转科诊断") || checkNull(rolloutt, "请输入生命体征") ||
        checkNull(rolloutp, "请输入生命体征") || checkNull(rolloutr, "请输入生命体征") ||
        checkNull(rolloutspo2, "请输入生命体征") || checkNull(rolloutep1, "请输入EP mmHg") ||
        checkNull(rolloutconsciousness, "请输入意识状态") || checkNull(rolloutskinCase, "请输入皮肤情况") ||
        checkNull(rolloutmedicineCure, "请输入药物治疗") || checkNull(rollouttransfusionCure, "请输入输血治疗") ||
        checkNull(rolloutcanal, "请输入管路") || checkNull(rolloutInstruments, "请输入携带仪器" || checkNull(recordperson,"请输入记录人")||checkNull(rollout,"请输入转出科室"||
        checkNull(rollin,"请输入转入科室")))
    ) {
        return;
    }

    var params = {};
    var person = $api.getStorage(storageKey.currentPerson);
    params.medPatientId = person.id;
    params.medTemplateId = 8;
    params.itemList = data;
    params.measureDate= currentTime()+":00";

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
            map["medTemplateItemId"] = 8;
        }
        arr.push(map);
    }
}

function openDetailWin(el) {
    var data = JSON.parse($(el).find(".json-span").first().text());
    api.openWin({
        name: 'win_zkjjjld_detail',
        url: './win_zkjjjld_detail.html',
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
            templateList:[{"templateCode":"transferNote","templateVersion":1}]
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

function onlyNum(obj){
    var inp = $api.val(obj);
    if (/^\d+(\.\d+)?$/.test(obj.value)){
        obj.value="";
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
