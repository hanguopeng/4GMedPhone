var person = $api.getStorage(storageKey.currentPerson);
var patientId = person.id;
var page = 1;
// var db;

apiready = function () {
    api.parseTapmode();
    // db = api.require('db');
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
var loadFYMX = function () {
    fymxList(patientId);
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
        loadJCST();
    } else if (dataTo == "jcjg") {//检查结果
        loadJCJG();
    } else if (dataTo == "hyjg") {//化验结果
        loadHYJG();
    } else if (dataTo == "fymx") {//费用明细
        loadFYMX();
    }
}


/**
 * 基础信息
 * @param patientId
 */
var searchPatientDetail = function (patientId) {
    common.get({
        url: config.patientDetailUrl + patientId,
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
        url: config.patientLastExamineUrl + patientId,
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
        url: config.costSituationUrl + patientId,
        isLoading: true,
        success: function (ret) {
            $api.html($api.byId('fyhzContentContainer'), "");
            if(ret && ret.content) {
                var contentTmpl = doT.template($api.text($api.byId('fyhzTmpl')));
                $api.html($api.byId('fyhzContentContainer'), contentTmpl(ret.content));
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
        url: config.medExaminelUrl + patientId + "&page=" + page,
        isLoading: true,
        success: function (ret) {
            $api.html($api.byId('jcjg'), "");
            if(ret && ret.content && ret.content.list){
                var contentTmpl = doT.template($api.text($api.byId('jcjgListTmpl')));
                $api.html($api.byId('jcjg'), contentTmpl(ret.content.list));
            }
        }
    });
};

/**
 * 检查结果详情
 * @param examineId
 */
var inspectionDetail = function (obj, examineId) {
    //console.log("offlineFlag = " + $api.getStorage(storageKey.offlineFlag));
    if($api.hasCls($api.next(obj),'hide')){
        common.get({
            url: config.medExamineDetailUrl + examineId,
            isLoading: true,
            success: function (ret) {
                var domAll = $api.domAll('.jcjgItemDetail');
                //console.log(domAll.length);
                for (var i = 0; i < domAll.length; i++) {
                    if (domAll[i]) {
                        $api.addCls(domAll[i], 'hide');
                    }

                }
                $api.html($api.next(obj), "");
                if(ret && ret.content) {
                    var contentTmpl = doT.template($api.text($api.byId('jcjgDetailTmpl')));
                    $api.html($api.next(obj), contentTmpl(ret.content));
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
        url: config.medAssayUrl + patientId + "&page=" + page,
        isLoading: true,
        success: function (ret) {
            $api.html($api.byId('hyjg'), "");
            if(ret && ret.content && ret.content.list) {
                var contentTmpl = doT.template($api.text($api.byId('hyjgListTmpl')));
                $api.html($api.byId('hyjg'), contentTmpl(ret.content.list));
            }
        }
    });
};

/**
 * 化验结果详情
 * @param examineId
 */
var assayDetail = function(obj,assayId){
    //console.log("offlineFlag = " + $api.getStorage(storageKey.offlineFlag));
    if($api.hasCls($api.next(obj),'hide')){
        common.get({
            url: config.medAssayDetailUrl+assayId,
            isLoading: true,
            success:function(ret){
                var domAll = $api.domAll('.hyjgItemDetail');
                //console.log(domAll.length);
                for (var i = 0; i < domAll.length; i++) {
                    if (domAll[i]) {
                        $api.addCls(domAll[i], 'hide');
                    }

                }
                $api.html($api.next(obj), "");
                if(ret && ret.content) {
                    var contentTmpl = doT.template($api.text($api.byId('hyjgDetailTmpl')));
                    $api.html($api.next(obj), contentTmpl(ret.content));
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
var fymxList = function(patientId){
    //alert(patientId);
    common.get({
        url: config.costItemStatisticsList + patientId,
        isLoading: true,
        success: function (ret) {
            //console.log(JSON.stringify(ret));
            $api.html($api.byId('fymx'), "");
            if(ret && ret.content&&ret.content.length>0) {
                var item = ret.content;
                var contentTmpl = doT.template($api.text($api.byId('fymxTmpl')));
                $api.html($api.byId('fymx'), contentTmpl(item));
                }
        }
    });
};

/**
 * 费用详情
 * @param obj
 */
var fymxDetail = function(obj){
    if($api.hasCls($api.next(obj),'hide')){
        //alert(patientId);
        common.get({
            url: config.costItemStatisticsList + patientId,
            isLoading: true,
            success: function (ret) {
                var domAll = $api.domAll('.fymxItemDetail');
                //console.log(domAll.length);
                for (var i = 0; i < domAll.length; i++) {
                    if (domAll[i]) {
                        $api.addCls(domAll[i], 'hide');
                    }

                }
                $api.removeCls($api.next(obj), 'hide');
            }
        });
    }else{
        $api.addCls($api.next(obj),'hide');
    }
};
