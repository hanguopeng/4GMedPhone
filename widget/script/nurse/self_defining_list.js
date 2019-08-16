var key
var value
apiready = function () {
    api.parseTapmode();
    getSelfDefining();


}
/**
 * 医嘱记录
 */
var getSelfDefining = function () {
    common.get({
        url: config.getSelfDefining,
        isLoading: true,
        success: function (ret) {
            $api.html($api.byId('selfDefiningContentContainer'), "");
            var contentTmpl = doT.template($api.text($api.byId('selfDefiningList')));
            $api.html($api.byId('selfDefiningContentContainer'), contentTmpl(ret.content));
        }
    });
};

function changeKey(obj) {
    if (!isEmpty(key)){
        $api.removeCls($api.byId("self"+key),"font-green")
    }
    key = $api.attr(obj,"id").substring(4)
    value = $api.attr(obj,"name")
    $api.addCls(obj,"font-green")
}

function save(){

    api.sendEvent({
        name: "chooseSelfDefining",
        extra: {
            key: key,
            value: value
        }
    });
    api.closeFrame();

}


function isEmpty(str){
    if (str === null || str ==='' || str === undefined){
        return true
    }
}