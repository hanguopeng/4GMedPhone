frames=["frm_person_center","frm_tizhengshouji","frm_yizhuzhixing","frm_huliwendang","frm_fuzhugongju","nurse/frm_nurse_hljld","nurse/frm_nurse_zyybtys","nurse/frm_nurse_dnzqtzs","nurse/frm_nurse_gczqtzs","nurse/frm_nurse_wcjyzqtzs","nurse/bloodGlucose"];
currentFrame = 0;

var scanner;

apiready = function(){
    api.parseTapmode();
    freshHeaderInfo();
    openMainFrame();

    //监听病人列表查询点击切换
    api.addEventListener({
        name: eventName.personChoosed
    }, function(ret, err){
        $api.setStorage(storageKey.currentIdx, ret.value.index);
        var allPersons = $api.getStorage(storageKey.persons);
        $api.setStorage(storageKey.currentPerson, allPersons[ret.value.index]);
        freshHeaderInfo();
        refreshCurrenFrame();
    });

    //添加其它页面打开某个frm的监听，需要在 frames 变量中添加对应的值
    api.addEventListener({
        name: eventName.openFrame
    }, function(ret, err){
        openFrameContent(ret.value.name);
    });

    // 保留
    // api.addEventListener({
    //     name: eventName.layerEvent
    // }, function(ret, err){
    //     if(ret.value.type==0){
    //       scanner.start({
    //       },function(ret,err){
    //     			if(ret.status===1){
    //             var value = ret.value;
    //             var persons = $api.getStorage(storageKey.persons);
    //             //遍历查询
    //             for (var i = 0; i < persons.length; i++) {
    //               if(persons[i].id==value){
    //                 api.sendEvent({
    //                     name: eventName.personChoosed,
    //                     extra: {
    //                         index: i
    //                     }
    //                 });
    //                 return;
    //               }
    //             }
    //             api.alert({
    //                 title: '提示',
    //                 msg: '系统未管理此病人，请刷新后重试',
    //             });
    //     			}else if(ret.status===0){
    //             api.toast({
    //                 msg: '超时或解码失败，请重试！',
    //                 duration: config.duration,
    //                 location: 'bottom'
    //             });
    //     			}
    //     	});
    //     }else if(ret.value.type==1){
    //       openPersonSearchFrame();
    //     }else if(ret.value.type==2){
    //       api.closeWin();
    //     }
    // });


    //点击返回键关闭当前window窗口
    api.addEventListener({
        name: 'keyback'
      },function(ret, err) {
        api.closeWin();
    });
    //没有设备的放最上面报错不能继续执行
    scanner = api.require('cmcScan');
    scanner.open();
}

function toggleMenu(){
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
      buttons: ['扫描','搜索','首页']
  }, function(ret, err){
      if(ret.buttonIndex==1){
        scanner.start({
        },function(ret,err){
            if(ret.status===1){
              var value = ret.value;
              var persons = $api.getStorage(storageKey.persons);
              //遍历查询
              for (var i = 0; i < persons.length; i++) {
                if(persons[i].id==value){
                  api.sendEvent({
                      name: eventName.personChoosed,
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
      }else if(ret.buttonIndex==2){
        openPersonSearchFrame();
      }else if(ret.buttonIndex==3){
        api.closeWin();
      }
  });

}

function freshHeaderInfo(){
  //获取当前的病人信息
  var person = $api.getStorage(storageKey.currentPerson);
  var personIndex = $api.getStorage(storageKey.currentIdx);
  var personData = {
      "person": person,
      "personIndex": personIndex
  };

  var headerInfo = doT.template($api.text($api.byId('header-tpl')));
  $api.html($api.byId('header'), headerInfo(personData));
}

function openMainFrame() {
    var header = document.querySelector('#header');
    var pos = $api.offset(header);
    var footPos = $api.offset(document.querySelector('#footer'))
    api.openFrame({ // 打开Frame
        name: 'frm_person_center',
        url: 'frm_person_center.html',
        rect: {
            x: 0,
            y: pos.h, // 头部留位置
            w: 'auto',
            h: api.winHeight-pos.h-footPos.h
        },
        bounces: true,
        reload: true,
        vScrollBarEnabled: false
    });
}

//左箭头点击选择上一个病人
function prePerson(){
  var personIndex = Number($api.getStorage(storageKey.currentIdx));
  if(personIndex<=0){
    api.toast({
      msg : '已经是第一个病人了'
    });
  }else{
    var allPersons = $api.getStorage(storageKey.persons);
    personIndex = personIndex - 1;
    while(personIndex>0 && !allPersons[personIndex].id /*空床位*/){
      personIndex = personIndex - 1;
    }
    if(allPersons[personIndex].id){
      $api.setStorage(storageKey.currentIdx, personIndex);
      $api.setStorage(storageKey.currentPerson, allPersons[personIndex]);
      freshHeaderInfo();
      refreshCurrenFrame();
    }else{
      api.toast({
        msg : '已经是第一个病人了'
      });
    }
  }
}

//右箭头点击选择下一个病人
function nextPerson(){
  var idx = Number($api.getStorage('currentIdx'));
  var lastIdx = Number($api.getStorage('lastIdx'));
  if(idx>=lastIdx){
    api.toast({
      msg : '已经是最后一个病人了'
    });
  }else{
    var allPersons = $api.getStorage('persons');
    idx = idx+1;
    while(idx<lastIdx && !allPersons[idx].id /*空床位*/){
      idx = idx+1;
    }
    if(allPersons[idx].id){
      $api.setStorage('currentIdx', idx);
      $api.setStorage('currentPerson', allPersons[idx]);
      freshHeaderInfo();
      refreshCurrenFrame();
    }else{
      api.toast({
        msg : '已经是最后一个病人了'
      });
    }
  }
}

function closeWin() {
    api.closeWin();
}

function openFrameContent(page){
  api.closeFrame({
      name: 'frm_person_search'
  });

  var header = document.querySelector('#header');
  var pos = $api.offset(header);
  var footPos = $api.offset(document.querySelector('#footer'))
  api.openFrame({ // 打开Frame
      name: page,
      url: '../html/'+ page +'.html',
      rect: {
          x: 0,
          y: pos.h, // 头部留位置
          w: 'auto',
          h: api.winHeight-pos.h-footPos.h
      },
      bounces: false,
      reload: true,
      vScrollBarEnabled: false
  });

  for (var i = 0; i < frames.length; i++){
    if(frames[i]===page){
      api.setFrameAttr({
        name: frames[i],
        hidden: false
      });
      currentFrame = i;

      //console.log("page="+page + ", currentFrame="+currentFrame);
    }else{
      api.setFrameAttr({
        name: frames[i],
        hidden: true
      });
    }
  }
}

//根据左右选择病人刷新当前frame页面
function refreshCurrenFrame(){
  openFrameContent(frames[currentFrame]);
}

//打开病人查询页面
function openPersonSearchFrame(){
  var header = document.querySelector('#header');
  var pos = $api.offset(header);
  var footPos = $api.offset(document.querySelector('#footer'))
  api.openFrame({
      name: 'frm_person_search',
      url: './frm_person_search.html',
      rect: {
          x: api.winWidth-300,
          y: pos.h,
          w: 'auto',
          h: api.winHeight-pos.h-footPos.h
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
