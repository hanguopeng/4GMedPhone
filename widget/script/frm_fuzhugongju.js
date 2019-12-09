var calendar;
var chooseDate=null; //当前月点击选择的日期
var specialDates = []; //当前月的特殊日期
var clendarId ;
var scanner;
var objId;
var firstFlag = false;
apiready = function(){
    api.parseTapmode();
    scanner = api.require('cmcScan');
    calendar = api.require('UICalendar');

    var tab = new auiTab({
        element:document.getElementById("tab"),
        index: 1,
        repeatClick:false
    },function(ret){
        $api.html($api.byId('content'), "");
        if(ret.index==1){
            $api.html($api.byId('content'), '');
            $api.html($api.byId('scanContentContainer'), '');
            $api.removeCls($api.byId('scanContentContainer'),'borderScanComplete');
            $api.setStorage(storageKey.scannerStatus,'checkDetail');
            //试管核对
            //关闭日历--根据日历open方法中的id关闭
            calendar.close({id:clendarId});
            showScan();

        }else if(ret.index==2){
            //重要事件提醒
            firstFlag = false;
            showCalendar();
        }else if(ret.index==3){
            $api.setStorage(storageKey.scannerStatus,'checkDetail');
            $api.html($api.byId('content'), '');
            $api.html($api.byId('scanContentContainer'), '');
            $api.removeCls($api.byId('scanContentContainer'),'borderScanComplete');
            //试管核对
            //关闭日历--根据日历open方法中的id关闭
            calendar.close({id:clendarId});
            showScan();
        }
    });
    api.addEventListener({
        name:'scanPersonComplete'
    },function(ret,err){
        //扫描切换患者成功后使第一步按钮变色
        $api.removeCls($api.byId(objId),'smUncomplete');
        $api.addCls($api.byId(objId),'smComplete');
        $api.removeCls($api.byId('scanMed'),'smComplete');
        $api.addCls($api.byId('scanMed'),'smUncomplete');
        $api.html($api.byId('tbody'), "");
        $api.addCls($api.byId('table-id'),'hide','hide')
        $api.removeCls($api.byId('scanContentContainer'),'borderScanComplete');
        //扫描患者成功后刷新上边栏信息
        api.sendEvent({
            name: 'patientChange'
        });
        //限制操作者必须先进行第一步扫描患者才可以扫试管码
        firstFlag = true;
    });
    api.addEventListener({
        name:'medScan'
    },function(ret,err){
        var person = $api.getStorage(storageKey.currentPerson);
        var userId = $api.getStorage(storageKey.userId);
        var materialCode = ret.value.materialCode.value
        var eleFlag = $api.byId(materialCode)
        if(eleFlag===undefined||eleFlag===""||eleFlag===null){
            common.get({
                url:config.scanMedical + materialCode + "/" + person.id + "/" + userId,
                isLoading:true,
                success:function(retGet){
                    if(retGet){
                        $api.removeCls($api.byId('table-id'),'hide')
                        var msgInfo;
                        var checkColor;
                        if(retGet.msg==='true'){
                            msgInfo = '核对一致'
                            checkColor = '#00cc66'
                        }
                        if(retGet.msg==='false'){
                            msgInfo = '核对不一致'
                            checkColor = '#ff6600'
                        }
                        if(retGet.msg==='failed'){
                            msgInfo = '无此条码，请到his系统确认'
                            checkColor = '#ffffff'
                        }
                        var params = {};
                        params.msgInfo = msgInfo;
                        params.checkColor = checkColor;
                        params.materialCode = materialCode;

                        var tbodyTmpl = doT.template($api.text($api.byId('tbody-tpl')));
                        $api.append($api.byId('tbody'), tbodyTmpl(params));

                        //显示医嘱信息
                        /*var contentTmpl = doT.template($api.text($api.byId('scanMedical-tmpl')));
                        $api.html($api.byId('medContentContainer'), contentTmpl(ret.content));
                        if(ret.content.sonBoList.length>0){
                            var contentTmpl = doT.template($api.text($api.byId('relation-tmpl')));
                            $api.html($api.byId('relationContentContainer'), contentTmpl(ret.content.sonBoList));
                        }*/

                    }

                },fail:function(retGet,err){
                    api.alert({
                        title: '提示',
                        msg: '请扫描正确的试管码',
                    });
                }
            });
        }
        //发送请求查询医嘱信息
        $api.setStorage(storageKey.scannerStatus,'');
    });
    showScan();
    //添加事件成功之后页面将该日期设置为提醒日期，同时需要重新刷新该日期下的所有事件
    api.addEventListener({
        name: eventName.addAlertOk
    }, function(ret, err){
        var addDate = ret.value.date;
        //判断当前特殊日期里面是否有该日期，如果没有，则需要添加进去，重新设置值，同时请求该日期下面的所有事件
        var existFlag = false;
        for (var i = 0; i < specialDates.length; i++) {
            if(specialDates[i].date == addDate){
                //存在
                existFlag = true;
                break;
            }
        }
        if(!existFlag){
            //不存在
            specialDates.push({"date":addDate});
            calendar.setSpecialDates({
                specialDates:specialDates
            });
        }
        //刷新当前日期的所有事件
        fetchRecord(true);
    });
}

//根据选择的日期获取记录
function fetchRecord(loadingFlag){
    $api.html($api.byId('record-content'),"");
    common.get({
        url:config.alertListUrl+chooseDate,
        isLoading:loadingFlag,
        success:function(ret){

            if(ret.content && ret.content.length>0){
                var contentTmpl = doT.template($api.text($api.byId('record-tpl')));
                $api.html($api.byId('record-content'), contentTmpl(ret));
                api.parseTapmode();
            }

            api.hideProgress();
        }
    });
}

//删除某一个记录,id为需要删除的记录的id
function deleteRecord(id){
    api.confirm({
        title: '提示',
        msg: '确定删除该事件记录吗？',
        buttons: ['确定', '取消']
    }, function(ret, err){
        if(ret.buttonIndex==1){
            //调后台
            common.post({
                url:config.alertDelUrl+id,
                isLoading:true,
                text:"正在提交...",
                success:function(ret){
                    //成功之后去掉该记录，
                    $("#record"+id).remove();
                    //如果记录全部没有，从特殊日期里面去掉
                    if($("#record-content").find(".cus-record-cus").size() <= 0){
                        var index = -1;
                        for (var i = 0; i < specialDates.length; i++) {
                            if(specialDates[i].date === chooseDate){
                                index = i;
                                break;
                            }
                        }
                        if(index >= 0){
                            specialDates.splice(index, 1);
                            calendar.cancelSpecialDates({
                                specialDates:[chooseDate]
                            });

                        }
                    }
                    api.hideProgress();
                }
            });
        }
    });

}

//显示重要事件提醒页面
function showCalendar(){
    chooseDate=null;
    specialDates.length = 0;
    $api.html($api.byId('scanContentContainer'),"");
    common.get({
        url:config.alertMonthUrl+"?month="+currentMonth(),
        isLoading:true,
        success:function(ret){
            var contentTmpl = doT.template($api.text($api.byId('calendar-tpl')));
            $api.html($api.byId('content'), contentTmpl({}));
            api.parseTapmode();

            calendar.open({
                rect: {
                    x: 0,
                    y: 100,
                    w: api.frameWidth,
                    h: 220
                },
                styles: {
                    bg: 'rgba(0,0,0,0)',
                    week: {
                        weekdayColor: '#3b3b3b',
                        weekendColor: '#757575',
                        size: 12
                    },
                    date: {
                        color: '#3b3b3b',
                        selectedColor: '#3b3b3b',
                        selectedBg: 'widget://image/rec_blue.png',//普通日期选中后的背景，边框
                        size: 12
                    },
                    today: {
                        color: '#fff',
                        bg: 'widget://image/dot_red.png'
                    },
                    specialDate: {
                        color: '#3b3b3b',
                        bg: 'widget://image/dot_red_upper.png'
                    }
                },
                specialDate: [],
                switchMode: 'none',// vertical（上下切换）  horizontal（左右切换）
                fixedOn: api.frameName,
                fixed: false
            }, function(ret, err){
                if(!ret){
                    api.hideProgress();
                    return;
                }
                //console.log(JSON.stringify(ret));
                if(ret.eventType=="show"){
                    clendarId = ret.id;
                    //alert(clendarId);
                    setCurDate(ret.year,ret.month,false);
                }else if (ret.eventType==="normal" || ret.eventType==="special") {
                    if(ret.month<10){
                        chooseDate = ret.year+"-0"+ret.month+"-"+(ret.day<10? "0"+ret.day: ret.day);
                    }else{
                        chooseDate = ret.year+"-"+ret.month+"-"+(ret.day<10? "0"+ret.day: ret.day);
                    }
                    if(ret.eventType==="special"){
                        fetchRecord(true);
                    }else{
                        $api.html($api.byId('record-content'),"");
                    }

                }else{
                    api.hideProgress();
                }
            });
        }
    });
}

function setCurDate(year,month,fetchRecordFlag){
    var val;
    if(month<10){
        val=year+"-0"+month;
    }else{
        val=year+"-"+month;
    }
    $api.html($api.byId("curDate"),val);
    common.get({
        url:config.alertMonthUrl+"?month="+val,
        isLoading:true,
        success:function(ret){
            specialDates.length = 0;//清空
            if(ret.content && ret.content.length>0){
                for (var i = 0; i < ret.content.length; i++) {
                    specialDates.push({date: ret.content[i].alertDate });
                }
            }
            calendar.setSpecialDates({
                specialDates:specialDates
            });
            if(chooseDate && fetchRecordFlag){
                //根据切换的年月替换chooseDate变量
                chooseDate = val + "-" + chooseDate.substr(8,2);
                fetchRecord(false);
            }else{
                api.hideProgress();
            }
        }
    });
}

//切换到上一个月
function lastMonth(){
    calendar.prevMonth(function(ret, err) {
        if (ret) {
            setCurDate(ret.year,ret.month,true);
        }else{
            alert(JSON.stringify(err));
        }
    });
}

//切换到下一个月
function nextMonth(){
    calendar.nextMonth(function(ret, err) {
        if (ret) {
            setCurDate(ret.year,ret.month,true);
        }else{
            alert(JSON.stringify(err));
        }
    });
}

//新增提示
function addNotice(){
    if (!chooseDate) {
        api.toast({
            msg: '请选择日期',
            duration: config.duration,
            location: 'bottom'
        });
        return;
    }
    api.openWin({
        name: 'win_add_noice',
        url: '../html/win_add_notice.html',
        pageParam: {
            date: chooseDate
        }
    });
}

//修改
function openModifyWin(id,motionName,alertTime,bedCode,patientName){
    api.openWin({
        name: 'win_modify_notice',
        url: '../html/win_modify_notice.html',
        pageParam: {
            date: chooseDate,
            id: id,
            motionName:motionName,
            alertTime:alertTime,
            bedCode:bedCode,
            patientName:patientName
        }
    });
}

//显示试管核对tab页面
function showScan(){
    var contentTmpl = doT.template($api.text($api.byId('check-tpl')));
    $api.html($api.byId('content'), contentTmpl({}));

    var tableTmpl = doT.template($api.text($api.byId('table-tpl')));
    $api.html($api.byId('scanContentContainer'), tableTmpl({}));
    api.parseTapmode();
}
function showScanMedical(){
    var contentTmpl = doT.template($api.text($api.byId('medical-tpl')));
    $api.html($api.byid('content'),contentTmpl({}));
}

function scan(obj){
    $api.setStorage(storageKey.scannerStatus,'checkDetail');
    scanner.start();
    objId= $api.attr(obj, 'id');
    /*scanner.start({
    },function(ret,err){
              if(ret.status===1){
          var value = ret.value;
          common.get({
            //todo 替换url的值
            url: config.scanCheckUrl+value,
            isLoading:true,
            success:function(ret){
              if(ret.content){
                api.openWin({
                    name: 'win_check_detail',
                    url: './win_check_detail.html',
                    pageParam: {
                        data: ret.content
                    }
                });
              }else{
                api.toast({
                    msg: '系统中未查询到此检验，请稍后再试',
                    duration: config.duration,
                    location: 'bottom'
                });
              }
            }
          });
              }else if(ret.status===0){
          api.toast({
              msg: '超时或解码失败，请重试！',
              duration: config.duration,
              location: 'bottom'
          });
              }
      });*/
}

function medScan(obj){
    if(firstFlag){
        objId = $api.attr(obj, 'id');
        $api.setStorage(storageKey.scannerStatus,'medScan');
        scanner.start();
    }else{
        api.toast({
            msg: '请先扫描患者腕带或床头卡',
            duration: 2000,
            location: 'middle'
        });
    }

}

function currentMonth(){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    if(month<10) month = "0"+month;
    return year+"-"+month;
}

function spliceHourMinute(date){
    return date.substr(11,5);
}
var changeNextTwoShow = function(obj){
    var isHide = $api.hasCls($api.next(obj), 'hide');
    obj = $api.next(obj)
    if (isHide){
        $api.removeCls(obj, 'hide');
        $api.removeCls($api.next(obj), 'hide');
    } else{
        $api.addCls(obj, 'hide');
        $api.addCls($api.next(obj), 'hide');
    }
}

