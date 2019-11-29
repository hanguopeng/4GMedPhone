var person = $api.getStorage(storageKey.currentPerson);
var userId = $api.getStorage(storageKey.userId);
var areaId = $api.getStorage(storageKey.areaId);
var tourRecordsPerson = person   // 巡视扫码得到的病人
var patientId = person.id;

var skinTestId = ''   //最后一次选中的皮试id
var skinTestAdviceId = ''  //最后一次选中的皮试的医嘱id
var skinTestStatus = true
var tabList = ['tab-advice-records','tab-advice-sends','tab-tour-records','tab-skin-test']
var currentTab = 0
var tabFlag;
apiready = function () {
    api.parseTapmode();
    currentTab = 2
    tabFlag = "tour-records"
    // 进入医嘱执行，默认显示巡视记录页，并添加扫码监听事件
    tourRecords();
    $api.setStorage(storageKey.scannerStatus, 'tour-records');
    paddingSelectAdviceRecords();
    // 监控左划事件
    api.addEventListener({
        name:'swipeleft'
    }, function(ret, err){
        if (currentTab === 3){
            currentTab = 3
        } else {
            currentTab = currentTab + 1
        }
        var id = tabList[currentTab]
        changeTab($api.dom('#'+id))
    });
    // 监控右划事件
    api.addEventListener({
        name:'swiperight'
    }, function(ret, err){
        if (currentTab === 0){
            currentTab = 0
        } else {
            currentTab = currentTab - 1
        }
        var id = tabList[currentTab]
        changeTab($api.dom('#'+id))
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
                // 如果病人对上了，直接触发保存动作
                tourRecordsExecute('scan');
                // clickBottomTab('tour-records','tourRecords-result');
                // paddingInputTourRecords()
            }
        }
        if (status){
            api.alert({
                title: '提示',
                msg: '系统未管理此病人，请刷新后重试',
            });
        }
    });

    api.setRefreshHeaderInfo({
        visible: true,
        bgColor: 'rgba(0,0,0,0)',
        textColor: '#666',
        textDown: '下拉刷新',
        textUp: '释放刷新',
        showTime: false
    }, function (ret, err) {
        downPullRefresh();
    });
}

function downPullRefresh(){
    api.refreshHeaderLoadDone(); //复位下拉刷新
    if(tabFlag === "advice-records"){
        $api.setStorage(storageKey.scannerStatus, '');
        currentTab = 0
        // 切换tab时将所有选中条件都清空
        adviceRecordsReset()
        var el =" <label>" +
            "<label><input class=\"aui-margin-t-5 \" name=\"inUse\" id=\"inUse\" type=\"checkbox\" tapmode  onchange=\"adviceRecords()\" checked> 在用医嘱</label>\n" +
            "<label id=\"nonArrivalLabel\" class=\"hide\"><input class=\"aui-margin-t-5 \" name=\"nonArrival\" id=\"nonArrival\" type=\"checkbox\" tapmode  onchange=\"adviceRecords()\" checked> 未到终止时间</label>\n" +
            "<label><input class=\"aui-margin-t-5 \" name=\"longTermAdvice\" id=\"longTermAdvice\" type=\"checkbox\" tapmode  onchange=\"adviceRecords()\"> 长嘱</label>\n" +
            "<label><input class=\"aui-margin-t-5 \" name=\"temporaryAdvice\" id=\"temporaryAdvice\" type=\"checkbox\" tapmode  onchange=\"adviceRecords()\"> 临嘱</label>\n" +
            "<div class=\"aui-btn\" style=\"background: #38afe6;float: right;margin-right: 0.5rem;margin-top: -5px\" onclick=\"clickBottomTab('advice-records','adviceRecords-selector');\">筛选</div>"
        $api.html($api.byId('advice-records-header'), "");
        $api.html($api.byId('advice-records-header'), el);
        adviceRecords()
    }/*else if(tabFlag === "advice-execute") {

    }*/else if(tabFlag === "skin-test") {
        $api.setStorage(storageKey.scannerStatus, '');
        // 切换tab时将所有选中条件都清空
        skinTestRecordReset()
        var el = "<label><input class=\"aui-margin-t-5 \" id=\"noInput\" type=\"checkbox\" onclick=\"skinTestRecord()\" checked> 未录入</label>\n" +
            "                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n" +
            "                <label><input class=\"aui-margin-t-5 \" id=\"alreadyInput\" type=\"checkbox\" onclick=\"skinTestRecord()\"> 已录入</label>"
        $api.html($api.byId('skinTest-header'), "");
        $api.html($api.byId('skinTest-header'), el);

        skinTestRecord();
    }else if(tabFlag === "tour-records") {
        var tourEle = "<label><input class=\"aui-margin-t-5 \" name=\"allPatient\" id=\"allPatient\" type=\"checkbox\" tapmode  onchange=\"tourRecords()\"> 全部患者</label>\n" +
            "                &nbsp;&nbsp;&nbsp;&nbsp;\n" +
            "                <label><input class=\"aui-margin-t-5 \" name=\"allNurse\" id=\"allNurse\" type=\"checkbox\" tapmode   onchange=\"tourRecords()\"> 全部护士</label>"
        $api.html($api.byId('tour-records-header'), "");
        $api.html($api.byId('tour-records-header'),tourEle);
        tourRecords();
    }else if(tabFlag === "advice-sends"){
        $api.setStorage(storageKey.scannerStatus, '');
        // 切换tab时将所有选中条件都清空
        adviceSendsReset()
        var el =" <label>" +
            "<label><input class=\"aui-margin-t-5 \" name=\"inUse1\" id=\"inUse1\" type=\"checkbox\" tapmode  onchange=\"adviceRecordsForAdviceSends()\" checked> 在用医嘱</label>\n" +
            "<label id=\"nonArrivalLabel1\" class=\"hide\"><input class=\"aui-margin-t-5 \" name=\"nonArrival1\" id=\"nonArrival11\" type=\"checkbox\" tapmode  onchange=\"adviceRecordsForAdviceSends()\" checked> 未到终止时间</label>\n" +
            "<label><input class=\"aui-margin-t-5 \" name=\"longTermAdvice1\" id=\"longTermAdvice1\" type=\"checkbox\" tapmode  onchange=\"adviceRecordsForAdviceSends()\"> 长嘱</label>\n" +
            "<label><input class=\"aui-margin-t-5 \" name=\"temporaryAdvice1\" id=\"temporaryAdvice1\" type=\"checkbox\" tapmode  onchange=\"adviceRecordsForAdviceSends()\"> 临嘱</label>\n" +
            "<div class=\"aui-btn\" style=\"background: #38afe6;float: right;margin-right: 0.5rem;margin-top: -5px\" onclick=\"clickBottomTab('advice-sends','adviceSends-selector');\">筛选</div>"
        $api.html($api.byId('advice-sends-header'), "");
        $api.html($api.byId('advice-sends-header'), el);

        adviceRecordsForAdviceSends()
    }
}
/**
 * 切换tab
 * @param obj
 */
var changeTab = function (obj) {
    tabFlag = ""
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
        tabFlag = "advice-records"
        $api.setStorage(storageKey.scannerStatus, '');
        currentTab = 0
        // 切换tab时将所有选中条件都清空
        adviceRecordsReset()
        var el =
            "<label><input class=\"aui-margin-t-5 \" name=\"inUse\" id=\"inUse\" type=\"checkbox\" tapmode  onchange=\"adviceRecords()\" checked> 在用医嘱</label>\n" +
            "<label id=\"nonArrivalLabel\" class=\"hide\"><input class=\"aui-margin-t-5 \" name=\"nonArrival\" id=\"nonArrival\" type=\"checkbox\" tapmode  onchange=\"adviceRecords()\" checked> 未到终止时间</label>\n" +
            "<label><input class=\"aui-margin-t-5 \" name=\"longTermAdvice\" id=\"longTermAdvice\" type=\"checkbox\" tapmode  onchange=\"adviceRecords()\"> 长嘱</label>\n" +
            "<label><input class=\"aui-margin-t-5 \" name=\"temporaryAdvice\" id=\"temporaryAdvice\" type=\"checkbox\" tapmode  onchange=\"adviceRecords()\"> 临嘱</label>\n" +
            "<div class=\"aui-btn\" style=\"background: #38afe6;float: right;margin-right: 0.5rem;margin-top: -5px\" onclick=\"clickBottomTab('advice-records','adviceRecords-selector');\">筛选</div>"
        $api.html($api.byId('advice-records-header'), "");
        $api.html($api.byId('advice-records-header'), el);
        adviceRecords()
    } else if (dataTo == "advice-execute") {//医嘱执行
            tabFlag = "advice-execute"
    } else if (dataTo == "advice-sends") {//医嘱发送
        tabFlag = "advice-sends"
        $api.setStorage(storageKey.scannerStatus, '');
        currentTab = 1
        // 切换tab时将所有选中条件都清空
        adviceSendsReset()
        var el =" <label>" +
            "<label><input class=\"aui-margin-t-5 \" name=\"inUse1\" id=\"inUse1\" type=\"checkbox\" tapmode  onchange=\"adviceRecordsForAdviceSends()\" checked> 在用医嘱</label>\n" +
            "<label id=\"nonArrivalLabel1\" class=\"hide\"><input class=\"aui-margin-t-5 \" name=\"nonArrival1\" id=\"nonArrival1\" type=\"checkbox\" tapmode  onchange=\"adviceRecordsForAdviceSends()\" checked> 未到终止时间</label>\n" +
            "<label><input class=\"aui-margin-t-5 \" name=\"longTermAdvice1\" id=\"longTermAdvice1\" type=\"checkbox\" tapmode  onchange=\"adviceRecordsForAdviceSends()\"> 长嘱</label>\n" +
            "<label><input class=\"aui-margin-t-5 \" name=\"temporaryAdvice1\" id=\"temporaryAdvice1\" type=\"checkbox\" tapmode  onchange=\"adviceRecordsForAdviceSends()\"> 临嘱</label>\n" +
            "<div class=\"aui-btn\" style=\"background: #38afe6;float: right;margin-right: 0.5rem;margin-top: -5px\" onclick=\"clickBottomTab('advice-sends','adviceSends-selector');\">筛选</div>"
        $api.html($api.byId('advice-sends-header'), "");
        $api.html($api.byId('advice-sends-header'), el);

        adviceRecordsForAdviceSends()
    } else if (dataTo == "tour-records") {//巡视记录
        tabFlag = "tour-records"
        $api.setStorage(storageKey.scannerStatus, 'tour-records');
        currentTab = 2
        tourRecords();
    } else if (dataTo == "skin-test") {//皮试结果
        tabFlag = "skin-test"
        $api.setStorage(storageKey.scannerStatus, '');
        currentTab = 3

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
var clickBottomTab = function (parent, id) {
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
            paddingInputTourRecords()
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
var adviceRecords = function () {
    var inUse
    if ($api.byId('inUse').checked){
        inUse = 1
    }
    var nonArrival
    if ($api.byId('nonArrival').checked){
        nonArrival = 1
    }
    var longTermAdviceStatus = $api.byId('longTermAdvice').checked
    var temporaryAdviceStatus = $api.byId('temporaryAdvice').checked
    var priorityCode = ''
    if (longTermAdviceStatus && !temporaryAdviceStatus){
        priorityCode = 0
    } else if (!longTermAdviceStatus && temporaryAdviceStatus){
        priorityCode = 1
    }
    // 如果只选中临嘱或者在用没有被勾选，则未到终止时间失效
    if (priorityCode == 1 || isEmpty(inUse)){
        nonArrival = null
        $api.addCls($api.byId('nonArrivalLabel'), 'hide');
    } else{
        $api.removeCls($api.byId('nonArrivalLabel'), 'hide');
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
        timeout: 30,
        isLoading: true,
        data: JSON.stringify({
            nurseId:  userId,   //护士ID
            patientId:  patientId,   //病人ID
            inUse: inUse,   //在用医嘱，选中是1
            nonArrival: nonArrival,   //未到终止时间，选中是1
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
 * 医嘱记录for发送记录
 */
var adviceRecordsForAdviceSends = function () {
    var inUse
    if ($api.byId('inUse1').checked){
        inUse = 1
    }
    var nonArrival
    if ($api.byId('nonArrival1').checked){
        nonArrival = 1
    }
    var longTermAdviceStatus = $api.byId('longTermAdvice1').checked
    var temporaryAdviceStatus = $api.byId('temporaryAdvice1').checked
    var priorityCode = ''
    if (longTermAdviceStatus && !temporaryAdviceStatus){
        priorityCode = 0
    } else if (!longTermAdviceStatus && temporaryAdviceStatus){
        priorityCode = 1
    }
    // 如果只选中临嘱或者在用没有被勾选，则未到终止时间失效
    if (priorityCode == 1 || isEmpty(inUse)){
        nonArrival = null
        $api.addCls($api.byId('nonArrivalLabel1'), 'hide');
    } else{
        $api.removeCls($api.byId('nonArrivalLabel1'), 'hide');
    }
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
        timeout: 30,
        data: JSON.stringify({
            nurseId:  userId,   //护士ID
            patientId:  patientId,   //病人ID
            inUse: inUse,   //在用医嘱，选中是1
            nonArrival: nonArrival,   //未到终止时间，选中是1
            priorityCode:  priorityCode,    //医嘱优先级（期效）
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
            $api.removeCls( $api.dom($api.byId('advice-sends'), '#adviceSends-selector'), 'active');
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
            timeout: 30,
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
    var params = {}
    params.organizationId = areaId;
    if (!$api.byId('allPatient').checked){
        params.patientId = person.id
        params.homepageId = person.homepageId
    }
    if (!$api.byId('allNurse').checked){
        params.nurseId = userId
    }
    common.post({
        url: config.inspectionQuery,
        isLoading: true,
        data:JSON.stringify(params),
        dataType: "json",
        success: function (ret) {
            if(ret&&ret.content&&ret.content.length>0){
                var userId = $api.getStorage(storageKey.userId);
                var params = [];
                params.list = ret.content;
                params.userId  = userId;
                $api.removeCls($api.dom($api.byId('tour-records'), '#tourRecords-result'), 'active');
                $api.html($api.byId('tourRecordsContentContainer'), "");
                var contentTmpl = doT.template($api.text($api.byId('tourRecordsList')));
                $api.html($api.byId('tourRecordsContentContainer'), contentTmpl(params));
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
            data.patientName = tourRecordsPerson.name;
            data.medBedName = tourRecordsPerson.medBedName;
            data.nurseLevelName = tourRecordsPerson.nurseLevelName;
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
 * 20191022 修改，当扫码触发巡视时直接保存
 */
var tourRecordsExecute = function (type) {
    var inspectionTypeId = null;
    var inspectionMemo = null;
    var inspectionTime = currentTime();
    if (isEmpty(type)){
        inspectionTypeId = $api.val($api.byId('inspectionTypeId'));
        inspectionMemo = $api.val($api.byId('inspectionMemo'));
        inspectionTime = $api.val($api.byId('inspectionTime'));
    }
    var nurseLevelCode = tourRecordsPerson.nurseLevelCode;
    var nurseLevel = ''
    switch (nurseLevelCode) {
        case 'A': nurseLevel = '120100002';break;
        case 'B': nurseLevel = '120100003';break;
        case 'C': nurseLevel = '120100004';break;
        case 'D': nurseLevel = '120100005';break;
        case 'E': nurseLevel = '1101005';break;
    }
    common.post({
        url: config.inspectionSave,
        data: {
            patientId:  tourRecordsPerson.id,
            homepageId:  tourRecordsPerson.homepageId,
            registerNumber:  tourRecordsPerson.registerNumber,
            patientName:  tourRecordsPerson.name,
            medBedId: tourRecordsPerson.medBedId,
            medBedName: tourRecordsPerson.medBedName,
            organizationId: areaId,
            nurseLevel: nurseLevel,
            nurseId: userId,
            nurseName: $api.getStorage(storageKey.userName),
            inspectionTime: inspectionTime,
            inspectionTypeId: inspectionTypeId,
            inspectionMemo: inspectionMemo
        },
        isLoading: true,
        success: function (ret) {
            $api.removeCls($api.dom($api.byId('tour-records'), '#tourRecords-result'), 'active');
            tourRecords();
            api.toast({
                msg: '操作成功',
                duration: 2000,
                location: 'middle'
            });
        },
    });
};
var deleteThis = function (id) {
    common.get({
        url: config.inspectionDelete + id + "/" + userId,
        isLoading: true,
        success: function (ret) {
            if(ret.code===200){
                if (ret.content === -1){
                    api.alert({
                        title: '提示',
                        msg: '只能删除自己创建的巡视记录！',
                    });
                } else if (ret.content > 0 ){
                    api.alert({
                        title: '提示',
                        msg: '删除成功',
                    });
                } else{
                    api.alert({
                        title: '提示',
                        msg: '删除失败',
                    });
                }
            }
            tourRecords();
        },
    });

}

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

var changeNextTwoShow = function(obj){
    var isHide = $api.hasCls($api.next(obj), 'hide');
    obj = $api.next(obj)
    if (isHide){
        $api.removeCls(obj, 'hide');
        $api.removeCls($api.next(obj), 'hide');
    } else{
        $api.addCls(obj, 'hide');
        $api.addCls($api.next(obj), 'hide');
    }
}
