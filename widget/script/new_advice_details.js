var userId = $api.getStorage(storageKey.userId);
var adviceStatus  = 0
var thisList=null
apiready = function () {
    api.parseTapmode();
    // $api.html($api.byId('select'), "");
    // var personInfo = doT.template($api.text($api.byId('selectList')));
    // var persons = $api.getStorage(storageKey.persons);
    // $api.html($api.byId('select'), personInfo(persons));

    newAdvice();


}
/**
 * 医嘱记录
 */
var newAdvice = function (status) {
    thisList=null
    if (isEmpty(status)){
        status = adviceStatus
    }else{
        adviceStatus = status
    }
    $api.removeCls($api.byId('tab-new-start-advice'), 'aui-active');
    $api.removeCls($api.byId('tab-new-end-advice'), 'aui-active');
    if (status==1){
        $api.addCls($api.byId('tab-new-end-advice'), 'aui-active');
    } else{
        $api.addCls($api.byId('tab-new-start-advice'), 'aui-active');
    }
    // var selectValue = $api.val($api.byId('selectValue'));
    var selectValue = 'all';
    common.post({
        url: config.adviceTipList,
        isLoading: true,
        data: JSON.stringify({
            nurseId:  userId,
            type:  status,
            factor: selectValue
        }),
        dataType: "json",
        success: function (ret) {
            $api.html($api.byId('newAdviceContentContainer'), "");
            var contentTmpl = doT.template($api.text($api.byId('newAdviceList')));
            thisList = ret.content.list
            $api.html($api.byId('newAdviceContentContainer'), contentTmpl(ret.content.list));
        }
    });
};

/**
 *  医嘱点击显示详情，再次点击隐藏
 */
var changeAdviceShow = function (obj,id) {
    var isBlack = $api.hasCls(obj, 'font-black');
    if (isBlack) {
        common.get({
                url: config.adviceTipRead + id + "/" + userId,
                isLoading: true,
                success: function (ret) {
                    if (ret.type==='success') {
                        $api.removeCls(obj, 'font-black');
                        $api.addCls(obj, 'font-gray');
                        var newAdviceCount = $api.getStorage(storageKey.newAdviceCount);
                        $api.setStorage(storageKey.newAdviceCount,parseInt(newAdviceCount)-1);
                        api.sendEvent({
                            name: 'changeNewAdviceNumber'
                        });
                    }
                }
            });
    }
    var isHide = $api.hasCls($api.next(obj), 'hide');
    if (isHide){
        $api.removeCls($api.next(obj), 'hide');
        $api.addCls($api.next(obj), 'show');
    } else{
        $api.removeCls($api.next(obj), 'show');
        $api.addCls($api.next(obj), 'hide');
    }
}

function changeAllRead(){
    common.get({
        url: config.adviceAllRead + userId+ "/" + adviceStatus,
        isLoading: true,
        success: function (ret) {
            if (ret.type==='success') {
                for (var i=0 ; i<thisList.length; i++){
                    var item = thisList[i]
                    var obj = $api.dom('#newAdvice'+ item.id)
                    var isBlack = $api.hasCls(obj, 'font-black');
                    if (isBlack) {
                        $api.removeCls(obj, 'font-black');
                        $api.addCls(obj, 'font-gray');
                    }
                }
                var newAdviceCount = $api.getStorage(storageKey.newAdviceCount);
                var num = parseInt(newAdviceCount) - parseInt(ret.num)
                $api.setStorage(storageKey.newAdviceCount,num);
                api.sendEvent({
                    name: 'changeNewAdviceNumber'
                });
                api.alert({
                    title: '提示',
                    msg: '操作成功！'});

            }else{
                api.alert({
                    title: '提示',
                    msg: '操作失败，请刷新后重试！'});
            }
        }
    });
}

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}
var changeThisShow = function(obj){
    var isHide = $api.hasCls(obj, 'hide');
    if (isHide){
        $api.removeCls(obj, 'hide');
        $api.addCls(obj, 'show');
    } else{
        $api.removeCls(obj, 'show');
        $api.addCls(obj, 'hide');
    }
}



function closeCurrentFrame(){
    api.closeFrame();
}


function isEmpty(str){
    if (str === null || str ==='' || str === undefined){
        return true
    }
}