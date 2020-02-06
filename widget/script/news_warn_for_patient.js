var areaCode = $api.getStorage(storageKey.areaCode);

apiready = function () {
    api.parseTapmode();
    queryList();
    api.addEventListener({
        name: 'changeNewsColorWhite'
    }, function(ret,err){
        queryList();
    });

}
/**
 * 医嘱数量记录
 */
var queryList = function () {
    console.log(areaCode)
    common.post({
        url: config.newsWarnList + areaCode,
        isLoading: true,
        dataType: "json",
        success: function (ret) {
            console.log(JSON.stringify(ret))
            $api.html($api.byId('newsWarnContentContainer'), "");
            var contentTmpl = doT.template($api.text($api.byId('newsWarnList')));
            $api.html($api.byId('newsWarnContentContainer'), contentTmpl(ret.content));
        }
    });
};

var redirectToAdviceList = function (obj,medPatientId,name) {
    // 关闭当前列表
    api.closeFrame();
    // 跳转至病人中心再跳转到医嘱列表
    var persons = $api.getStorage(storageKey.persons);
    var status = false
    //遍历查询
    for (var i = 0; i < persons.length; i++) {
        if(persons[i].id==medPatientId){
            status = true
            var person = persons[i]
            $api.setStorage(storageKey.currentPerson, person);
            api.openWin({
                name: "win_person_center",
                bounces: false,
                slidBackEnabled: false,
                reload: true,
                url: '../html/win_person_center.html',
                vScrollBarEnabled: true,
                hScrollBarEnabled: false,
                pageParam: {
                    redirectToAdviceList: true
                }
            });
        }
    }
    if (status===false) {
        api.toast({
            msg:  '暂未管理此病人，请刷新病人列表！',
            duration: config.duration,
            location: 'bottom'
        });
        return;
    }
}
function closeCurrentFrame(){
    api.closeFrame();
}
