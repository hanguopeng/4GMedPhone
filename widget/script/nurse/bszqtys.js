var person = $api.getStorage(storageKey.currentPerson);
var patientId = person.id;
var id = 216;
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
    var huanbing = $api.val($api.byId('huanbing'));
    var zhiliao = $api.val($api.byId('zhiliao'));
    var qianziren = $api.val($api.byId("qianziren"));
    var hzrqsj = $api.val($api.byId("hzrqsj"));
    var guanxi = $api.val($api.byId("hzgx"));
    var otheritem = $api.val($pi.byId('otheritem'));
    //alert("sdfsdfsdf")
    domNotNull();

    api.confirm({
        title: '提示',
        msg: '确定保存吗？',
        buttons: ['确定', '取消']
    }, function (ret, err) {
        if (ret.buttonIndex == 1) {
            var data = [];
            addMapIfNotNull(data,'qianziren',qianziren,true);
            addMapIfNotNull(data,'guanxi',guanxi,true);
            addMapIfNotNull(data,'huanbing',huanbing,true);
            addMapIfNotNull(data,'zhiliao',zhiliao,true);
            addMapIfNotNull(data,'hzrqsj',hzrqsj,true);
            addMapIfNotNull(data,'otheritem',true);
            var params = {};

            params.medPatientId = patientId;
            params.name = '鼻饲知情同意书';
            params.medTemplateId = 216;
            params.itemList = data;
            //alert(JSON.stringify(params));
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
            templateList:[{"templateCode":"nasalFeeding","templateVersion":1}]
        }),
        success: function (ret) {
            //alert(JSON.stringify(ret.content));
            if (ret.content && ret.content.list && ret.content.list.length > 0) {
                //处理数据
                //alert(JSON.stringify(ret.content.list));
                var data = ret.content.list;
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

function openDetailWin(el) {
    var data = JSON.parse($(el).find(".json-span").first().text());
    api.openWin({
        name: 'win_bszqtys_detail',
        url: './win_bszqtys_detail.html',
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
            map["medTemplateItemId"]=216;
        }
        arr.push(map);
    }
}
function picker(el,id){
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
            $api.val(el,date);

            $(id).css("color","#ccc2c2");
            $(id).one("click",function(){
                $(el).val("");
                $(id).css("color","#ffffff");
            });
        });
    });
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