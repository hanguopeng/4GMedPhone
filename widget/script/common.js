function openMyToolFrame(){
  $api.addEvt($api.dom('.search-person'), 'click', function(){
    api.openFrame({
        name: 'frm_tools',
        url: './frm_tools.html',
        rect: {
            x: api.winWidth-300,
            y: api.winHeight - api.frameHeight + 20,
            w: 300,
            h: api.frameHeight
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
        vScrollBarEnabled: true,
        hScrollBarEnabled: false
    });
  });
}

/*
 * 统一请求处理方法，后续可能会涉及到如果token失效要跳转到登录页面的操作
 * 该js需要放到apiready方法之后
 * 如果isLoading=true,success方法中需要自己使用api.hideProgress方法，进行关闭遮罩,主要是ajax多次调用时遮罩一直可以保持
 */
var common = {
  "loginInvalid": false,
  "notNull":function(val){
    return val||"";
  },
  "clearStorage":function(){
    var loginName = $api.getStorage(storageKey.loginName);
    $api.clearStorage();
    if(loginName){
      $api.setStorage(storageKey.loginName, loginName);
    }
     for(var key in config.storageKey){
       if(storageKey[key]!="loginName"){
           //如果登录选择了记录用户名，那么用户信息不删除
           $api.rmStorage(config.storageKey[key]);
       }
     }
  },
  "sortAsc":function(x,y){
    if (x < y) {
        return -1;
    } else if (x > y) {
        return 1;
    } else {
        return 0;
    }
  },
  "beginTransSync":function(db){
    db.transactionSync({
      name: cmcdb.name,
      operation: 'begin'
    }, function(ret, err) {
        if (ret.status) {
        } else {
            alert(JSON.stringify(err));
        }
    });
  },
  "commitTransSync":function(db){
    db.transactionSync({
      name: cmcdb.name,
      operation: 'commit'
    }, function(ret, err) {
        if (ret.status) {
        } else {
            alert(JSON.stringify(err));
        }
    });
  },
  "rollbackTransSync":function(db){
    db.transactionSync({
      name: cmcdb.name,
      operation: 'rollback'
    }, function(ret, err) {
        if (ret.status) {
        } else {
            alert(JSON.stringify(err));
        }
    });
  },
  "getCurrentPerson": function(){
    //获取当前病人的信息
    return $api.getStorage(storageKey.currentPerson);
  },
  "post":function(param){
    if(param.isLoading||false){
      api.showProgress({
        title:param.title||'',
        text: param.text||'努力加载中...'
      });
    }

    //获取离线读取标示
    var offline = $api.getStorage(storageKey.offlineFlag)=="on"?true:false;
    if( offline && param.offline){
      //离线 有离线函数, 走离线函数
      param.offline();
    }else{
      //在线 直接走网络
      //console.log(param.data)
      api.ajax({
          url: param.url,
          method: 'post',
          headers: {
            "Content-Type": "application/json",
            "token":$api.getStorage(storageKey.token)
          },
          dataType: 'json',
          data: {
              body: param.data
          }
      },function(ret, err){
        if (ret) {
            if(ret.code==200){
              if(param.success){
                param.success(ret);
                  if(param.isLoading||false){
                      api.hideProgress();
                  }
              }else{
                if(param.isLoading||false){
                    api.hideProgress();
                }
              }
            }else if(ret.code==401){
              //token失效
              if(param.isLoading||false){
                  api.hideProgress();
              }
              if(!common.loginInvalid){
                common.loginInvalid = true;
                api.alert({
                    title: '提示',
                    msg: '长时间未操作或该账号在其它应用登录,请重新登录！',
                }, function(ret, err){
                  common.clearStorage();
                  api.closeToWin({
                      name: 'root'
                  });
                });
              }
            }else{
                if(param.isLoading||false){
                    api.hideProgress();
                }
                if (param.fail) {
                    param.fail(err);
                }else{
                  api.toast({
                      msg: ret.msg,
                      duration: config.duration,
                      location: 'bottom'
                  });
                }
            }

        } else {
          if(param.isLoading||false){
              api.hideProgress();
          }
          if(param.fail){
            param.fail(err);
          }else{
            if(err.statusCode==404){
              api.alert({
                  title: '404错误',
                  msg: '没有找到资源',
              });
              // alert( JSON.stringify( err ) );
            }else if(err.code===0){
              api.alert({
                title: '网络连接错误',
                msg: '请检查网络状态'
              });
            }else{
              api.alert({
                  title: '错误',
                  msg: '系统错误，请联系管理员'
              });
              //调试的时候使用
              // alert( JSON.stringify( err ) );
            }
          }
        }
      });
    }
  },
  "get":function(param){
    if(param.isLoading||false){
      api.showProgress({
        title:param.title||'',
        text: param.text||'努力加载中...'
      });
    }

    //获取离线读取标示
    var offline = $api.getStorage(storageKey.offlineFlag)=="on"?true:false;
    if( offline && param.offline){
      //离线 有离线函数, 走离线函数
      param.offline();
    }else{
      //在线 直接走网络
      api.ajax({
          url: param.url,
          method: 'get',
          headers: {
            "Content-Type": "application/json",
            "token":$api.getStorage(storageKey.token)
          },
          dataType: 'json'
      },function(ret, err){
          console.log(JSON.stringify(ret));
        if (ret) {
            //console.log(param.url+"------------"+JSON.stringify(ret));
            if(ret.code==200){
              if(param.success){
                param.success(ret);
                if (param.isLoading || false) {
                  api.hideProgress();
                }
              }else{
                if(param.isLoading||false){
                    api.hideProgress();
                }
              }
            }else if(ret.code==401){

              //token失效
              if(param.isLoading||false){
                  api.hideProgress();
              }
              if(!common.loginInvalid){
                common.loginInvalid = true;
                api.alert({
                    title: '提示',
                    msg: '长时间未操作或该账号在其它应用登录,请重新登录！',
                }, function(ret, err){
                  common.clearStorage();
                  api.closeToWin({
                      name: 'root'
                  });
                });
              }
            }else{
                if(param.isLoading||false){
                    api.hideProgress();
                }
                if (param.fail) {
                    param.fail(err);
                }else{
                    // alert(JSON.stringify(ret))
                  api.toast({
                      msg: ret.msg,
                      duration: config.duration,
                      location: 'bottom'
                  });
                }
            }

        } else {
          if(param.isLoading||false){
              api.hideProgress();
          }
          if(param.fail){
            param.fail(err);
          }else{
            if(err.statusCode==404){
              api.alert({
                  title: '404错误',
                  msg: '没有找到资源',
              });
              // alert( JSON.stringify( err ) );
            }else if(err.code===0){
              api.alert({
                  title: '网络连接错误',
                  msg: '请检查网络状态'
              });
            }else{
              api.alert({
                  title: '错误',
                  msg: '系统错误，请联系管理员'
              });
              //调试的时候使用
              // alert("get" + JSON.stringify( err ) );
            }
          }
        }
      });
    }
  }
}