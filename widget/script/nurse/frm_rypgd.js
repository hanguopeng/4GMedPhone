var person = $api.getStorage(storageKey.currentPerson);
var personInfo = null;
var patientId = person.id;
apiready = function () {
    api.parseTapmode();
    searchPatientDetail(patientId);
};

var searchPatientDetail = function (patientId) {
    common.get({
        url: config.patientDetailUrl + patientId,
        isLoading: true,
        success: function (ret) {
            //alert(JSON.stringify(ret.content));
            ret.content.pgrq=currentTime();
            var storageUserName = $api.getStorage(storageKey.userName);
            ret.content.pgr = storageUserName;

            personInfo = ret.content;

            $api.html($api.byId('pingguInfo'), "");
            var contentTmpl = doT.template($api.text($api.byId('pingguInfo-tpl')));
            $api.html($api.byId('pingguInfo'), contentTmpl(personInfo));

            showDetail();
        }
    });
};

function currentTime() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    return year + "-" + month + "-" + day + " " + hour + ":" + minute;
}

function showDetail(){
    $api.html($api.byId('content'), "");
    var person = $api.getStorage(storageKey.currentPerson);
    var requestUrl = config.nurseLogCommon;
    common.post({
        url:requestUrl,
        isLoading:true,
        data:JSON.stringify({
            patientId: person.id,
            page: 1,
            limit: 1,
            templateList:[{"templateCode":"inHospital","templateVersion":1}]
        }),
        success:function(ret){
            // 数组key value ret.content
            if(ret.content.list){
                var map;
                for (var i = 0; i < ret.content.list.length; i++) {
                    map = {};
                    for(var j = 0; j < ret.content.list[i].itemList.length; j++){
                        map[ret.content.list[i].itemList[j].key] =  ret.content.list[i].itemList[j].value;
                    }
                    ret.content.list[i]._map = map;
                }
                ret.content.list[0]._map.hasValue=true;
                ret.content.list[0].personInfo = personInfo;
                var contentTmpl = doT.template($api.text($api.byId('detail-tpl')));
                $api.html($api.byId('detailInfo'), contentTmpl(ret.content.list[0]));
            }else{
                ret.content.list = [{}];
                ret.content.list[0].personInfo = personInfo;
                ret.content.list[0]._map = {hasValue:false};
                //console.log(JSON.stringify(ret.content.list[0]))
                var contentTmpl = doT.template($api.text($api.byId('detail-tpl')));
                $api.html($api.byId('detailInfo'), contentTmpl(ret.content.list[0]));
            }



            api.parseTapmode();
            api.hideProgress();
        }
    });
}

function save(){
    var key11 = $("input[name='key11']:checked").val();
    var key12 = $("input[name='key12']:checked").val();
    var key13 = $("input[name='key13']:checked").val();
    var key15 = $("input[name='key15']:checked").val();
    var key16 = $("input[name='key16']:checked").val();
    var key16_value = $("input[name='key16_value']").val();
    var key18 = $("input[name='key18:checked']").val();
    var key19 = $("input[name='key19']").val();
    var key20 = $("input[name='key20']:checked").val();
    var key20_da = $("input[name='key20_da']:checked").val();
    var key20_sl = $("input[name='key20_sl']:checked").val();
    var key21 = $("input[name='key21']:checked").val();
    var key22 = $("input[name='key22']:checked").val();
    var key23 = $("input[name='key23']:checked").val();
    var key24 = $("input[name='key24']").val();
    var key25 = $("input[name='key25']:checked").val();
    var key26 = $("input[name='key26']:checked").val();
    var key27 = $("input[name='key27']").val();
    var key28 = $("input[name='key28']:checked").val();
    var key29 = $("input[name='key29']:checked").val();
    var key30 = $("input[name='key30']").val();
    var key31 = $("input[name='key31']:checked").val();
    var key33 = $("input[name='key33']").val();
    var key34 = $("input[name='key34']").val();
    var key32 = $("input[name='key32']").val();
    var key35 = $("input[name='key35']:checked").val();
    var key40 = $("input[name='key40']:checked").val();
    var key36 = $("input[name='key36']").val();
    var key37 = $("input[name='key37']").val();
    var key38 = $("input[name='key38']").val();
    var key39 = $("input[name='key39']").val();

    key20 = key20+','+key20_da+','+key20_sl;

    var data = [];
    addMapIfNotNull(data,"key11",key11,true);
    addMapIfNotNull(data,"key12",key12,true);
    addMapIfNotNull(data,"key13",key13,true);
    addMapIfNotNull(data,"key15",key15,true);
    addMapIfNotNull(data,"key16",key16,true);
    addMapIfNotNull(data,"key16_value",key16_value,true);
    addMapIfNotNull(data,"key18",key18,true);
    addMapIfNotNull(data,"key19",key19,true);
    addMapIfNotNull(data,"key20",key20,true);
    addMapIfNotNull(data,"key20_da",key20_da,true);
    addMapIfNotNull(data,"key20_sl",key20_sl,true);
    addMapIfNotNull(data,"key21",key21,true);
    addMapIfNotNull(data,"key22",key22,true);
    addMapIfNotNull(data,"key23",key23,true);
    addMapIfNotNull(data,"key24",key24,true);
    addMapIfNotNull(data,"key25",key25,true);
    addMapIfNotNull(data,"key26",key26,true);
    addMapIfNotNull(data,"key27",key27,true);
    addMapIfNotNull(data,"key28",key28,true);
    addMapIfNotNull(data,"key29",key29,true);
    addMapIfNotNull(data,"key30",key30,true);
    addMapIfNotNull(data,"key31",key31,true);
    addMapIfNotNull(data,"key33",key33,true);
    addMapIfNotNull(data,"key34",key34,true);
    addMapIfNotNull(data,"key32",key32,true);
    addMapIfNotNull(data,"key35",key35,true);
    addMapIfNotNull(data,"key40",key40,true);
    addMapIfNotNull(data,"key36",key36,true);
    addMapIfNotNull(data,"key37",key37,true);
    addMapIfNotNull(data,"key38",key38,true);
    addMapIfNotNull(data,"key39",key39,true);
/*|| checkNull(key18, "请输入医疗费用支付方式")*/
    if (checkNull(key11, "请输入教育程度") || checkNull(key12, "请输入资料来源") ||
        checkNull(key13, "请输入日常照顾者") || checkNull(key15, "请输入入院方式") ||
        checkNull(key16, "请输入过敏史") || checkNull(key20, "请输入意识状态") || checkNull(key21, "请输入饮食") ||
        checkNull(key22, "请输入咀嚼困难状态") || checkNull(key23, "请输入口腔黏膜状态") ||
        checkNull(key25, "请输入吞咽困难状态") || checkNull(key26, "请输入睡眠状态" || checkNull(key28,"请输入醒后疲劳感")||checkNull(key29,"请输入排尿"))
        ||checkNull(key31,"请输入排便")||checkNull(key36,"请输入跌倒风险评估")||checkNull(key38,"请输入基本生活活动能力评估")) {
        return;
    }

    if(data.length <= 0){
        api.toast({
            msg: '请输入指标值',
            duration: config.duration,
            location: 'bottom'
        });
        return;
    }

    var params = {};
    var person = $api.getStorage(storageKey.currentPerson);
    params.name = "入院评估单";
    params.medPatientId = person.id;
    params.medTemplateId= 2;
    params.measureDate= currentTime()+":00";
    params.itemList=data;
    api.confirm({
        title: '提示',
        msg: '确定保存吗？',
        buttons: ['确定', '取消']
    }, function(ret, err) {
        if(ret.buttonIndex==1){
            common.post({
                url: config.nurseLogTXSJCreate,
                isLoading:true,
                text:"正在保存...",
                data:JSON.stringify(params),
                success:function(ret){
                    api.hideProgress();
                    api.alert({
                        title: '提示',
                        msg: '保存成功！',
                    }, function(ret, err){
                        showDetail();
                    });

                }
            });

        }
    });
}

function addMapIfNotNull(arr, key, value, existsId) {
    var map = {};
    if (value && key) {
        map["key"] = key;
        map["value"] = value;
        if (existsId) {
            map["medTemplateItemId"] = 2;
        }
        arr.push(map);
    }else{
        $("input[name='key39']").val();
    }
}

function checkNull(val, msg) {
    if (!val) {
        api.toast({
            msg: msg,
            duration: 2000,
            location: 'bottom'
        });
        return true;
    }

    return false;
}
