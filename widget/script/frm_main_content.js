var persons = [];
var areaId;
apiready = function () {
    api.parseTapmode();
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
    // api.removeEventListener({
    //     name: 'scanEvent'
    // },scanFun);
    // 给dom元素加监听
    // api.addEventListener({
    //     name: 'scanEvent'
    // },scanFun);
    $api.html($api.byId('nurseLevelContent'), "");
    $api.html($api.byId('personContent'), "");

    $api.rmStorage(storageKey.currentPerson);
    $api.rmStorage(storageKey.currentIdx);
    $api.rmStorage(storageKey.lastIdx);
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
        success: function (ret) {
            //动态添加病人信息
            if (ret.content && ret.content.list && ret.content.list.length > 0) {
                var personInfo = doT.template($api.text($api.byId('person-info-tpl')));
                var countInfo = doT.template($api.text($api.byId('count-info')));
                var params = ret.content;
                alert(JSON.stringify(ret.content))
                params._listCount = ret.content.list.length;
                $api.html($api.byId('personContent'), personInfo(params));
                $api.html($api.byId('countContent'), countInfo(params));
                //存储persons
                persons = ret.content.list;
                $api.setStorage(storageKey.persons, persons);
                api.hideProgress();
            } else if (ret.content && ret.content.list && ret.content.list.length == 0) {
                api.hideProgress();
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
        openPersonCenter(personIdx);
    });
}


/**
 * 重置查询条件，查询病人信息
 */
function refresh() {
    //设置所有选项为初始值
    $api.val($api.byId("doctorName"), "");
    $api.val($api.byId("nurseName"), "");
    $api.byId("emptyBed").checked = false;
    $api.dom("input[name='patientFlag'][value='0']").checked = true;
    searchPersons();
}


//下拉刷新
function refresh() {
    api.refreshHeaderLoadDone(); //复位下拉刷新
    $api.byId("patientFlag").checked = false;
    $api.byId('chooseType').value = -1;
    $api.val($api.byId("medBedCode"), "");
    searchPersons();
}

//点击病人卡进入到病人详细信息页面
function openPersonCenter(idx) {
    var allPersons = $api.getStorage(storageKey.persons);
    var person = allPersons[idx];
    $api.setStorage(storageKey.currentPerson, person);
    $api.setStorage(storageKey.currentIdx, idx); //左右箭头的时候需要
    $api.setStorage(storageKey.lastIdx, allPersons.length - 1); //设置最后一个索引的大小，length-1
    // api.removeEventListener({
    //     name: 'scanEvent'
    // },scanFun);
    api.openWin({
        name: "win_person_center",
        bounces: false,
        slidBackEnabled: false,
        reload: true,
        url: '../html/win_person_center.html',
        vScrollBarEnabled: true,
        hScrollBarEnabled: false,
        pageParam:{
            idx:idx,
        }
    });
}

function subStrDate(date) {
    return date.slice(0, 11)
}