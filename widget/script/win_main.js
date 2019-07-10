var fs;
apiready = function() {
  fs = api.require('fs');
  api.parseTapmode();
  getUserInfo();
  var header = document.querySelector('#header');
  immersive(header);
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
    // 保留
    // api.openFrame({
    //     name: 'win_layer_menu',
    //     bounces:false,
    //     rect : {
    //       x : 0,
    //       y : 0,
    //       w : 'auto',
    //       h : 'auto'
    //     },
    //     bgColor:'rgba(255, 255, 255, 0.4)',
    //     url: './frm_layer_menu.html'
    // });
    api.actionSheet({
        cancelTitle: '取消',
        buttons: ['扫描','搜索','首页','新医嘱列表'+'('+daList+')']
    }, function(ret, err){
        if(ret.buttonIndex==1){
            scanner.start();
        }else if(ret.buttonIndex==2){
            openPersonSearchFrame();
        }else if(ret.buttonIndex==3){
            api.closeWin();
        }else if(ret.buttonIndex==4){
            newDocAdvice();
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
        name: 'new_doctor_advice',
        url: './new_doctor_advice.html',
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