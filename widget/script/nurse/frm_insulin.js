var ji = 0;
var xi = 0;
var userName = $api.getStorage(storageKey.userName)
apiready = function() {
    api.parseTapmode();
    var tab = new auiTab({
        element: document.getElementById("tab"),
        index: 1,
        repeatClick: false
    }, function(ret) {
        $api.html($api.byId("content"), "");
        if (ret.index == 1) {
            showAdd();
        } else if (ret.index == 2) {
            showHis();
        }
    });
    showAdd();
};

function showAdd() {
    var person = $api.getStorage(storageKey.currentPerson);
    common.get({
        url: config.patientDetailUrl + person.id + '/' + person.homepageId,
        isLoading: true,
        success: function(ret) {
            var contentTmpl = doT.template($api.text($api.byId('add-tpl')));
            $api.html($api.byId('content'), contentTmpl({
                person: ret.content,
                "currentTime": currentTime(),
                "currentDate": currentDate(),
                "userName": userName
            }));
            api.parseTapmode();
            var collapse = new auiCollapse({
                autoHide: false //是否自动隐藏已经展开的容器
            });
        }
    });
}

function saveAddRecord() {
    if ($.trim(huanzheqianzi) == "") {
        api.toast({
            msg: '请输入患者签名',
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
    }, function(ret1, err) {
        if (ret1.buttonIndex == 1) {
            var data = [];
            addMapIfNotNull(data, "createUserName", createUserName, true);
            addMapIfNotNull(data, "handleTime", handleTime, true);
            addMapIfNotNull(data, "createTime", createTime, true);
            addMapIfNotNull(data, "huanzheqianzi", huanzheqianzi, true);
            addMapIfNotNull(data, "guanxi", guanxi, true);
            addMapIfNotNull(data, "huanzhejiashuqianzi", huanzhejiashuqianzi, true);
            addMapIfNotNull(data, "beizhu", beizhu, true);

            var params = {};
            var person = $api.getStorage(storageKey.currentPerson);
            params.medPatientId = person.id;
            params.homepageId = person.homepageId;
            params.name = "中心静脉导管拒绝维护知情同意书";
            params.medTemplateId = 218;
            params.itemList = data;

            common.post({
                url: config.nursePlanUrl,
                isLoading: true,
                text: '保存数据...',
                data: JSON.stringify(params),
                success: function(r) {
                    api.hideProgress();
                    api.alert({
                        title: '提示',
                        msg: '保存成功！',
                    }, function(ret, err) {
                        showAdd();
                    });
                }
            });
        }
    });
}

function showHis() {
    var contentTmpl = doT.template($api.text($api.byId('his-tpl')));
    $api.html($api.byId('content'), contentTmpl({}));

    $api.html($api.byId("recordContent"), "");
    var person = $api.getStorage(storageKey.currentPerson);
    common.get({
        url: config.selectInsulin+"?patientId="+person.id+"&homepageId=" + person.homepageId,
        isLoading: true,
        success: function(ret) {
            if (ret.content && ret.content.list && ret.content.list.length > 0) {
                //处理数据
                var data = ret.content.list;
                //根据开始时间和结束时间构造一个以时间为key的数组对象
                timeMap = getDayAll(ret.content.list);
                //var timeMap = getDayAll(startDate,endDate);
                for (var i = 0; i < data.length; i++) {
                    timeMap[truncDate(data[i].createTime)].push(data[i])
                }
                var params = {};
                for (var key in timeMap) {
                    if (timeMap[key].length > 0) {
                        params[key] = timeMap[key];
                    }
                }
                var contentTmpl = doT.template($api.text($api.byId('record-tpl')));
                $api.html($api.byId('recordContent'), contentTmpl(params));
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


function openDetailWin(id) {
    api.openWin({
        name: 'win_insulin_detail',
        url: './win_insulin_detail.html',
        pageParam: {
            data: id
        }
    });
}

//如果value不会空，则放入到map中
function addMapIfNotNull(arr, key, value, existsId) {
    var map = {};
    if (value && key) {
        map["key"] = key;
        map["value"] = value;
        if (existsId) {
            map["medTemplateItemId"] = 218;
        }
        arr.push(map);
    }
}

function picker(el, id) {
    api.openPicker({
        type: 'date',
        title: '日期'
    }, function(ret, err) {
        var startYear = ret.year;
        var startMonth = ret.month;
        var startDay = ret.day;
        var date = startYear + "-" + (startMonth < 10 ? "0" + startMonth : startMonth) + "-" + (startDay < 10 ? "0" + startDay : startDay);
        api.openPicker({
            type: 'time',
            title: '时间'
        }, function(ret1, err1) {
            var hour = ret1.hour;
            if (hour < 10) {
                hour = "0" + hour;
            }
            var minute = ret1.minute;
            if (minute < 10) {
                minute = "0" + minute;
            }
            var time = hour + ":" + minute+":"+"00";
            $api.val(el, date + " " + time);

            $(id).css("color", "#ccc2c2");
            $(id).one("click", function() {
                $(el).val("");
                $(id).css("color", "#ffffff");
            });
        });
    });
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
    return year + "-" + month + "-" + day + " " + hour + ":" + minute+":"+"00";
}

function currentDate() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    return year + "-" + month + "-" + day;
}

function truncDate(date) {
    return date.substr(0, 10);
}

function truncTime(date) {
    return date.substr(11, 5);
}

function getDayAll(datas) {
    var dateAllMap = {};
    for (var i = 0; i < datas.length; i++) {
        dateAllMap[truncDate(datas[i].createTime)] = [];
    }
    return dateAllMap;
}



function jiliang() {
  var person = $api.getStorage(storageKey.currentPerson);
  var patientId = person.id;
 var homepageId = person.homepageId;
  var insulinId = 0;
  insulinId = $("#insulinId").val();
  if(insulinId!=0){

  }else{
    var handleTime = $("#handleTime").val();
    var nurseName = $("#nurseName").val();
    var userTime = $("#userTime").val();
    common.post({
        url: config.saveInsulinPda,
        isLoading: false,
        dataType:JSON,
        data: {
          'handleTime':handleTime,
          'nurseName':nurseName,
          'userTime':userTime,
          'medPatientId':patientId,
          'homepageId':homepageId
        },
        success: function(r) {
            $("#insulinId").val(r.content.id);
        }
    });
  }
  insulinId = $("#insulinId").val();
    $("#jltbody").append("<tr name='jtr'>"+
    "<td><input type='text' tapmode style='font-size:0.7rem' name='jhandleTime"+ji+"' onclick='picker(this);' tapmode style='text-align:center;height:25px;'></td>"+
    "<td><input type='text' name='jbasedAmount"+ji+"' style='text-align:center;height:25px;'/></td>"+
    "<td><input type='text' name='jmoring"+ji+"' style='text-align:center;height:25px;'/></td>"+
    "<td><input type='text' name='jnoon"+ji+"' style='text-align:center;height:25px;'/></td>"+
    "<td><input type='text' name='jnight"+ji+"' style='text-align:center;height:25px;'/></td>"+
    "<td><input type='text' name='jnurseName"+ji+"' value=" + userName + " style='text-align:center;height:25px;'/></td>"+
    "</tr>");
    ji++;
    }

    function xuetang() {
      var person = $api.getStorage(storageKey.currentPerson);
      var patientId = person.id;
      var homepageId = person.homepageId;
      var insulinId = $("#insulinId").val();
      if(insulinId!=0){

      }else{
        var handleTime = $("#handleTime").val();
        var nurseName = $("#nurseName").val();
        var userTime = $("#userTime").val();
        common.post({
            url: config.saveInsulinPda,
            isLoading: false,
            dataType:JSON,
            data: {
              'handleTime':handleTime,
              'nurseName':nurseName,
              'userTime':userTime,
              'medPatientId':patientId,
              'homepageId':homepageId
            },
            success: function(r) {
                $("#insulinId").val(r.content.id);
            }
        });
      }
      insulinId = $("#insulinId").val();
        $("#xtbody").append("<tr name='xtr'>"+
        "<td><input type='text' tapmode style='font-size:0.7rem' name='xhandleTime"+xi+"' onclick='picker(this);' tapmode readOnly='readOnly' style='text-align:center;height:25px;'></td>"+
        "<td><input type='text' name='xstomach"+xi+"' style='text-align:center;height:25px;'/></td>"+
        "<td><input type='text' name='xmoring"+xi+"' style='text-align:center;height:25px;'/></td>"+
        "<td><input type='text' name='xnoonBefore"+xi+"' style='text-align:center;height:25px;'/></td>"+
        "<td><input type='text' name='xnoonAfter"+xi+"' style='text-align:center;height:25px;'/></td>"+
        "<td><input type='text' name='xnightBefore"+xi+"' style='text-align:center;height:25px;'/></td>"+
        "<td><input type='text' name='xnigntAfter"+xi+"' style='text-align:center;height:25px;'/></td>"+
        "<td><input type='text' name='xsleepBefore"+xi+"' style='text-align:center;height:25px;'/></td>"+
        "<td><input type='text' name='xzero"+xi+"' style='text-align:center;height:25px;'/></td>"+
        "<td><input type='text' name='xthree"+xi+"' style='text-align:center;height:25px;'/></td>"+
        "<td><input type='text' name='xmemo"+xi+"' style='text-align:center;height:25px;'/></td>"+
        "<td><input type='text' name='xnurseName"+xi+"' value=" + userName + "  style='text-align:center;height:25px;'/></td>"+
        "</tr>");
        xi++;
        }

        function saveHLD(){
          var person = $api.getStorage(storageKey.currentPerson);
          var patientId = person.id;
          var homepageId = person.homepageId;
          var insulinId = $("#insulinId").val();

          if(insulinId!=0){
            var i = 0;
          $("tr[name='jtr'").each(function(){
            var handleTime;
            var basedAmount;
            var moring;
            var noon;
            var night;
            var nurseName;
             handleTime = $("input[name='jhandleTime"+i+"']").val();
             basedAmount = $("input[name='jbasedAmount"+i+"']").val();
             moring = $("input[name='jmoring"+i+"']").val();
             noon = $("input[name='jnoon"+i+"']").val();
             night = $("input[name='jnight"+i+"']").val();
             nurseName = $("input[name='jnurseName"+i+"']").val();
             i=i+1;
            common.post({
                url: config.saveBased,
                isLoading: false,
                dataType:JSON,
                data: {
                  'handleTime':handleTime,
                  'nurseName':nurseName,
                  'basedAmount':basedAmount,
                  'insulinId':insulinId,
                  'moring':moring,
                  'noon':noon,
                  'night':night
                },
                success: function(r) {
                  api.hideProgress();

                }
            });
          })
          var ii = 0;
          $("tr[name='xtr'").each(function(){
            var handleTime;
            var stomach;
            var nurseName;
            var moring;
            var noonBefore;
            var noonAfter;
            var nightBefore;
            var nigntAfter;
            var sleepBefore;
            var zero;
            var three;
            var memo;
             handleTime = $("input[name='xhandleTime"+ii+"']").val();
             stomach = $("input[name='xstomach"+ii+"']").val();
             nurseName = $("input[name='xnurseName"+ii+"']").val();
             moring = $("input[name='xmoring"+ii+"']").val();
             noonBefore = $("input[name='xnoonBefore"+ii+"']").val();
             noonAfter = $("input[name='xnoonAfter"+ii+"']").val();
             nightBefore = $("input[name='xnightBefore"+ii+"']").val();
             nigntAfter = $("input[name='xnigntAfter"+ii+"']").val();
             sleepBefore = $("input[name='xsleepBefore"+ii+"']").val();
             zero = $("input[name='xzero"+ii+"']").val();
             three = $("input[name='xthree"+ii+"']").val();
             memo = $("input[name='xmemo"+ii+"']").val();
             ii++;
            common.post({
                url: config.saveMonitoring,
                isLoading: false,
                dataType:JSON,
                data: {
                  'handleTime':handleTime,
                  'nurseName':nurseName,
                  'insulinId':insulinId,
                  'stomach':stomach,
                  'noonBefore':noonBefore,
                  'moring':moring,
                  'noonAfter':noonAfter,
                  'nightBefore':nightBefore,
                  'nigntAfter':nigntAfter,
                  'sleepBefore':sleepBefore,
                  'zero':zero,
                  'three':three,
                  'memo':memo
                },
                success: function(r) {
                  api.hideProgress();
                }
            });
          })
          api.alert({
              title: '提示',
              msg: '保存成功！',
          }, function(ret, err) {
              showAdd();
          });
          }else{
            var person = $api.getStorage(storageKey.currentPerson);
            var patientId = person.id;
            var handleTime = $("#handleTime").val();
            var nurseName = $("#nurseName").val();
            var userTime = $("#userTime").val();
            common.post({
                url: config.saveInsulinPda,
                isLoading: false,
                dataType:JSON,
                data: {
                  'handleTime':handleTime,
                  'nurseName':nurseName,
                  'userTime':userTime,
                  'medPatientId':patientId
                },
                success: function(r) {
                  api.hideProgress();
                  api.alert({
                      title: '提示',
                      msg: '保存成功！',
                  }, function(ret, err) {
                      showAdd();
                  });
                }
            });
          }
        }
