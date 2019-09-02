var person = $api.getStorage(storageKey.currentPerson);
var personInfo = null;
var patientId = person.id;
apiready = function () {
    api.parseTapmode();

    var tab = new auiTab({
        element: document.getElementById("tab"),
        index: 1,
        repeatClick: false
    }, function (ret) {
        $api.html($api.byId("content"), "");
        if (ret.index == 1) {
            showAdd();
        } else if (ret.index == 2) {
            showHis();
        }
    });
    showAdd();

}

function showAdd() {
    common.get({
        url: config.patientDetailUrl + patientId + '/' + person.homepageId,
        isLoading: true,
        success: function (ret) {
            ret.content.pgrq = currentTime();
            var storageUserName = $api.getStorage(storageKey.userName);
            ret.content.pgr = storageUserName;
            //alert(JSON.stringify())
            personInfo = ret.content;
            $api.html($api.byId('content'), "");
            var contentTmpl = doT.template($api.text($api.byId('add-tpl')));
            $api.html($api.byId('content'), contentTmpl(personInfo));

        }
    });
    api.parseTapmode();
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


function currentTime() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    return year + "-" + month + "-" + day + " " + hour + ":" + minute;
}


//分时段信息保存
function saveAddRecord() {
    //上传的数据集合
    var data = [];
    var shifouzuoguohualiao = $("input[name='shifouzuoguohualiao']:checked").val();
    var xuechanggui = $("input[name='xuechanggui']:checked").val();
    var shengao = $("input[name='shengao']").val();
    var yewoshang = $("input[name='yewoshang']").val();
    var yewoxia = $("input[name='yewoxia']").val();
    var pinpai = $("input[name='pinpai']").val();
    var charu = $("input[name='charu']").val();
    var tuiru = $("input[name='tuiru']").val();
    var yichang = $("input[name='yichang']").val();


    var jianduanweiyu = $("input[name='jianduanweiyu']").val();
    var zhushou = $("input[name='zhushou']").val();
    var zaituichu = $("input[name='zaituichu']").val();
    var chuancijingmai= "" ;
    var chuancijingmaiList = $("input[name='chuancijingmai']");
    for(var i=0;i<chuancijingmaiList.length;i++){
        if(chuancijingmaiList[i].checked){
            chuancijingmai += chuancijingmaiList[i].value+",";
        }
    }

    var tuiru1 = $("input[name='tuiru1']").val();
    var wailu = $("input[name='wailu']").val();
    var jianqu = $("input[name='jianqu']").val();
    var xinjianduan = $("input[name='xinjianduan']").val();
    var fengguanfangfa = "" ;
    var fengguanfangfaList = $("input[name='fengguanfangfa']");
    for(var i=0;i<fengguanfangfaList.length;i++){
        if(fengguanfangfaList[i].checked){
            fengguanfangfa += fengguanfangfaList[i].value+",";
        }
    }
    var xindejianduanweizhi = "" ;
    var xindejianduanweizhiList =$("input[name='xindejianduanweizhi']");
    for(var i=0;i<xindejianduanweizhiList.length;i++){
        if(xindejianduanweizhiList[i].checked){
            xindejianduanweizhi += xindejianduanweizhiList[i].value+",";
        }
    }

    addMapIfNotNull(data, "shengao",shengao,true);
    addMapIfNotNull(data, "yichang",yichang,true);
    addMapIfNotNull(data, "shifouzuoguohualiao", shifouzuoguohualiao, true);
    addMapIfNotNull(data, "xuechanggui", xuechanggui, true);
    addMapIfNotNull(data, "chuancijingmai", chuancijingmai, true);
    addMapIfNotNull(data, "yewoshang", yewoshang, true);
    addMapIfNotNull(data, "yewoxia", yewoxia, true);
    addMapIfNotNull(data, "pinpai", pinpai, true);
    addMapIfNotNull(data, "charu", charu, true);
    addMapIfNotNull(data, "tuiru", tuiru, true);
    addMapIfNotNull(data, "fengguanfangfa", fengguanfangfa, true);
    addMapIfNotNull(data, "jianduanweiyu", jianduanweiyu, true);
    addMapIfNotNull(data, "zhushou", zhushou, true);
    addMapIfNotNull(data, "zaituichu", zaituichu, true);
    addMapIfNotNull(data, "tuiru1", tuiru1, true);
    addMapIfNotNull(data, "wailu", wailu, true);
    addMapIfNotNull(data, "jianqu", jianqu, true);
    addMapIfNotNull(data, "xinjianduan", xinjianduan, true);
    addMapIfNotNull(data, "xindejianduanweizhi", xindejianduanweizhi, true);

    var params = {};
    var person = $api.getStorage(storageKey.currentPerson);
    params.medPatientId = person.id;
    params.homepageId = person.homepageId;
    params.medTemplateId = 219;
    params.itemList = data;
    params.name = "PICC穿刺"
    params.measureDate= currentTime()+":00";

    api.confirm({
        title: '提示',
        msg: '确定保存吗？',
        buttons: ['确定', '取消']
    }, function (ret, err) {
        if (ret.buttonIndex == 1) {
            common.post({
                url: config.nursePlanUrl,
                isLoading: true,
                text: "正在保存...",
                data: JSON.stringify(params),
                success: function (ret) {
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

function checkNull(val, msg) {
    if (!val) {
        api.toast({
            msg: msg,
            duration: 2000,
            location: 'bottom'
        });
        return true;
    }

    return false;
}

//如果value不会空，则放入到map中
function addMapIfNotNull(arr, key, value, existsId) {
    var map = {};
    if (value && key) {
        map["key"] = key;
        map["value"] = value;
        if (existsId) {
            map["medTemplateItemId"] = 219;
        }
        arr.push(map);
    }
}

function openDetailWin(el) {
    var data = JSON.parse($(el).find(".json-span").first().text());
    api.openWin({
        name: 'win_PICC_detail',
        url: './win_PICC_detail.html',
        pageParam: {
            data: data
        }
    });

}

function showHis(){
    var contentTmpl = doT.template($api.text($api.byId('his-tpl')));
    $api.html($api.byId('content'), contentTmpl({}));
    api.parseTapmode();
    api.hideProgress();
    common.post({
        //url:config.nursePlanUrl+"?patientId="+person.id+"&templateIdList=204&limit=-1",
        url:config.nursePlanUrl+"/listDetails/json",
        isLoading:true,
        data:JSON.stringify({
            patientId: person.id,
            homepageId: person.homepageId,
            limit: -1,
            templateList:[{"templateCode":"PICCpuncture","templateVersion":1}]
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
function getDayAll(datas){
    var dateAllMap = {};
    for (var i = 0; i < datas.length; i++) {
        dateAllMap[truncDate(datas[i].createTime)]=[];
    }
    return dateAllMap;
}
function truncDate(date) {
    return date.substr(0, 10);
}

function truncTime(date) {
    return date.substr(11, 5);
}
