apiready = function() {
    api.parseTapmode();
};

function openFrame(page){
  api.sendEvent({
      name: eventName.openFrame,
      extra: {
          name: page
      }
  });
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
