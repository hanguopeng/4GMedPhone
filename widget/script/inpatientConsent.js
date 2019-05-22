apiready = function(){
    api.parseTapmode();
}

var clickBottomTab = function(parent,id){
    var activeTab = $api.dom($api.byId(parent), '#'+id);

    var active = $api.hasCls(activeTab,'active');
    if(!active){
        $api.addCls(activeTab, 'active');
    }
}

var hideBottomTab = function(parent,id){
    $api.removeCls($api.dom($api.byId(parent), '#'+id), 'active');
}
