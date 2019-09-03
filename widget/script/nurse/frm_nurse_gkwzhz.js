var person = $api.getStorage(storageKey.currentPerson);
var personInfo = null;
var patientId = person.id;
apiready = function () {
    api.parseTapmode();

    //定义点击tab切换本地和云端音频
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
    // common.get({
    //     url: config.patientDetailUrl + patientId + '/' + person.homepageId,
    //     isLoading: true,
    //     success: function (ret) {
    //         alert(JSON.stringify(ret))
    //         ret.content.pgrq = currentTime();
    //         var storageUserName = $api.getStorage(storageKey.userName);
    //         ret.content.pgr = storageUserName;
    //
    //         personInfo = ret.content;
    //         personInfo.currentTime = currentTime();
    //         $api.html($api.byId('content'), "");
    //         var contentTmpl = doT.template($api.text($api.byId('add-tpl')));
    //         $api.html($api.byId('content'), contentTmpl(personInfo));
    //
    //     }
    // });
    person.pgrq = currentTime();
    var storageUserName = $api.getStorage(storageKey.userName);
    person.pgr = storageUserName;

    person.currentTime = currentTime();
    $api.html($api.byId('content'), "");
    var contentTmpl = doT.template($api.text($api.byId('add-tpl')));
    $api.html($api.byId('content'), contentTmpl(person));

    api.parseTapmode();
}

//历史展示
function showHis() {

    var contentTmpl = doT.template($api.text($api.byId('his-tpl')));
    $api.html($api.byId('content'), contentTmpl({}));
    search()
    api.parseTapmode();
    api.hideProgress();

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

function createDate() {
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

function nextTime() {
    var curDate = new Date();
    var date = new Date(curDate.getTime() + 24 * 60 * 60 * 1000);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    return year + "-" + month + "-" + day + "T" + hour + ":" + minute;
}


function saveAddRecord() {
    //上传的数据集合
    var data = [];

    var medBedName = $("input[name='medBedName']").val();
    var name = $("input[name='name']").val();
    var sexName = $("input[name='sexName']").val();
    var registerNumber = $("input[name='registerNumber']").val();
    var inHospitalTime = $("input[name='inHospitalTime']").val();
    var createTime = $("input[name='createTime']").val();
    var tiwen = $("input[name='temperature']").val();
    var maibo = $("input[name='pulse']").val();//脉搏
    var huxi = $("input[name='breath']").val();
    var xueya = $("input[name='bloodpressure']").val();
    var xueyangbaohedu = $("input[name='ogen']").val();//血氧饱和度
    var xiyang = $("input[name='inputogen']").val();//吸氧
    var ruliangmingcheng = $("select[name='RLMCval']").val();
    var ruliangml = $("input[name='RLRLval']").val();
    var chuliangmingcheng = $("select[name='CHMCval']").val();
    var chuliangml = $("input[name='CLRLval']").val();

    var yansexingzhuang = $("select[name='YSXZval']").val();

    var yishi = "";
    var dxysArr = $("input[name='dx-ys']");
    for(var i=0;i<dxysArr.length;i++){
        if(dxysArr[i].checked){

            yishi += dxysArr[i].value+",";
        }
    }

    var daoguanhuli = "";
    var dxdghlArr = $("input[name='dx-dghl']");
    var qgqkmjz = $("select[name='qgqkmjz']").val();

    for(var i=0;i<dxdghlArr.length;i++){
        if(dxdghlArr[i].checked){

            if("气管切开"==dxdghlArr[i].value){
             daoguanhuli += dxdghlArr[i].value+"("+qgqkmjz+")"+",";
            }else {

                daoguanhuli += dxdghlArr[i].value+",";
            }
        }

    }

    //var CLRLval = $("input[name='CLRLval']").val();
    var yinshi = "";
    var dxswArr = $("input[name='dx-sw']");//饮食
    for(var i=0;i<dxswArr.length;i++){
        if(dxswArr[i].checked){

            yinshi += dxswArr[i].value+",";
        }
    }
    var jiankangzhidao = "";
    var dxjkzdArr = $("input[name='dx-jkzd']");//健康指导
    for(var i=0;i<dxjkzdArr.length;i++){
        if(dxjkzdArr[i].checked){

            jiankangzhidao += dxjkzdArr[i].value+",";
        }
    }
    var bingqingguancha ="";
    var dxbqgcArr = $("input[name='dx-bqgc']");//病情观察
    var sctksel = $("select[name='sctksel']").val();//双侧瞳孔
    var dkdgfs = $("select[name='dkdgfs']").val();//瞳孔对光发散
    var czthdza = $("select[name='czthdza']").val();//语言
    var hzhz = $("select[name='hzhz']").val();//患肢
    var hzfw = $("select[name='hzfw']").val();//患肢皮温
    var jljl = $("select[name='jljl']").val();//肌力

    for(var i=0;i<dxbqgcArr.length;i++){
        if(dxbqgcArr[i].checked){
            if("双侧瞳孔"==dxbqgcArr[i].value){
                bingqingguancha += dxbqgcArr[i].value+"("+sctksel+")"+",";
            }else if("瞳孔对光发散"==dxbqgcArr[i].value){
                bingqingguancha += dxbqgcArr[i].value+"("+dkdgfs+")"+",";
            }else if("语言"==dxbqgcArr[i].value){
                bingqingguancha += dxbqgcArr[i].value+"("+czthdza+")"+",";
            }else if("患肢"==dxbqgcArr[i].value){
                bingqingguancha += dxbqgcArr[i].value+"("+hzhz+")"+",";
            }else if("患肢皮温"==dxbqgcArr[i].value){
                bingqingguancha += dxbqgcArr[i].value+"("+hzfw+")"+",";
            }else if("肌力"==dxbqgcArr[i].value){
                bingqingguancha += dxbqgcArr[i].value+"("+jljl+")"+",";
            }else{

                bingqingguancha += dxbqgcArr[i].value+",";

            }
        }

    }
    var hulicuoshi = "";
    var wljw = $("select[name='wljw']").val();
    var dxhlcsArr = $("input[name='dx-hlcs']");
    for(var i=0;i<dxhlcsArr.length;i++){
        if(dxhlcsArr[i].checked){
            if("物理降温"==dxhlcsArr[i].value){
                hulicuoshi += dxhlcsArr[i].value +"(" + wljw + ")" + ",";
            }else{

                hulicuoshi += dxhlcsArr[i].value + ",";
            }
        }

    }
    var hushiqianming = $("input[name='userName']").val();


    /*addMapIfNotNull(data, "medBedName", medBedName, true);

    addMapIfNotNull(data, "name", name, true);
    addMapIfNotNull(data, "sexName", sexName, true);
    addMapIfNotNull(data, "registerNumber", registerNumber, true);
    addMapIfNotNull(data, "inHospitalTime", inHospitalTime, true);
    addMapIfNotNull(data, "createTime", createTime, true);
    addMapIfNotNull(data, "tiwen", tiwen, true);
    addMapIfNotNull(data, "maibo", maibo, true);
    addMapIfNotNull(data, "huxi", huxi, true);
    addMapIfNotNull(data, "xueya", xueya, true);
    addMapIfNotNull(data, "xueyangbaohedu", xueyangbaohedu, true);
    addMapIfNotNull(data, "xiyang", xiyang, true);
    addMapIfNotNull(data, "ruliangmingcheng", ruliangmingcheng, true);
    addMapIfNotNull(data, "ruliangml", ruliangml, true);
    addMapIfNotNull(data, "chuliangmingcheng", chuliangmingcheng, true);

    addMapIfNotNull(data, "chuliangml", chuliangml, true);
    addMapIfNotNull(data, "yansexingzhuang", yansexingzhuang, true);
    addMapIfNotNull(data, "yishi", yishi, true);

    addMapIfNotNull(data, "daoguanhuli", daoguanhuli, true);

    addMapIfNotNull(data, "yinshi", yinshi, true);
    addMapIfNotNull(data, "jiankangzhidao", jiankangzhidao, true);
    addMapIfNotNull(data, "bingqingguancha", bingqingguancha, true);
    addMapIfNotNull(data, "hulicuoshi", hulicuoshi, true);
    addMapIfNotNull(data, "hushiqianming", hushiqianming, true);*/


    var params = {};
    var person = $api.getStorage(storageKey.currentPerson);
    params.hushiqianming = hushiqianming;
    params.hulicuoshi = hulicuoshi;
    params.bingqingguancha = bingqingguancha;
    params.jiankangzhidao = jiankangzhidao;
    params.yinshi = yinshi;
    params.daoguanhuli = daoguanhuli;
    params.yishi = yishi;
    params.yansexingzhuang = yansexingzhuang;
    params.chuliangml = chuliangml;
    params.ruliangml = ruliangml;
    params.ruliangmingcheng = ruliangmingcheng;
    params.chuliangmingcheng = chuliangmingcheng;
    params.xueyangbaohedu = xueyangbaohedu;
    params.xiyang = xiyang;
    params.huxi = huxi;
    params.xueya = xueya;
    params.createTime = createTime;
    params.tiwen = tiwen;
    params.maibo = maibo;
    params.medBedName = medBedName;
    params.name = name;
    params.sexName = sexName;
    params.registerNumber = registerNumber;
    params.inHospitalTime = inHospitalTime;
    params.medPatientId = person.id;
    params.homepageId = person.homepageId;
    params.medTemplateId = 225;
    params.name = "骨科危重患者护理记录单";
    params.itemList = data;
    params.measureDate= currentTime()+":00";
    api.confirm({
        title: '提示',
        msg: '确定保存吗？',
        buttons: ['确定', '取消']
    }, function (ret, err) {
        if (ret.buttonIndex == 1) {
            common.post({
                url: config.nurseBloodSugar,
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
            map["medTemplateItemId"] = 225;
        }
        arr.push(map);
    }
}

function openDetailWin(el) {
    var data = JSON.parse($(el).find(".json-span").first().text());
    api.openWin({
        name: 'win_nurse_gk_wzhzhljld_detail',
        url: './win_nurse_gk_wzhzhljld_detail.html',
        pageParam: {
            data: data
        }
    });

}

function chooseDate(){
    api.openPicker({
        type: 'date',
        title: '开始时间'
    }, function (ret, err) {
        var startYear = ret.year;
        var startMonth = ret.month;
        var startDay = ret.day;
        var startDate = startYear + "-" + (startMonth < 10 ? "0" + startMonth : startMonth) + "-" + (startDay < 10 ? "0" + startDay : startDay);
        $api.val($api.byId("explainTime"), startDate);
    });
}

function chooseDateTime(){
    api.openPicker({
        type: 'date',
        title: '开始时间'
    }, function (ret, err) {
        var startYear = ret.year;
        var startMonth = ret.month;
        var startDay = ret.day;
        var startDate = startYear + "-" + (startMonth < 10 ? "0" + startMonth : startMonth) + "-" + (startDay < 10 ? "0" + startDay : startDay);
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
            $api.val($api.byId("explainTimeBottom"), startDate+" "+time);
        });

    });
}

//打开日期选择
function picker() {
    api.openPicker({
        type: 'date',
        title: '开始时间'
    }, function (ret, err) {
        var startYear = ret.year;
        var startMonth = ret.month;
        var startDay = ret.day;
        var startDate = startYear + "-" + (startMonth < 10 ? "0" + startMonth : startMonth) + "-" + (startDay < 10 ? "0" + startDay : startDay);
        api.openPicker({
            type: 'date',
            title: '结束时间'
        }, function (ret1, err1) {
            var endYear = ret1.year;
            var endMonth = ret1.month;
            var endDay = ret1.day;
            var endDate = endYear + "-" + (endMonth < 10 ? "0" + endMonth : endMonth) + "-" + (endDay < 10 ? "0" + endDay : endDay);
            $api.val($api.byId("dateRange"), startDate + "~" + endDate);
        });
    });
}

function pickerTime(el,id){
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
            $api.val(el,date+" "+time);

            $(id).css("color","#ccc2c2");
            $(id).one("click",function(){
                $(el).val("");
                $(id).css("color","#ffffff");
            });
        });
    });
}

//打开日期选择
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

function search() {

    var person = $api.getStorage(storageKey.currentPerson);
    $api.html($api.byId("recordContent"), "");
    common.post({
        url: config.nurseLogNew,
        isLoading: true,
        data: JSON.stringify({
            patientId: person.id,
            homepageId: person.homepageId,
            templateList: [{
                templateCode: 'gkwzhzhljld',
                templateVersion: '1'
            }],
            limit: -1,
        }),
        success: function (ret) {
            if (ret.content.list) {
                //处理数据
                var data = ret.content.list;
                var contentTmpl = doT.template($api.text($api.byId('record-tpl')));
                if (data[0].id){
                    $api.html($api.byId('recordContent'), contentTmpl(data));
                } else{
                    $api.html($api.byId('recordContent'), contentTmpl(""));
                }
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
function QGQKselect(ele){
    var sctksel = $api.next(ele);
    if(ele.checked){

        $api.removeCls(sctksel, 'hide');
    }else{
        $api.addCls(sctksel, 'hide');
    }
}

function getDayAll(begin, end) {
    var dateAllMap = {};
    var ab = begin.split("-");
    var ae = end.split("-");
    var db = new Date();
    db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
    var de = new Date();
    de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
    var unixDb = db.getTime();
    var unixDe = de.getTime();
    for (var k = unixDb; k <= unixDe;) {
        var date = new Date(k);
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var tmp = date.getFullYear() + '-' + (month < 10 ? ("0" + month) : month) + '-' + (day < 10 ? ("0" + day) : day);
        dateAllMap[tmp] = [];
        k = k + 24 * 60 * 60 * 1000;
    }
    return dateAllMap;
}

function truncDate(date) {
    return date.substr(0, 10);
}

function truncTime(date) {
    return date.substr(11, 5);
}
