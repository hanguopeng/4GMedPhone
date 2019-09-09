var person = $api.getStorage(storageKey.currentPerson);
var patientId = person.id;
var page = 1;
var tabList = ['tab-jcst','tab-jcjg','tab-hyjg','tab-fymx']
var currentTab = 0
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
};

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
        loadJCST();
    } else if (dataTo == "jcjg") {//检查结果
        currentTab = 1
        loadJCJG();
    } else if (dataTo == "hyjg") {//化验结果
        currentTab = 2
        loadHYJG();
    } else if (dataTo == "fymx") {//费用明细
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
            }
        }
    });
};

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
var inspectionDetail = function (obj, id,examineId) {
    if($api.hasCls($api.next(obj),'hide')){
        common.get({
            url: config.medExamineDetailUrl + id + "/" + examineId,
            isLoading: true,
            success: function (ret) {
                $api.html($api.next(obj), "");
                if(ret && ret.content) {
                    if (ret.content.reportTime){
                        var contentTmpl = doT.template($api.text($api.byId('jcjgDetailTmpl')));
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