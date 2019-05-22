apiready = function(){
    api.parseTapmode();
}

var changeTab = function(obj){
    var auiActive = $api.hasCls(obj,'aui-active');
    if(!auiActive){
        $api.removeCls($api.byId('tab-fsdxxlr'), 'aui-active');
        $api.removeCls($api.byId('tab-qbxxkr'), 'aui-active');

        $api.addCls(obj, 'aui-active');
    }

    var dataTo = $api.attr(obj,'data-to');//获取化验ID
    var activeTab = $api.byId(dataTo);

    var active = $api.hasCls(activeTab,'active');
    if(!active){
        $api.removeCls($api.byId('fsdxxlr'), 'active');
        $api.removeCls($api.byId('qbxxkr'), 'active');

        $api.addCls(activeTab, 'active');

        $api.removeCls($api.dom($api.byId('fsdxxlr'), '#lsjl'), 'active');
    }
}


var openWin = function(page){
    api.openWin({
        name: page,
        bounces: false,
        slidBackEnabled : false,
        reload:true,
        url: '../html/'+page+'.html',
        vScrollBarEnabled:true,
        hScrollBarEnabled:false
    });

}


var clickBottomTab = function(parent,id){
    var activeTab = $api.dom($api.byId(parent), '#'+id);

    var active = $api.hasCls(activeTab,'active');
    if(!active){
        $api.removeCls($api.dom($api.byId(parent), '#lsjl'), 'active');
        $api.addCls(activeTab, 'active');
    }
}

var hideBottomTab = function(parent,id){
    $api.removeCls($api.dom($api.byId(parent), '#'+id), 'active');
}
