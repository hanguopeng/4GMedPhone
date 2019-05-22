apiready = function(){
    api.parseTapmode();
}


var changeTab = function(obj){
    var auiActive = $api.hasCls(obj,'aui-active');
    if(!auiActive){
        $api.removeCls($api.byId('tab-tzcj'), 'aui-active');
        $api.removeCls($api.byId('tab-lsjl'), 'aui-active');
        $api.removeCls($api.byId('tab-wdqx'), 'aui-active');

        $api.addCls(obj, 'aui-active');
    }

    var dataTo = $api.attr(obj,'data-to');//获取化验ID
    var activeTab = $api.byId(dataTo);

    var active = $api.hasCls(activeTab,'active');
    if(!active){
        $api.removeCls($api.byId('tzcj'), 'active');
        $api.removeCls($api.byId('lsjl'), 'active');
        $api.removeCls($api.byId('wdqx'), 'active');

        $api.addCls(activeTab, 'active');
    }
}
