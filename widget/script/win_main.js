var fs;
var scanner;
var socketFlag = $api.getStorage(storageKey.createFlag);
apiready = function() {
    //alert('win_main')
    fs = api.require('fs');
    // scanner =  $api.getStorage(storageKey.cmcScan);
    scanner = api.require('cmcScan');
    //alert(scanner)
    alert(666);
    //scanner.open();

    api.parseTapmode();

    getUserInfo();
    var header = document.querySelector('#header');
    immersive(header);

    api.addEventListener({
        name: 'scanEvent'
    }, function(ret,err){
        alert(22222)
        if(ret.value.status===1){
            var scannerStatus = $api.getStorage(storageKey.scannerStatus)
            var value = ret.value.value;
            if (scannerStatus == 'changePatient'){
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
                                msg: ret.content,
                            }, function (ret, err) {
                                loadJCST()
                            });
                        }
                    });
                }else{
                    api.alert({
                        title: '提示',
                        msg: '扫描到的患者与当前患者不是同一个人',
                    }, function (ret, err) {
                        loadJCST()
                    });
                }
            } else{
                alert(111)
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
        isLoading: true,
        success: function (ret) {
            //alert(JSON.stringify(ret));
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
            api.hideProgress();
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
    // var footPos = $api.offset(document.querySelector('#footer'))
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
function toggleMenu(daList){
    var newAdviceCount =  $api.getStorage(storageKey.newAdviceCount);
    api.actionSheet({
        cancelTitle: '取消',
        // buttons: ['扫描','搜索','首页','新医嘱列表'+'('+daList+')']
        buttons: ['首页','搜索','新医嘱列表'+'('+newAdviceCount+')','修改密码','切换账户','直接退出系统']
    }, function(ret, err){
        if(ret.buttonIndex==1){
            api.closeWin();
        }else if(ret.buttonIndex==2){
            openPersonSearchFrame();
        }else if(ret.buttonIndex==3){
            newDocAdvice();
        }else if(ret.buttonIndex==4){
            changePwd();
        }else if(ret.buttonIndex==5){
            switchAccount();
        }else if(ret.buttonIndex==6){
            logOut();
        }
    });
}

//打开病人查询页面
function openPersonSearchFrame(){
    var header = document.querySelector('#header');
    var pos = $api.offset(header);
    api.openFrame({
        name: 'frm_person_search',
        url: './frm_person_search.html',
        rect: {
            x: api.winWidth-300,
            y: pos.h,
            w: 'auto',
            h: api.winHeight-pos.h
        },
        progress: {
            type:"default",
            title:"",
            text:"正在加载数据"
        },
        animation:{
            type:"flip",
            subType:"from_bottom"
        },
        vScrollBarEnabled: false,
        hScrollBarEnabled: false
    });
}
//新开医嘱列表
function newDocAdvice(){
    var header = document.querySelector('#header');
    var pos = $api.offset(header);
    api.openFrame({
        name: 'new_advice_details',
        url: './new_advice_details.html',
        rect: {
            x: 0,
            y: pos.h,
            w: 'auto',
            h: api.winHeight-pos.h
        },
        progress: {
            type:"default",
            title:"",
            text:"正在加载数据"
        },
        animation:{
            type:"flip",
            subType:"from_bottom"
        },
        vScrollBarEnabled: false,
        hScrollBarEnabled: false
    });
}
// 修改密码
function changePwd(){
    api.openWin({
        name: 'change_password',
        url: './change_password.html',
    });
}

// 登录页
function switchAccount(){
    common.clearStorage();
    api.closeToWin({
        name: 'root'
    });
}

// 直接退出
function logOut(){
    common.clearStorage();
    api.closeWidget({
        id: api.appId,
        retData: {
            name: 'closeWidget'
        },
        silent: true
    });
}


var tokenRet = function(personId){
    alert(personId)
    common.get({
        url:"http://192.168.1.112:8085/cmc-server/med/patient/getUserToken/"+personId,
        isLoading: true,
        success: function (ret) {
            alert("tokenRet");
            var wsdata = ret.data;
            alert(wsdata);

            createWs(wsdata);


        }
    });

    //alert("end");
}

var nurerId = function(){

    common.get({
        url: config.loginUserInfoUrl,
        isLoading: true,
        success: function (ret) {
            var personId = ret.content.id;
            tokenRet(personId);

        }
    });

}
function createWs(wsdata) {
    var WsUrl = "ws://192.168.1.112:8888/"+encodeURIComponent(wsdata);

    wsClient = new WebSocket(WsUrl);
    wsClient.onopen = function() {
        onOpen()
    };
    wsClient.onclose = function() {
        onClose();
    };
    wsClient.onmessage = function(evt) {
        alert("onmessage");
        onmessage(evt)
    };
    wsClient.onerror = function() {
        alert("error");
        onError()
    };

    $api.setStorage("createFlag","true");

}
function  onmessage(event) {
    var newAdviceCount= $api.getStorage(storageKey.newAdviceCount);
    newAdviceCount = parseInt(newAdviceCount) + parseInt(JSON.parse(event.data).notice)
    $api.setStorage(storageKey.newAdviceCount, newAdviceCount);
    var jiaobiao = "<div class='jiaobiao' id='sjb'>"+newAdviceCount+"</div>\n" +
        "        <span class='aui-iconfont aui-icon-menu' style='color:white;font-size:1rem;' id='hongdian'></span>";
    $api.html($api.byId("caidanlan"), jiaobiao);

}
function onOpen(){
}
function send(){

}


