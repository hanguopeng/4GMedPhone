var person = $api.getStorage(storageKey.currentPerson);
var userId = $api.getStorage(storageKey.userId);
var areaId = $api.getStorage(storageKey.areaId);
var tourRecordsPerson = person   // 巡视扫码得到的病人
var patientId = person.id;
apiready = function () {
    api.parseTapmode();
    tourRecords();
    $api.setStorage(storageKey.scannerStatus, 'tour-records');
    // 监控巡视扫码事件
    api.addEventListener({
        name: 'tourRecordsResultShow'
    }, function(ret,err){
        var tourRecordsPersonId = $api.getStorage(storageKey.tourRecordsPersonId);
        var persons = $api.getStorage(storageKey.persons);
        var status = true
        var inOraFlag = true;
        //遍历查询
        for (var i = 0; i < persons.length; i++) {
            if(persons[i].id == tourRecordsPersonId){
                var homeId = persons[i].homepageId
                var personInfo = persons[i]
                common.get({
                    url: config.patientDetailUrl + tourRecordsPersonId + '/' + homeId,
                    isLoading: true,
                    success: function (ret) {
                        if (ret && ret.content) {
                            if (ret.content.inOrganizationTime == null || ret.content.inOrganizationTime == "") {
                                api.toast({
                                    title: '提示',
                                    msg: '病人未入科，请入科后尝试'
                                })
                                return;
                            }
                                tourRecordsPerson = personInfo;
                                tourRecordsExecute('scan');
                        }
                    }
                })
                status = false

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
    var tourEle = "<label><input class=\"aui-margin-t-5 \" name=\"allPatient\" id=\"allPatient\" type=\"checkbox\" tapmode  onchange=\"tourRecords()\" checked> 全部患者</label>\n" +
        "                &nbsp;&nbsp;&nbsp;&nbsp;\n" +
        "                <label><input class=\"aui-margin-t-5 \" name=\"allNurse\" id=\"allNurse\" type=\"checkbox\" tapmode   onchange=\"tourRecords()\"> 全部护士</label>"
    $api.html($api.byId('tour-records-header'), "");
    $api.html($api.byId('tour-records-header'),tourEle);
    tourRecords();
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

var addTourRecords = function () {
    var activeTab = $api.dom($api.byId('tour-records'), '#tourRecords-result');
    var active = $api.hasCls(activeTab, 'active');
    if (!active) {
        paddingInputTourRecords()
        $api.addCls($api.dom($api.byId('tour-records'), '#tourRecords-result'), 'active');
    }else{
        $api.removeCls($api.dom($api.byId('tour-records'), '#tourRecords-result'), 'active');
    }
}


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
    if (

        function isEmpty(str){
            if (str === null || str ==='' || str === undefined || str === 'undefined'){
                return true
            }
        }(type)){
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
