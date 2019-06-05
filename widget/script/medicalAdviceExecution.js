var person = $api.getStorage(storageKey.currentPerson);
var patientId = person.id;
var page = 1;
apiready = function () {
    api.parseTapmode();
    doctorAdvice();
}


var changeTab = function (obj) {
    var auiActive = $api.hasCls(obj, 'aui-active');
    if (!auiActive) {
        $api.removeCls($api.byId('tab-yzd'), 'aui-active');
        $api.removeCls($api.byId('tab-dzx'), 'aui-active');
        $api.removeCls($api.byId('tab-yzx'), 'aui-active');
        $api.removeCls($api.byId('tab-psgc'), 'aui-active');

        $api.addCls(obj, 'aui-active');
    }

    var dataTo = $api.attr(obj, 'data-to');//获取化验ID
    var activeTab = $api.byId(dataTo);

    var active = $api.hasCls(activeTab, 'active');
    if (!active) {
        $api.removeCls($api.byId('yzd'), 'active');
        $api.removeCls($api.byId('dzx'), 'active');
        $api.removeCls($api.byId('yzx'), 'active');
        $api.removeCls($api.byId('psgc'), 'active');

        $api.addCls(activeTab, 'active');

        $api.removeCls($api.dom($api.byId('dzx'), '#shaiXuan'), 'active');
        $api.removeCls($api.dom($api.byId('dzx'), '#zhiXing'), 'active');

        $api.removeCls($api.dom($api.byId('yzx'), '#yzx-shaiXuan'), 'active');
        $api.removeCls($api.dom($api.byId('yzx'), '#shuyexunshi'), 'active');

        $api.removeCls($api.dom($api.byId('psgc'), '#psgc-shaiXuan'), 'active');
        $api.removeCls($api.dom($api.byId('psgc'), '#lurujieguo'), 'active');

    }

    if (dataTo == "yzd") {//基础视图
        doctorAdvice();
    } else if (dataTo == "dzx") {//待执行
        waitExecuteDoctorAdvice();
    } else if (dataTo == "yzx") {//已执行
        hadExecuteDoctorAdvice();
    } else if (dataTo == "psgc") {//皮试观察
        psgcRecord();
    }
}

var clickBottomTab = function (parent, id) {
    var activeTab = $api.dom($api.byId(parent), '#' + id);

    var active = $api.hasCls(activeTab, 'active');
    if (!active) {
        $api.removeCls($api.dom($api.byId(parent), '#shaiXuan'), 'active');
        $api.removeCls($api.dom($api.byId(parent), '#zhiXing'), 'active');

        $api.removeCls($api.dom($api.byId(parent), '#yzx-shaiXuan'), 'active');
        $api.removeCls($api.dom($api.byId(parent), '#shuyexunshi'), 'active');

        $api.removeCls($api.dom($api.byId(parent), '#psgc-shaiXuan'), 'active');
        $api.removeCls($api.dom($api.byId(parent), '#lurujieguo'), 'active');
        $api.addCls(activeTab, 'active');


    }
    if(active){
        $api.removeCls(activeTab,'active');
    }
};

/**
 * 医嘱记录
 */
var doctorAdvice = function () {
    common.get({
        url: config.adviceDetail + patientId,
        isLoading: true,
        success: function (ret) {
            //alert(JSON.stringify(ret));
            $api.html($api.byId('yzdContentContainer'), "");
            var contentTmpl = doT.template($api.text($api.byId('yzlTmplList')));
            $api.html($api.byId('yzdContentContainer'), contentTmpl(ret.content));
        }
    });
};

/**
 * 待执行医嘱记录
 */
var notNullFlag = false;
var waitExecuteDoctorAdvice = function () {
    var priorityCode = $api.val($api.byId('dzx-yzyxj'));
    //var usageCode = $api.val($api.byId('dzx-yytj'));
    var bigKindNumCode = $api.val($api.byId('dzx-yzcfdl'));
    var beginFoundTime = $api.val($api.byId('dzx-yzsj-begin'));
    var endFoundTime = $api.val($api.byId('dzx-yzsj-end'));
    var dzjtime = new Date().getTime();
    var curTime = new Date(dzjtime).format("yyyy-MM-dd hh:mm:ss");
    var pretime = dzjtime-24*1000*3600;
    var pttime = new Date(pretime).format("yyyy-MM-dd hh:mm:ss");
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
    var beginRequireExecuteTime = $api.val($api.byId('dzx-yqzxsj-begin'));
    var endRequireExecuteTime = $api.val($api.byId('dzx-yqzxsj-end'));
    var preHour = new Date(dzjtime-1*1000*3600);
    var beHour = new Date(dzjtime+1*1000*3600);
    preHour = new Date(preHour).format("yyyy-MM-dd hh:mm:ss");
    beHour = new Date(beHour).format("yyyy-MM-dd hh:mm:ss");
    //alert("preHour:"+preHour+"beHour:"+beHour);
    var params = {};
    var beginTime = pttime;
    var endTime = curTime;


    beginFoundTime = ifNotNull(beginFoundTime);
    endFoundTime=ifNotNullEnd(endFoundTime);
    beginRequireExecuteTime=ifNotNull(beginRequireExecuteTime);
    endRequireExecuteTime=ifNotNullEnd(endRequireExecuteTime);
    if(beginFoundTime!=""||endFoundTime!=""||beginRequireExecuteTime!=""||endRequireExecuteTime!=""){
        beginTime="";
        endTime="";
    }
    params.beginTime = beginTime;
    params.endTime = endTime;
    params.patientId = patientId;
    params.executeStatusCode = '0';
    params.priorityCode = priorityCode;
    //params.usage = usageCode;
    params.bigKindNum = bigKindNumCode;
    params.beginFoundTime = beginFoundTime;
    params.endFoundTime = endFoundTime;
    params.beginRequireExecuteTime = beginRequireExecuteTime;
    params.endRequireExecuteTime = endRequireExecuteTime;
    //alert(JSON.stringify(params))
    //alert(JSON.stringify(params));
    common.post({
        url: config.adviceExecute ,
        isLoading: true,
        data:JSON.stringify(params),
        dataType:JSON,
        success: function (ret) {
            //alert(JSON.stringify(ret));
            $api.removeCls($api.dom($api.byId('dzx'), '#shaiXuan'), 'active');

            $api.html($api.byId('dzxContentContainer'), "");
            var contentTmpl = doT.template($api.text($api.byId('dzxTmplList')));
            $api.html($api.byId('dzxContentContainer'), contentTmpl(ret.content.list));
        }
    });
};

/**
 * 打开待执行窗口
 * @param usage
 * @param adviceName
 * @param unit
 * @param dosage
 * @param createTime
 * @param frequency
 * @param beginDoctorName
 * @param requireExecuteTime
 */
var showExecuteDoctorAdviceWindow = function(imstr){
    $api.html($api.byId('zhiXing'), "");
    var item =  JSON.parse(imstr);
    var contentTmpl = doT.template($api.text($api.byId('dzxExecuteTmplList')));
    $api.html($api.byId('zhiXing'), contentTmpl(item));

};
/**
 * 执行待执行医嘱
 */
var executeDoctorAdvice = function(id,relevanceFlag){
    var implementResult = $("input[name='implementResult']:checked").val();
    var implname ;
    var memo = $api.val($api.byId('memo'));
    if('0'==implementResult){
        implname= '未执行';
    }else if('1'==implementResult){
        implname='完全执行';
    }else if('2'==implementResult){
        implname='拒绝执行';
    }else{
        implname='正在执行';
    }
    common.post({
        url: config.adviceExecuteUpdate + id,
        data:{
            relevanceFlag:relevanceFlag,
            executeStatusCode:implementResult,
            executeStatusName:implname,
            remark:memo
        },
        isLoading: true,
        success: function (ret) {
            $api.removeCls($api.dom($api.byId('dzx'), '#zhiXing'), 'active');
            api.alert({
                title: '提示',
                msg: '操作成功',
            }, function(ret, err){
                //common.clearStorage();
                /*api.closeToWin({
                    name: 'root'
                });*/
            });
        }
    });
};

/**
 * 已执行医嘱记录
 */
var hadExecuteDoctorAdvice = function () {
    var sixflag = true;
    var exetime = "";
    var priorityCode = $api.val($api.byId('yzx-yzyxj'));
    var usageCode = $api.val($api.byId('yzx-yytj'));
    var bigKindNumCode = $api.val($api.byId('yzx-yzcfdl'));
    var beginFoundTime = $api.val($api.byId('yzx-yzsj-begin'));
    var endFoundTime = $api.val($api.byId('yzx-yzsj-end'));
    var dzjtime = new Date().getTime();
    var curTime = new Date(dzjtime).format("yyyy-MM-dd hh:mm:ss");
    var pretime = dzjtime - 6 * 1000 * 3600;
    var pttime = new Date(pretime).format("yyyy-MM-dd hh:mm:ss");
    var beginExecuteTime = $api.val($api.byId('yzx-yqzxsj-begin'));
    var endExecuteTime = $api.val($api.byId('yzx-yqzxsj-end'));
    var currentsecond = new Date().getTime();
    var exeTimeSix = new Date(currentsecond - 6 * 1000 * 3600);
    var curTimeSix = new Date(exeTimeSix).format("yyyy-MM-dd hh:mm:ss");
    var begintime = "";
    var endtime = "";


    var params = {};
    begintime = curTimeSix;
    endtime = curTime;
    beginFoundTime = ifNotNull(beginFoundTime);
    endFoundTime = ifNotNullEnd(endFoundTime);
    beginExecuteTime = ifNotNull(beginExecuteTime);
    endExecuteTime = ifNotNullEnd(endExecuteTime);

    if(beginFoundTime!=""||endFoundTime!=""){
        params.beginTime = "";
        params.endTime = "";
    }
    var params = {};
    params.patientId = patientId;
    params.executeStatusCode = '1';
    params.priorityCode = priorityCode;
    params.usage = usageCode;
    params.bigKindNum = bigKindNumCode;
    params.beginFoundTime = beginFoundTime;
    params.endFoundTime = endFoundTime;
    params.beginTime = beginExecuteTime;
    params.endTime = endExecuteTime;
    //alert(JSON.stringify(params));
    common.post({
        url: config.adviceExecute ,
        isLoading: true,
        data:JSON.stringify(params),
        dataType:JSON,
        success: function (ret) {
            //alert(ret.content.list);
            $api.removeCls($api.dom($api.byId('yzx'), '#yzx-shaiXuan'), 'active');
            $api.html($api.byId('yzxContentContainer'), "");
            var contentTmpl = doT.template($api.text($api.byId('yzxTmplList')));
            $api.html($api.byId('yzxContentContainer'), contentTmpl(ret.content.list));

        }
    });
    $api.val($api.byId('yzx-xssj'), currentTime() + "");
    //alert(config.adviceExecute + patientId +"&executeStatusCode=advice_execute_status_1"+queryParam);
};


/**
 * 打开已执行窗口
 * @param usage
 * @param adviceName
 * @param unit
 * @param dosage
 * @param createTime
 * @param frequency
 * @param beginDoctorName
 * @param requireExecuteTime
 */
var showHadExecuteDoctorAdviceWindow = function (imstr) {
    $api.html($api.byId('shuyexunshi'), "");
    var item = JSON.parse(imstr);
    item.currentTime = currentTime();
    item.xsr = $api.getStorage(storageKey.userName);
    var contentTmpl = doT.template($api.text($api.byId('yzxSyxsTmpl')));
    $api.html($api.byId('shuyexunshi'), contentTmpl(item));

};

/**
 * 输液巡视
 */
var executeSyxs = function (id, relevanceFlag) {
    var ds = $api.val($api.byId('yzx-ds'));
    var dz = $api.val($api.byId('yzx-dz'));
    var xssj = $api.val($api.byId('yzx-xssj'));
    var xsr = $api.val($api.byId('yzx-xsr'));
    var memo = $api.val($api.byId('yzx-memo'));

    common.post({
        url: config.transfuseExecute + patientId,
        isLoading: true,
        success: function (ret) {
            $api.removeCls($api.dom($api.byId('yzx'), '#shuyexunshi'), 'active');
            api.alert({
                title: '提示',
                msg: '操作成功',
            }, function (ret, err) {
                common.clearStorage();
                api.closeToWin({
                    name: 'root'
                });
            });
        }
    });
};

/**
 * 皮试观察记录
 */
var psgcRecord = function () {
    var beginTime  = $api.val($api.byId('psgc-yqzxsj-begin'));
    var endTime   = $api.val($api.byId('psgc-yqzxsj-end'));
    if ("" != beginTime) {
        beginTime = beginTime + " 00:00:00";
    }
    if ("" != endTime) {
        endTime = endTime + " 00:00:00";
    }

    var queryParam = "&beginTime =" + beginTime
        + "&endTime=" + endTime;
    common.get({
        url: config.skinTestQuery + patientId ,
        isLoading: true,
        success: function (ret) {

            if(ret&&ret.content&&ret.content.length>0){
                $api.removeCls($api.dom($api.byId('psgc'), '#psgc-shaiXuan'), 'active');
                $api.html($api.byId('psgcContentContainer'), "");
                var contentTmpl = doT.template($api.text($api.byId('psgcTmplList')));
                $api.html($api.byId('psgcContentContainer'), contentTmpl(ret.content));
                alert(JSON.stringify(ret.content))
            }
        }
    });
    //alert(config.adviceExecute + patientId +"&skinTestFlag=true"+queryParam)
};

var showPsgcAdviceWindow = function (id) {
    $api.html($api.byId('lurujieguo'), "");
    var contentTmpl = doT.template($api.text($api.byId('psgcExecuteTmplList')));
    $api.html($api.byId('lurujieguo'), contentTmpl({
        id: id
    }));
    $api.addCls($api.dom($api.byId('psgc'), '#lurujieguo'), 'active');
};
/**
 * 皮试结果
 */
var psgcExecute = function (id) {
    var lurujieguo = $("input[name='lurujieguo']").val();
    var skinTestRemark = $api.val($api.byId("psgc-memo"));

    common.post({
        url: config.skinTestExecute + id,
        data: {
            skinTestResult: lurujieguo,
            skinTestRemark: skinTestRemark
        },
        isLoading: true,
        success: function (ret) {
            $api.removeCls($api.dom($api.byId('psgc'), '#lurujieguo'), 'active');
            api.alert({
                title: '提示',
                msg: '操作成功',
            });
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
    return year + "-" + month + "-" + day + " " + hour + ":" + minute;
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
