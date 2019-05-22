var person = $api.getStorage(storageKey.currentPerson);
var patientId = person.id;
var id = 217;
var personInfo = null;
apiready = function () {
    api.parseTapmode();
    checkBox();
    var tab = new auiTab({
        element: document.getElementById("tab"),
        index: 1,
        repeatClick: false
    }, function (ret) {
        $api.html($api.byId("content"), "");
        if (ret.index == 1) {
            checkBox();
            showAdd();
        } else if (ret.index == 2) {
            search();
        }
    });
    showAdd();

}

function checkBox() {
    var params = {};
    params.queryCode = "patient_relation";
    params.addAllFlag = false;
    params.loadSonFlag = false;
    params.nullFlag = false;
    common.post({
        url:config.patientrelationUrl,
        isLoading: true,
        data:JSON.stringify(params),
        dataType:JSON,
        success:function(ret){
            var item = ret.content;
            //alert(JSON.stringify(item));
            console.log(JSON.stringify(item));
            //alert(item.length);
            $api.html($api.byId("hzgx"), "");
            /*$api.html($api.byId("hzgx"), "<option value=''>请选择</option>");*/
            var contentTmpl = doT.template($api.text($api.byId("hzjsgx-tpl")));
            $api.html($api.byId("hzgx"), contentTmpl(item));
        }
    });
}
function showAdd() {

    common.get({
        url: config.patientDetailUrl + patientId,
        isLoading: true,
        success: function (ret) {
            ret.content.rqsj = currentDate();
            var storageUserName = $api.getStorage(storageKey.userName);
            ret.content.hsqm = storageUserName;
            //alert(JSON.stringify())
            personInfo = ret.content;

            $api.html($api.byId('content'), "");
            var contentTmpl = doT.template($api.text($api.byId('add-tpl')));
            $api.html($api.byId('content'), contentTmpl(personInfo));

        }
    });
    api.parseTapmode();
    checkBox();
}
function saveAddRecord() {
    var keshi = $api.val($api.byId("keshi"));
    var hzxm = $api.val($api.byId("hzxm"));
    var age = $api.val($api.byId("age"));
    var mednum = $api.val($api.byId("mednum"));
    var medid = $api.val($api.byId("medid"));
    var sex = $api.val($api.byId("sex"));
    var hzjs = $api.val($api.byId("hzjs"));
    var hsqm = $api.val($api.byId("hsqm"));
    var sjrq = $api.val($api.byId("sjrq"));
    var guanxi = $api.val($api.byId("hzgx"));
    //alert("sdfsdfsdf")
    domNotNull();

    api.confirm({
        title: '提示',
        msg: '确定保存吗？',
        buttons: ['确定', '取消']
    }, function (ret, err) {
        if (ret.buttonIndex == 1) {
            var data = [];
            /*addMapIfNotNull(data,'organizationName',keshi,true);
            addMapIfNotNull(data,'age',age,true);
            addMapIfNotNull(data,'sexName',sex,true);
            addMapIfNotNull(data,'medBedName',mednum,true);
            addMapIfNotNull(data,'registerNumber',medid,true);
            addMapIfNotNull(data,'createName',hsqm,true);*/
            addMapIfNotNull(data,'huanzhejiashu',hzjs,true);
            addMapIfNotNull(data,'guanxi',guanxi,true);
/*            addMapIfNotNull(data,'name',hzxm,true);*/
            var params = {};

            params.medPatientId = patientId;
            params.name = '化疗药物静脉输液外渗告知书';
            params.medTemplateId = 217;
            params.itemList = data;
            alert(JSON.stringify(params));
            common.post({
                url:config.nursePlanUrl,
                isLoading:true,
                text:"正在保存...",
                data:JSON.stringify(params),
                dataType:JSON,
                success:function (ret) {
                    api.hideProgress();
                    api.alert({
                        title: '提示',
                        msg: '保存成功！',
                    }, function (ret, err) {
                        showAdd();
                    });
                }
            });

        }
    });

}

/*function showHis() {

    var contentTmpl = doT.template($api.text($api.byId('his-tpl')));
    $api.html($api.byId('content'), contentTmpl({}));
    api.parseTapmode();
    api.hideProgress();

}*/

function domNotNull() {
    var hzjs = $api.val($api.byId("hzjs"));
    if (!hzjs){
        api.toast({
            msg: "请患者或家属签字",
            duration: config.duration,
            location: 'bottom'
        });
    }
}
function search() {
    var contentTmpl = doT.template($api.text($api.byId('his-tpl')));
    $api.html($api.byId('content'), contentTmpl({}));
    api.parseTapmode();
    api.hideProgress();
    common.post({
        url: config.nurseLogNew,
        isLoading: true,
        data:JSON.stringify({
            patientId: person.id,
            paga:1,
            limit: 100,
            templateList:[{"templateCode":"hlywjmsywsgzs","templateVersion":1}]
        }),
        success: function (ret) {
            //alert(JSON.stringify(ret.content));
            if (ret.content && ret.content.list && ret.content.list.length > 0) {
                //处理数据
                //alert(JSON.stringify(ret.content.list));
                var data = ret.content.list;
                //根据开始时间和结束时间构造一个以时间为key的数组对象
                var contentTmpl = doT.template($api.text($api.byId('record-tpl')));
                $api.html($api.byId('recordContent'), contentTmpl(data));
                api.parseTapmode();
                api.hideProgress();
            } else {
                api.hideProgress();
                api.toast({
                    msg: "未查询到记录",
                    duration: config.duration,
                    location: 'bottom'
                });
            }
        }
    });
}
function pickerSearch(){
    api.openPicker({
        type: 'date',
        title: '开始时间'
    }, function(ret, err){
        var startYear = ret.year;
        var startMonth = ret.month;
        var startDay = ret.day;
        var startDate = startYear + "-" + (startMonth<10? "0"+startMonth:startMonth) + "-" + (startDay<10?"0"+startDay:startDay);
        api.openPicker({
            type: 'date',
            title: '结束时间'
        }, function(ret1, err1){
            var endYear = ret1.year;
            var endMonth = ret1.month;
            var endDay = ret1.day;
            var endDate = endYear + "-" + (endMonth<10?"0"+endMonth:endMonth) + "-" + (endDay<10?"0"+endDay:endDay);
            $api.val($api.byId("dateRange"),startDate+"~"+endDate);
        });
    });
}
function openDetailWin(el) {
    var data = JSON.parse($(el).find(".json-span").first().text());
    api.openWin({
        name: 'win_hlwjmsyws_detail',
        url: './win_hlwjmsyws_detail.html',
        pageParam: {
            data: data
        }
    });

}
function addMapIfNotNull(arr,key,value,existsId){
    var map = {};
    if(value && key){
        map["key"]=key;
        map["value"]=value;
        if(existsId){
            map["medTemplateItemId"]=217;
        }
        arr.push(map);
    }
}


function currentDate() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    return year + "-" + month + "-" + day;
}