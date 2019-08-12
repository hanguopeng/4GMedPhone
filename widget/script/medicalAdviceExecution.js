var person = $api.getStorage(storageKey.currentPerson);
var userId = $api.getStorage(storageKey.userId);
var tourRecordsPerson = person   // 巡视扫码得到的病人
var patientId = person.id;

var skinTestId = ''   //最后一次选中的皮试id
var skinTestAdviceId = ''  //最后一次选中的皮试的医嘱id
var skinTestStatus = true

var priorityCode = ''   // 存放医嘱记录选中的医嘱期效
var tabList = ['tab-advice-records','tab-advice-sends','tab-tour-records','tab-skin-test']
var currentTab = 0
apiready = function () {
    api.parseTapmode();
    adviceRecords();
    paddingSelectAdviceRecords();
    // 监控左划事件
    api.addEventListener({
        name:'swipeleft'
    }, function(ret, err){
        if (currentTab === 3){
            currentTab = 0
        } else {
            currentTab = currentTab + 1
        }
        var id = tabList[currentTab]
        changeTab($api.dom('#'+id))
        if (currentTab === 0){
            $api.removeCls($api.byId("adviceRecordsDropdown"), 'show');
        }
    });
    // 监控右划事件
    api.addEventListener({
        name:'swiperight'
    }, function(ret, err){
        if (currentTab === 0){
            currentTab = 3
        } else {
            currentTab = currentTab - 1
        }
        var id = tabList[currentTab]
        changeTab($api.dom('#'+id))
        if (currentTab === 0 ){
            $api.removeCls($api.byId("adviceRecordsDropdown"), 'show');
        }
    });
    // 监控巡视扫码事件
    api.addEventListener({
        name: 'tourRecordsResultShow'
    }, function(ret,err){
        var tourRecordsPersonId = $api.getStorage(storageKey.tourRecordsPersonId);
        var persons = $api.getStorage(storageKey.persons);
        var status = true
        //遍历查询
        for (var i = 0; i < persons.length; i++) {
            if(persons[i].id == tourRecordsPersonId){
                status = false
                tourRecordsPerson = persons[i]
                clickBottomTab('tour-records','tourRecords-result',persons[i].name, persons[i].medBedName);
            }
        }
        if (status){
            api.alert({
                title: '提示',
                msg: '系统未管理此病人，请刷新后重试',
            });
        }
    });
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

        $api.removeCls($api.dom($api.byId('advice-records'), '#adviceRecords-selector'), 'active');

        // 移除医嘱执行、医嘱发送、巡视记录、皮试结果的筛选等操作
        // $api.removeCls($api.dom($api.byId('advice-execute'), '#adviceExecute-selector'), 'active');
        // $api.removeCls($api.dom($api.byId('advice-execute'), '#adviceExecute-execute'), 'active');

        $api.removeCls($api.dom($api.byId('advice-sends'), '#adviceSends-selector'), 'active');

        $api.removeCls($api.dom($api.byId('tour-records'), '#tourRecords-result'), 'active');

        $api.removeCls($api.dom($api.byId('skin-test'), '#skinTest-selector'), 'active');
        $api.removeCls($api.dom($api.byId('skin-test'), '#skinTest-result'), 'active');

    }

    if (dataTo == "advice-records") {// 医嘱记录
        $api.setStorage(storageKey.scannerStatus, '');
        if (currentTab === 0 ){
            $api.removeCls($api.dom($api.byId('advice-records'), '#adviceRecords-selector'), 'active');
            $api.addCls($api.byId("adviceRecordsDropdown"), 'show');
        } else{
            currentTab = 0
            // 切换tab时将所有选中条件都清空
            priorityCode = ''
            adviceRecordsReset()
            $api.addCls($api.byId('allTold'), 'changeBlue');
            $api.removeCls($api.byId('longTold'), 'changeBlue');
            $api.removeCls($api.byId('temporaryTold'), 'changeBlue');
            var el =" <label><input class=\"aui-margin-t-5 \" name=\"inUse\" id=\"inUse\" type=\"checkbox\" tapmode  onchange=\"adviceRecords()\"> 在用医嘱</label>\n" +
                "                &nbsp;&nbsp;&nbsp;&nbsp;\n" +
                "                <label><input class=\"aui-margin-t-5 \" name=\"reportFlag\" id=\"reportFlag\" type=\"checkbox\" tapmode   onchange=\"adviceRecords()\"> 需要报告</label>\n" +
                "                &nbsp;&nbsp;&nbsp;&nbsp;\n" +
                "                <div class=\"aui-btn\" style=\"background: #38afe6;float: right;margin-right: 1rem;margin-top: -5px\" onclick=\"clickBottomTab('advice-records','adviceRecords-selector');\">筛选</div>"
            $api.html($api.byId('advice-records-header'), "");
            $api.html($api.byId('advice-records-header'), el);

            adviceRecords();
        }
    } else if (dataTo == "advice-execute") {//医嘱执行
        // $api.removeCls($api.byId("adviceRecordsDropdown"), 'show');
        // currentTab = 'advice-execute'
        // adviceExecute();
    } else if (dataTo == "advice-sends") {//医嘱发送
        $api.setStorage(storageKey.scannerStatus, '');
        $api.removeCls($api.byId("adviceRecordsDropdown"), 'show');
        currentTab = 1
        // 切换tab时将所有选中条件都清空
        adviceSendsReset()
        var el =" <label><input class=\"aui-margin-t-5 \" name=\"inUse1\" id=\"inUse1\" type=\"checkbox\" tapmode  onchange=\"adviceRecordsForAdviceSends()\"> 在用医嘱</label>\n" +
            "                &nbsp;&nbsp;&nbsp;&nbsp;\n" +
            "                <label><input class=\"aui-margin-t-5 \" name=\"reportFlag1\" id=\"reportFlag1\" type=\"checkbox\" tapmode   onchange=\"adviceRecordsForAdviceSends()\"> 需要报告</label>\n" +
            "                &nbsp;&nbsp;&nbsp;&nbsp;\n" +
            "                <div class=\"aui-btn\" style=\"background: #38afe6;float: right;margin-right: 1rem;margin-top: -5px\" onclick=\"clickBottomTab('advice-sends','adviceSends-selector');\">筛选</div>"
        $api.html($api.byId('advice-sends-header'), "");
        $api.html($api.byId('advice-sends-header'), el);

        adviceRecordsForAdviceSends()
        // adviceSends();
    } else if (dataTo == "tour-records") {//巡视记录
        $api.setStorage(storageKey.scannerStatus, 'tour-records');
        $api.removeCls($api.byId("adviceRecordsDropdown"), 'show');
        currentTab = 2
        tourRecords();
    } else if (dataTo == "skin-test") {//皮试结果
        $api.setStorage(storageKey.scannerStatus, '');
        currentTab = 3
        $api.removeCls($api.byId("adviceRecordsDropdown"), 'show');

        // 切换tab时将所有选中条件都清空
        skinTestRecordReset()
        var el = "<label><input class=\"aui-margin-t-5 \" id=\"noInput\" type=\"checkbox\" onclick=\"skinTestRecord()\" checked> 未录入</label>\n" +
            "                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n" +
            "                <label><input class=\"aui-margin-t-5 \" id=\"alreadyInput\" type=\"checkbox\" onclick=\"skinTestRecord()\"> 已录入</label>"
        $api.html($api.byId('skinTest-header'), "");
        $api.html($api.byId('skinTest-header'), el);

        skinTestRecord();
    }
}
/**
 * 切换页面下端功能按钮显示
 * @param parent
 * @param id
 */
var clickBottomTab = function (parent, id, name ,medBedName) {
    var activeTab = $api.dom($api.byId(parent), '#' + id);
    var active = $api.hasCls(activeTab, 'active');
    if (!active) {
        // $api.removeCls($api.dom($api.byId(parent), '#adviceExecute-selector'), 'active');
        // $api.removeCls($api.dom($api.byId(parent), '#adviceExecute-execute'), 'active');

        $api.removeCls($api.dom($api.byId(parent), '#adviceRecords-selector'), 'active');

        $api.removeCls($api.dom($api.byId(parent), '#adviceSends-selector'), 'active');

        $api.removeCls($api.dom($api.byId(parent), '#tourRecords-result'), 'active');

        $api.removeCls($api.dom($api.byId(parent), '#skinTest-selector'), 'active');
        $api.removeCls($api.dom($api.byId(parent), '#skinTest-result'), 'active');

        if (id === 'tourRecords-result'){
            if (!isEmpty(name)){
                paddingInputTourRecords(name, medBedName);
            } else {
                paddingInputTourRecords(person.name, person.medBedName);
            }
        }else if(id === 'adviceRecords-selector'){
            $api.removeCls($api.byId("adviceRecordsDropdown"), 'show');
        }

        $api.addCls(activeTab, 'active');


    }
    if(active){
        $api.removeCls(activeTab,'active');
    }
};

/**
 * 医嘱记录
 */
var adviceRecords = function (type) {
    var inUse
    var reportFlag
    if ($api.byId('inUse').checked){
        inUse = 1
    }
    if ($api.byId('reportFlag').checked){
        reportFlag = 1
    }
    if (!isEmpty(type)){
        priorityCode = $api.val($api.byId('priorityCode'))
        //并将上面的期效下拉选更改为这里选中的条件
        $api.removeCls($api.byId('allTold'), 'changeBlue');
        $api.removeCls($api.byId('longTold'), 'changeBlue');
        $api.removeCls($api.byId('temporaryTold'), 'changeBlue');
        if (priorityCode === ''){
            $api.addCls($api.byId('allTold'), 'changeBlue');
        } else if(priorityCode === '0'){
            $api.addCls($api.byId('longTold'), 'changeBlue');
        } else if(priorityCode === '1'){
            $api.addCls($api.byId('temporaryTold'), 'changeBlue');
        }
    }
    var lastExcecutiveTimeBegin = $api.val($api.byId('lastExcecutiveTimeBegin')) //上次执行时间开始
    var lastExcecutiveTimeEnd =   $api.val($api.byId('lastExcecutiveTimeEnd'))  //上次执行时间结束
    var foundTimeBegin = $api.val($api.byId('foundTimeBegin'))  //开嘱时间开始
    var foundTimeEnd = $api.val($api.byId('foundTimeEnd'))
    if (!isEmpty(lastExcecutiveTimeBegin)){
        lastExcecutiveTimeBegin = lastExcecutiveTimeBegin + ":00"
    }
    if (!isEmpty(lastExcecutiveTimeEnd)){
        lastExcecutiveTimeEnd = lastExcecutiveTimeEnd + ":00"
    }
    if (!isEmpty(foundTimeBegin)){
        foundTimeBegin = foundTimeBegin + ":00"
    }if (!isEmpty(foundTimeEnd)){
        foundTimeEnd = foundTimeEnd + ":00"
    }

    common.post({
        url: config.queryAdviceList,
        isLoading: true,
        data: JSON.stringify({
            nurseId:  userId,   //护士ID
            patientId:  patientId,   //病人ID
            inUse: inUse,   //在用医嘱，选中是1
            reportFlag: reportFlag,   //需要报告,  选中是1
            priorityCode:  priorityCode,    //医嘱优先级（期效）
            typeCode:  $api.val($api.byId('typeCode')),    //病案费目
            status:  $api.val($api.byId('status')),   //医嘱状态
            lastExcecutiveTimeBegin:  lastExcecutiveTimeBegin,   //上次执行时间开始
            lastExcecutiveTimeEnd:  lastExcecutiveTimeEnd,   //上次执行时间结束
            foundTimeBegin:  foundTimeBegin,   //开嘱时间开始
            foundTimeEnd: foundTimeEnd,   //开嘱时间结束
            homepageId: person.homepageId,
            limit: -1
        }),
        dataType: "json",
        success: function (ret) {
            // 刷新数据之前将所有筛选的弹框和医嘱记录的弹框收回
            $api.removeCls( $api.dom($api.byId('tab'), '#adviceRecordsDropdown'), 'show');
            $api.removeCls( $api.dom($api.byId('advice-records'), '#adviceRecords-selector'), 'active');
            $api.html($api.byId('adviceRecordsContentContainer'), "");
            var contentTmpl = doT.template($api.text($api.byId('adviceRecordsTmplList')));
            $api.html($api.byId('adviceRecordsContentContainer'), contentTmpl(ret.content.list));
        }
    });
};

/**
 * 医嘱记录筛选
 */
var paddingSelectAdviceRecords = function () {
    var params = {};
    params.queryCode = "advice_status";
    params.addAllFlag = false;
    params.loadSonFlag = false;
    params.nullFlag = false;
    common.post({
        url:config.dictUrl,
        isLoading: false,
        data:JSON.stringify(params),
        dataType:JSON,
        success:function(ret){
            var data = {}
            data.adviceStatus = ret.content
            data.priorityCode = priorityCode
            params.queryCode = "advice_type"
            common.post({
                url:config.dictUrl,
                isLoading: false,
                data:JSON.stringify(params),
                dataType:JSON,
                success:function(ret){
                    data.adviceType = ret.content
                    var contentTmpl = doT.template($api.text($api.byId('selectAdviceRecords')));
                    $api.html($api.byId('adviceRecords-selector'), "");
                    $api.html($api.byId('adviceRecords-selector'), contentTmpl(data));
                    var contentTmpl1 = doT.template($api.text($api.byId('selectAdviceSends')));
                    $api.html($api.byId('adviceSends-selector'), "");
                    $api.html($api.byId('adviceSends-selector'), contentTmpl1(data));
                }
            });
        }
    });
}

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
var changeBlue = function (obj,id) {
    if ('allTold' === id){
        priorityCode = ''
    } else if ('longTold' === id){
        priorityCode = 0
    } else if ('temporaryTold' === id){
        priorityCode = 1
    }

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
    common.post({
        url: config.adviceDetail + patientId,
        isLoading: true,
        success: function (ret) {
            // $api.removeCls($api.dom($api.byId('advice-execute'), '#adviceExecute-selector'), 'active');
            // $api.removeCls($api.dom($api.byId('advice-execute'), '#adviceExecute-execute'), 'active');
            //
            // $api.html($api.byId('adviceExecuteContentContainer'), "");
            // var contentTmpl = doT.template($api.text($api.byId('adviceExecuteTmplList')));
            // $api.html($api.byId('adviceExecuteContentContainer'), contentTmpl(ret.context));
        }
    });
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
 * 医嘱记录
 */
var adviceRecordsForAdviceSends = function () {
    var inUse
    var reportFlag
    if ($api.byId('inUse1').checked){
        inUse = 1
    }
    if ($api.byId('reportFlag1').checked){
        reportFlag = 1
    }
    var priorityCode1 = $api.val($api.byId('priorityCode1'))
    var lastExcecutiveTimeBegin = $api.val($api.byId('lastExcecutiveTimeBegin1')) //上次执行时间开始
    var lastExcecutiveTimeEnd =   $api.val($api.byId('lastExcecutiveTimeEnd1'))  //上次执行时间结束
    var foundTimeBegin = $api.val($api.byId('foundTimeBegin1'))  //开嘱时间开始
    var foundTimeEnd = $api.val($api.byId('foundTimeEnd1'))
    if (!isEmpty(lastExcecutiveTimeBegin)){
        lastExcecutiveTimeBegin = lastExcecutiveTimeBegin + ":00"
    }
    if (!isEmpty(lastExcecutiveTimeEnd)){
        lastExcecutiveTimeEnd = lastExcecutiveTimeEnd + ":00"
    }
    if (!isEmpty(foundTimeBegin)){
        foundTimeBegin = foundTimeBegin + ":00"
    }if (!isEmpty(foundTimeEnd)){
        foundTimeEnd = foundTimeEnd + ":00"
    }

    common.post({
        url: config.queryAdviceList,
        isLoading: true,
        data: JSON.stringify({
            nurseId:  userId,   //护士ID
            patientId:  patientId,   //病人ID
            inUse: inUse,   //在用医嘱，选中是1
            reportFlag: reportFlag,   //需要报告,  选中是1
            priorityCode:  priorityCode1,    //医嘱优先级（期效）
            typeCode:  $api.val($api.byId('typeCode1')),    //病案费目
            status:  $api.val($api.byId('status1')),   //医嘱状态
            lastExcecutiveTimeBegin:  lastExcecutiveTimeBegin,   //上次执行时间开始
            lastExcecutiveTimeEnd:  lastExcecutiveTimeEnd,   //上次执行时间结束
            foundTimeBegin:  foundTimeBegin,   //开嘱时间开始
            foundTimeEnd: foundTimeEnd,   //开嘱时间结束
            homepageId: person.homepageId,
            limit: -1
        }),
        dataType: "json",
        success: function (ret) {
            $api.removeCls( $api.dom($api.byId('advice-sends'), '#adviceRecords-selector'), 'active');
            $api.html($api.byId('adviceSendsContentContainer'), "");
            var contentTmpl = doT.template($api.text($api.byId('adviceSendsTmplList')));
            $api.html($api.byId('adviceSendsContentContainer'), contentTmpl(ret.content.list));
        }
    });
};



/**
 * 医嘱发送记录
 */
var adviceSendsDetail = function (obj,adviceId) {
    var noDetail = $api.hasCls(obj, 'noDetail');
    if (noDetail){
        common.post({
            url: config.querySendList,
            isLoading: true,
            data: JSON.stringify({
                patientId:  patientId,   //病人ID
                homepageId:  person.homepageId,
                adviceId: adviceId
            }),
            dataType: "json",
            success: function (ret) {
                $api.removeCls( $api.dom($api.byId('advice-sends'), '#adviceSends-selector'), 'active');
                $api.removeCls(obj, 'noDetail');
                $api.html($api.dom("#adviceSendsDetail" + adviceId), "");
                var contentTmpl = doT.template($api.text($api.byId('adviceSendsDetail')));
                $api.html($api.dom("#adviceSendsDetail" + adviceId), contentTmpl(ret.content.list));

            }
        });
    } else{
        $api.addCls(obj, 'noDetail');
        $api.html($api.dom("#adviceSendsDetail" + adviceId), "");
    }

};

/**
 * 医嘱发送记录详情收回
 */
var closeDetail = function (obj) {
    $api.html(obj, "");
}
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

var paddingInputTourRecords = function (name,medBedName) {

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
            data.patientName = name;
            data.medBedName = medBedName;
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
            patientId:  tourRecordsPerson.id,
            patientName:  tourRecordsPerson.name,
            medBedId: tourRecordsPerson.medBedId,
            medBedName: tourRecordsPerson.medBedName,
            nurseId: $api.getStorage(storageKey.userId),
            nurseName: $api.getStorage(storageKey.userName),
            inspectionTime: inspectionTime,
            inspectionTypeId: inspectionTypeId,
            inspectionMemo: inspectionMemo
        },
        isLoading: true,
        success: function (ret) {
            $api.removeCls($api.dom($api.byId('tour-records'), '#tourRecords-result'), 'active');
            tourRecords();
            api.alert({
                title: '提示',
                msg: '操作成功',
            });
        },
    });
};

/**
 * 皮试结果记录列表查询
 */
var skinTestRecord = function () {
    var beginTime  = $api.val($api.byId('skin-test-begin-time'));
    var endTime   = $api.val($api.byId('skin-test-end-time'));
    var noInput   = $api.byId('noInput').checked;
    var alreadyInput   = $api.byId('alreadyInput').checked;
    var inputStatus = 3;
    if (noInput && !alreadyInput){
        inputStatus = 1
    } else if (!noInput && alreadyInput){
        inputStatus = 2
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
                $api.removeCls($api.dom($api.byId('skin-test'), '#skinTest-selector'), 'active');
                $api.removeCls($api.dom($api.byId('skin-test'), '#skinTest-result'), 'active');
                $api.html($api.byId('skinTestContentContainer'), "");
            }
        }
    });
};
/**
 * 选中某条皮试记录，边框变成红色，代表已选中，再次点击去掉红色
 */
var SkinTestSelect = function (medAdviceId,status) {
    var obj = $api.dom('#skinTest'+medAdviceId)
    if (!obj){
        return
    }
    var id = $(obj).attr('name');
    if (isEmpty(skinTestAdviceId)){
        $api.removeCls(obj, 'border-green');
        $api.addCls(obj, 'border-red');
        skinTestId = id;
        skinTestAdviceId = medAdviceId
        skinTestStatus = status;
    } else{
        if (medAdviceId!==skinTestAdviceId){
            var oldObj = $api.dom('#skinTest'+skinTestAdviceId)
            if (!oldObj){
                return
            }
            $api.removeCls($api.dom('#skinTest'+skinTestAdviceId), 'border-red');
            $api.addCls($api.dom('#skinTest'+skinTestAdviceId), 'border-green');
            $api.removeCls(obj, 'border-green');
            $api.addCls(obj, 'border-red');
            skinTestId = id
            skinTestAdviceId = medAdviceId
            skinTestStatus = status
        }else{
            $api.removeCls(obj, 'border-red');
            $api.addCls(obj, 'border-green');
            skinTestId = ''
            skinTestAdviceId = ''
            skinTestStatus = true
        }

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
        $api.removeCls($api.dom('#skinTest'+skinTestAdviceId), 'border-red');
        $api.addCls($api.dom('#skinTest'+skinTestAdviceId), 'border-green');
        api.alert({
            title: '提示',
            msg: '请选择一条皮试记录再操作！',
        });
        return;
    }else{
        if (!skinTestStatus){
            $api.removeCls($api.dom($api.byId('skin-test'), '#skinTest-result'), 'active');
            skinTestId = ''
            $api.removeCls($api.dom('#skinTest'+skinTestAdviceId), 'border-red');
            $api.addCls($api.dom('#skinTest'+skinTestAdviceId), 'border-green');
            api.alert({
                title: '提示',
                msg: '已经录入皮试结果不允许修改！'
            });
            return;
        }
    }
    common.post({
        url: config.updateSkin,
        data:JSON.stringify({
            id:skinTestId,
            implementNurseId: userId,
            implementNurseName: $api.getStorage(storageKey.userName),
            medAdviceId: skinTestAdviceId,
            skinResult:skinTestResult
        }),
        dataType: "json",
        isLoading: true,
        success: function (ret) {
            if (ret.code==200){
                $api.removeCls($api.dom($api.byId('skin-test'), '#skinTest-selector'), 'active');
                skinTestId = ''
                skinTestRecord()
                api.alert({
                    title: '提示',
                    msg: ret.msg,
                });
            } else{
                skinTestRecord()
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

function pickerWithSecond(el){
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
            $api.val(el,date+" "+time+":00");
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
    if (str === null || str ==='' || str === undefined){
        return true
    }
}

// 医嘱记录筛选重置
function adviceRecordsReset(){
    $api.val($api.byId('lastExcecutiveTimeBegin'),'')
    $api.val($api.byId('lastExcecutiveTimeEnd'),'')
    $api.val($api.byId('foundTimeBegin'),'')
    $api.val($api.byId('foundTimeEnd'),'')
    $api.attr($api.byId('typeCodeOne'), 'selected','true');
    $api.attr($api.byId('statusOne'), 'selected','true');

}

// 医嘱发送筛选重置
function adviceSendsReset(){
    $api.val($api.byId('lastExcecutiveTimeBegin1'),'')
    $api.val($api.byId('lastExcecutiveTimeEnd1'),'')
    $api.val($api.byId('foundTimeBegin1'),'')
    $api.val($api.byId('foundTimeEnd1'),'')
    $api.attr($api.byId('priorityCodeOne1'), 'selected','true');
    $api.attr($api.byId('typeCodeOne1'), 'selected','true');
    $api.attr($api.byId('statusOne1'), 'selected','true');

}
//
//
// function adviceSendsReset(){
//     $api.val($api.byId('sendTimeStart'),'')
//     $api.val($api.byId('sendTimeEnd'),'')
//     $api.val($api.byId('firstTimeStart'),'')
//     $api.val($api.byId('firstTimeEnd'),'')
//     $api.val($api.byId('lastTimeStart'),'')
//     $api.val($api.byId('lastTimeEnd'),'')
//     var el ="<label style=\"margin-left: 3rem\"><input class=\"aui-margin-t-5\"  id=\"changzhu\" type=\"checkbox\"> 长嘱</label>\n" +
//         "                        &nbsp;&nbsp;&nbsp;&nbsp;\n" +
//         "                        <label style=\"margin-right: 4rem\"><input class=\"aui-margin-t-5\"  id=\"linzhu\" type=\"checkbox\"> 临嘱</label>"
//     $api.html($api.byId('advice-header'), "");
//     $api.html($api.byId('advice-header'), el);
//
// }

// 皮试筛选重置
function skinTestRecordReset() {
    $api.val($api.byId('skin-test-begin-time'),'')
    $api.val($api.byId('skin-test-end-time'),'')
}

var changeThisShow = function(obj){
    var isHide = $api.hasCls(obj, 'hide');
    if (isHide){
        $api.removeCls(obj, 'hide');
        $api.addCls(obj, 'show');
    } else{
        $api.removeCls(obj, 'show');
        $api.addCls(obj, 'hide');
    }
}

var changeNextShow = function(obj){
    var isHide = $api.hasCls($api.next(obj), 'hide');
    if (isHide){
        $api.removeCls($api.next(obj), 'hide');
    } else{
        $api.addCls($api.next(obj), 'hide');
    }
}
