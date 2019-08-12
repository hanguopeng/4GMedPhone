apiready = function(){
    api.parseTapmode();

    var tab = new auiTab({
        element:document.getElementById("tab"),
        index: 1,
        repeatClick:false
    },function(ret){
        $api.html($api.byId("content"),"");
        if(ret.index==1){
            showAdd();
        }else if(ret.index==2){
            showHis();
        }
    });
    showAdd();
};

function showAdd(){
    var person = $api.getStorage(storageKey.currentPerson);
    common.get({
        url: config.patientDetailUrl + patientId + '/' + person.homepageId,
        isLoading: true,
        success:function(ret){

            var userName = $api.getStorage(storageKey.userName)
            var contentTmpl = doT.template($api.text($api.byId('add-tpl')));
            $api.html($api.byId('content'), contentTmpl({person:ret.content,"currentTime":currentTime(),"currentDate":currentDate(),"userName":userName}));
            api.parseTapmode();
            var collapse = new auiCollapse({
                autoHide:false //是否自动隐藏已经展开的容器
            });
        }
    });
}

function saveAddRecord(){
    //var rzty = $api.byId('rzty').value; //入住同意
    //var gbty = $api.byId('gbty').value; //公布同意
    //var zyrq = $("#zyrq").val(); //入住日期

    var brhjsqm = $("#brhjsqm").val();//患者或家属签名
    //var dhhsj = $("#dhhsj").val(); //患者或家属电话或手机
    //var sjrq = $("#sjrq").val(); //患者或家属时间日期

    //var jjlxrqm = $("#jjlxrqm").val(); //紧急联系人签名
    var jjlxrgx = $("#jjlxrgx").val(); //关系
    //var jjlxrdhhsj = $("#jjlxrdhhsj").val(); //电话或手机
    //var jjlxrsjrq = $("#jjlxrsjrq").val(); //时间日期

    //var drjfee = $("#danrenjian").val();//单人间费用
    //var srjfee = $("#shuangrenjian").val();//双人间费用
    //var ptjfee = $("#putongjian").val();//普通间费用

    var hsqm = $("#hsqm").val(); //护士签名
    var hssjrq = $("#hssjrq").val(); //时间日期
    /*if( $.trim(djrfee)!=""||$.trim(srjfee)!=""||$.trim(ptjfee)!=""){
        api.toast({
            msg: '请输入床位费用',
            duration: config.duration,
            location: 'bottom'
        });
        return;
    }*/

    if( $.trim(brhjsqm)=="" ){
        api.toast({
            msg: '请输入患者或家属签名',
            duration: config.duration,
            location: 'bottom'
        });
        return;
    }

    if( $.trim(jjlxrgx)=="" ){
        api.toast({
            msg: '请输入与患者关系',
            duration: config.duration,
            location: 'bottom'
        });
        return;
    }

    if( $.trim(hsqm)=="" ){
        api.toast({
            msg: '请输入护士签名',
            duration: config.duration,
            location: 'bottom'
        });
        return;
    }
    if( $.trim(hssjrq)=="" ){
        api.toast({
            msg: '请输入护士签名的时间日期',
            duration: config.duration,
            location: 'bottom'
        });
        return;
    }

    //点击保存时，需提醒使用者，一经保存，不允许修改。请检查
    api.confirm({
        title: '提示',
        msg: '一经保存，不允许修改，确定保存吗？',
        buttons: ['确定', '取消']
    }, function(ret1, err){
        if(ret1.buttonIndex==1){
            var data = [];
            //addMapIfNotNull(data,"danrenjian",drjfee,true);
            //addMapIfNotNull(data,"shuangrenjian",srjfee,true);
            //addMapIfNotNull(data,"putongjian",ptjfee,true);
            //addMapIfNotNull(data,"rzty",rzty,true);
            //addMapIfNotNull(data,"gbty",gbty,true);
            //addMapIfNotNull(data,"zyrq",zyrq,true);
            addMapIfNotNull(data,"brhjsqm",brhjsqm,true);
            //addMapIfNotNull(data,"dhhsj",dhhsj,true);
            //addMapIfNotNull(data,"sjrq",sjrq,true);
            //addMapIfNotNull(data,"jjlxrqm",jjlxrqm,true);
            addMapIfNotNull(data,"jjlxrgx",jjlxrgx,true);
            //addMapIfNotNull(data,"jjlxrdhhsj",jjlxrdhhsj,true);
            //addMapIfNotNull(data,"jjlxrsjrq",jjlxrsjrq,true);
            addMapIfNotNull(data,"hsqm",hsqm,true);
            addMapIfNotNull(data,"hssjrq",hssjrq,true);

            var params = {};
            var person = $api.getStorage(storageKey.currentPerson);
            params.medPatientId = person.id;
            params.name="住院一般同意书";
            params.medTemplateId= 201;
            params.itemList=data;

            common.post({
                url:config.nursePlanUrl,
                isLoading:true,
                text:'保存数据...',
                data:JSON.stringify(params),
                success:function(r){
                    api.hideProgress();
                    api.alert({
                        title: '提示',
                        msg: '保存成功！',
                    }, function(ret, err){
                        showAdd();
                    });
                }
            });

        }
    });
}

//如果value不会空，则放入到map中
function addMapIfNotNull(arr,key,value,existsId){
    var map = {};
    if(value && key){
        map["key"]=key;
        map["value"]=value;
        if(existsId){
            map["medTemplateItemId"]=201;
        }
        arr.push(map);
    }
}

function openDetailWin(id){
    api.openWin({
        name: 'win_zygzs_detail',
        url: './win_zygzs_detail.html',
        pageParam: {
            data: id
        }
    });
}

function showHis(){
    var contentTmpl = doT.template($api.text($api.byId('his-tpl')));
    $api.html($api.byId('content'), contentTmpl({}));

    $api.html($api.byId("recordContent"),"");
    var person = $api.getStorage(storageKey.currentPerson);
    common.post({
        //url:config.nursePlanUrl+"?patientId="+person.id+"&templateIdList=201&limit=-1",
        url:config.nursePlanUrl+"/listDetails",
        isLoading:true,
        data:JSON.stringify({
            patientId: person.id,
            limit: -1,
            templateList:[{"templateCode":"zytys","templateVersion":1}]
        }),
        success:function(ret){
            if(ret.content && ret.content.list && ret.content.list.length>0){
                //处理数据
                var data = ret.content.list;
                //根据开始时间和结束时间构造一个以时间为key的数组对象
                timeMap=getDayAll(ret.content.list);
                //var timeMap = getDayAll(startDate,endDate);
                for (var i = 0; i < data.length; i++) {
                    timeMap[truncDate(data[i].createTime)].push(data[i])
                }
                var params = {};
                for (var key in timeMap) {
                    if(timeMap[key].length > 0){
                        params[key]=timeMap[key];
                    }
                }
                var contentTmpl = doT.template($api.text($api.byId('record-tpl')));
                $api.html($api.byId('recordContent'), contentTmpl(params));
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

function picker(el){
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

function search(){
    $api.html($api.byId("recordContent"),"");
    var dateRange = $api.val($api.byId("dateRange"));
    if(!dateRange){
        api.toast({
            msg: '请选择日期',
            duration: config.duration,
            location: 'bottom'
        });
        return;
    }
    var fields = dateRange.split("~");
    var startDate = fields[0];
    var endDate = fields[1];
    var person = $api.getStorage(storageKey.currentPerson);
    $api.html($api.byId("recordContent"),"");
    common.get({
        //url:config.nursePlanUrl+"?patientId="+person.id+"&templateIdList=201&limit=-1&beginTime="+startDate+" 00:00:00&endTime="+endDate+" 23:59:59",
        url:config.nursePlanUrl+"?patientId="+person.id+"&templateCode=zytys&templateVersion=1&limit=-1&beginTime="+startDate+" 00:00:00&endTime="+endDate+" 23:59:59",
        isLoading:true,
        success:function(ret){
            if(ret.content && ret.content.list && ret.content.list.length>0){
                //处理数据
                var data = ret.content.list;
                //根据开始时间和结束时间构造一个以时间为key的数组对象
                var timeMap = getDayAll(startDate,endDate);
                for (var i = 0; i < data.length; i++) {
                    timeMap[truncDate(data[i].createTime)].push(data[i])
                }
                var params = {};
                for (var key in timeMap) {
                    if(timeMap[key].length > 0){
                        params[key]=timeMap[key];
                    }
                }
                var contentTmpl = doT.template($api.text($api.byId('record-tpl')));
                $api.html($api.byId('recordContent'), contentTmpl(params));
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

function pickerDate(el){
    api.openPicker({
        type: 'date',
        title: '日期'
    }, function(ret, err){
        var startYear = ret.year;
        var startMonth = ret.month;
        var startDay = ret.day;
        var date = startYear + "-" + (startMonth<10? "0"+startMonth:startMonth) + "-" + (startDay<10?"0"+startDay:startDay);
        $api.val(el,date);
    });
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
    return year+"-"+month+"-"+day+" "+hour+":"+minute;
}

function currentDate(){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    if(month<10) month = "0"+month;
    if(day<10) day = "0"+day;
    return year+"-"+month+"-"+day;
}

function truncDate(date){
    return date.substr(0,10);
}

function truncTime(date){
    return date.substr(11,5);
}

function getDayAll(datas){
    var dateAllMap = {};
    for (var i = 0; i < datas.length; i++) {
        dateAllMap[truncDate(datas[i].createTime)]=[];
    }
    return dateAllMap;
}
