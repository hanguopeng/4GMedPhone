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
        url: config.patientDetailUrl+person.id,
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
    var zhiliaofangan = $("#zhiliaofangan").val(); //治疗

    var huanzheqianzi = $("#huanzheqianzi").val(); //患者签名
    //var createTime = $("#createTime").val(); //患者签名日期

    var huanzhejiashuqianzi = $("#huanzhejiashuqianzi").val(); //患者授权亲属签名
    var guanxi = $("#guanxi").val(); //与患者关系
    var jingzhiyisheng = $("#jingzhiyisheng").val(); //经治医生

    var createUserName = $("#createUserName").val(); //护士签名
    var handleTime = $("#handleTime").val(); //时间日期

    if( $.trim(huanzheqianzi)=="" ){
        api.toast({
            msg: '请输入患者签名',
            duration: config.duration,
            location: 'bottom'
        });
        return;
    }
    if( $.trim(zhiliaofangan)=="" ){
        api.toast({
            msg: '请输入治疗方案',
            duration: config.duration,
            location: 'bottom'
        });
        return;
    }
    if( $.trim(handleTime)=="" ){
        api.toast({
            msg: '请输入签名日期',
            duration: config.duration,
            location: 'bottom'
        });
        return;
    }
    if( $.trim(huanzhejiashuqianzi)=="" ){
        api.toast({
            msg: '请输入患者亲属签名',
            duration: config.duration,
            location: 'bottom'
        });
        return;
    }
    if( $.trim(guanxi)=="" ){
        api.toast({
            msg: '请输入患者亲属关系',
            duration: config.duration,
            location: 'bottom'
        });
        return;
    }
    if( $.trim(createUserName)=="" ){
        api.toast({
            msg: '请输入护士签名',
            duration: config.duration,
            location: 'bottom'
        });
        return;
    }
    if( $.trim(handleTime)=="" ){
        api.toast({
            msg: '请输入签名日期',
            duration: config.duration,
            location: 'bottom'
        });
        return;
    }
    if( $.trim(jingzhiyisheng)=="" ){
        api.toast({
            msg: '请输入经治医生',
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
            addMapIfNotNull(data,"createUserName",createUserName,true);
            addMapIfNotNull(data,"handleTime",handleTime,true);
            addMapIfNotNull(data,"jingzhiyisheng",jingzhiyisheng,true);
            addMapIfNotNull(data,"huanzheqianzi",huanzheqianzi,true);
            addMapIfNotNull(data,"guanxi",guanxi,true);
            addMapIfNotNull(data,"huanzhejiashuqianzi",huanzhejiashuqianzi,true);
            addMapIfNotNull(data,"zhiliaofangan",zhiliaofangan,true);

            var params = {};
            var person = $api.getStorage(storageKey.currentPerson);
            params.medPatientId = person.id;
            params.name="中心静脉导管拒绝置管知情同意书";
            params.medTemplateId= 221;
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

function showHis(){
    var contentTmpl = doT.template($api.text($api.byId('his-tpl')));
    $api.html($api.byId('content'), contentTmpl({}));

    $api.html($api.byId("recordContent"),"");
    var person = $api.getStorage(storageKey.currentPerson);
    common.post({
        //url:config.nursePlanUrl+"?patientId="+person.id+"&templateIdList=202&limit=-1",
        url:config.nursePlanUrl+"/listDetails",
        isLoading:true,
        data:JSON.stringify({
            patientId: person.id,
            limit: -1,
            templateList:[{"templateCode":"zxjmdgjjzgzqtys","templateVersion":1}]
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


function openDetailWin(id){
    api.openWin({
        name: 'win_jjzgtys_detail',
        url: './win_jjzgtys_detail.html',
        pageParam: {
            data: id
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
            map["medTemplateItemId"]=221;
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
            $api.val(el,date+" "+time);

            $(id).css("color","#ccc2c2");
            $(id).one("click",function(){
                $(el).val("");
                $(id).css("color","#ffffff");
            });
        });
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
