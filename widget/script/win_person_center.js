frames=["frm_person_center","frm_tizhengshouji","frm_yizhuzhixing","frm_huliwendang","frm_fuzhugongju","nurse/frm_nurse_hljld","nurse/frm_nurse_zyybtys","nurse/frm_nurse_dnzqtzs","nurse/frm_nurse_gczqtzs","nurse/frm_nurse_wcjyzqtzs","nurse/bloodGlucose"];
currentFrame = 0;
apiready = function(){
    api.parseTapmode();
    freshHeaderInfo();
    var newAdviceCount= $api.getStorage(storageKey.newAdviceCount);
    if (parseInt(newAdviceCount)>0){
        var jiaobiao = "<div class='jiaobiao' id='sjb'>"+newAdviceCount+"</div>\n" +
            "        <span class='aui-iconfont aui-icon-menu' style='color:white;font-size:1rem;' id='hongdian'></span>";
        $api.html($api.byId("icon"), jiaobiao);
    }
    api.addEventListener({
        name: 'changeNewAdviceNumber'
    }, function(ret,err){
        var newAdviceCount1= $api.getStorage(storageKey.newAdviceCount);
        if (parseInt(newAdviceCount1)>0){
            var jiaobiao = "<div class='jiaobiao' id='sjb'>"+newAdviceCount1+"</div>\n" +
                "        <span class='aui-iconfont aui-icon-menu' style='color:white;font-size:1rem;' id='hongdian'></span>";
            $api.html($api.byId("icon"), jiaobiao);
        }else{
            var jiaobiao = "<span class='aui-iconfont aui-icon-menu' style='color:white;font-size:1rem;'></span>";
            $api.html($api.byId("icon"), jiaobiao);
        }
    });
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

    //点击返回键关闭当前window窗口
    api.addEventListener({
        name: 'keyback'
      },function(ret, err) {
        api.closeWin();
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

function closeWin() {
    api.closeWin();
}

function openFrameContent(page){
  api.closeFrame({
      name: 'frm_person_search'
  });

  if (page === 'frm_tizhengshouji'||page === 'frm_huliwendang'||page === 'frm_fuzhugongju'){
      api.toast({
          msg: '功能暂未开放，敬请期待！'
      });
      return;
  }
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

