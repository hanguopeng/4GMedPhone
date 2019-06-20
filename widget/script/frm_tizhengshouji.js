var page=1;
var limit=10;
var currIdx = 1;
var re = /^[1-9]+[0-9]*]*$/;
var double = /^[0-9]+\.?[0-9]*$/;
apiready = function(){
    api.parseTapmode();

    //定义点击tab
    var tab = new auiTab({
        element:document.getElementById("tab"),
        index: 1,
        repeatClick:false
    },function(ret){
        if(ret.index==1){
          //体征采集
          initPager();
          currIdx = 1;
          showTZCJ();
        }else if(ret.index==2){
          //历史记录
          initPager();
          currIdx = 2;
          showHis();
        }else if(ret.index==3){
          currIdx = 3;
          showChart();
        }
    });

    //设置content的高度，设置会内部滚动
    var tabHeight = $api.byId("tab").offsetHeight;
    contentHeight = api.frameHeight-tabHeight;
    $("#content").css("height",contentHeight);
    $("#content").css("overflow-y","auto");


    showTZCJ();

    //上拉加载更多
    api.addEventListener({name:'scrolltobottom',extra:{threshold:0}}, function(ret, err){
        loadMore();
    });
}

//每个tab页面点击之后会进行的初始化
function initPager(){
  page=1;
  limit=20;
}

//显示体征采集页面
function showTZCJ(){
  $api.html($api.byId('content'), "");
  var contentTmpl = doT.template($api.text($api.byId('tzRecord-tpl')));
  $api.html($api.byId('content'), contentTmpl({"currentDate":currentDate()}));
  api.parseTapmode();
}

//保存体征采集
function saveTZ(){
  //校验时间已经填写，并且是正确格式
  var currentTime = $("#currentTime").val();
  if(! currentTime){
    api.toast({
        msg: '请输入创建时间',
        duration: config.duration,
        location: 'bottom'
    });
    return;
  }
  if(!testTime(currentTime)){
    api.toast({
        msg: '创建时间格式不正确',
        duration: config.duration,
        location: 'bottom'
    });
    return;
  }
  //读取其它的字段，只要有一个字段不为空，则可以进行保存
  var currentDate = $("#currentDate").val();
  //温度的key
  var tempKey = $api.byId('tempKey').value;
  //温度的值
  var tempVal = Number($("#temp-sw").val()+"."+$("#temp-fw").val());
  // 脉搏的key
  var pulseKey = $("#pulseKey").val();
  // 脉搏得值
  var pulse = $("#pulse").val();
  // 心率的值
  var heartRate = $("#heartRate").val();
  // 呼吸
  var breathRate = $("#breathRate").val();
  // 高压
  var bloodPressureHigh = $("#bloodPressureHigh").val();
  // 低压
  var bloodPressureLow = $("#bloodPressureLow").val();
  // 痛感强度
  var painIntensity = $("#painIntensity").val();
  // 大便次数
  var shitTime = $("#shitTime").val();
  // 小便次数
  var urineTime = $("#urineTime").val();
  // 体重
  var weight = $("#weight").val();
  // 身高
  var height = $("#height").val();
  // 总入量
  var totalInput = $("#totalInput").val();
  // 总出量
  var totalOutput = $("#totalOutput").val();
  // 入量内容
  var input = $("#input").val();
  // 入量值
  var inputMl = $("#inputMl").val();
  // 出量内容
  var output = $("#output").val();
  // 出量值
  var outputMl = $("#outputMl").val();
  // 尿量
  var upd = $("#upd").val();

  if (!re.test(pulse)&&pulse!=0&&pulse!=null)
  {
    api.toast({
        msg: '脉搏只能为整数',
        duration: config.duration,
        location: 'bottom'
    });
    return;
  }
  if (!re.test(heartRate)&&heartRate!=0)
  {
    api.toast({
      msg: '心率只能为整数',
      duration: config.duration,
      location: 'bottom'
    });
    return;
  }
  if (!re.test(breathRate)&&breathRate!=0)
  {
    api.toast({
        msg: '呼吸只能为整数',
        duration: config.duration,
        location: 'bottom'
    });
    return;
  }
  if (!re.test(bloodPressureHigh)&&bloodPressureHigh!=0)
  {
    api.toast({
        msg: '高压只能为整数',
        duration: config.duration,
        location: 'bottom'
    });
    return;
  }
  if (!re.test(bloodPressureLow)&&bloodPressureLow!=0)
  {
    api.toast({
        msg: '低压只能为整数',
        duration: config.duration,
        location: 'bottom'
    });
    return;
  }
  if (!re.test(painIntensity)&&painIntensity!=0)
  {
    api.toast({
      msg: '痛感强度只能为整数',
      duration: config.duration,
      location: 'bottom'
    });
    return;
  }
  if (!re.test(shitTime)&&shitTime!=0)
  {
    api.toast({
      msg: '大便次数只能为整数',
      duration: config.duration,
      location: 'bottom'
    });
    return;
  }
  if (!re.test(urineTime)&&urineTime!=0)
  {
    api.toast({
      msg: '小便次数只能为整数',
      duration: config.duration,
      location: 'bottom'
    });
    return;
  }
  if (!double.test(weight)&&weight!=0)
  {
    api.toast({
        msg: '体重只能为数字',
        duration: config.duration,
        location: 'bottom'
    });
    return;
  }
  if (!double.test(height)&&height!=0)
  {
    api.toast({
      msg: '身高只能为数字',
      duration: config.duration,
      location: 'bottom'
    });
    return;
  }
  if (!re.test(totalInput)&&totalInput!=0)
  {
    api.toast({
        msg: '总入量只能为整数',
        duration: config.duration,
        location: 'bottom'
    });
    return;
  }
  if (!re.test(totalOutput)&&totalOutput!=0)
  {
    api.toast({
        msg: '总出量只能为整数',
        duration: config.duration,
        location: 'bottom'
    });
    return;
  }
  if (!re.test(inputMl)&&inputMl!=0)
  {
    api.toast({
      msg: '入量只能为整数',
      duration: config.duration,
      location: 'bottom'
    });
    return;
  }
  if (!re.test(outputMl)&&outputMl!=0)
  {
    api.toast({
      msg: '出量只能为整数',
      duration: config.duration,
      location: 'bottom'
    });
    return;
  }
  if (!re.test(upd)&&upd!=0&&upd!=0)
  {
    api.toast({
        msg: '尿量只能为整数',
        duration: config.duration,
        location: 'bottom'
    });
    return;
  }

  var data = [];
  addMapIfNotNull(data,"currentDate",currentDate,true);
  addMapIfNotNull(data,"currentTime",currentTime,true);
  addMapIfNotNull(data,tempKey,tempVal,true);
  addMapIfNotNull(data,pulseKey,pulse,true);
  addMapIfNotNull(data,"heartRate",heartRate,true);
  addMapIfNotNull(data,"breathRate",breathRate,true);
  addMapIfNotNull(data,"bloodPressureHigh",bloodPressureHigh,true);
  addMapIfNotNull(data,"bloodPressureLow",bloodPressureLow,true);
  addMapIfNotNull(data,"painIntensity",painIntensity,true);
  addMapIfNotNull(data,"shitTime",shitTime,true);
  addMapIfNotNull(data,"urineTime",urineTime,true);
  addMapIfNotNull(data,"weight",weight,true);
  addMapIfNotNull(data,"height",height,true);
  addMapIfNotNull(data,"totalInput",totalInput,true);
  addMapIfNotNull(data,"totalOutput",totalOutput,true);
  if (inputMl!=null&&inputMl!='' && inputMl>=0){
    addMapIfNotNull(data,"input",input,true);
    addMapIfNotNull(data,"inputMl",inputMl,true);
  }
  if (outputMl!=null&&outputMl!=''&& outputMl>=0){
    addMapIfNotNull(data,"output",output,true);
    addMapIfNotNull(data,"outputMl",outputMl,true);
  }
  addMapIfNotNull(data,"upd",upd,true);

  // 下面这段不知道是干什么的
  var flag = false;
  $(".custom-field").each(function(index,item){
    var key = $(item).find(".custom-key").val();
    var val = $(item).find(".custom-val").val();
    addMapIfNotNull(data,key,val,true);
  });
  if(flag){
    return;
  }

  if(data.length <= 0){
    api.toast({
        msg: '请输入指标值',
        duration: config.duration,
        location: 'bottom'
    });
    return;
  }

  var params = {};
  var person = $api.getStorage(storageKey.currentPerson);
  params.medPatientId = person.id;
  params.medTemplateId= 5;
  params.handleTime=currentDate+" "+currentTime+":00";
  params.itemList=data;
  // alert(currentDate+currentTime);
  api.confirm({
    title: '提示',
    msg: '确定保存吗？',
    buttons: ['确定', '取消']
  }, function(ret, err) {
      if(ret.buttonIndex==1){
        common.post({
          url: config.nurseLogTXSJCreate,
          isLoading:true,
          text:"正在保存...",
          data:JSON.stringify(params),
          success:function(ret){
            api.hideProgress();
            api.alert({
                title: '提示',
                msg: '保存成功！'
            }, function(ret, err){
                showTZCJ();
            });

          }
        });

      }
  });
}

//显示体征采集历史
function showHis(){
  $api.html($api.byId('content'), "");
  var person = $api.getStorage(storageKey.currentPerson);
  var requestUrl = config.nurseLogTZSJ;
  common.post({
    url:requestUrl,
    isLoading:true,
    data:JSON.stringify({
      patientId: person.id,
      page: page,
      limit: limit,
      templateList:[{"templateCode":"temperature","templateVersion":1}]
    }),
    success:function(ret){
      // alert(JSON.stringify(ret.content.list));
      if(!ret.content.list || ret.content.list.length <= 0){
        api.hideProgress();
        api.toast({
            msg: '没有更多数据',
            duration: config.duration,
            location: 'bottom'
        });
        return;
      }

      // 数组key value ret.content
      var map;
      for (var i = 0; i < ret.content.list.length; i++) {
        map = {};
        for(var j = 0; j < ret.content.list[i].itemList.length; j++){
          map[ret.content.list[i].itemList[j].key] =  ret.content.list[i].itemList[j].value;
        }
        ret.content.list[i]._map = map;
      }
      var contentTmpl = doT.template($api.text($api.byId('hisRecord-tpl')));

      if(page==1){
          $api.html($api.byId('content'), contentTmpl(ret.content));
      }else{
          $api.append($api.byId('content'), contentTmpl(ret.content));
          page = page + 1;
      }
      api.parseTapmode();
      api.hideProgress();
    }
  });
}

//历史记录列表点击查看详情页面
function showDetail(idx){
  var mapStr = $api.html($api.byId("content-"+idx));
  //打开一个明细窗口
  api.openWin({
      name: 'win_tizhengshouji_his_detail',
      url: './win_tizhengshouji_his_detail.html',
      pageParam: {
          content: mapStr
      }
  });

}

//历史记录上拉加载更多的选项
function loadMore(){
  //判断是不是第二个tab页面，是的话才走
  if(currIdx!=5){
    return;
  }
  showHis();
}

//新增自定义字段
function addField(){
  $("#fieldAdd").after('<div class="custom-field"><li class="aui-list-item"><div class="aui-list-item-inner"><div class="aui-list-item-label" style="width: 40%;">自定义内容</div><div class="aui-list-item-input"><input type="text" class="aui-pull-left custom-key" style="width:90%"  placeholder="请输入内容"><i class="aui-iconfont aui-icon-minus aui-pull-right" style="line-height: 2.2rem;" tapmode onclick="delField(this);"></i></div></div></li><li class="aui-list-item"><div class="aui-list-item-inner"><div class="aui-list-item-label" style="width: 40%;">值</div><div class="aui-list-item-input"><input class="custom-val" type="text" placeholder="请输入内容"></div></div></li></div>');
  api.parseTapmode();
}

//删除自定义字段
function delField(el){
  var cur = $api.closest(el, 'li');
  //这里有坑，需要使用两次next，具体查看https://www.cnblogs.com/lijinwen/p/5690223.html
  $api.remove(cur.nextElementSibling);
  $api.remove(cur);
}

//正则判断  小时:分钟 格式
function testTime(time){
  var regu =/^([0-1]{1}\d|2[0-3]):([0-5]\d)$/;
  var re = new RegExp(regu);
  if (re.test(time)) {
      return true;
  }else{
     return false;
  }
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

//如果value不会空，则放入到map中
function addMapIfNotNull(arr,key,value,existsId){
  var map = {};
  if(value && key){
    map["key"]=key;
    map["value"]=value;
    if(existsId){
        map["medTemplateItemId"]=5;
    }
    arr.push(map);
  }
}


var currentFirstDate;
var currentDates=[];
var zr;
var currentStartDate=null;
var currentEndDate=null;
var limitEndDate = null;
var yWdLow = 34; //最低体温34
var yMbLow = 20; //最低脉搏20
//显示温度曲线
function showChart(){
  var contentTmpl = doT.template($api.text($api.byId('chart-tpl')));
  $api.html($api.byId('content'), contentTmpl({}));
  api.parseTapmode();

  //设置canvas外部的宽高
  var btnHeight = $api.byId("weekBtn").offsetHeight;
  var frameWidth = api.frameWidth;
  var frameHeight = api.frameHeight;
  $("#mainDiv").css("width",frameWidth);

  zr = zrender.init(document.getElementById('main'));
  //todo 请求具体数据
  //绘图准备
  currentFirstDate=null;
  currentDates.length=0;
  currentStartDate=null;
  currentEndDate=null;
  limitEndDate=null;
  setDate(new Date());
  draw();
}

//绘图逻辑
function draw(){
  zr.clear();
  zr.add(DrawUtil.drawXAxis());
  zr.add(DrawUtil.drawYAxis());
  zr.add(DrawUtil.drawXAxisSolid());
  zr.add(DrawUtil.drawYAxisSolid());
  zr.add(DrawUtil.drawXAxisText(currentDates));
  zr.add(DrawUtil.drawYAxisText());
  zr.add(DrawUtil.drawDesc());
  //根据请求回来的排序数据，判断体温还是脉搏，体温的情况判断是那种温度，然后画出对应的图形

  //请求数据
  var person = $api.getStorage(storageKey.currentPerson);
  var requestUrl = config.nurseLogTZSJ; /*+ "?patientId="+person.id+"&limit=-1&beginTime="+currentStartDate+" 00:00:00&endTime="+currentEndDate+" 23:59:59";*/
  var currentSDate = currentStartDate+" 00:00:00";
  var currentEDate = currentEndDate+" 23:59:59";
  //alert("currentStartDate: "+currentStartDate+"currentEndDate: "+currentEndDate+"petientId: "+person.id);
  common.post({
    url:requestUrl,
    isLoading:true,
      data:JSON.stringify({
          patientId: person.id,
          limit: -1,
          templateList:[{"templateCode":"temperature","templateVersion":1}],
          beginTime:currentSDate,
          endTime:currentEDate
      }),
    success:function(ret){
      if(ret.content && ret.content.list && ret.content.list.length>0){
        var wdDatas=[];
        var mbDatas=[];
        for (var i = 0; i < ret.content.list.length; i++) {
          var data = {};
          var mbData = {};
          //type
          if(ret.content.list[i].itemList && ret.content.list[i].itemList.length>0){
            data["handleTime"]=ret.content.list[i].handleTime;
            for (var j = 0; j < ret.content.list[i].itemList.length; j++) {
              if(ret.content.list[i].itemList[j].key=="temperature"){
                data["type"]=0;
                data["value"]=ret.content.list[i].itemList[j].value;
                wdDatas.push(data);
              }else if(ret.content.list[i].itemList[j].key=="temperature1"){
                data["type"]=1;
                data["value"]=ret.content.list[i].itemList[j].value;
                wdDatas.push(data);
              }else if(ret.content.list[i].itemList[j].key=="temperature2"){
                data["type"]=2;
                data["value"]=ret.content.list[i].itemList[j].value;
                wdDatas.push(data);
              }else if(ret.content.list[i].itemList[j].key=="temperature3"){
                data["type"]=3;
                data["value"]=ret.content.list[i].itemList[j].value;
                wdDatas.push(data);
              } else if (ret.content.list[i].itemList[j].key=="temperature4") {
                  data["type"]=5;
                  data["value"]=ret.content.list[i].itemList[j].value;
                  wdDatas.push(data);
              }
            }
          }//end if
          if(ret.content.list[i].itemList && ret.content.list[i].itemList.length>0){
            mbData["handleTime"]=ret.content.list[i].handleTime;
            for (var j = 0; j < ret.content.list[i].itemList.length; j++) {
              if(ret.content.list[i].itemList[j].key=="pulse"){
                mbData["type"]=4; //脉搏
                mbData["value"]=ret.content.list[i].itemList[j].value;
                mbDatas.push(mbData);
                break;
              }
            }
          }//end if
        }//end for
        //计算温度的每个的坐标
        // console.log(JSON.stringify(wdDatas));
        // console.log(JSON.stringify(mbDatas));
        for (var i = 0; i < wdDatas.length; i++) {
          if(Number(wdDatas[i].value)-yWdLow>=0 && Number(wdDatas[i].value)-yWdLow <=8){
            wdDatas[i].y = DrawUtil.startY - (Number(wdDatas[i].value)-yWdLow)*DrawUtil.yWidth*5;
          }else{
            wdDatas.splice(i,1);
            i--;
            continue;
          }

          var d1 = currentStartDate.replace(/\-/g, "/");
          var date1 = new Date(d1);
          var d2 = wdDatas[i].handleTime.replace(/\-/g, "/");
          var date2 = new Date(d2);
          var minutes = parseInt(date2 - date1) / 1000 / 60; //两个时间相差的分钟数
            // alert("wdDatas[i].value"+wdDatas[i].value)
            // alert(d1) //2019/05/27
            // alert(date1) //
            // alert(d2) //2019/05/28 11:33:51
            // alert(date2) //
            // alert(minutes) //2132.85
          //console.log("minutes="+minutes);
          wdDatas[i].x = DrawUtil.startX + minutes * DrawUtil.xWidth/(4*60);
            // alert( wdDatas[i].x)
        }
        //画图形
        for (var i = 0; i < wdDatas.length; i++) {
          if(wdDatas[i].type==0){
            zr.add(DrawUtil.drawX({x: wdDatas[i].x, y: wdDatas[i].y}, '#03a9f4')); //腋温  type=0
          }else if(wdDatas[i].type==1){
            zr.add(DrawUtil.drawCircle({x: wdDatas[i].x, y: wdDatas[i].y}, '#03a9f4')); //口温 type=1
          }else if(wdDatas[i].type==2){
            zr.add(DrawUtil.drawPointCircle({x: wdDatas[i].x, y: wdDatas[i].y}, '#03a9f4')); //肛温 type=2
          }else if(wdDatas[i].type==3){
            zr.add(DrawUtil.drawIsogon({x: wdDatas[i].x, y: wdDatas[i].y}, '#03a9f4')); //耳温 type=3
          }else if (wdDatas[i].type==5){
            zr.add(DrawUtil.drawCircle({x: wdDatas[i].x, y: wdDatas[i].y}, '#ff3223')); //额温 type=5
          }
        }
        //画连线
        for (var i = 0; i < wdDatas.length-1; i++) {
          var line = new zrender.Line({
            shape:{
              x1:wdDatas[i].x,
              y1:wdDatas[i].y,
              x2:wdDatas[i+1].x,
              y2:wdDatas[i+1].y
            },
            style:{
              stroke:'#000',
              lineWidth:1
            }
          });
          zr.add(line);
        }
        //计算脉搏的每个的坐标
        for (var i = 0; i < mbDatas.length; i++) {
          if(Number(mbDatas[i].value)-yMbLow>=0 && Number(mbDatas[i].value)-yMbLow <=160 ){
            mbDatas[i].y = DrawUtil.startY - (Number(mbDatas[i].value)-yMbLow)*75/30
          }else{
            mbDatas.splice(i,1);
            i--;
            continue;
          }
          var d1 = currentStartDate.replace(/\-/g, "/");
          var date1 = new Date(d1);
          var d2 = mbDatas[i].handleTime.replace(/\-/g, "/");
          var date2 = new Date(d2);
          var minutes = parseInt(date2 - date1) / 1000 / 60; //两个时间相差的分钟数
          mbDatas[i].x = DrawUtil.startX + minutes * DrawUtil.xWidth/(4*60);
        }
        //console.log(JSON.stringify(wdDatas));
        //console.log(JSON.stringify(mbDatas));
        for (var i = 0; i < mbDatas.length; i++) {
            zr.add(DrawUtil.drawHollowCircle({x: mbDatas[i].x, y: mbDatas[i].y}, '#03a9f4')); //脉搏 type=4
        }
        for (var i = 0; i < mbDatas.length-1; i++) {
          var line = new zrender.Line({
            shape:{
              x1:mbDatas[i].x,
              y1:mbDatas[i].y,
              x2:mbDatas[i+1].x,
              y2:mbDatas[i+1].y
            },
            style:{
              stroke:'#e51c23',
              lineWidth:1
            }
          });
          zr.add(line);
        }

        api.hideProgress();
      }else{
        api.hideProgress();
        api.toast({
            msg: '没有查询到数据',
            duration: 2000,
            location: 'bottom'
        });
      }
    }
  });
}

var formatDate = function(date){
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    if(month<10) month = "0"+month;
  	if(day<10) day = "0"+day;
    return year+"-"+month+"-"+day;
};
var addDate= function(date,n){
    date.setDate(date.getDate()+n);
    return date;
};
var setDate = function(date){
    var week = date.getDay()-1;
    date = addDate(date,week*-1);
    currentFirstDate = new Date(date);
    currentDates.length=0;
    for(var i = 0;i<7;i++){
        var tmp = formatDate(i==0 ? date : addDate(date,1));
        if(i==0){
          currentStartDate = tmp;
        }else if(i==6){
          currentEndDate = tmp;
          if(limitEndDate==null){
            limitEndDate = tmp;
          }
        }
        currentDates.push(i==0? truncMD(tmp):truncD(tmp));
    }
};
//截取月日
function truncMD(datestr){
  return datestr.substr(5);
}
//截取日
function truncD(datestr){
  return datestr.substr(8);
}
function lastweek(){
    setDate(addDate(currentFirstDate,-7));
    draw();
};
function nextweek(){
    //下一周最大控制到当前周
    if(currentEndDate == limitEndDate){
      api.toast({
          msg: '没有下一周啦',
          duration: 2000,
          location: 'bottom'
      });

      return;
    }
    setDate(addDate(currentFirstDate,7));
    draw();
};
