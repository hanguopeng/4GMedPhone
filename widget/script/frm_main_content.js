var persons = [];
var areaId
apiready = function () {
    areaId = api.pageParam.areaId;
    searchPersons();
    addInpatientAreaChangedListener();
    addScanSuccessListener();
    api.parseTapmode();
    //下拉刷新
    api.setRefreshHeaderInfo({
        visible: true,
        bgColor: 'rgba(0,0,0,0)',
        textColor: '#666',
        textDown: '下拉刷新',
        textUp: '释放刷新',
        showTime: false
    }, function (ret, err) {
        refresh();
    });
};


/*
 * 根据条件查询所有病人信息
 */
function searchPersons() {
    $api.rmStorage(storageKey.currentIdx);
    $api.rmStorage(storageKey.persons);

    // 床号
    var medBedCode = $api.trim($api.val($api.byId("medBedCode")));
    // 我的病人
    var patientFlag = $api.byId("patientFlag").checked;
    // 护理等级
    var chooseType = $api.byId('chooseType').value;

    var requestUrl = config.patientSearchUrl + "?inpatientArea=" + areaId + "&medBedCode=" + medBedCode + "&myPatientFlag=" + patientFlag + "&operatorId=" + $api.getStorage(storageKey.userId) + "&nurseLevel=" + chooseType;
    common.get({
        url: requestUrl,
        isLoading: true,
        timeout: 20,
        success: function (ret) {
            //动态添加病人信息
            $api.html($api.byId('personContent'), "");
            if (ret.content && ret.content.list && ret.content.list.length > 0) {
                var personInfo = doT.template($api.text($api.byId('person-info-tpl')));
                var countInfo = doT.template($api.text($api.byId('count-info')));
                var params = ret.content;
                params._listCount = ret.content.list.length;
                $api.html($api.byId('personContent'), personInfo(params));
                $api.html($api.byId('countContent'), countInfo(params));
                //存储persons
                persons = ret.content.list;
                $api.setStorage(storageKey.persons, persons);
                api.hideProgress();
            } else if (ret.content && ret.content.list && ret.content.list.length == 0) {
                api.hideProgress();
                var params = {}
                params.inHospital = 0
                params.emptyBedNum = 0
                params.feverNum = 0
                params.newAdviceNum = 0
                var countInfo = doT.template($api.text($api.byId('count-info')));
                $api.html($api.byId('countContent'), countInfo(params));
                api.toast({
                    msg: '无患者'
                });
            }
        }
    });

}


/**
 * 添加病区修改监听器，当header上面的下拉框修改之后，重新进行查询
 */
function addInpatientAreaChangedListener() {
    api.addEventListener({
        name: eventName.InpatientAreaChanged
    }, function (ret, err) {
        areaId = ret.value.areaId;
        searchPersons();
    });
}

function addScanSuccessListener() {
    api.addEventListener({
        name: "scanSuccess"
    }, function (ret, err) {
        var personIdx = ret.value.index;
        var allPersons = $api.getStorage(storageKey.persons);
        var person = allPersons[personIdx];
        common.get({
            url: config.patientDetailUrl + person.id + '/' + person.homepageId,
            isLoading: true,
            success: function (ret) {
                if(ret && ret.content){
                    if (isEmpty(ret.content.inOrganizationTime)){
                        common.get({
                            url: config.patientSaveUrl + person.id + '/' + person.homepageId,
                            isLoading: true,
                            text: "正在保存...",
                            success: function (ret) {
                                api.hideProgress();
                                api.sendEvent({
                                    name: 'inOraSuccessEvent',
                                });
                            }
                        });
                        return;
                    }
                }else{
                    api.toast({
                        msg:  '未查到指定病人信息',
                        duration: config.duration,
                        location: 'bottom'
                    });
                    return;
                }
            }
        });

        openPersonCenter(personIdx);
    });
}

//下拉刷新
function refresh() {
    api.refreshHeaderLoadDone(); //复位下拉刷新
    $api.byId("patientFlag").checked = false;
    $api.byId('chooseType').value = '';
    $api.val($api.byId("medBedCode"), "");
    searchPersons();
}

//点击病人卡进入到病人详细信息页面
function openPersonCenter(idx) {
    var allPersons = $api.getStorage(storageKey.persons);
    var person = allPersons[idx];
    $api.setStorage(storageKey.currentPerson, person);
    api.openWin({
        name: "win_person_center",
        bounces: false,
        slidBackEnabled: false,
        reload: true,
        url: '../html/win_person_center.html',
        vScrollBarEnabled: true,
        hScrollBarEnabled: false
    });
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
