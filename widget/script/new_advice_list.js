var userId = $api.getStorage(storageKey.userId);
apiready = function () {
    api.parseTapmode();
    newAdviceList();


}
/**
 * 医嘱记录
 */
var newAdviceList = function () {

    common.post({
        url: config.adviceTipList,
        isLoading: true,
        data: JSON.stringify({
            nurseId:  userId
        }),
        dataType: "json",
        success: function (ret) {
            $api.html($api.byId('newAdviceContentContainer'), "");
            var contentTmpl = doT.template($api.text($api.byId('newAdviceList')));
            $api.html($api.byId('newAdviceContentContainer'), contentTmpl(ret.content.list));
        }
    });
};


var changeAdviceRead = function (obj,id) {
    var isGreen = $api.hasCls(obj, 'font-green');
    if (isGreen) {
        common.get({
                url: config.adviceTipRead + id + "/" + userId,
                isLoading: true,
                text: "已读...",
                success: function (ret) {
                    if (ret.type==='success') {
                        $api.removeCls(obj, 'font-green');
                        $api.addCls(obj, 'font-white');
                        $api.removeCls($api.first(obj,'span'), 'font-green');
                        $api.addCls($api.first(obj,'span'), 'font-white');
                        var newAdviceCount = $api.getStorage(storageKey.newAdviceCount);
                        $api.setStorage(storageKey.newAdviceCount,parseInt(newAdviceCount)-1);
                        api.sendEvent({
                            name: 'changeNewAdviceNumber'
                        });
                    }
                }
            });
    }

}

function changeAllRead(){
    var number = $api.getStorage(storageKey.newAdviceCount);
    if (number <= 0){
        api.alert({
            title: '提示',
            msg: '没有可操作已读的记录！'});
    }else{
        common.get({
            url: config.adviceAllRead + userId,
            isLoading: true,
            success: function (ret) {
                if (ret.type==='success') {
                    $api.setStorage(storageKey.newAdviceCount,0);
                    api.sendEvent({
                        name: 'changeNewAdviceNumber'
                    });
                    api.alert({
                        title: '提示',
                        msg: '操作成功！'}
                        , function (ret, err) {
                            closeCurrentFrame()
                        });

                }else{
                    api.alert({
                        title: '提示',
                        msg: '操作失败，请刷新后重试！'});
                }
            }
        });
    }
}

function closeCurrentFrame(){
    api.closeFrame();
}