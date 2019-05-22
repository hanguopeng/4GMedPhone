var person = $api.getStorage(storageKey.currentPerson);
var patientId = person.id;
var page = 1;
apiready = function(){
    api.parseTapmode();

    personInfo();
    bloodGlucose();
}

var personInfo = function(){
    var personJson = {
        name: person.name,
        sex: person.sex?"男":"女",
        age: person.age,
        ryrq: person.inHospitalTime,
        ks: person.organizationName,
        ch: person.medBedName,
        zyh: person.registerNumber
    }
    var personInfoTmpl = doT.template($api.text($api.byId('personInfo-tmpl')));
    $api.html($api.byId('personInfo'), personInfoTmpl(personJson));
}



var bloodGlucose = function(){
    /*common.post({
        url: config.nurseLogCommon,
        isLoading: true,
        data:JSON.stringify({
            patientId: patientId,
            page: page,
            templateList:[{"templateCode":"xtjchl","templateVersion":1}]
        }),
        success:function(ret){
            //alert(JSON.stringify(ret));
            var totalCount = ret.content.totalCount;
            var pageSize = ret.content.pageSize;
            var totalPage = ret.content.totalPage;
            var currPage = ret.content.currPage;
            var pageJson = {
                totalCount:totalCount,
                pageSize:pageSize,
                totalPage:totalPage,
                currPage:page
            };
            pageInfo(pageJson);

            $api.html($api.byId('tbody'),"");
            var contentTmpl = doT.template($api.text($api.byId('content-tmpl')));
            if(ret.content.list){
            for(var i=0;i<ret.content.list.length;i++){
                var obj = dealItemKeyValue(ret.content.list[i].itemList);
                obj.id = ret.content.list[i].id;
                $api.append($api.byId('tbody'), contentTmpl(obj));
            }
        }
        }
    });*/
}

var dealItemKeyValue = function(itemList){
    var obj = {};
    for(var i =0;i<itemList.length;i++){
        var key = itemList[i].key;
        var value = itemList[i].value;
        obj[""+key] = value;
    }
    return obj;
};



var pageInfo = function(pageJson){
    var pageInfoTmpl = doT.template($api.text($api.byId('pageInfo-tmpl')));
    $api.html($api.byId('pageDivContainer'), pageInfoTmpl(pageJson));
}

var firstPage = function(){
    page = 1;
    bloodGlucose();
}

var prePage = function(){
    var currentPage = $api.attr($api.byId('pageNumContainer'),'data-currentPage');
    page = parseInt(currentPage) - 1;
    bloodGlucose();
}

var nextPage = function(size){
    var currentPage = $api.attr($api.byId('pageNumContainer'),'data-currentPage');
    page = parseInt(currentPage) + 1;
    bloodGlucose();
}
