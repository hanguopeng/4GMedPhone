var re = /^[1-9]+[0-9]*]*$/;
var userName = $api.getStorage(storageKey.userName);
var currIdx =1;
apiready = function(){
    api.parseTapmode();


    /* //设置content的高度，设置会内部滚动
     var tabHeight = $api.byId("tab").offsetHeight;
     contentHeight = api.frameHeight-tabHeight;
     //console.log(tabHeight);
     //console.log(contentHeight);
     //height:300px;overflow-y:auto
     $("#content").css("height",contentHeight);
     $("#content").css("overflow-y","auto");*/
    search();

}



function showAllAdd(){
    var contentTmpl = doT.template($api.text($api.byId('all-tpl')));
    $api.html($api.byId('content'), contentTmpl({"userName":userName,"createDate":createDate()}));
    api.parseTapmode();
}

//历史展示
function showHis(){

    var contentTmpl = doT.template($api.text($api.byId('his-tpl')));
    $api.html($api.byId('content'), contentTmpl({}));
    api.parseTapmode();
    api.hideProgress();

}

//自定义内容
function addField(){
    $("#fieldAdd").after('<div class="custom-field"><li class="aui-list-item"><div class="aui-list-item-inner"><div class="aui-list-item-label" style="width: 40%;">内容</div><div class="aui-list-item-input"><select class="custom-key"><option value="切口敷料">切口敷料</option><option value="切口疼痛">切口疼痛</option><option value="腹胀">腹胀</option><option value="留置X管">留置X管</option><option value="XX引流球">XX引流球</option><option value="XX引流管">XX引流管</option><option value="XX引流液">XX引流液</option><option value="XX液颜色">XX液颜色</option><option value="体位">体位</option><option value="呼吸困难">呼吸困难</option><option value="心电监护">心电监护</option><option value="镇痛泵">镇痛泵</option><option value="吸氧（L/min）">吸氧（L/min）</option><option value="石膏固定">石膏固定</option><option value="皮牵引">皮牵引</option><option value="肛门排气">肛门排气</option><option value="水肿">水肿</option><option value="声嘶">声嘶</option><option value="恶心">恶心</option><option value="呕吐">呕吐</option><option value="阴囊肿胀">阴囊肿胀</option><option value="尿急">尿急</option><option value="尿频">尿频</option><option value="尿痛">尿痛</option><option value="鼻塞">鼻塞</option><option value="流涕">流涕</option><option value="耳鸣">耳鸣</option><option value="耳闷">耳闷</option><option value="听力下降">听力下降</option><option value="碎石排出">碎石排出</option></select></div><div class="aui-col-xs-4 aui-padded-r-15"><i class="aui-iconfont aui-icon-minus aui-pull-right" style="line-height: 2.2rem;" tapmode onclick="delField(this);"></i></div></div></li><li class="aui-list-item"><div class="aui-list-item-inner"><div class="aui-list-item-label" style="width: 40%;">值</div><div class="aui-list-item-input aui-row"><div class="aui-col-xs-8"><select class="custom-val"><option value="√">√</option><option value="有">有</option><option value="无">无</option><option value="偶有">偶有</option><option value="停">停</option><option value="干洁">干洁</option><option value="少许">少许</option><option value="轻度">轻度</option><option value="中度">中度</option><option value="重度">重度</option><option value="少量">少量</option><option value="固定通畅">固定通畅</option><option value="拔管">拔管</option><option value="剪断夹管">剪断夹管</option><option value="定时开放">定时开放</option><option value="鼻导管">鼻导管</option><option value="面罩">面罩</option><option value="鲜红">鲜红</option><option value="淡红">淡红</option><option value="暗红">暗红</option><option value="淡黄色">淡黄色</option><option value="去枕平卧">去枕平卧</option><option value="平卧位">平卧位</option><option value="半卧位">半卧位</option></select></div></div></li></div>');
    api.parseTapmode();
}

//删除自定义字段
function delField(el){
    var cur = $api.closest(el, 'li');
    $api.remove(cur.nextElementSibling);
    $api.remove(cur);
}

function currentDate(){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    if(month<10) month = "0"+month;
    if(day<10) day = "0"+day;
    return year+"-"+month+"-"+day;
}

function createDate(){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    if(month<10) month = "0"+month;
    if(day<10) day = "0"+day;
    return year+"-"+month+"-"+day+" "+hour+":"+minute;
}

function currentTime(){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    if(month<10) month = "0"+month;
    if(day<10) day = "0"+day;
    return year+"-"+month+"-"+day+"T"+hour+":"+minute;
}

function nextTime(){
    var curDate = new Date();
    var date = new Date(curDate.getTime() + 24*60*60*1000);
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    if(month<10) month = "0"+month;
    if(day<10) day = "0"+day;
    return year+"-"+month+"-"+day+"T"+hour+":"+minute;
}

function changeType(){
    var typeVal = $api.byId('type').value;
    if(typeVal==="引流量" || typeVal==="尿量"){
        $api.attr($api.byId("input"), 'placeholder', '');
        $api.val($api.byId("input"),"");
        $api.attr($api.byId("input"), 'disabled', 'disabled');
    }else{
        $api.attr($api.byId("input"), 'placeholder', '请输入内容');
        $api.removeAttr($api.byId("input"), 'disabled');
    }
}


//全量保存
function saveAllRecord(){
    //上传的数据集合
    var data = [];

    var TWval = $("#TWval").val();
    var HXval = $("#HXval").val();
    var MBval = $("#MBval").val();
    var XYval = $("#XYval").val();
    var RLval = $("#RLval").val();
    var RLnum = $("#RLnum").val();
    var CLval = $("#CLval").val();
    var CLnum = $("#CLnum").val();

    var createDate = $("#createDate").val(); //页面当前的时间


    addMapIfNotNull(data,"TWval",TWval,true);
    addMapIfNotNull(data,"HXval",HXval,true);
    addMapIfNotNull(data,"MBval",MBval,true);
    addMapIfNotNull(data,"RLval",RLval,true);
    addMapIfNotNull(data,"XYval",XYval,true);
    addMapIfNotNull(data,"RLnum",RLnum,true);
    addMapIfNotNull(data,"CLval",CLval,true);
    addMapIfNotNull(data,"CLnum",CLnum,true);
    /*addMapIfNotNull(data,"dateStr",createDate.substr(0,10),true);
    addMapIfNotNull(data,"timeStr",createDate.substr(11),true);*/
    addMapIfNotNull(data,"qianming",$("#creator").text(),true); //创建人

    var params = {};
    var person = $api.getStorage(storageKey.currentPerson);
    params.medPatientId = person.id;
    params.medTemplateId= 6;
    params.handleTime= createDate + ":00" ;
    params.itemList=data;

    api.confirm({
        title: '提示',
        msg: '确定保存吗？',
        buttons: ['确定', '取消']
    }, function(ret, err) {
        if(ret.buttonIndex==1){
            common.post({
                url: config.nurseLogCreate,
                isLoading:true,
                text:"正在保存...",
                data:JSON.stringify(params),
                success:function(ret){
                    api.hideProgress();
                    api.alert({
                        title: '提示',
                        msg: '保存成功！',
                    }, function(ret, err){
                        showAllAdd();
                    });
                }
            });

        }
    });
}

function checkNull(val,msg){
    if(!val){
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
function addMapIfNotNull(arr,key,value,existsId){
    var map = {};
    if(value && key){
        map["key"]=key;
        map["value"]=value;
        if(existsId){
            map["medTemplateItemId"]=6;
        }
        arr.push(map);
    }
}

function openDetailWin(el){
    var data = JSON.parse($(el).find(".json-span").first().text());
    api.openWin({
        name: 'win_hljld_detail',
        url: './win_hljld_detail.html',
        pageParam: {
            data: data
        }
    });

}

//打开日期选择
function picker(){
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

function search(){
    var person = $api.getStorage(storageKey.currentPerson);
    $api.html($api.byId("tbody"),"");
    common.get({
        url:config.nurseSMTZhljld + "?registerNumber="+person.registerNumber,
        isLoading:true,
        success:function(ret){
            //alert(JSON.stringify(ret.content.list))
            if(ret&&ret.content&&ret.content.list){
                //处理数据
                var data = ret.content.list;
                var contentTmpl = doT.template($api.text($api.byId('content-tmpl')));
                $api.html($api.byId('tbody'), contentTmpl(data));
                api.parseTapmode();
                api.hideProgress();
            }else{
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

function getDayAll(begin,end){
    var dateAllMap = {};
    var ab = begin.split("-");
    var ae = end.split("-");
    var db = new Date();
    db.setUTCFullYear(ab[0], ab[1]-1, ab[2]);
    var de = new Date();
    de.setUTCFullYear(ae[0], ae[1]-1, ae[2]);
    var unixDb=db.getTime();
    var unixDe=de.getTime();
    for(var k=unixDb;k<=unixDe;){
        var date = new Date(k);
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var tmp =  date.getFullYear() + '-' + (month<10?("0"+month):month) + '-' + (day<10?("0"+day):day);
        dateAllMap[tmp]=[];
        k=k+24*60*60*1000;
    }
    return dateAllMap;
}

function truncDate(date){
    return date.substr(0,10);
}

function truncTime(date){
    return date.substr(11,5);
}
