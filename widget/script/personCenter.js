var person = $api.getStorage(storageKey.currentPerson);
var patientId = person.id;
var page = 1;
var tabList = ['tab-jcst','tab-jcjg','tab-hyjg','tab-fymx']
var currentTab = 0
var tagFlag;
apiready = function () {
    api.parseTapmode();
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
    loadJCST();
    /**
     *  下拉刷新
     * */
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
};

function downPullRefresh(){
    api.refreshHeaderLoadDone();
    if(tagFlag === "jcst"){
        loadJCST();
    }else if(tagFlag === "jcjg"){
        loadJCJG()
    }else if(tagFlag === "hyjg"){
        loadHYJG()
    }else {
        loadFYMX()
    }


}
/**
 * 基础信息
 */
var loadJCST = function () {
    searchLastExamineInfo(patientId);
    searchPatientDetail(patientId);
    costDetailInfo(patientId);
};
/**
 * 检查结果
 */
var loadJCJG = function () {
    searchMedExamine(patientId);
};
/**
 * 化验结果
 */
var loadHYJG = function () {
    searchMedAssay(patientId);
};
/**
 * 费用明细
 */
var loadFYMX = function (status) {
    fymxList(patientId,status);
};

/**
 * tab切换
 * @param obj
 */
var changeTab = function (obj) {
    var auiActive = $api.hasCls(obj, 'aui-active');
    tagFlag = ""
    if (!auiActive) {
        $api.removeCls($api.byId('tab-jcst'), 'aui-active');
        $api.removeCls($api.byId('tab-jcjg'), 'aui-active');
        $api.removeCls($api.byId('tab-hyjg'), 'aui-active');
        $api.removeCls($api.byId('tab-fymx'), 'aui-active');

        $api.addCls(obj, 'aui-active');
    }

    var dataTo = $api.attr(obj, 'data-to');//获取化验ID
    var activeTab = $api.byId(dataTo);

    var active = $api.hasCls(activeTab, 'active');
    if (!active) {
        $api.removeCls($api.byId('jcst'), 'active');
        $api.removeCls($api.byId('jcjg'), 'active');
        $api.removeCls($api.byId('hyjg'), 'active');
        $api.removeCls($api.byId('fymx'), 'active');

        $api.addCls(activeTab, 'active');
    }
    if (dataTo == "jcst") {//基础视图
        currentTab = 0
        tagFlag = "jcst"
        loadJCST();
    } else if (dataTo == "jcjg") {//检查结果
        tagFlag = "jcjg"
        currentTab = 1
        loadJCJG();
    } else if (dataTo == "hyjg") {//化验结果
        tagFlag = "hyjg"
        currentTab = 2
        loadHYJG();
    } else if (dataTo == "fymx") {//费用明细
        tagFlag = "fymx"
        currentTab = 3
        loadFYMX(false);
    }
}

var changeNextShow = function(obj){
    var isHide = $api.hasCls($api.next(obj), 'hide');
    if (isHide){
        $api.removeCls($api.next(obj), 'hide');
        $api.addCls($api.next(obj), 'show');
    } else{
        $api.removeCls($api.next(obj), 'show');
        $api.addCls($api.next(obj), 'hide');
    }
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
/**
 * 基础信息
 * @param patientId
 */
var searchPatientDetail = function (patientId) {
    common.get({
        url: config.patientDetailUrl + patientId + '/' + person.homepageId,
        isLoading: true,
        success: function (ret) {
            $api.html($api.byId('jcxxContentContainer'), "");
            if(ret && ret.content){
                var contentTmpl = doT.template($api.text($api.byId('jcxxTmpl')));
                $api.html($api.byId('jcxxContentContainer'), contentTmpl(ret.content));
                var inOrganization = $api.getStorage(storageKey.inOrganization);
                if (!isEmpty(inOrganization)){
                    api.toast({
                        msg: '入科成功!',
                        duration: 3000,
                        location: 'middle'
                    });
                    $api.setStorage(storageKey.inOrganization,null);
                }else{
                    $api.setStorage(storageKey.inOrganization,null);
                }
            }
        }
    });
};
//添加联系电话方式
function addTelephone(){
    var telephone = $api.text($api.byId('telephoneInput'));
    api.prompt({
        title:'联系电话添加',
        text:telephone,
        type:'number',
        buttons: ['确定', '取消']
    }, function (ret, err) {
        var btnIndex = ret.buttonIndex;
        var text = ret.text;
        if(btnIndex===1){
            if(text===""||text===null){
                api.toast({
                    msg: '联系电话不可为空',
                    duration: 2000,
                    location: 'middle'
                });
            }else{
                common.get({
                    url:config.updateTelephone + patientId + "/" + person.homepageId + "/" + text ,
                    isLoading:true,
                    success:function(ret,err){
                        api.hideProgress();
                        if(ret.code===200){
                            api.toast({
                                msg: '添加成功',
                                duration: 2000,
                                location: 'middle'
                            });
                            $api.text($api.byId('telephoneInput'), text);
                        }else{
                            api.toast({
                                msg: '添加失败',
                                duration: 2000,
                                location: 'middle'
                            });
                        }
                    }
                })
            }
        }
    });
}
//修改电话方法
function updateTelephone(){
    var telephone = $api.text($api.byId('telephoneInput'));
    api.prompt({
        title:'联系电话修改',
        text:telephone,
        type:'number',
        buttons: ['确定', '取消']
    }, function (ret, err) {
        var btnIndex = ret.buttonIndex;
        var text = ret.text;
        if(btnIndex===1){
            if(text===""||text===null){
                api.toast({
                    msg: '联系电话不能为空',
                    duration: 2000,
                    location: 'middle'
                });
            }else{
                common.get({
                    url:config.updateTelephone + patientId + "/" + person.homepageId + "/" + text ,
                    isLoading:true,
                    success:function(ret,err){
                        api.hideProgress();
                        if(ret.code===200){
                            api.toast({
                                msg: '联系电话修改成功',
                                duration: 2000,
                                location: 'middle'
                            });
                            $api.text($api.byId('telephoneInput'), text);
                        }else{
                            api.toast({
                                msg: '联系电话修改失败',
                                duration: 2000,
                                location: 'middle'
                            });
                        }
                    }
                })
            }
        }
    });

}
/**
 * 体征信息
 * @param patientId
 */
var searchLastExamineInfo = function (patientId) {
    common.get({
        url: config.patientLastExamineUrl + patientId + "/" + person.homepageId,
        isLoading: true,
        success: function (ret) {
            $api.html($api.byId('tzylContentContainer'), "");
            if(ret && ret.content) {
                var contentTmpl = doT.template($api.text($api.byId('tzylTmpl')));
                $api.html($api.byId('tzylContentContainer'), contentTmpl(ret.content));
            }
        }
    });
};
/**
 * 费用信息查询
 * @param patientId
 */
var costDetailInfo = function (patientId) {
    common.get({
        url: config.costSituationUrl + patientId + '/' + person.homepageId,
        isLoading: true,
        success: function (ret) {
            $api.html($api.byId('fyhzContentContainer'), "");
            if(ret && ret.content) {
                var contentTmpl = doT.template($api.text($api.byId('fyhzTmpl')));
                $api.html($api.byId('fyhzContentContainer'), contentTmpl(ret.content));
            }else{
                var contentTmpl = doT.template($api.text($api.byId('fyhzTmpl')));
                var list = {}
                list.balance = 0;
                list.prepayMoney = 0;
                list.unconsumeMoney = 0;
                list.consumeMoney = 0;
                list.selfMoney = 0;
                $api.html($api.byId('fyhzContentContainer'), contentTmpl(list));
            }
        }
    });
};
/**
 * 检查结果列表
 * @param patientId
 */
var searchMedExamine = function (patientId) {
    common.get({
        url: config.medExaminelUrl + patientId + "&homepageId=" + person.homepageId + "&page=" + page + "&limit=-1",
        isLoading: true,
        timeout: 30,
        success: function (ret) {
            $api.html($api.byId('jcjg'), "");
            var contentTmpl = doT.template($api.text($api.byId('jcjgListTmpl')));
            $api.html($api.byId('jcjg'), contentTmpl(ret.content.list));
        }
    });
};

/**
 * 检查结果详情
 * @param examineId
 */
var inspectionDetail = function (obj, id,examineId,execStatus) {
    if($api.hasCls($api.next(obj),'hide')){
        if (execStatus==='0'){
            api.toast({
                msg: '该条医嘱未执行！',
                duration: 2000,
                location: 'bottom'
            });
            return
        } else if(execStatus==='1'){
            common.get({
                url: config.medExamineDetailUrl + id + "/" + examineId,
                isLoading: true,
                success: function (ret) {
                    $api.html($api.next(obj), "");
                    if(ret && ret.content) {
                        var contentTmpl = doT.template($api.text($api.byId('jcjgDetailTmpl')));
                        $api.html($api.next(obj), contentTmpl(ret.content));
                        var contentTmpl = doT.template($api.text($api.byId('jcjgDetailTmpl')));
                        $api.html($api.next(obj), contentTmpl(ret.content));
                    }
                    $api.removeCls($api.next(obj), 'hide');
                }
            });
        } else if(execStatus==='2'){
            api.toast({
                msg: '该条医嘱拒绝执行！',
                duration: 2000,
                location: 'bottom'
            });
            return
        } else if(execStatus==='3'){
            api.toast({
                msg: '该条医嘱正在执行中！',
                duration: 2000,
                location: 'bottom'
            });
            return
        }
    }else{
        $api.addCls($api.next(obj),'hide');
    }
};


/*化验结果*/
var searchMedAssay = function (patientId) {
    //在线
    common.get({
        url: config.medAssayUrl + patientId + "&homepageId=" + person.homepageId + "&page=" + page + "&limit=-1",
        isLoading: true,
        timeout: 30,
        success: function (ret) {
            $api.html($api.byId('hyjg'), "");
            var contentTmpl = doT.template($api.text($api.byId('hyjgListTmpl')));
            $api.html($api.byId('hyjg'), contentTmpl(ret.content.list));
        }
    });
};

/**
 * 化验结果详情
 * @param examineId
 */
var assayDetail = function(obj,assayId){
    if($api.hasCls($api.next(obj),'hide')){
        common.get({
            url: config.medAssayDetailUrl+assayId,
            isLoading: true,
            success:function(ret){
                $api.html($api.next(obj), "");
                if(ret && ret.content) {
                    if (ret.content.reportTime){
                        var contentTmpl = doT.template($api.text($api.byId('hyjgDetailTmpl')));
                        $api.html($api.next(obj), contentTmpl(ret.content));
                    }else{
                        alert("未开具报告，请耐心等待!")
                    }
                }
                $api.removeCls($api.next(obj), 'hide');
            }
        });
    }else{
        $api.addCls($api.next(obj),'hide');
    }
};

/**
 * 费用明细
 * @param patientId
 */
var fymxList = function(patientId,status){
    var costItemStatisticsList  = config.costItemStatisticsList + "?patientId=" + patientId + "&homepageId=" + person.homepageId;
    if (status){
        var costSum = $api.byId('costSum').checked;
        if (costSum){
            costItemStatisticsList = costItemStatisticsList + "&costSum=true";
        }
    }
    common.get({
        url: config.costSituationUrl + patientId + '/' + person.homepageId,
        isLoading: false,
        success: function (ret) {
            var data = {}
            data.cost = ret.content
            common.get({
                url: costItemStatisticsList,
                isLoading: true,
                success: function (ret) {
                    $api.html($api.byId('fymx'), "");
                    data.list = ret.content
                    if (status && costSum){
                       var contentTmpl = doT.template($api.text($api.byId('fymxTmplTwo')));
                    } else{
                       var contentTmpl = doT.template($api.text($api.byId('fymxTmpl')));
                    }
                    $api.html($api.byId('fymx'), contentTmpl(data));
                }
            });
        }
    });
};

function toggleMenu(){
    var scanner = api.require('cmcScan');
    $api.setStorage(storageKey.scannerStatus, 'changePatient');
    scanner.start()
}

function subStrDate(date) {
    if (!isEmpty(date)){
        return date.slice(0, 11)
    }
}

function isEmpty(str){
    if (str === null || str ==='' || str === undefined){
        return true
    }
}
