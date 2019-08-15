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
  var bingName = $("#bingName").val(); //病情内容
  var mazui = $("#mazui").val(); //麻醉
  var tixing = $("#tixing").val();//提醒内容

  var hzqm = $("#hzqm").val(); //患者签名
  var qmrq = $("#qmrq").val(); //患者签名日期

  var hzsqqsqm = $("#hzsqqsqm").val(); //患者授权亲属签名
  var hzgx = $("#hzgx").val(); //与患者关系
  var qmrq2 = $("#qmrq2").val(); //授权亲属签名日期

  var hsqm = $("#hsqm").val(); //护士签名
  var hsqmrq = $("#hsqmrq").val(); //时间日期

  if( ($.trim(hzqm)!="" || $.trim(qmrq)!="") && ($.trim(hzsqqsqm)!="" || $.trim(hzgx)!="" || $.trim(qmrq2)!="") ){
    api.toast({
        msg: '患者和授权亲属签名不能同时填写',
        duration: config.duration,
        location: 'bottom'
    });
    return;
  }

  if( $.trim(hzqm)=="" && $.trim(qmrq)=="" && $.trim(hzsqqsqm)=="" && $.trim(hzgx)=="" && $.trim(qmrq2)=="" ){
    api.toast({
        msg: '请输入患者或患者授权亲属内容',
        duration: config.duration,
        location: 'bottom'
    });
    return;
  }

  if( $.trim(hzqm)=="" && $.trim(qmrq)!=""){
    api.toast({
        msg: '请输入患者签名',
        duration: config.duration,
        location: 'bottom'
    });
    return;
  }

  if( $.trim(hzqm)!="" && $.trim(qmrq)==""){
    api.toast({
        msg: '请输入患者签名日期',
        duration: config.duration,
        location: 'bottom'
    });
    return;
  }

  if( $.trim(hzsqqsqm)=="" && ( $.trim(hzgx)!="" || $.trim(qmrq2)!="") ){
    api.toast({
        msg: '请输入授权亲属签名',
        duration: config.duration,
        location: 'bottom'
    });
    return;
  }

  if( $.trim(hzgx)=="" && ( $.trim(hzsqqsqm)!="" || $.trim(qmrq2)!="") ){
    api.toast({
        msg: '请输入授权亲属关系',
        duration: config.duration,
        location: 'bottom'
    });
    return;
  }

  if( $.trim(qmrq2)=="" && ( $.trim(hzsqqsqm)!="" || $.trim(hzgx)!="") ){
    api.toast({
        msg: '请输入授权亲属签名日期',
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
  if( $.trim(hsqmrq)=="" ){
    api.toast({
        msg: '请输入护士签名日期',
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
        addMapIfNotNull(data,"bingName",bingName,true);
        addMapIfNotNull(data,"mazui",mazui,true);
        addMapIfNotNull(data,"tixing",tixing,true);
        addMapIfNotNull(data,"hzqm",hzqm,true);
        addMapIfNotNull(data,"qmrq",qmrq,true);
        addMapIfNotNull(data,"hzsqqsqm",hzsqqsqm,true);
        addMapIfNotNull(data,"hzgx",hzgx,true);
        addMapIfNotNull(data,"qmrq2",qmrq2,true);
        addMapIfNotNull(data,"hsqm",hsqm,true);
        addMapIfNotNull(data,"hsqmrq",hsqmrq,true);

        var params = {};
        var person = $api.getStorage(storageKey.currentPerson);
        params.medPatientId = person.id;
        params.name="肠胃减压知情通知书";
        params.medTemplateId= 203;
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
    //url:config.nursePlanUrl+"?patientId="+person.id+"&templateIdList=203&limit=-1",
    url:config.nursePlanUrl+"/listDetails",
    isLoading:true,
    data:JSON.stringify({
      patientId: person.id,
      limit: -1,
      templateList:[{"templateCode":"cwjyzqtzs","templateVersion":1}]
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
      name: 'win_wcjyzqtzs_detail',
      url: './win_wcjyzqtzs_detail.html',
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
        map["medTemplateItemId"]=203;
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
