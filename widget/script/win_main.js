var fs;
var scanner ;
var socketFlag = $api.getStorage(storageKey.createFlag);
apiready = function() {
    fs = api.require('fs');
    scanner = api.require('cmcScan');
    api.parseTapmode();
    if(storageKey.scannerStatus !== 'checkDetail'){
        getUserInfo();
        var header = document.querySelector('#header');
        immersive(header);

    }


    api.addEventListener({
        name: 'scanEvent'
    }, function(ret,err){
        if(ret.value.status===1){
            var scannerStatus = $api.getStorage(storageKey.scannerStatus);
            var value = ret.value.value;
            if (scannerStatus === 'changePatient'){
                var person = $api.getStorage(storageKey.currentPerson);
                var patientId = person.id;
                $api.setStorage(storageKey.scannerStatus, '');
                if(value == patientId){
                    common.get({
                        url: config.patientSaveUrl + patientId + '/' + person.homepageId,
                        isLoading: true,
                        text: "正在保存...",
                        success: function (ret) {
                            api.hideProgress();
                            api.alert({
                                title: '提示',
                                msg: '入科成功！',
                            }, function (ret, err) {
                                var persons = $api.getStorage(storageKey.persons);
                                //遍历查询
                                for (var i = 0; i < persons.length; i++) {
                                    if(persons[i].id==value){
                                        api.sendEvent({
                                            name: "scanSuccess",
                                            extra: {
                                                index: i
                                            }
                                        });
                                        return;
                                    }
                                }

                            });
                        }
                    });
                }else{
                    api.alert({
                        title: '提示',
                        msg: '扫描到的患者与当前患者不是同一个人',
                    }, function (ret, err) {
                    });
                }
            } else if (scannerStatus === 'tour-records'){
                api.sendEvent({
                    name: 'tourRecordsResultShow'
                });
                $api.setStorage(storageKey.tourRecordsPersonId,value)
            }else if(scannerStatus === 'checkDetail'){
                //alert("试管核对");
                var persons = $api.getStorage(storageKey.persons);
                //遍历查询
                for (var i = 0; i < persons.length; i++) {
                    if(persons[i].id==value){
                        $api.setStorage(storageKey.currentPerson, persons[i]);
                    }
                }
                api.openWin({
                    name: "win_person_center",
                    bounces: false,
                    slidBackEnabled: false,
                    reload: true,
                    url: '../html/win_person_center.html',
                    vScrollBarEnabled: true,
                    hScrollBarEnabled: false
                });
                api.sendEvent({
                    name: 'scanPersonComplete',
                });
            }else if(scannerStatus === 'medScan'){
                //alert('medScan')
                api.sendEvent({
                    name: 'medScan',
                });
            }else{
                var persons = $api.getStorage(storageKey.persons);
                //遍历查询
                for (var i = 0; i < persons.length; i++) {
                    if(persons[i].id==value){
                        api.sendEvent({
                            name: "scanSuccess",
                            extra: {
                                index: i
                            }
                        });
                        return;
                    }
                }
                api.alert({
                    title: '提示',
                    msg: '系统未管理此病人，请刷新后重试',
                });
            }
        }else if(ret.status===0){
            api.toast({
                msg: '超时或解码失败，请重试！',
                duration: config.duration,
                location: 'bottom'
            });
        }
    });
    if("true"!=socketFlag){
        nurerId();
    }
    var newAdviceCount= $api.getStorage(storageKey.newAdviceCount);
    if (parseInt(newAdviceCount)>0){
        var jiaobiao = "<div class='jiaobiao' id='sjb'>"+newAdviceCount+"</div>\n" +
            "        <span class='aui-iconfont aui-icon-menu' style='color:white;font-size:1rem;' id='hongdian'></span>";
        $api.html($api.byId("caidanlan"), jiaobiao);
    }

    api.addEventListener({
        name: 'changeNewAdviceNumber'
    }, function(ret,err){
        var newAdviceCount1= $api.getStorage(storageKey.newAdviceCount);
        if (parseInt(newAdviceCount1)>0){
            var jiaobiao = "<div class='jiaobiao' id='sjb'>"+newAdviceCount1+"</div>\n" +
                "        <span class='aui-iconfont aui-icon-menu' style='color:white;font-size:1rem;' id='hongdian'></span>";
            $api.html($api.byId("caidanlan"), jiaobiao);
        }else{
            var jiaobiao = "<span class='aui-iconfont aui-icon-menu' style='color:white;font-size:1rem;'></span>";
            $api.html($api.byId("caidanlan"), jiaobiao);
        }
    });

    ExitApp();
};

function immersive(header) {
    var systemType = api.systemType;  // 获取手机类型，比如： ios
    if (systemType == 'ios') {//兼容ios和安卓
        $api.addCls(header, 'headerIos');
    } else {
        $api.addCls(header, 'headerAnd');
    }
    api.setStatusBarStyle({
        color: 'rgba(0, 71, 131, 1)',//设置APP状态栏背景色
        style: 'light'
    });
}

/**
 * 获取登录人员信息
 */
function getUserInfo() {
    common.get({
        url: config.loginUserInfoUrl,
        isLoading: false,
        success: function (ret) {
            //不关闭遮罩，还要获取疗区信息
            //填写欢迎信息
            $api.text($api.byId('welcomeContent'), common.notNull(ret.content.name));
            //todo 人员照片信息，后台还未做功能，后续补上
            getOrganizationInfo();
            $api.setStorage(storageKey.userName, ret.content.name);
            $api.setStorage(storageKey.userId, ret.content.id);
            //根据用户创建不同的文件目录
            fs.exist({
                path: 'fs://' + ret.content.id
            }, function (retfs, err) {
                if (!retfs.exist) {
                    //不存在，新建一个用户id对应的文件夹
                    fs.createDir({
                        path: 'fs://' + ret.content.id
                    }, function (retdir, err) {
                        if (!retdir.status) {
                            api.toast({
                                msg: '创建文件夹失败！',
                                duration: config.duration,
                                location: 'bottom'
                            });
                        }
                    });// fs createDir
                }
            });//fs exist
        }
    });
}

/**
 * 获取疗区信息
 */
function getOrganizationInfo() {
    common.get({
        url: config.organizationUrl,
        isLoading: false,
        success: function (ret) {
            //填写疗区信息
            if (ret.content.length > 0) {
                //排序
                ret.content.sort(common.sortAsc);
                for (var i = 0; i < ret.content.length; i++) {
                    if (i == 0) {
                        $api.append($api.byId('areaSel'), '<option value="' + ret.content[i].id + '" selected="selected">' + ret.content[i].name + '</option>');
                    } else {
                        $api.append($api.byId('areaSel'), '<option value="' + ret.content[i].id + '">' + ret.content[i].name + '</option>');
                    }

                }
                openMainFrame();
            } else {
                api.alert({
                    msg: '没有查询到疗区'
                });
            }
        }
    });
}

function openMainFrame() {
    var header = document.querySelector('#header');
    var pos = $api.offset(header);
    api.openFrame({ // 打开Frame
        name: 'frm_main_content',
        url: 'frm_main_content.html',
        rect: {
            x: 0,
            y: pos.h, // 头部留位置
            w: 'auto',
            h: api.winHeight-pos.h //-footPos.h
        },
        pageParam: {
            areaId: $api.byId('areaSel').value
        },
        bounces: true,
        reload: true,
        vScrollBarEnabled: false
    });
}

/**
 * 修改下拉框发送刷新病人事件
 */
function sendAreaChangedEvent() {
    var areaId = $api.byId('areaSel').value;
    $api.setStorage(storageKey.areaId, areaId);
    api.sendEvent({
        name: eventName.InpatientAreaChanged,
        extra: {
            areaId: areaId
        }
    });
}
function backSystem(){
  api.closeToWin({
      name: 'win_system_grid'
  });
}
var tokenRet = function(personId){
    common.get({
        url: localServer + "/med/patient/getUserToken/"+personId,
        isLoading: false,
        success: function (ret) {
            var wsdata = ret.data;
            createWs(wsdata);
        }
    });
}

var nurerId = function(){

    common.get({
        url: config.loginUserInfoUrl,
        isLoading: false,
        success: function (ret) {
            var personId = ret.content.id;
            tokenRet(personId);

        }
    });

}
function createWs(wsdata) {
    var WsUrl = ws + encodeURIComponent(wsdata);

    wsClient = new WebSocket(WsUrl);
    wsClient.onopen = function() {
        onOpen()
    };
    wsClient.onclose = function() {
    };
    wsClient.onmessage = function(evt) {
        api.startPlay({
            path : 'widget://res/Global.mp3'
        }, function() {
        });
        onmessage(evt)
    };
    wsClient.onerror = function() {
    };

    $api.setStorage("createFlag","true");

}
function  onmessage(event) {
    var newAdviceCount= $api.getStorage(storageKey.newAdviceCount);
    newAdviceCount = parseInt(newAdviceCount) + parseInt(JSON.parse(event.data).notice)
    $api.setStorage(storageKey.newAdviceCount, newAdviceCount);
    api.sendEvent({
        name: 'changeNewAdviceNumber'
    });

}
function onOpen(){
}
function send(){

}


/**
 * 绑定退出事件
 */
function ExitApp() {
    var ci = 0;
    var time1, time2;
    api.addEventListener({
        name: 'keyback'
    }, function (ret, err) {
        if (ci == 0) {
            time1 = new Date().getTime();
            ci = 1;
            api.toast({
                msg: '再按一次返回键退出'
            });
        } else if (ci == 1) {
            time2 = new Date().getTime();
            if (time2 - time1 < 2000) {
                common.clearStorage();
                api.closeWidget({
                    id: api.appId,
                    retData: {
                        name: 'closeWidget'
                    },
                    silent: true
                });
            } else {
                ci = 0;
                api.toast({
                    msg: '再按一次返回键退出'
                });
            }
        }
    });
}