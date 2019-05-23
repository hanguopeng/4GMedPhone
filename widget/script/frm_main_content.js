var persons = [];
var areaId;


apiready = function() {
  api.parseTapmode();
  areaId = api.pageParam.areaId;
  searchPersons();
  addInpatientAreaChangedListener();
  addScanSuccessListener();

    cmcScan = api.require('cmcScan');
    cmcScan.open();

    //页面的按钮和物理按钮统一使用该事件监听，如果ret.status=1表示识别成功,ret.value为识别的内容
    //如果ret.status=0表示识别失败
    api.addEventListener({
        name: 'scanEvent'
    }, function(ret, err) {
        if (ret) {
            var rval = ret.value;
            if(rval.status == 1){
                var personIndex = Number($api.getStorage(storageKey.currentIdx));

            }else{

            }
        } else {
            alert(JSON.stringify(err));
        }
    });
  //下拉刷新
  api.setRefreshHeaderInfo({
     visible: true,
     bgColor: 'rgba(0,0,0,0)',
     textColor: '#666',
     textDown: '下拉刷新',
     textUp: '释放刷新',
     showTime: false
  }, function(ret, err){
     refresh();
  });
};
function startScan(){
    //这里和之前的不一样
    cmcScan.start();
}

function stopScan(){
    cmcScan.stop();
}

/*
 * 根据条件查询所有病人信息
 */
function searchPersons(){
  $api.html($api.byId('nurseLevelContent'), "");
  $api.html($api.byId('personContent'), "");

  $api.rmStorage(storageKey.currentPerson);
  $api.rmStorage(storageKey.currentIdx);
  $api.rmStorage(storageKey.lastIdx);
  $api.rmStorage(storageKey.persons);

  var medBedCode = $api.trim($api.val($api.byId("medBedCode")));
  var patientFlag = $api.byId("patientFlag").checked;
  var chooseType = $api.byId('chooseType').value;

  chooseQuery="";
    if(chooseType == "-1"){
        chooseQuery = "";
    }
    if(chooseType == "0"){
        chooseQuery = "&outHspitalFlag=true";
    }
    if(chooseType == "1"){
        chooseQuery = "&highRiskFlag=true";
    }
    if(chooseType == "2"){
        chooseQuery = "&operationFlag=true";
    }


  var requestUrl = config.patientSearchUrl+"?inpatientArea="+areaId+"&medBedCode="+medBedCode+"&myPatientFlag="+patientFlag+"&operatorId="+$api.getStorage(storageKey.userId)+chooseQuery;
    //alert("url= "+requestUrl)
  common.get({
    url:requestUrl,
    isLoading:true,
    success:function(ret){

      //动态添加病人信息
      if(ret.content && ret.content.list && ret.content.list.length>0){
        //var levelInfo = doT.template($api.text($api.byId('nurse-level-tpl')));
        var personInfo = doT.template($api.text($api.byId('person-info-tpl')));
        //alert(JSON.stringify(ret));
        //$api.html($api.byId('nurseLevelContent'), levelInfo(ret.content));
        var params = ret.content;
        params._listCount = ret.content.list.length;
        $api.html($api.byId('personContent'), personInfo(params));
        //存储persons
        persons = ret.content.list;
        $api.setStorage(storageKey.persons, persons);
        api.hideProgress();
      }else if(ret.content && ret.content.list && ret.content.list.length==0){
        api.hideProgress();
        api.toast({
          msg : '无患者'
        });
      }
    }
  });
}


/**
 * 添加病区修改监听器，当header上面的下拉框修改之后，重新进行查询
 */
function addInpatientAreaChangedListener(){
  api.addEventListener({
      name: eventName.InpatientAreaChanged
  }, function(ret, err) {
      areaId=ret.value.areaId;
      searchPersons();
  });
}

function addScanSuccessListener(){
  api.addEventListener({
      name: "scanSuccess"
  }, function(ret, err) {
      var personIdx=ret.value.index;
      openPersonCenter(personIdx);
  });
}



/**
 * 重置查询条件，查询病人信息
 */
function refresh(){
  //设置所有选项为初始值
  $api.val($api.byId("doctorName"),"");
  $api.val($api.byId("nurseName"),"");
  $api.byId("emptyBed").checked = false;
  $api.dom("input[name='patientFlag'][value='0']").checked=true;
  searchPersons();
}


//下拉刷新
function refresh(){
  api.refreshHeaderLoadDone(); //复位下拉刷新
  $api.byId("patientFlag").checked = false;
  $api.byId('chooseType').value=-1;
  $api.val($api.byId("medBedCode"),"");
  searchPersons();
}

//点击病人卡进入到病人详细信息页面
function openPersonCenter(idx){
  //console.log("idx="+ ( typeof idx) + " " + idx);
  var allPersons = $api.getStorage(storageKey.persons);
  var person = allPersons[idx];
  $api.setStorage(storageKey.currentPerson, person);
  $api.setStorage(storageKey.currentIdx, idx); //左右箭头的时候需要
  $api.setStorage(storageKey.lastIdx, allPersons.length-1); //设置最后一个索引的大小，length-1

  api.openWin({
      name: "win_person_center",
      bounces: false,
      slidBackEnabled : false,
      reload:true,
      url: '../html/win_person_center.html',
      vScrollBarEnabled:true,
      hScrollBarEnabled:false
  });
}
