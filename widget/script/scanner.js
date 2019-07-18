


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



/*function listenerChange(){

    api.addEventListener({
        name: 'scanEvent'
    }, function(ret,err){
        //alert(22222)
        if(ret.value.status===1){
            var scannerStatus = $api.getStorage(storageKey.scannerStatus)
            var value = ret.value.value;
            alert(value);
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
            }else if(scannerStatus == 'rukequeren'){
                    alert("入科确认");
            } else{
                //alert(111)
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

    scanner.start();
    api.removeEventListener({
        name:'scanEvent'
    });
}*/
