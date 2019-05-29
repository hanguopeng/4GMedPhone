var hlwsarr = $api.getStorage(storageKey.careSheet);
apiready = function() {
    api.parseTapmode();
    //alert($api.getStorage(storageKey.careSheet));
    //hlwsList();
};

function openFrame(page){
    //hlws();
  api.sendEvent({
      name: eventName.openFrame,
      extra: {
          name: page
      }
  });
}
function hlwsList(){
    var item = {}  ;
    //alert(hlwsarr);
    //var hlList = hlwsarr.split(",");
    alert(hlwsarr);
    for(var i=0;i<hlwsarr.length;i++){
        if(hlwsarr[i]=="PICC穿刺记录"){
            item.name=hlwsarr[i];
            item.sheetName = "frm_PICC";
            item.picName = "PICC";
        }

    }
    alert(JSON.stringify(item));
    var contentTmpl = doT.template($api.text($api.byId('hlws-tpl')));
    $api.html($api.byId('section1'), contentTmpl(item));
}
/*function hlws(){
    common.get({
        url:config.lqhlws,
        isLoading:false,
        success:function (ret) {
            alert(JSON.stringify(ret));
        }
    })
}*/

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
