
apiready = function(){

    newAdvice();
    var tab = new auiTab({
        element: document.getElementById("tab"),
        index: 1,
        repeatClick: false
    }, function (ret) {
        $api.html($api.byId("content"), "");
        if (ret.index == 1) {
            newAdvice();
        } else if (ret.index == 2) {
            stopAdvice();
        }
    });
}


var newAdvice = function(){
    var contentTmpl = doT.template($api.text($api.byId('newstart-tpl')));
    $api.html($api.byId('content'), contentTmpl(''));

    var contentTmp = doT.template($api.text($api.byId('yzxx-tpl')));
    $api.html($api.byId('contentAdvice'),contentTmp(''));
}

var stopAdvice = function(){

}

function docAdvDetails(ele){
    var hideFlag = $api.hasCls(ele.children[2],"aui-hide");
    if(hideFlag){
       $api.removeCls(ele.children[2],"aui-hide");
    }else{
        $api.addCls(ele.children[2],"aui-hide");
    }
}