var personInfo = $api.getStorage(storageKey.currentPerson)
var areaId = $api.getStorage(storageKey.areaId)
var psersons = $api.getStorage(storageKey.persons);
var loginUserId = $api.getStorage(storageKey.userId);
var recordEle ;
var tagMemo;
var tagDays;    //当前选中患者标签最后一次修改日期距现在多少天
var patientAge;
var timeArea = -1;  //出现体温异常时时间区域数组下标(2~22)
var patientName;
var currentSelectedTime;
apiready=function(){
    $api.val($api.byId('lwbtime'), currentDate());

    $api.html($api.byId(content), '');

    patientList();
}


function showNext(obj,eleId,homeId,recordType,tag,age,name){
    patientAge = age;
    patientName = name;
    recordEle = $api.val($api.first($api.next(obj) ));
    tagMemo = tag;
    var nextDivs = $("div[name='nextDiv']")
    var selectedDate = $api.val($api.byId('lwbtime'));
    for(var k=0;k<nextDivs.length;k++){
        $api.html(nextDivs[k], "");
    }
        common.get({
            url:config.temperatureNote,
            isLoading:true,
            data:{
                'medPatientId': eleId,
                'beginDay':lwbtime ,
                'endDay': lwbtime,
                'homePageID': homeId
            },
            success:function (ret) {
                if(ret&&ret.code&&ret.code===200){
                    tagDays = ret.content.tagDays;
                    var itemContent = {
                        tempTwo:'',
                        tempSix:'',
                        tempTen:'',
                        tempFourteen:'',
                        tempEighteen:'',
                        tempTwentyTwo:'',
                        heartTwo:'',
                        heartSix:'',
                        heartTen:'',
                        heartFourteen:'',
                        heartEighteen:'',
                        heartTwentyTwo:'',
                        breathTwo:'',
                        breathSix:'',
                        breathTen:'',
                        breathFourteen:'',
                        breathEighteen:'',
                        breathTwentyTwo:'',
                        patientTwo:'',
                        patientSix:'',
                        patientTen:'',
                        patientFourteen:'',
                        patientEighteen:'',
                        patientTwentyTwo:'',
                        heartRateTwo:'',
                        heartRateSix:'',
                        heartRateTen:'',
                        heartRateFourteen:'',
                        heartRateEighteen:'',
                        heartRateTwentyTwo:'',
                        shit:'',
                        pee:'',
                        tagList:[],
                        fileId:'',
                        medPatientId:eleId,
                        homePageID:homeId
                    };
                        if(ret.content&&ret.content.temperatureList){
                            var temListSide = ret.content.temperatureList;
                            itemContent.tagList = ret.content.tagChangeList;
                            if(temListSide.temperatureList&&temListSide.temperatureList.length>0){
                                for(var i=0;i<temListSide.temperatureList.length;i++){
                                    var item = temListSide.temperatureList[i].measureTimeSection;
                                    var flagCount = 0;
                                    switch (item) {
                                        case 2:
                                            itemContent.tempTwo = temListSide.temperatureList[i];
                                            break;
                                        case 6:
                                            itemContent.tempSix = temListSide.temperatureList[i];
                                            break;
                                        case 10:
                                            itemContent.tempTen = temListSide.temperatureList[i];
                                            break;
                                        case 14:
                                            itemContent.tempFourteen = temListSide.temperatureList[i];
                                            break;
                                        case 18:
                                            itemContent.tempEighteen = temListSide.temperatureList[i];
                                            break;
                                        case 22:
                                            itemContent.tempTwentyTwo = temListSide.temperatureList[i];
                                            break;
                                    }
                                }
                                for(var i=0;i<temListSide.heartList.length;i++){
                                    var itemHeart = temListSide.heartList[i].measureTimeSection;
                                    switch (itemHeart) {
                                        case 2:
                                            itemContent.heartTwo = temListSide.heartList[i];
                                            break;
                                        case 6:
                                            itemContent.heartSix = temListSide.heartList[i];
                                            break;
                                        case 10:
                                            itemContent.heartTen = temListSide.heartList[i];
                                            break;
                                        case 14:
                                            itemContent.heartFourteen = temListSide.heartList[i];
                                            break;
                                        case 18:
                                            itemContent.heartEighteen = temListSide.heartList[i];
                                            break;
                                        case 22:
                                            itemContent.heartTwentyTwo = temListSide.temperatureList[i];
                                            break;
                                    }
                                }
                                for(var i=0;i<temListSide.breathList.length;i++){
                                    var itemBreath = temListSide.heartList[i].measureTimeSection;
                                    switch (itemBreath) {
                                        case 2:
                                            itemContent.breathTwo = temListSide.breathList[i];
                                            break;
                                        case 6:
                                            itemContent.breathSix = temListSide.breathList[i];
                                            break;
                                        case 10:
                                            itemContent.breathTen = temListSide.breathList[i];
                                            break;
                                        case 14:
                                            itemContent.breathFourteen = temListSide.breathList[i];
                                            break;
                                        case 18:
                                            itemContent.breathEighteen = temListSide.breathList[i];
                                            break;
                                        case 22:
                                            itemContent.breathTwentyTwo = temListSide.breathList[i];
                                            break;
                                    }
                                }
                                for(var i=0;i<temListSide.patientList.length;i++){
                                    var itemPatient = temListSide.heartList[i].measureTimeSection;
                                    switch (itemPatient) {
                                        case 2:
                                            itemContent.patientTwo = temListSide.patientList[i];
                                            break;
                                        case 6:
                                            itemContent.patientSix = temListSide.patientList[i];
                                            break;
                                        case 10:
                                            itemContent.patientTen = temListSide.patientList[i];
                                            break;
                                        case 14:
                                            itemContent.patientFourteen = temListSide.patientList[i];
                                            break;
                                        case 18:
                                            itemContent.patientEighteen = temListSide.patientList[i];
                                            break;
                                        case 22:
                                            itemContent.patientTwentyTwo = temListSide.patientList[i];
                                            break;
                                    }
                                }
                                for(var i=0;i<temListSide.heartRateList.length;i++){
                                    var itemHeartRate = temListSide.heartList[i].measureTimeSection;
                                    switch (itemHeartRate) {
                                        case 2:
                                            itemContent.heartRateTwo = temListSide.heartRateList[i];
                                            break;
                                        case 6:
                                            itemContent.heartRateSix = temListSide.heartRateList[i];
                                            break;
                                        case 10:
                                            itemContent.heartRateTen = temListSide.heartRateList[i];
                                            break;
                                        case 14:
                                            itemContent.heartRateFourteen = temListSide.heartRateList[i];
                                            break;
                                        case 18:
                                            itemContent.heartRateEighteen = temListSide.heartRateList[i];
                                            break;
                                        case 22:
                                            itemContent.heartRateTwentyTwo = temListSide.heartRateList[i];
                                            break;
                                    }
                                }
                                if(temListSide.shitList[temListSide.shitList[0]]){
                                    itemContent.shit = temListSide.shitList[temListSide.shitList[0]];
                                }else{
                                    itemContent.shit = {
                                        measureValue:'',
                                        measureId:'',
                                        measureKey:'',
                                        measureTime:'',
                                    }
                                }
                                if(temListSide.peeList[temListSide.peeList[0]]){
                                    itemContent.pee = temListSide.peeList[temListSide.peeList[0]]
                                }else{
                                    itemContent.pee = {
                                        measureValue:'',
                                        measureId:'',
                                        measureKey:'',
                                        measureTime:'',
                                    }
                                }

                            }
                        }
                    console.log(JSON.stringify(itemContent))
                    $api.html($api.byId(eleId),'');
                    var conTmpl = doT.template($api.text($api.byId('lwb-table')));
                    $api.html($api.byId(eleId),conTmpl(itemContent));


                    var twoInputs = $("input[name='twoInput']");
                    var sixInputs = $("input[name='sixInput']");
                    var tenInputs = $("input[name='tenInput']");
                    var fourteenInputs = $("input[name='fourteenInput']");
                    var eighteenInputs = $("input[name='eighteenInput']");
                    var twentytwoInputs = $("input[name='twentytwoInput']");

                    var twoNum = isNotNullArrFunc(twoInputs);
                    var sixNum = isNotNullArrFunc(sixInputs);
                    var tenNum = isNotNullArrFunc(tenInputs);
                    var fourteenNum = isNotNullArrFunc(fourteenInputs);
                    var eightteenNum = isNotNullArrFunc(eighteenInputs);
                    var twentytwoNum = isNotNullArrFunc(twentytwoInputs);
                    var tagHisMemo ="" ;
                    var recordMemoTime;
                    var hisRecordType;
                    /*for(var u=0;u<itemContent.tagList.length;u++){
                        if(itemContent.tagList[u].memo){
                            timeAreaNext = parseInt(itemContent.tagList[u].memo);
                            recordMemoTime = itemContent.tagList[u].createTime.slice(0,10);
                            hisRecordType = itemContent.tagList[u].tag;
                            console.log(recordMemoTime);
                        }
                    }*/


                    for(var h=0;h<itemContent.tagList.length;h++){
                        console.log(itemContent.tagList[h].createDate + '=======')
                        console.log(selectedDate + '++++++++')
                        if(itemContent.tagList[h].createDate&&itemContent.tagList[h].createDate==selectedDate){
                            tagHisMemo = itemContent.tagList[h].memo;
                        }
                    }
                    var domIdArr = ['twoTr','sixTr','tenTr','fourteenTr','eightTeenTr','twentyTwoTr'];
                    var domNameArr = [];
                    var tagHisMemoArr = [];
                    if(tagHisMemo!=null){
                        tagHisMemoArr = tagHisMemo.split(',');
                    }
                    console.log(tagHisMemoArr)
                    console.log(tagHisMemoArr.length)
                    if(tagHisMemoArr.length>0){
                            switch (tagHisMemoArr[0]) {
                                case 6:
                                    domNameArr = ['sixTr','tenTr','fourteenTr','eightTeenTr','twentyTwoTr'];
                                    break;
                                case 10:
                                    domNameArr = ['tenTr','fourteenTr','eightTeenTr','twentyTwoTr'];
                                    break;
                                case 14:
                                    domNameArr = ['fourteenTr','eightTeenTr','twentyTwoTr'];
                                    break;
                                case 18:
                                    domNameArr = ['eightTeenTr','twentyTwoTr'];
                                    break;
                                case 22:
                                    domNameArr = ['twentyTwoTr'];
                                    break;
                                default:
                                    domNameArr = ['twoTr','sixTr','tenTr','fourteenTr','eightTeenTr','twentyTwoTr'];
                                    break;
                            }
                        for(var f=0;f<domNameArr.length;f++){
                            addClasById(domNameArr[f]);
                        }

                    }else{
                        switch (recordType) {
                                                case '1':
                                                    if(fourteenNum<4){
                                                        $api.addCls($api.byId('fourteenTr'),'notInput');
                                                    }
                                                    break;
                                                case '2':
                                                    if(sixNum<4){
                                                        $api.addCls($api.byId('sixTr'),'notInput');
                                                    }
                                                    if(fourteenNum<4){
                                                        $api.addCls($api.byId('fourteenTr'),'notInput');
                                                    }

                                                    break;
                                                case '4':
                                                    if(sixNum<4){
                                                        $api.addCls($api.byId('sixTr'),'notInput');
                                                    }
                                                    if(tenNum<4){
                                                        $api.addCls($api.byId('tenTr'),'notInput');
                                                    }
                                                    if(fourteenNum<4){
                                                        $api.addCls($api.byId('fourteenTr'),'notInput');
                                                    }
                                                    if(eightteenNum<4){
                                                        $api.addCls($api.byId('eightTeenTr'),'notInput');
                                                    }
                                                    break;
                                                case '6':
                                                    if(twoNum<4){
                                                        $api.addCls($api.byId('twoTr'),'notInput');
                                                    }
                                                    if(sixNum<4){
                                                        $api.addCls($api.byId('sixTr'),'notInput');
                                                    }
                                                    if(tenNum<4){
                                                        $api.addCls($api.byId('tenTr'),'notInput');
                                                    }
                                                    if(fourteenNum<4){
                                                        $api.addCls($api.byId('fourteenTr'),'notInput');
                                                    }
                                                    if(eightteenNum<4){
                                                        $api.addCls($api.byId('eightTeenTr'),'notInput');
                                                    }
                                                    if(twentytwoNum<4){
                                                        $api.addCls($api.byId('twentyTwoTr'),'notInput');
                                                    }
                                                    break;
                                            }
                    }

                    /*if(timeAreaNext){
                        if(recordMemoTime){
                            if(recordMemoTime===currentSelectedTime){
                                switch (hisRecordType) {
                                    case '2':
                                        if(isNotNullArrFunc(getDomArrByName(domNameArr[timeAreaNext]))>4){
                                            addClasById('fourteenInput');
                                        };
                                        break;
                                    case '4':
                                        if(isNotNullArrFunc(getDomArrByName(domNameArr[timeAreaNext]))>4){
                                            addClasById();
                                        };
                                        break;
                                }
                            }
                        }
                    }*/

                }

            }
        })
}


function getDomArrByName(domName){
    var domArr ;
    switch (domName) {
        case 'twoInput':
            domArr = $("input[name='twoInput']");
            break;
        case 'sixInput':
            domArr = $("input[name='sixInput']");
            break;
        case 'tenInput':
            domArr = $("input[name='tenInput']");
            break;
        case 'fourteenInput':
            domArr = $("input[name='fourteenInput']");
            break;
        case 'eighteenInput':
            domArr = $("input[name='eighteenInput']");
            break;
        case 'twentytwoInput':
            domArr = $("input[name='twentytwoInput']");
            break;

    }
    return domArr;
}

function addClasById(domId){
    $api.addCls($api.byId(domId),'notInput');
}

//查询疗区所有病人
function patientList(){
    common.get({
        url:config.patientSearchUrl + "?inpatientArea=" + areaId,
        isLoading: true,
        success:function(ret){
            if(ret&&ret.code===200){
                if(ret.content&&ret.content.list&&ret.content.list.length>0){
                    var conTmpl = doT.template($api.text($api.byId('lwb-tpl')));
                    $api.html($api.byId('content'), conTmpl(ret.content));
                }
            }
        }
    })
}

//修改病人标签
function changeRecord(ele,tagMemo,patId,homeId,patName){
    var recordType = $api.val(ele);
    common.post({
        url:config.changeUpdateRecordType,
        isLoading:true,
        data:{
            patientId:patId,
            homepageId:homeId,
            tag:recordType,
            tagMemo:tagMemo,
            oId:patId + '' + homeId
        },
        success:function (ret) {
            common.post({
                url:config.tempreatureRecordSave,
                data:{
                    updatePerson:$api.getStorage(storageKey.userName),
                    updatePersonId:$api.getStorage(storageKey.userId),
                    tag:recordType,
                    patientId:patId,
                    patientName:patName,
                    homepageId:homeId,
                    updateContent:'',
                    tagMemo:tagMemo
                    },
                isLoading:true,
                success:function(ret1){
                    api.toast({
                        msg: '修改成功',
                        duration: 2000,
                        location: 'middle'
                    });
                }

            })
        }
    })
}


function recordPerDay(ele){
    var recordList = $("div[name='menuLwb']");
    var eleValue = $api.val(ele);
    var recordValue = '';
    if(ele.checked){
        for(var i=0;i<recordList.length;i++){
             recordValue = $api.attr(recordList[i],'data-tag');
             console.log(recordValue)
            if(eleValue==recordValue){
                $api.removeCls(recordList[i],'aui-hide');

            }
        }
    }else{
        for(var j=0;j<recordList.length;j++){
             recordValue = $api.attr(recordList[j],'data-tag');
            if(eleValue==recordValue){
                $api.addCls(recordList[j],'aui-hide');

            }
        }
    }
}

//留温本修改保存
function submit(ele,medPatientId,homePageID){
    var tempList = [];
    var age;
    var timeAreaMemo = "";
    console.log(patientAge);
    if(patientAge.length<3){
        age = parseInt(patientAge.slice(0,1));
    }else{
        age = parseInt(patientAge.slice(0,2));
    }

    console.log(age)
    common.post({
        url: config.getFileId,
        isLoading: false,
        text: "正在保存...",
        data: JSON.stringify({
            medPatientId: medPatientId,
            homePageID: homePageID
        }),
        success: function (ret) {
            var fileId =  ret.content;
            var dbcs = $api.val($api.byId('dbcs'));
            var shitMeasureTime = $api.attr($api.byId('dbcs'), 'data-time');
            if(shitMeasureTime==null||shitMeasureTime==undefined||shitMeasureTime==""){
                shitMeasureTime = currentTime;
            };
            addMapIfNotNull(tempList,fileId, '大便',dbcs,'',shitMeasureTime,'10');
            var xbcs = $api.val($api.byId('xbcs'));
            var peeMeasureTime = $api.attr($api.byId('xbcs'), 'data-time');
            if(peeMeasureTime==null||peeMeasureTime==undefined||peeMeasureTime==""){
                peeMeasureTime = currentTime;
            };
            addMapIfNotNull(tempList,fileId, '小便',xbcs,'',peeMeasureTime,'11');
            var twoInputs = $("input[name='twoInput']");
            var sixInputs = $("input[name='sixInput']");
            var tenInputs = $("input[name='tenInput']");
            var fourteenInputs = $("input[name='fourteenInput']");
            var eighteenInputs = $("input[name='eighteenInput']");
            var twentytwoInputs = $("input[name='twentytwoInput']");
            var twoTemp = $api.val(twoInputs[0]);
            var sixTemp = $api.val(sixInputs[0]);
            var tenTem = $api.val(tenInputs[0]);
            var fourteenTemp = $api.val(fourteenInputs[0]);
            var eightteenTemp = $api.val(eighteenInputs[0]);
            var twentytwoTemp = $api.val(twentytwoInputs[0]);
            var timeTempList = [twoTemp,sixTemp,tenTem,fourteenTemp,eightteenTemp,twentytwoTemp];
            var timeAreaArr = [2,6,10,14,18,22];

            for(var t=0;t<timeTempList.length;t++){
                if(checkHot(timeTempList[t])==='hotFerver'){
                    if(recordEle!=='6'){
                        api.confirm({
                            title: '提示',
                            msg: '此病人处于高烧，是否修改为6次/日(第二天生效)？',
                            buttons: ['确定','取消']
                        }, function (ret, err) {
                            var index = ret.buttonIndex;
                            for(var nm=0;nm<6;nm++){
                                if(nm>=t){
                                    if(nm!=5){
                                        timeAreaMemo += timeAreaArr[nm] + ","
                                    }else{
                                        timeAreaMemo += timeAreaArr[nm] + ""
                                    }
                                }
                            }
                            if(index===1){
                                common.post({
                                    url:config.changeUpdateRecordType,
                                    isLoading:true,
                                    data:{
                                        patientId:medPatientId,
                                        homepageId:homePageID,
                                        tag:'6',
                                        tagMemo:'高烧',
                                        oId:medPatientId + '' + homePageID
                                    },
                                    success:function (ret) {
                                        common.post({
                                            url:config.tempreatureRecordSave,
                                            data:{
                                                updatePerson:$api.getStorage(storageKey.userName),
                                                updatePersonId:$api.getStorage(storageKey.userId),
                                                tag:'6',
                                                patientId:medPatientId,
                                                patientName:patientName,
                                                homepageId:homePageID,
                                                updateContent:'',
                                                tagMemo:'高烧',
                                                memo:timeAreaMemo
                                            },
                                            isLoading:true,
                                            success:function(ret1){
                                                api.toast({
                                                    msg: '修改成功',
                                                    duration: 2000,
                                                    location: 'middle'
                                                });
                                            }

                                        })
                                    }
                                })
                            }
                        });
                        break;
                    }
                }else if(checkHot(timeTempList[t])==='tempAbnormal'){
                    if(recordEle!=='4'){
                        api.confirm({
                            title: '提示',
                            msg: '此病人体温存在异常，是否修改为4次/日(第二天生效)？',
                            buttons: ['确定','取消']
                        }, function (ret, err) {
                            var index = ret.buttonIndex;
                            for(var nm=0;nm<6;nm++){
                                if(nm>=t){
                                    if(nm!=5){
                                        timeAreaMemo += timeAreaArr[nm] + ","
                                    }else{
                                        timeAreaMemo += timeAreaArr[nm] + ""
                                    }
                                }
                            }
                            if(index===1){
                                common.post({
                                    url:config.changeUpdateRecordType,
                                    isLoading:true,
                                    data:{
                                        patientId:medPatientId,
                                        homepageId:homePageID,
                                        tag:'4',
                                        tagMemo:'体温异常',
                                        oId:medPatientId + '' + homePageID
                                    },
                                    success:function (ret) {
                                        common.post({
                                            url:config.tempreatureRecordSave,
                                            data:{
                                                updatePerson:$api.getStorage(storageKey.userName),
                                                updatePersonId:$api.getStorage(storageKey.userId),
                                                tag:'4',
                                                patientId:medPatientId,
                                                patientName:patientName,
                                                homepageId:homePageID,
                                                updateContent:'',
                                                tagMemo:'体温异常',
                                                memo:timeAreaMemo
                                            },
                                            isLoading:true,
                                            success:function(ret1){
                                                api.toast({
                                                    msg: '修改成功',
                                                    duration: 2000,
                                                    location: 'middle'
                                                });
                                            }

                                        })
                                    }
                                })
                            }
                        });
                        timeArea = t;
                        break;
                    }
                    else if(recordEle=='6'){
                        api.confirm({
                            title: '提示',
                            msg: '体温符合体温异常规则，是否修改为4次/日(第二天生效)？',
                            buttons: ['确定','取消']
                        }, function (ret, err) {
                            var index = ret.buttonIndex;
                            for(var nm=0;nm<6;nm++){
                                if(nm>=t){
                                    if(nm!=5){
                                        timeAreaMemo += timeAreaArr[nm] + ","
                                    }else{
                                        timeAreaMemo += timeAreaArr[nm] + ""
                                    }
                                }
                            }
                            if(index===1){
                                common.post({
                                    url:config.changeUpdateRecordType,
                                    isLoading:true,
                                    data:{
                                        patientId:medPatientId,
                                        homepageId:homePageID,
                                        tag:'4',
                                        tagMemo:'体温异常',
                                        oId:medPatientId + '' + homePageID
                                    },
                                    success:function (ret) {
                                        common.post({
                                            url:config.tempreatureRecordSave,
                                            data:{
                                                updatePerson:$api.getStorage(storageKey.userName),
                                                updatePersonId:$api.getStorage(storageKey.userId),
                                                tag:'4',
                                                patientId:medPatientId,
                                                patientName:'',
                                                homepageId:homePageID,
                                                updateContent:'',
                                                tagMemo:'体温异常',
                                                memo:timeAreaMemo
                                            },
                                            isLoading:true,
                                            success:function(ret1){
                                                api.toast({
                                                    msg: '修改成功',
                                                    duration: 2000,
                                                    location: 'middle'
                                                });
                                            }

                                        })
                                    }
                                })
                            }
                        });
                        break;
                    }
                }
            }
            getItemAddList(tempList,twoInputs,$api.byId('temTwoTempPart'),$api.byId('heartTwoPart'),$api.byId('breathTwoPart'),fileId);
            getItemAddList(tempList,sixInputs,$api.byId('tempSixPart'),$api.byId('heartSixPart'),$api.byId('breathSixPart'),fileId);
            getItemAddList(tempList,tenInputs,$api.byId('tempTenPart'),$api.byId('heartTenPart'),$api.byId('breathTenPart'),fileId);
            getItemAddList(tempList,fourteenInputs,$api.byId('tempFourteenPart'),$api.byId('heartFourteen'),$api.byId('breathFourteenPart'),fileId);
            getItemAddList(tempList,eighteenInputs,$api.byId('tempEighteenPart'),$api.byId('heartEighteen'),$api.byId('breathEighteenPart'),fileId);
            getItemAddList(tempList,twentytwoInputs,$api.byId('tempTwentyTwoPart'),$api.byId('heartTwentyTwo'),$api.byId('breathTwentyTwoPart'),fileId);
            getItemAddList(tempList,tenInputs,$api.byId('tempTenPart'),$api.byId('heartTenPart'),$api.byId('breathTenPart'),fileId);
            if(twentytwoTemp){
                common.post({
                    url:config.beforeThreeDays,
                    isLoading:false,
                    data:{
                        medPatientId:medPatientId,
                        homePageID:homePageID,
                        fileId:ret.content
                    },success:function (retThree) {
                        if(retThree){
                            if(retThree.code===200){
                                if(ret.content=="threeDaysTempOk"){
                                    api.confirm({
                                        title: '提示',
                                        msg: '此病人体温已回复至正常水平，是否将测量次数回复至正常？',
                                        buttons: ['确定','取消']
                                    }, function (ret, err) {
                                        var index = ret.buttonIndex;
                                        if(index===1){
                                            var threeTag = '1' ;
                                            var threeTagMemo = '一般患者';
                                            if(age<15) {
                                                threeTag = '2';
                                                threeTagMemo='14周岁以下患者'
                                            }
                                            common.post({
                                                url: config.insertTag,
                                                isLoading: false,
                                                data: {
                                                    recordType: threeTag,
                                                    tag_memo: threeTagMemo,
                                                    patientId: medPatientId,
                                                    homepageId: homePageID
                                                }, success: function (retHot) {
                                                    if(retHot&&retHot.code&&retHot.code===200){
                                                        common.post({
                                                            url:config.tempreatureRecordSave,
                                                            data:{
                                                                updatePerson:$api.getStorage(storageKey.userName),
                                                                updatePersonId:$api.getStorage(storageKey.userId),
                                                                tag:threeTag,
                                                                patientId:medPatientId,
                                                                patientName:patientName,
                                                                homepageId:homePageID,
                                                                updateContent:'',
                                                                tagMemo:threeTagMemo,
                                                            },
                                                            isLoading:true,
                                                            success:function(ret1){
                                                                api.toast({
                                                                    msg: '修改成功',
                                                                    duration: 2000,
                                                                    location: 'middle'
                                                                });
                                                            }

                                                        })
                                                    }
                                                }
                                            })
                                        }
                                    });

                                }
                            }
                        }
                    }
                })
            }

            common.post({
                url:config.tempreatureSava,
                isLoading:false,
                data:JSON.stringify(tempList),
                success:function(retSave){
                    if(retSave&&retSave.code&&retSave.code===200){
                        api.toast({
                            msg: '回传成功！',
                            duration: 3000,
                            location: 'middle'
                        });
                    }

                }
            })

       }
    });
}

function checkHot(temp){
    if(temp&&temp>=38.5){
        return 'hotFerver';
    }else if(temp&&temp<=35){
        return 'tempAbnormal';
    }else if(temp&&temp>=37.5&&temp<=38.4){
        return 'tempAbnormal';
    }else{
        return "";
    }
}
function checkUnatureAbnormal(temp){
    if(temp>=38.5){
        return true;
    }else{
        return false;
    }
}
//获取所有体温项并放入list中
function getItemAddList(tempList,inputs,tempPart,heartPart,breathPart,fileId){
    for(var i=0;i<inputs.length;i++){
        var measureTime = isNotNullTime(inputs[i].parentNode);
        var measurePart;
        var measureValue;
        switch (i) {
            case 0:
                measurePart=$api.val(tempPart);
                measureValue = $api.val(inputs[i]);
                addMapIfNotNull(tempList,fileId,'体温',measureValue,measurePart,measureTime,'1')
                break;
            case 1:
                measurePart=$api.val(heartPart);
                measureValue = $api.val(inputs[i]);
                addMapIfNotNull(tempList,fileId,'脉搏',measureValue,measurePart,measureTime,'2')
                break;
            case 2:
                measurePart=$api.val(breathPart);
                measureValue = $api.val(inputs[i]);
                addMapIfNotNull(tempList,fileId,'呼吸',measureValue,measurePart,measureTime,'3');
                break;
            case 3:
                measureValue = $api.val(inputs[i]);
                measurePart="";
                addMapIfNotNull(tempList,fileId,'疼痛强度',measureValue,measurePart,measureTime,'162');
                break;
            case 4:
                measureValue = $api.val(inputs[i]);
                measurePart="";
                addMapIfNotNull(tempList,fileId,'心率',measureValue,measurePart,measureTime,'-1');
        }

    }
}
function isNotNullTime(ele){
    var measureTimeFnc = $api.attr(ele, 'data-time');
    if(measureTimeFnc==null||measureTimeFnc=='undefined'||measureTimeFnc==""){
        return measureTimeFnc = currentTime();
    };
    return measureTimeFnc;
}

function currentDate() {
    var nowDate = new Date(new Date().toLocaleDateString());
    var date = new Date(nowDate.getTime());
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    return year + "-" + month + "-" + day;
}
function currentTime() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}



function addMapIfNotNull(arr, fileId, key, value, part,time,measureId) {
    if (value && key) {
        arr.push({
            updateUserId: loginUserId,
            fileId: fileId,
            measureTime: time,
            type: "1",
            measureKey: key,
            measureValue: value,
            tempreaturePart: part,
            isShow:"1",
            measureId:measureId
        });
    }
}

function chooseDate(el){
    api.openPicker({
        type: 'date',
        title: '日期'
    }, function (ret, err) {
        var startYear = ret.year;
        var startMonth = ret.month;
        var startDay = ret.day;
        var startDate = startYear + "-" + (startMonth < 10 ? "0" + startMonth : startMonth) + "-" + (startDay < 10 ? "0" + startDay : startDay);
        $api.val(el, startDate);
        //patientList();
        currentSelectedTime = startDate;
        hisInhospitalPatient(startDate);
    });
}


function hisInhospitalPatient(startDate){
    common.get({
        url:config.hisInhospitalPatient,
        isLoading:true,
        data:{
            inHospitalTime:startDate,
            areaId:personInfo.bedOrganizationId
        },
        success:function(ret){
            if(ret&&ret.code==200){
                $api.html($api.byId('content'), '');
                var conTmpl = doT.template($api.text($api.byId('lwb-tpl')));
                $api.html($api.byId('content'), conTmpl(ret.content));
            }
        }
    })
}
function showMeasurePart(ele){
    var nextEle = $api.next(ele.parentNode);
    var flag = $api.hasCls(nextEle,'aui-hide')
    if(flag){
        $api.removeCls(nextEle,'aui-hide');
    }else{
        $api.addCls(nextEle,'aui-hide');
    }
}


function ifUndefinedOrNull(para){
    if(para===undefined||para===null){
        return "";
    }else{
        return para;
    }
}

function changeTag(ele,patientId,homepageId,name){
    var recordEle = $api.first($api.prev($api.prev(ele.parentNode)));
    var tagMemo = $api.val(ele);
    var optionArr = ['<option value="1">1次/日</option>','<option value="2">2次/日</option>','<option value="4">4次/日</option>','<option value="6">6次/日</option>'];
    var tag = $api.val(ele);
    var parentColor ;
    var selectStr;
    var optionValur;
    switch(tag){
        case '新入院患者':
            selectStr = '<option value="2" selected>2次/日</option>';
            optionValur = '2';
            parentColor = 'twoRecord';
            break;
        case "14周岁以下患者":
            selectStr = '<option value="2" selected>2次/日</option>';
            parentColor = 'twoRecord';
            optionValur ='2';
            break;
        case "手术":
            selectStr = '<option value="4" selected>4次/日</option>';
            parentColor = 'fourRecord';
            optionValur ='4';
            break;
        case "分娩":
            selectStr = '<option value="4" selected>4次/日</option>';
            parentColor = 'fourRecord';
            optionValur ='4';
            break;
        case "介入":
            selectStr = '<option value="4" selected>4次/日</option>';
            parentColor = 'fourRecord';
            optionValur ='4';
            break;
        case "体温异常":
            selectStr = '<option value="4" selected>4次/日</option>';
            parentColor = 'fourRecord';
            optionValur ='4';
            break;
        case "高烧":
            selectStr = '<option value="6" selected>6次/日</option>';
            parentColor = 'sixRecord';
            optionValur ='6';
            break;
        case "1级护理级别患者":
            selectStr = '<option value="4" selected>4次/日</option>';
            parentColor = 'fourRecord';
            optionValur ='4';
            break;
        case "术前":
            selectStr = '<option value="1" selected>1次/日</option>';
            parentColor = 'oneRecord';
            optionValur ='1';
            break;
        case "术晨":
            selectStr = '<option value="1" selected>1次/日</option>';
            parentColor = 'oneRecord';
            optionValur ='1';
            break;
        case "一般患者":
            selectStr = '<option value="1" selected>1次/日</option>';
            parentColor = 'oneRecord';
            optionValur ='1';
            break;
        default :
            selectStr = '<option value="1" selected>1次/日</option>';
            parentColor = 'oneRecord';
            optionValur ='1';
            break;
    }

        switch (optionValur) {
            case '1':
                optionArr[0] = optionArr[0].slice(0,7) + " selected" + optionArr[0].slice(7);
                break;
            case '2':
                optionArr[1] = optionArr[1].slice(0,7) + " selected" + optionArr[1].slice(7);
                break;
            case '4':
                optionArr[2] = optionArr[2].slice(0,7) + " selected" + optionArr[2].slice(7);
                break;
            case '6':
                optionArr[3] = optionArr[3].slice(0,7) + " selected" + optionArr[3].slice(7);
                break;
    }

    var options = "";
    for(var j=0;j<optionArr.length;j++){
        options += optionArr[j];
    }
    api.confirm({
        title: '提示',
        msg: '是否将每日测量次数改为'+optionValur + '次/日',
        buttons: ['确定','取消']
    }, function (ret, err) {
        var index = ret.buttonIndex;
        if(index===0){
            alert(0)
        }else if(index===1){
            var divDom = ele.parentNode.parentNode;
            $api.removeCls(divDom,'twoRecord');
            $api.removeCls(divDom,'fourRecord');
            $api.removeCls(divDom,'sixRecord');
            $api.removeCls(divDom,'oneRecord');
            $api.addCls(divDom,parentColor);
            $api.html(recordEle, '');
            $api.html(recordEle, options);

            changeRecord(recordEle,tagMemo,patientId,homepageId,name);
        }
    });

}

function isNotNullFlag(item){
    if(!item||item==null||item==undefined||item==""){
        return 0;
    }else{
        return 1;

    }
}

function isNotNullArrFunc(arr){
    var count = 0;
    for(var i=0;i<arr.length-1;i++){
        count +=isNotNullFlag($api.val(arr[i]));

    }
    return count;
}
