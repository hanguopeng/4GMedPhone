var person = $api.getStorage(storageKey.currentPerson);
var patientId = person.id;
apiready = function () {
    api.parseTapmode();
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
    common.get({
        url: config.adviceDetail + patientId,
        isLoading: true,
        success: function (ret) {
            $api.html($api.byId('newAdviceContentContainer'), "");
            var contentTmpl = doT.template($api.text($api.byId('newAdviceList')));
            $api.html($api.byId('newAdviceContentContainer'), contentTmpl(ret.content));
        }
    });
};

/**
 *  医嘱点击显示详情，再次点击隐藏
 */
var changeAdviceShow = function (obj) {
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