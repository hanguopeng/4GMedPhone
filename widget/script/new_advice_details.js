var areaId;
var userId = $api.getStorage(storageKey.userId);
apiready = function () {
    api.parseTapmode();
    areaId =  api.pageParam.areaId
    newAdvice();
}
/**
 * 医嘱记录
 */
var newAdvice = function (status) {
    $api.removeCls($api.byId('tab-new-start-advice'), 'aui-active');
    $api.removeCls($api.byId('tab-new-end-advice'), 'aui-active');
    if (status==1){
        $api.addCls($api.byId('tab-new-end-advice'), 'aui-active');
    } else{
        $api.addCls($api.byId('tab-new-start-advice'), 'aui-active');
    }
    if (isEmpty(status)){
        status = 0
    }
    alert(config.adviceTipList + areaId + "/" + userId + "/" +status)
    common.get({
        url: config.adviceTipList + areaId + "/" + userId + "/" +status,
        isLoading: true,
        success: function (ret) {
            alert(JSON.parse(ret.content.list))
            $api.html($api.byId('newAdviceContentContainer'), "");
            var contentTmpl = doT.template($api.text($api.byId('newAdviceList')));
            $api.html($api.byId('newAdviceContentContainer'), contentTmpl(ret.content.list));
        }
    });
};

/**
 *  医嘱点击显示详情，再次点击隐藏
 */
var changeAdviceShow = function (obj,id) {
    // 第一次点击将框变成红色，以后每次进来判断是否有红色框，有红色框不再触发已读操作
    var isGreen = $api.hasCls(obj, 'border-green');
    if (isGreen) {
        $api.removeCls(obj, 'border-green');
        $api.addCls(obj, 'border-red');
        common.get({
                url: config.adviceTipRead + id + "/" + userId,
                isLoading: true,
                success: function (ret) {
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



function isEmpty(str){
    if (str == null || str =='' || str == undefined){
        return true
    }
}

function closeCurrentFrame(){
    api.closeFrame();
}


function isEmpty(str){
    if (str == null || str =='' || str == undefined){
        return true
    }
}