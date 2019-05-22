let scanner;
apiready = function() {
    scanner = api.require('cmcScan');
    scanner.stop();
    api.parseTapmode();
    getUserInfo();

    scanner.open();

    api.addEventListener({
        name : 'keyback'
    }, function(ret, err) {
        scanner.stop();
        api.closeWin();
    });
};

//打开扫描
function scan(){
    scanner.start({
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
            scanner.stop();
            window.location.reload();
        }else if(ret.status===0){
            api.toast({
                msg: '超时或解码失败，请重试！',
                duration: config.duration,
                location: 'bottom'
            });
            scanner.stop();
            window.location.reload();
        }
    });
}