var person = $api.getStorage(storageKey.currentPerson);
var patientId = person.id;
var page = 1;
var testData
var skinTestId = ''
var skinTestStatus = true

var currentTab = 'advice-records'
apiready = function () {
    api.parseTapmode();
    adviceRecords();
}

/**
 * 切换tab
 * @param obj
 */
var changeTab = function (obj) {
    // 给选中的tab添加aui-active样式
    var auiActive = $api.hasCls(obj, 'aui-active');
    if (!auiActive) {
        $api.removeCls($api.byId('tab-advice-records'), 'aui-active');
        // $api.removeCls($api.byId('tab-advice-execute'), 'aui-active');
        $api.removeCls($api.byId('tab-advice-sends'), 'aui-active');
        $api.removeCls($api.byId('tab-tour-records'), 'aui-active');
        $api.removeCls($api.byId('tab-skin-test'), 'aui-active');
        $api.addCls(obj, 'aui-active');
    }
    // 获取data-to，显示对应的tab
    var dataTo = $api.attr(obj, 'data-to');
    var activeTab = $api.byId(dataTo);
    var active = $api.hasCls(activeTab, 'active');
    if (!active) {
        $api.removeCls($api.byId('advice-records'), 'active');
        // $api.removeCls($api.byId('advice-execute'), 'active');
        $api.removeCls($api.byId('advice-sends'), 'active');
        $api.removeCls($api.byId('tour-records'), 'active');
        $api.removeCls($api.byId('skin-test'), 'active');

        $api.addCls(activeTab, 'active');

        // 移除医嘱执行、医嘱发送、巡视记录、皮试结果的筛选等操作
        // $api.removeCls($api.dom($api.byId('advice-execute'), '#adviceExecute-selector'), 'active');
        // $api.removeCls($api.dom($api.byId('advice-execute'), '#adviceExecute-execute'), 'active');

        $api.removeCls($api.dom($api.byId('advice-sends'), '#adviceSends-selector'), 'active');

        $api.removeCls($api.dom($api.byId('tour-records'), '#tourRecords-result'), 'active');

        $api.removeCls($api.dom($api.byId('skin-test'), '#skinTest-selector'), 'active');
        $api.removeCls($api.dom($api.byId('skin-test'), '#skinTest-result'), 'active');

    }

    if (dataTo == "advice-records") {// 医嘱记录
        if (currentTab == "advice-records"){
            $api.addCls($api.byId("adviceRecordsDropdown"), 'show');
        } else{
            currentTab = 'advice-records'
            adviceRecords();
        }
    } else if (dataTo == "advice-execute") {//医嘱执行
        // $api.removeCls($api.byId("adviceRecordsDropdown"), 'show');
        // currentTab = 'advice-execute'
        // adviceExecute();
    } else if (dataTo == "advice-sends") {//医嘱发送
        $api.removeCls($api.byId("adviceRecordsDropdown"), 'show');
        currentTab = 'advice-sends'
        adviceSends();
    } else if (dataTo == "tour-records") {//巡视记录
        $api.removeCls($api.byId("adviceRecordsDropdown"), 'show');
        currentTab = 'tour-records'
        tourRecords();
    } else if (dataTo == "skin-test") {//皮试结果
        $api.removeCls($api.byId("adviceRecordsDropdown"), 'show');
        currentTab = 'skin-test'
        skinTestRecord();
    }
}
/**
 * 切换页面下端功能按钮显示
 * @param parent
 * @param id
 */
var clickBottomTab = function (parent, id) {
   if (id == 'tourRecords-result'){
       paddingInputTourRecords();
   }
    var activeTab = $api.dom($api.byId(parent), '#' + id);
    var active = $api.hasCls(activeTab, 'active');
    if (!active) {
        // $api.removeCls($api.dom($api.byId(parent), '#adviceExecute-selector'), 'active');
        // $api.removeCls($api.dom($api.byId(parent), '#adviceExecute-execute'), 'active');

        $api.removeCls($api.dom($api.byId(parent), '#adviceSends-selector'), 'active');

        $api.removeCls($api.dom($api.byId(parent), '#tourRecords-result'), 'active');
        $api.removeCls($api.dom($api.byId(parent), '#shuyexunshi'), 'active');

        $api.removeCls($api.dom($api.byId(parent), '#skinTest-selector'), 'active');
        $api.removeCls($api.dom($api.byId(parent), '#skinTest-result'), 'active');
        $api.addCls(activeTab, 'active');


    }
    if(active){
        $api.removeCls(activeTab,'active');
    }
};

/**
 * 医嘱记录
 */
var adviceRecords = function () {
    common.get({
        url: config.adviceDetail + patientId,
        isLoading: true,
        success: function (ret) {
            testData = ret
            // 刷新数据之前将所有筛选的弹框和医嘱记录的弹框收回
            $api.removeCls( $api.dom($api.byId('tab'), '#adviceRecordsDropdown'), 'show');
            $api.removeCls( $api.dom($api.byId('advice-records'), '#adviceRecords-selector'), 'active');
            $api.html($api.byId('adviceRecordsContentContainer'), "");
            var contentTmpl = doT.template($api.text($api.byId('adviceRecordsTmplList')));
            $api.html($api.byId('adviceRecordsContentContainer'), contentTmpl(ret.content));
        }
    });
};

/**
 *  医嘱点击显示详情，再次点击隐藏
 */
var changeAdviceShow = function (obj) {
    var isHide = $api.hasCls($api.next(obj), 'hide');
    if (isHide){
        $api.removeCls($api.next(obj), 'hide');
        $api.addCls($api.next(obj), 'show');
    } else{
        $api.removeCls($api.next(obj), 'show');
        $api.addCls($api.next(obj), 'hide');
    }
}

/**
 * 点击医嘱记录弹出下拉选，鼠标浮在哪条记录上哪条记录变成浅蓝色
 * @param obj
 */
var changeBlue = function (obj) {
    $api.removeCls($api.byId('allTold'), 'changeBlue');
    $api.removeCls($api.byId('longTold'), 'changeBlue');
    $api.removeCls($api.byId('temporaryTold'), 'changeBlue');
    $api.addCls(obj, 'changeBlue');
    adviceRecords();
}

/**
 * 医嘱执行记录查询
 */
var adviceExecute = function () {
    // var priorityCode = $api.val($api.byId('dzx-yzyxj'));
    //var usageCode = $api.val($api.byId('dzx-yytj'));
    // var bigKindNumCode = $api.val($api.byId('dzx-yzcfdl'));
    // var beginFoundTime = $api.val($api.byId('dzx-yzsj-begin'));
    // var endFoundTime = $api.val($api.byId('dzx-yzsj-end'));
    // var dzjtime = new Date().getTime();
    // var curTime = new Date(dzjtime).format("yyyy-MM-dd hh:mm:ss");
    // var pretime = dzjtime-24*1000*3600;
    // var pttime = new Date(pretime).format("yyyy-MM-dd hh:mm:ss");
    /*if ("" != beginFoundTime){
        beginFoundTime = beginFoundTime+' 00:00:00';
    }
    if(""!= endFoundTime){
        endFoundTime = endFoundTime+' 00:00:00';
    }*/
    /*else if ("" != beginFoundTime&&""==endFoundTime){
        beginFoundTime = beginFoundTime+' 00:00:00';
        endFoundTime = curTime;
    }else if("" == beginFoundTime&&""==endFoundTime){
        beginFoundTime = pttime;
        endFoundTime = endFoundTime+' 00:00:00';
    }else{
        beginFoundTime = beginFoundTime+' 00:00:00';
        endFoundTime = endFoundTime+' 00:00:00';
    }*/
    // var beginRequireExecuteTime = $api.val($api.byId('dzx-yqzxsj-begin'));
    // var endRequireExecuteTime = $api.val($api.byId('dzx-yqzxsj-end'));
    // var preHour = new Date(dzjtime-1*1000*3600);
    // var beHour = new Date(dzjtime+1*1000*3600);
    // preHour = new Date(preHour).format("yyyy-MM-dd hh:mm:ss");
    // beHour = new Date(beHour).format("yyyy-MM-dd hh:mm:ss");
    //alert("preHour:"+preHour+"beHour:"+beHour);
    var params = {};
    // var beginTime = pttime;
    // var endTime = curTime;


    // beginFoundTime = ifNotNull(beginFoundTime);
    // endFoundTime=ifNotNullEnd(endFoundTime);
    // beginRequireExecuteTime=ifNotNull(beginRequireExecuteTime);
    // endRequireExecuteTime=ifNotNullEnd(endRequireExecuteTime);
    // if(beginFoundTime!=""||endFoundTime!=""||beginRequireExecuteTime!=""||endRequireExecuteTime!=""){
    //     beginTime="";
    //     endTime="";
    // }
    // params.beginTime = beginTime;
    // params.endTime = endTime;
    // params.patientId = patientId;
    // params.executeStatusCode = '0';
    // params.priorityCode = priorityCode;
    // params.usage = usageCode;
    // params.bigKindNum = bigKindNumCode;
    // params.beginFoundTime = beginFoundTime;
    // params.endFoundTime = endFoundTime;
    // params.beginRequireExecuteTime = beginRequireExecuteTime;
    // params.endRequireExecuteTime = endRequireExecuteTime;
    //alert(JSON.stringify(params))
    //alert(JSON.stringify(params));

    $api.removeCls($api.dom($api.byId('advice-execute'), '#adviceExecute-selector'), 'active');
    $api.removeCls($api.dom($api.byId('advice-execute'), '#adviceExecute-execute'), 'active');

    $api.html($api.byId('adviceExecuteContentContainer'), "");
    var contentTmpl = doT.template($api.text($api.byId('adviceExecuteTmplList')));
    $api.html($api.byId('adviceExecuteContentContainer'), contentTmpl(testData.content));
    // common.post({
    //     url: config.adviceDetail + patientId,
    //     isLoading: true,
    //     success: function (ret) {
    //         //alert(JSON.stringify(ret));
    //         $api.removeCls($api.dom($api.byId('advice-execute'), '#adviceExecute-selector'), 'active');
    //         $api.removeCls($api.dom($api.byId('advice-execute'), '#adviceExecute-execute'), 'active');
    //
    //         $api.html($api.byId('adviceExecuteContentContainer'), "");
    //         var contentTmpl = doT.template($api.text($api.byId('adviceExecuteTmplList')));
    //         $api.html($api.byId('adviceExecuteContentContainer'), contentTmpl(testData.context));
    //     }
    // });
};

/**
 * 点击医嘱执行记录显示详细信息
 * @param obj
 */
var changeAdviceExecuteShow = function (obj) {
    var isHide = $api.hasCls($api.next(obj), 'hide');
    if (isHide){
        $api.removeCls($api.next(obj), 'hide');
        $api.addCls($api.next(obj), 'show');
    } else{
        $api.removeCls($api.next(obj), 'show');
        $api.addCls($api.next(obj), 'hide');
    }
}

/**
 * 点击医嘱执行详细信息关闭详情
 * @param obj
 */
var closeAdviceExecuteDetail = function (obj) {
    $api.removeCls(obj, 'show');
    $api.addCls(obj, 'hide');
}


/**
 * 医嘱发送记录
 */
var adviceSends = function () {
    common.get({
        url: config.adviceDetail + patientId,
        isLoading: true,
        success: function (ret) {
            testData = ret
            $api.removeCls( $api.dom($api.byId('advice-sends'), '#adviceSends-selector'), 'active');
            $api.html($api.byId('adviceSendsContentContainer'), "");
            var contentTmpl = doT.template($api.text($api.byId('adviceSendsTmplList')));
            $api.html($api.byId('adviceSendsContentContainer'), contentTmpl(testData.content));
        }
    });
};


/**
 * 巡视记录列表
 */
var tourRecords = function () {
    common.get({
        url: config.inspectionQuery + patientId + '/' + $api.getStorage(storageKey.userId) ,
        isLoading: true,
        success: function (ret) {
            if(ret&&ret.content&&ret.content.list.length>0){
                $api.removeCls($api.dom($api.byId('tour-records'), '#tourRecords-result'), 'active');
                $api.html($api.byId('tourRecordsContentContainer'), "");
                var contentTmpl = doT.template($api.text($api.byId('tourRecordsList')));
                $api.html($api.byId('tourRecordsContentContainer'), contentTmpl(ret.content));
            }else{
                $api.html($api.byId('tourRecordsContentContainer'), "");
            }
        }
    });
};

var paddingInputTourRecords = function () {

    var params = {};
    params.queryCode = "inspectionType";
    params.addAllFlag = false;
    params.loadSonFlag = false;
    params.nullFlag = false;
    common.post({
        url:config.dictUrl,
        isLoading: true,
        data:JSON.stringify(params),
        dataType:JSON,
        success:function(ret){
            var data = {}
            data.patientName = person.name;
            data.medBedName = person.medBedName;
            data.list = {}
            data.time = currentTime();
            data.nurseName = $api.getStorage(storageKey.userName);
            data.list = ret.content
            $api.html($api.byId('tourRecords-result'), "");
            var contentTmpl = doT.template($api.text($api.byId('inputTourRecords')));
            $api.html($api.byId('tourRecords-result'), contentTmpl(data));
        }
    });


}
/**
 * 巡视记录保存
 */
var tourRecordsExecute = function () {
    var inspectionTypeId = $api.val($api.byId('inspectionTypeId'));
    var inspectionMemo = $api.val($api.byId('inspectionMemo'));
    var inspectionTime = $api.val($api.byId('inspectionTime'));
    common.post({
        url: config.inspectionSave,
        data: {
            patientId:  patientId,
            patientName:  person.name,
            medBedId: person.medBedId,
            medBedName: person.medBedName,
            nurseId: $api.getStorage(storageKey.userId),
            nurseName: $api.getStorage(storageKey.userName),
            inspectionTime: inspectionTime,
            inspectionTypeId: inspectionTypeId,
            inspectionMemo: inspectionMemo
        },
        isLoading: true,
        success: function (ret) {
            $api.removeCls($api.dom($api.byId('tour-records'), '#tourRecords-result'), 'active');
            api.alert({
                title: '提示',
                msg: '操作成功',
            });
        },
    }); tourRecords();
};

/**
 * 皮试结果记录列表查询
 */
var skinTestRecord = function () {
    var beginTime  = $api.val($api.byId('skin-test-begin-time'));
    var endTime   = $api.val($api.byId('skin-test-end-time'));
    var noInput   = $api.byId('noInput').checked;
    var alreadyInput   = $api.byId('alreadyInput').checked;
    var inputStatus = null;
    if (noInput && !alreadyInput){
        inputStatus = 0
    } else if (!noInput && alreadyInput){
        inputStatus = 1
    }
    if (!isEmpty(beginTime)){
        beginTime  = beginTime + ":00";
    }else{
        beginTime = null
    }
    if (!isEmpty(endTime)){
        endTime  = endTime + ":00";
    }else{
        endTime = null
    }
    common.post({
        url: config.querySkinList ,
        isLoading: true,
        data:JSON.stringify({
            medPatientId:patientId,
            beginTime: beginTime,
            endTime: endTime,
            inputStatus: inputStatus
        }),
        dataType: "json",
        success: function (ret) {
            if(ret&&ret.content&&ret.content.list.length>0){
                $api.removeCls($api.dom($api.byId('skin-test'), '#skinTest-selector'), 'active');
                $api.removeCls($api.dom($api.byId('skin-test'), '#skinTest-result'), 'active');
                $api.html($api.byId('skinTestContentContainer'), "");
                var contentTmpl = doT.template($api.text($api.byId('skinTestList')));
                $api.html($api.byId('skinTestContentContainer'), contentTmpl(ret.content.list));
            }else{
                $api.html($api.byId('skinTestContentContainer'), "");
            }
        }
    });
};
/**
 * 选中某条皮试记录，边框变成红色，代表已选中，再次点击去掉红色
 */
var SkinTestSelect = function (obj,id,status) {
    if (isEmpty(skinTestId)){
        $api.removeCls(obj, 'border-green');
        $api.addCls(obj, 'border-red');
        skinTestId = id;
        skinTestStatus = status;
    } else{
        $api.removeCls(obj, 'border-red');
        $api.addCls(obj, 'border-green');
        skinTestId = ''
        skinTestStatus = true
    }

};
/**
 * 皮试结果保存或修改
 */
var skinTestExecute = function () {
    var skinTestResult = $("input[name='skinTestResult']:checked").val();
    if (isEmpty(skinTestId)){
        $api.removeCls($api.dom($api.byId('skin-test'), '#skinTest-result'), 'active');
        skinTestId = ''
        api.alert({
            title: '提示',
            msg: '请选择一条皮试记录再操作！',
        });
        return;
    }else{
        if (!skinTestStatus){
            $api.removeCls($api.dom($api.byId('skin-test'), '#skinTest-result'), 'active');
            skinTestId = ''
            api.alert({
                title: '提示',
                msg: '已经录入皮试结果不允许修改！',
            });
            return;
        }
    }
    common.post({
        url: config.updateSkin,
        data:JSON.stringify({
            id:skinTestId,
            skinResult:skinTestResult
        }),
        dataType: "json",
        isLoading: true,
        success: function (ret) {
            if (ret.code==200){
                $api.removeCls($api.dom($api.byId('skin-test'), '#skinTest-selector'), 'active');
                skinTestId = ''
                api.alert({
                    title: '提示',
                    msg: ret.msg,
                });
                skinTestRecord()
            } else{
                api.alert({
                    title: '提示',
                    msg: ret.content,
                });
            }

        }
    });
};

var currentTime = function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" +second;
}

function picker(obj) {
    api.openPicker({
        type: 'date',
        title: '选择时间'
    }, function (ret, err) {
        var startYear = ret.year;
        var startMonth = ret.month;
        var startDay = ret.day;
        var startDate = startYear + "-" + (startMonth < 10 ? "0" + startMonth : startMonth) + "-" + (startDay < 10 ? "0" + startDay : startDay);
        obj.value = startDate;
    });
}
function pickerWithTime(el){
    api.openPicker({
        type: 'date',
        title: '日期'
    }, function(ret, err){
        var startYear = ret.year;
        var startMonth = ret.month;
        var startDay = ret.day;
        var date = startYear + "-" + (startMonth<10? "0"+startMonth:startMonth) + "-" + (startDay<10?"0"+startDay:startDay);
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
            $api.val(el,date+" "+time);
        });
    });
}


Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

function ifNotNull(timeStr){
    var timeTip ;
    if(timeStr!=""){
        timeTip = timeStr+" 00:00:00";
        return timeStr = timeTip;
    }
    return timeStr;
}
function ifNotNullEnd(timeStr){
    var timeTip ;
    if(timeStr!=""){
        timeTip = timeStr+" 23:59:59";
        return timeStr = timeTip;
    }
    return timeStr;
}

function isEmpty(str){
    if (str == null || str =='' || str == undefined){
        return true
    }
}