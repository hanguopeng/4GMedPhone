function toggleMenu(daList){
    var newAdviceCount =  $api.getStorage(storageKey.newAdviceCount);
    api.actionSheet({
        cancelTitle: '取消',
        // buttons: ['扫描','搜索','首页','新医嘱列表'+'('+daList+')']
        buttons: ['首页','搜索','新医嘱列表'+'('+newAdviceCount+')','修改密码','切换账户','直接退出系统']
    }, function(ret, err){
        if(ret.buttonIndex==1){
            winMain();
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

// 首页
function winMain(){
    api.closeToWin({
        name: 'win_main'
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
        name: 'new_advice_list',
        url: './new_advice_list.html',
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
    api.sendEvent({
        name: 'goRoot'
    });
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