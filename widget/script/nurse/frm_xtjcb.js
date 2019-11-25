var page=1;
var limit=10;
var currIdx = 1;
var re = /^[1-9]+[0-9]*]*$/;
apiready = function(){
    api.parseTapmode();

    //定义点击tab
    var tab = new auiTab({
        element:document.getElementById("tab"),
        index: 1,
        repeatClick:false
    },function(ret){
        if(ret.index==1){
            //血糖录入
            initPager();
            currIdx = 1;
            showXTLR();
        }else if(ret.index==2){
            //历史记录
            initPager();
            currIdx = 2;
            showXTJCB();
        }/*else if(ret.index==2){
            currIdx = 3;
            showChart();
        }*/
    });

    //设置content的高度，设置会内部滚动
    var tabHeight = $api.byId("tab").offsetHeight;
    contentHeight = api.frameHeight-tabHeight;
    //console.log(tabHeight);
    //console.log(contentHeight);
    //height:300px;overflow-y:auto
    $("#content").css("height",contentHeight);
    $("#content").css("overflow-y","auto");


    showXTLR();

    //上拉加载更多
   /* api.addEventListener({name:'scrolltobottom',extra:{threshold:0}}, function(ret, err){
        loadMore();
    });*/
}

//每个tab页面点击之后会进行的初始化
function initPager(){
    page=1;
    limit=20;
}

//显示血糖录入页面
function showXTLR(){
    var storageUserName = $api.getStorage(storageKey.userName);
    $api.html($api.byId('content'), "");
    var contentTmpl = doT.template($api.text($api.byId('tzRecord-tpl')));
    //alert(storageUserName);
    $api.html($api.byId('content'), contentTmpl({"currentDate":currentDate(),"storageUserName":storageUserName}));
    api.parseTapmode();
}

//保存血糖录入
function saveTZ(){
    //校验时间已经填写，并且是正确格式
    var xyDate = $("#currentDate").val();
    var xytime = $("#currentTime").val();
    if(! xyDate){
        api.toast({
            msg: '请输入测量日期',
            duration: config.duration,
            location: 'bottom'
        });
        return;
    }
    if(! xytime){
        api.toast({
            msg: '请输入测量时间',
            duration: config.duration,
            location: 'bottom'
        });
        return;
    }
    if(!testTime(xytime)){
        api.toast({
            msg: '创建时间格式不正确',
            duration: config.duration,
            location: 'bottom'
        });
        return;
    }
    var xuetang = $api.val($api.byId("xt-hs"));
    var huanzhezicexuetang = $api.val($api.byId("xt-zc"));
    var qianzi = $api.val($api.byId("hsqm"));
    var params = {};
    var person = $api.getStorage(storageKey.currentPerson);
    params.medPatientId = person.id;
    params.homepageId = person.homepageId;
    params.medTemplateId= 222;
    params.name = "血糖监测报表";
    params.huanzhezicexuetang = huanzhezicexuetang;
    params.medTemplateVersion = 1;
    params.qianzi = qianzi;
    params.xuetang = xuetang;
    params.xydate = xyDate;
    params.xytime = xytime + ':00';
    params.handleTime = xyDate + ' '+ xytime + ':00.000000';

    api.confirm({
        title: '提示',
        msg: '确定保存吗？',
        buttons: ['确定', '取消']
    }, function(ret, err) {
        if(ret.buttonIndex==1){
            common.post({
                url: config.nurseBloodSugar,
                isLoading:true,
                text:"正在保存...",
                data:JSON.stringify(params),
                dataType:JSON,
                success:function(ret){
                    api.hideProgress();
                    api.alert({
                        title: '提示',
                        msg: '保存成功！'
                    }, function(ret, err){
                        showXTLR();
                    });

                }
            });

        }
    });
}

function showXTJCB(){
    var currentPerson = $api.getStorage(storageKey.currentPerson);
    var homepageId = currentPerson.homepageId;
    $api.html($api.byId('content'), "");
    alert(JSON.stringify(currentPerson))
    common.post({
        url:config.nurseBloodSheet,
        isLoading: true,
        data:{
            patientId: currentPerson.id,
            homepageId: homepageId,
            templateList: [{
                templateCode: 'bloodSugar',
                templateVersion: '1'
            }],
        },
        success:function (ret) {
            if(ret&&ret.content&&ret.content.list&&ret.content.list.length>0){
                var contentTmpl = doT.template($api.text($api.byId('hisxt-tpl')));
                if (ret.content.list[0].id){
                    var item = ret.content.list;
                    $api.html($api.byId('content'), contentTmpl(item));
                }else{
                    $api.html($api.byId('content'), contentTmpl(""));
                }
            }
        }
    })
}
function openFrame(page){
    api.sendEvent({
        name: eventName.openFrame,
        extra: {
            name: page
        }
    });

}

/*//显示采集历史
function showHis(){
    $api.html($api.byId('content'), "");
    var person = $api.getStorage(storageKey.currentPerson);
    var requestUrl = config.nurseLogTZSJ;
    common.post({
        url:requestUrl,
        isLoading:true,
        data:JSON.stringify({
            patientId: person.id,
            page: page,
            limit: limit,
            templateList:[{"templateCode":"temperature","templateVersion":1}]
        }),
        success:function(ret){
            if(!ret.content.list || ret.content.list.length <= 0){
                api.hideProgress();
                api.toast({
                    msg: '没有更多数据',
                    duration: config.duration,
                    location: 'bottom'
                });
                return;
            }

            // 数组key value ret.content
            var map;
            for (var i = 0; i < ret.content.list.length; i++) {
                map = {};
                for(var j = 0; j < ret.content.list[i].itemList.length; j++){
                    map[ret.content.list[i].itemList[j].key] =  ret.content.list[i].itemList[j].value;
                }
                ret.content.list[i]._map = map;
            }
            var contentTmpl = doT.template($api.text($api.byId('hisRecord-tpl')));

            if(page==1){
                $api.html($api.byId('content'), contentTmpl(ret.content));
            }else{
                $api.append($api.byId('content'), contentTmpl(ret.content));
                page = page + 1;
            }
            api.parseTapmode();
            api.hideProgress();
        }
    });
}

//历史记录列表点击查看详情页面
function showDetail(idx){
    var mapStr = $api.html($api.byId("content-"+idx));
    //打开一个明细窗口
    api.openWin({
        name: 'win_tizhengshouji_his_detail',
        url: './win_tizhengshouji_his_detail.html',
        pageParam: {
            content: mapStr
        }
    });

}

//历史记录上拉加载更多的选项
function loadMore(){
    //判断是不是第二个tab页面，是的话才走
    if(currIdx!=2){
        return;
    }
    showHis();
}*/

function addMapIfNotNull(arr,key,value,existsId){
    var map = {};
    if(value && key){
        map["key"]=key;
        map["value"]=value;
        if(existsId){
            map["medTemplateItemId"]=222;
        }
        arr.push(map);
    }
}

//正则判断  小时:分钟 格式
function testTime(time){
    var regu =/^([0-1]{1}\d|2[0-3]):([0-5]\d)$/;
    var re = new RegExp(regu);
    if (re.test(time)) {
        return true;
    }else{
        return false;
    }
}

function currentDate(){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    if(month<10) month = "0"+month;
    if(day<10) day = "0"+day;
    return year+"-"+month+"-"+day;
}

var formatDate = function(date){
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    if(month<10) month = "0"+month;
    if(day<10) day = "0"+day;
    return year+"-"+month+"-"+day;
};
var addDate= function(date,n){
    date.setDate(date.getDate()+n);
    return date;
};
var setDate = function(date){
    var week = date.getDay()-1;
    date = addDate(date,week*-1);
    currentFirstDate = new Date(date);
    currentDates.length=0;
    for(var i = 0;i<7;i++){
        var tmp = formatDate(i==0 ? date : addDate(date,1));
        if(i==0){
            currentStartDate = tmp;
        }else if(i==6){
            currentEndDate = tmp;
            if(limitEndDate==null){
                limitEndDate = tmp;
            }
        }
        currentDates.push(i==0? truncMD(tmp):truncD(tmp));
    }
};
//截取月日
function truncMD(datestr){
    return datestr.substr(5);
}
//截取日
function truncD(datestr){
    return datestr.substr(8);
}

