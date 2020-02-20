var person = $api.getStorage(storageKey.currentPerson);
var userId = $api.getStorage(storageKey.userId);
var areaId = $api.getStorage(storageKey.areaId);
var executeStatus = 1
var scanAdviceExecute;   // 医嘱执行得到的记录
var scanAdviceExecutePerson;   // 医嘱执行记录对应的人

var patientId = person.id;

var skinTestId = ''   //最后一次选中的皮试id
var skinTestAdviceId = ''  //最后一次选中的皮试的医嘱id
var skinTestStatus = true
var tabList = ['tab-advice-records','tab-advice-sends','tab-advice-execute','tab-skin-test']
var currentTab = 2
var tabFlag = 'advice-execute';

var adviceStartTime;
var redirectToAdviceList = false
var scanner;
apiready = function () {
    scanner = api.require('cmcScan');
    redirectToAdviceList = api.pageParam.redirectToAdviceList
    api.parseTapmode();
    if (redirectToAdviceList === true) {
        currentTab = 0
        tabFlag = 'advice-records';
        $api.addCls($api.byId('tab-advice-records'), 'aui-active');
        $api.addCls($api.byId('advice-records'), 'active');
        adviceRecords()
    }else{
        // 进入医嘱执行，默认显示医嘱执行页，并添加扫码监听事件
        $api.addCls($api.byId('tab-advice-execute'), 'aui-active');
        $api.addCls($api.byId('advice-execute'), 'active');
        adviceExecute()
    }
    $api.setStorage(storageKey.scannerStatus, 'adviceExecute');
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
    //监控医嘱执行扫码事件
    api.addEventListener({
        name: 'adviceExecuteShow'
    }, function(ret,err){
        var infusionStickValue = $api.getStorage(storageKey.infusionStickValue)
        // 通过这个码获取输液贴信息。
        common.post({
            url: config.getInfusionStickById + infusionStickValue,
            isLoading: true,
            success: function (ret) {
                if (ret && ret.content) {
                    scanAdviceExecute = ret.content
                    // 对比是否是这个科室的病人。
                    var persons = $api.getStorage(storageKey.persons);
                    var status = true
                    //遍历查询
                    for (var i = 0; i < persons.length; i++) {
                        var personInfo = persons[i]
                        var homeId = personInfo.homepageId
                        var medPatientId = personInfo.id
                        if(medPatientId == scanAdviceExecute.medPatientId && homeId == scanAdviceExecute.homepageId){
                            scanAdviceExecutePerson = personInfo
                            common.get({
                                url: config.patientDetailUrl + medPatientId + '/' + homeId,
                                isLoading: true,
                                success: function (ret) {
                                    if (ret && ret.content) {
                                        if (isEmpty(ret.content.inOrganizationTime)) {
                                            scanAdviceExecute = null
                                            api.toast({
                                                title: '提示',
                                                msg: '病人未入科，请入科后尝试'
                                            })
                                            return;
                                        }else{
                                            popupExecuteDiv()
                                        }
                                    }
                                }
                            })
                            status = false
                        }
                    }
                }else{
                    api.toast({
                        msg: '获取输液贴信息失败，请扫描正确的输液贴条码！',
                        duration: 2000,
                        location: 'middle'
                    });
                    return;
                }
            }
        })

        if (status){
            scanAdviceExecute = null
            api.toast({
                msg: '本科室未管理此条码对应的病人，请确认！',
                duration: 2000,
                location: 'middle'
            });
            return;
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
    api.addEventListener({
        name: 'adviceExecuteScanPatientId'
    }, function(ret,err){
        var patientId = $api.getStorage(storageKey.adviceExecuteScanPatientId);
        $api.setStorage(storageKey.scannerStatus, 'adviceExecute');
        if (scanAdviceExecute.medPatientId === patientId){
            api.toast({
                msg: '核对病人信息成功，请核对输液贴信息！',
                duration: 2000,
                location: 'middle'
            });
            scanAdviceExecute.executeStatus = 2
            scanAdviceExecute.message = "核对完成"
            $api.addCls($api.dom($api.byId("advice-execute"), '#adviceExecute-dialog'), 'active');
            var contentTmpl = doT.template($api.text($api.byId('adviceExecuteDialog')));
            $api.html($api.byId('adviceExecute-dialog'), "");
            $api.html($api.byId('adviceExecute-dialog'), contentTmpl(scanAdviceExecute));
        }else{
            $api.removeCls($api.dom($api.byId("advice-execute"), '#adviceExecute-dialog'), 'active');
            api.toast({
                msg: '扫描信息与输液贴病人信息不匹配！',
                duration: 2000,
                location: 'middle'
            });
        }
    })
}
function popupExecuteDiv(){
    var executeStatus = scanAdviceExecute.executeStatus
    scanAdviceExecute.patientName = scanAdviceExecutePerson.name
    scanAdviceExecute.patientAge = scanAdviceExecutePerson.age
    scanAdviceExecute.sexName = scanAdviceExecutePerson.sexName
    scanAdviceExecute.medBedId = scanAdviceExecutePerson.medBedId
    if (executeStatus === 0){
        scanAdviceExecute.message = "接收成功"
    }else if (executeStatus === 1){
        scanAdviceExecute.message = "配液完成"
    }else if (executeStatus === 2){
        scanAdviceExecute.executeStatus = 'no'
        scanAdviceExecute.message = "扫描病人"
    }else if (executeStatus === 3){
        scanAdviceExecute.message = "输液提交"
    }else if (executeStatus === 4){
    }else{
        return
    }
    $api.addCls($api.dom($api.byId("advice-execute"), '#adviceExecute-dialog'), 'active');
    var contentTmpl = doT.template($api.text($api.byId('adviceExecuteDialog')));
    $api.html($api.byId('adviceExecute-dialog'), "");
    $api.html($api.byId('adviceExecute-dialog'), contentTmpl(scanAdviceExecute));
}
function adviceExecuteProcess(executeStatus) {
    if (executeStatus==='3'){
        scanAdviceExecute.drippingSpeed = $api.val($api.byId('drippingSpeed'))
        scanAdviceExecute.transfusionStatus = $("input[name='transfusionStatus']:checked").val();
    }
    scanAdviceExecute.executeStatus = parseInt(executeStatus)+1
    common.post({
        url: config.executeInfusionStick,
        isLoading: true,
        data: JSON.stringify(scanAdviceExecute),
        success: function (ret) {
            if (ret && ret.code==200){
                api.toast({
                    msg: '操作成功！',
                    duration: 2000,
                    location: 'middle'
                });
                adviceExecuteClose('adviceExecute-dialog')
            } else{
                api.toast({
                    msg: '操作失败！',
                    duration: 2000,
                    location: 'middle'
                });
                return;
            }
        }
    })
}
function adviceExecuteClose(adviceExecuteDialog) {
    scanAdviceExecute = null
    scanAdviceExecutePerson = null
    $api.removeCls($api.dom($api.byId("advice-execute"), '#'+adviceExecuteDialog), 'active');
    adviceExecute()
}
function deleteInfusionStick(id) {
    api.confirm({
        title: '提示',
        msg: '确定删除该输液贴记录吗？',
        buttons: ['确定', '取消']
    }, function(ret, err){
        if(ret.buttonIndex==1){
            common.post({
                url: config.deleteInfusionStick + id,
                isLoading: true,
                success: function (ret) {
                    if (ret && ret.code==200){
                        api.toast({
                            msg: '删除成功！',
                            duration: 2000,
                            location: 'middle'
                        });
                        adviceExecuteClose('adviceExecute-dialog')
                    } else{
                        api.toast({
                            msg: '删除失败！',
                            duration: 2000,
                            location: 'middle'
                        });
                        return;
                    }
                }
            })
        }
    });
}
function adviceExecuteScanPatient() {
    $api.setStorage(storageKey.scannerStatus,'adviceExecuteScanPatient');
    scanner.start();
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
    }else if(tabFlag === "advice-sends"){
        $api.setStorage(storageKey.scannerStatus, '');
        // 切换tab时将所有选中条件都清空
        adviceSendsReset()
        var el =
            "<label><input class=\"aui-margin-t-5 \" name=\"inUse1\" id=\"inUse1\" type=\"checkbox\" tapmode  onchange=\"adviceRecordsForAdviceSends()\" checked> 在用医嘱</label>\n" +
            "<label id=\"nonArrivalLabel1\" class=\"hide\"><input class=\"aui-margin-t-5 \" name=\"nonArrival1\" id=\"nonArrival1\" type=\"checkbox\" tapmode  onchange=\"adviceRecordsForAdviceSends()\" checked> 未到终止时间</label>\n" +
            "<label><input class=\"aui-margin-t-5 \" name=\"longTermAdvice1\" id=\"longTermAdvice1\" type=\"checkbox\" tapmode  onchange=\"adviceRecordsForAdviceSends()\"> 长嘱</label>\n" +
            "<label><input class=\"aui-margin-t-5 \" name=\"temporaryAdvice1\" id=\"temporaryAdvice1\" type=\"checkbox\" tapmode  onchange=\"adviceRecordsForAdviceSends()\"> 临嘱</label>\n" +
            "<div class=\"aui-btn\" style=\"background: #38afe6;float: right;margin-right: 0.5rem;margin-top: -5px\" onclick=\"clickBottomTab('advice-sends','adviceSends-selector');\">筛选</div>"
        $api.html($api.byId('advice-sends-header'), "");
        $api.html($api.byId('advice-sends-header'), el);
        adviceRecordsForAdviceSends()
    }else if(tabFlag === "advice-execute") {
        $api.setStorage(storageKey.scannerStatus, 'adviceExecute');
        executeStatus = 1
        var el =
            "<label><input class=\"aui-margin-t-5 \" name=\"longTermAdvice2\" id=\"longTermAdvice2\" type=\"checkbox\" tapmode  onchange=\"adviceExecute()\"> 长嘱</label>\n" +
            "<label><input class=\"aui-margin-t-5 \" name=\"temporaryAdvice2\" id=\"temporaryAdvice2\" type=\"checkbox\" tapmode  onchange=\"adviceExecute()\"> 临嘱</label>\n" +
            "<div id=\"noDo\" class=\"aui-btn show\" style=\"background: #38afe6;float: right;margin-right: 0.5rem;margin-top: -5px\" onclick=\"adviceExecute('change')\">执行列表</div>\n" +
            "<div id=\"done\" class=\"aui-btn hide\" style=\"background: #38afe6;float: right;margin-right: 0.5rem;margin-top: -5px\" onclick=\"adviceExecute('change')\">待执行</div>"
        $api.html($api.byId('advice-execute-header'), "");
        $api.html($api.byId('advice-execute-header'), el);
        adviceExecute()
    }else if(tabFlag === "skin-test") {
        $api.setStorage(storageKey.scannerStatus, '');
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
 * 切换tab
 * @param obj
 */
var changeTab = function (obj) {
    tabFlag = ""
    // 给选中的tab添加aui-active样式
    var auiActive = $api.hasCls(obj, 'aui-active');
    if (!auiActive) {
        $api.removeCls($api.byId('tab-advice-records'), 'aui-active');
        $api.removeCls($api.byId('tab-advice-sends'), 'aui-active');
        $api.removeCls($api.byId('tab-advice-execute'), 'aui-active');
        $api.removeCls($api.byId('tab-skin-test'), 'aui-active');
        $api.addCls(obj, 'aui-active');
    }
    // 获取data-to，显示对应的tab
    var dataTo = $api.attr(obj, 'data-to');
    var activeTab = $api.byId(dataTo);
    var active = $api.hasCls(activeTab, 'active');
    if (!active) {
        $api.removeCls($api.byId('advice-records'), 'active');
        $api.removeCls($api.byId('advice-sends'), 'active');
        $api.removeCls($api.byId('advice-execute'), 'active');
        $api.removeCls($api.byId('skin-test'), 'active');

        $api.addCls(activeTab, 'active');

        $api.removeCls($api.dom($api.byId('advice-records'), '#adviceRecords-selector'), 'active');

        // 移除医嘱执行、医嘱发送、医嘱执行、皮试结果的筛选等操作
        $api.removeCls($api.dom($api.byId('advice-execute'), '#adviceExecute-selector'), 'active');
        $api.removeCls($api.dom($api.byId('advice-execute'), '#adviceExecute-execute'), 'active');

        $api.removeCls($api.dom($api.byId('advice-sends'), '#adviceSends-selector'), 'active');


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
    }else if (dataTo == "advice-sends") {//医嘱发送
        tabFlag = "advice-sends"
        $api.setStorage(storageKey.scannerStatus, '');
        currentTab = 1
        // 切换tab时将所有选中条件都清空
        adviceSendsReset()
        var el =
            "<label><input class=\"aui-margin-t-5 \" name=\"inUse1\" id=\"inUse1\" type=\"checkbox\" tapmode  onchange=\"adviceRecordsForAdviceSends()\" checked> 在用医嘱</label>\n" +
            "<label id=\"nonArrivalLabel1\" class=\"hide\"><input class=\"aui-margin-t-5 \" name=\"nonArrival1\" id=\"nonArrival1\" type=\"checkbox\" tapmode  onchange=\"adviceRecordsForAdviceSends()\" checked> 未到终止时间</label>\n" +
            "<label><input class=\"aui-margin-t-5 \" name=\"longTermAdvice1\" id=\"longTermAdvice1\" type=\"checkbox\" tapmode  onchange=\"adviceRecordsForAdviceSends()\"> 长嘱</label>\n" +
            "<label><input class=\"aui-margin-t-5 \" name=\"temporaryAdvice1\" id=\"temporaryAdvice1\" type=\"checkbox\" tapmode  onchange=\"adviceRecordsForAdviceSends()\"> 临嘱</label>\n" +
            "<div class=\"aui-btn\" style=\"background: #38afe6;float: right;margin-right: 0.5rem;margin-top: -5px\" onclick=\"clickBottomTab('advice-sends','adviceSends-selector');\">筛选</div>"
        $api.html($api.byId('advice-sends-header'), "");
        $api.html($api.byId('advice-sends-header'), el);

        adviceRecordsForAdviceSends()
    } else if (dataTo == "advice-execute") {//医嘱执行
        tabFlag = "advice-execute"
        $api.setStorage(storageKey.scannerStatus, 'adviceExecute');
        currentTab = 2
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

        $api.removeCls($api.dom($api.byId(parent), '#adviceRecords-selector'), 'active');

        $api.removeCls($api.dom($api.byId(parent), '#adviceSends-selector'), 'active');
        $api.removeCls($api.dom($api.byId(parent), '#adviceExecute-dialog'), 'active');

        // $api.removeCls($api.dom($api.byId(parent), '#tourRecords-result'), 'active');

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
var adviceExecute = function (change) {
    $api.removeCls($api.dom($api.byId("advice-execute"), '#adviceExecute-dialog'), 'active');
    if (change){
        if (executeStatus === 1){
            executeStatus = 4
            $api.removeCls($api.byId('noDo'), 'show');
            $api.removeCls($api.byId('done'), 'hide');
            $api.addCls($api.byId('noDo'), 'hide');
            $api.addCls($api.byId('done'), 'show');
        } else{
            executeStatus = 1
            $api.removeCls($api.byId('noDo'), 'hide');
            $api.removeCls($api.byId('done'), 'show');
            $api.addCls($api.byId('noDo'), 'show');
            $api.addCls($api.byId('done'), 'hide');
        }
    }
    var longTermAdviceStatus = $api.byId('longTermAdvice2').checked
    var temporaryAdviceStatus = $api.byId('temporaryAdvice2').checked
    var adviceType = ''
    if (longTermAdviceStatus && !temporaryAdviceStatus){
        adviceType = 0
    } else if (!longTermAdviceStatus && temporaryAdviceStatus){
        adviceType = 1
    }
    common.post({
        url: config.infusionStickList,
        isLoading: true,
        data: JSON.stringify({
            medPatientId:  patientId,   //病人ID
            homepageId: person.homepageId,
            adviceType:  adviceType,    //医嘱期效
            executeStatus:  executeStatus    //执行状态
        }),
        dataType: "json",
        success: function (ret) {
            if (ret.code==200){
                var result = ret.content
                $api.html($api.byId('adviceExecuteContentContainer'), "");
                var contentTmpl = doT.template($api.text($api.byId('adviceExecuteNoDoList')));
                if (executeStatus === 4){
                    for (var i=0;i<result.length;i++){
                        result[i].adviceType = transAdviceType(result[i].adviceType)
                        result[i].transfusionStatus = transTransfusionStatus(result[i].transfusionStatus)
                    }
                    contentTmpl = doT.template($api.text($api.byId('adviceExecuteDoneList')));
                }else{
                    for (var i=0;i<result.length;i++){
                        result[i].executeStatus = transExecuteStatus(result[i].executeStatus)
                        result[i].adviceType = transAdviceType(result[i].adviceType)
                    }
                }
                console.log(JSON.stringify(result))
                $api.html($api.byId('adviceExecuteContentContainer'), contentTmpl(result));
            }else{
                api.toast({
                    msg: '获取执行记录异常！',
                    duration: 2000,
                    location: 'middle'
                });
                return;
            }
        }
    });
};

var transAdviceType = function (adviceType) {
    switch (adviceType) {
        case '0': return '长嘱';
        case '1': return '临嘱';
        default: return '';
    }
}

var transTransfusionStatus = function (transfusionStatus) {
    switch (transfusionStatus) {
        case 0: return '完成';
        case 1: return '拒绝';
        case 2: return '外出';
        default: return '';
    }
}

var transExecuteStatus = function (executeStatus) {
    switch (executeStatus) {
        case 1: return '接收成功';
        case 2: return '配液完成';
        case 3: return '核对完成';
        default: return '';
    }
}
var test = function () {
    alert(3233)
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
    console.log(adviceId);
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
var SkinTestSelect = function (implementTime,medAdviceId,status) {
    adviceStartTime = implementTime;//生效时间

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
    //录入时间处理
    var t = new Date(implementTime).getTime();
    t += 20*60*1000;//一个小时的毫秒数
    d = new Date(t);
    var date = new Date(d);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    $api.val($api.byId('input_time'), y + '-' + m + '-' + d+' '+h+':'+minute+':'+second);
};
/**
 * 皮试结果保存或修改
 */
var skinTestExecute = function () {
    var  inputTime = $api.val($api.byId('input_time'));
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

    if (isEmpty(inputTime)){
        api.toast({
            msg: '请选择录入时间',
            duration: 2000,
            location: 'middle'
        });
        return;

    } else if (new Date(inputTime).getTime() < new Date(adviceStartTime).getTime()) {
        api.toast({
            msg: '录入时间不能小于生效时间',
            duration: 2000,
            location: 'middle'
        });
        return;
    }
    common.post({
        url: config.updateSkin,
        data:JSON.stringify({
            id:skinTestId,
            implementNurseId: userId,
            implementNurseName: $api.getStorage(storageKey.userName),
            medAdviceId: skinTestAdviceId,
            skinResult:skinTestResult,
            inputTime:inputTime,
            skinMemo:''
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
    if (str === null || str ==='' || str === undefined || str === 'undefined'){
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
function choose(el){
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
