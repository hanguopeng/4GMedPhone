var fs;
var scanner;
apiready = function() {
  fs = api.require('fs');
  scanner = api.require('cmcScan');
  api.parseTapmode();
  getUserInfo();

  var header = document.querySelector('#header');
  immersive(header);
  
  scanner.open();
    api.addEventListener({
        name: 'scanEvent'
    }, function(ret,err){
        if(ret.value.status===1){
            var value = ret.value.value;
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
        }else if(ret.status===0){
            api.toast({
                msg: '超时或解码失败，请重试！',
                duration: config.duration,
                location: 'bottom'
            });
        }
    });
  api.addEventListener({
      name : 'keyback'
  }, function(ret, err) {
    scanner.stop_sync();
    api.closeWin();
  });
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

//打开扫描
function scan(){
  scanner.start();
 /*   scanner.start({
    },function(ret,err){
        if(ret.status===1){
            var value = ret.value;
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
        }else if(ret.status===0){
            api.toast({
                msg: '超时或解码失败，请重试！',
                duration: config.duration,
                location: 'bottom'
            });
        }
    });*/
}

function backSystem(){
  api.closeToWin({
      name: 'win_system_grid'
  });
}
