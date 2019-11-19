var person = $api.getStorage(storageKey.currentPerson);


apiready = function(){
    api.parseTapmode();

    initPage()
};
function  initPage() {
    var params = api.pageParam.data;
    var contentTmpl = doT.template($api.text($api.byId('add-tpl')));
    $api.html($api.byId('content'), contentTmpl(params));
    //console.log(JSON.stringify(params));
    $api.attr($api.byId(params.ruliangmingcheng),"selected","selected");
    $api.attr($api.byId(params.chuliangmingcheng),"selected","selected");
    $api.attr($api.byId(params.yansexingzhuang),"selected","selected");
}
//修改按钮
function update () {
    //按钮变化
    document.getElementById("update").style.display="none";
    document.getElementById("saveUpdate").style.display="";
    document.getElementById("cancel").style.display="";
    //显示checkbox
    document.getElementById("yinshi_checkbox").style.display="block";
    document.getElementById("yishi_checkbox").style.display="block";
    document.getElementById("tiwei_checkbox").style.display="block";
    document.getElementById("dghl_checkbox").style.display="block";
    document.getElementById("jkjy_checkbox").style.display="block";
    document.getElementById("bqgc_checkbox").style.display="block";
    document.getElementById("hlcs_checkbox").style.display="block";
    //隐藏输入框
    document.getElementById("yinshi_input").style.display="none";
    document.getElementById("yishi_input").style.display="none";
    document.getElementById("tiwei_input").style.display="none";
    document.getElementById("dghl_input").style.display="none";
    document.getElementById("jkjy_input").style.display="none";
    document.getElementById("bqgc_input").style.display="none";
    document.getElementById("hlcs_input").style.display="none";
    //输入框可修改,下拉选可选
    $("input").removeAttr("readonly");
    $("input").removeAttr("disabled");

    $("#YSXZval").removeAttr("disabled");
    $("#RLMCval").removeAttr("disabled");
    $("#CHMCval").removeAttr("disabled");
    //回显
    var yishi = api.pageParam.data.yishi;//意识
    var yinshi = api.pageParam.data.yinshi;//饮食
    var tiwei = api.pageParam.data.tiwei;//体位
    var dghl = api.pageParam.data.daoguanguanli;//导管护理
    var jkjy = api.pageParam.data.jiankangjiaoyu;//健康教育
    var bqgc = api.pageParam.data.bingqingguancha;//病情观察
    var hlcs = api.pageParam.data.hulicuoshi;//护理措施
    var pfqk = api.pageParam.data.pifuqingkuang;//皮肤情况

    showCheckbox(yishi,'dx-ys');
    showCheckbox(yinshi,'dx-sw');
    showCheckbox(tiwei,'dx-tw');
    showCheckbox(dghl,'dx-dghl');
    showCheckbox(jkjy,'dx-jkzd');
    showCheckbox(bqgc,'dx-bqgc');
    showCheckbox(hlcs,'dx-hlcs')
    showCheckbox(pfqk,'dx-piqk');



}
function showCheckbox(obj,name) {
    var itemArr = document.getElementsByName(name);
    for (var i=0;i<itemArr.length;i++){
        if (obj.indexOf($api.val(itemArr[i]))!=-1) {
            if($api.next(itemArr[i])){
                $api.removeCls($api.next(itemArr[i]), 'hide');
                var childDomArr = ($api.first(($api.next(itemArr[i])))).children
                for(var j=0;j<childDomArr.length;j++){
                    var childStr = $api.attr(childDomArr[j],'data-val')
                    console.log(childStr)
                    if(childStr!==""&&childStr!==null&&obj.indexOf(childStr)!==-1){
                        $api.attr(childDomArr[j],'selected','selected')
                    }
                }
            }
            $api.attr(itemArr[i],'checked','checked')
        }
    }
}
//保存 修改按钮
function savaUpdate() {
    //上传的数据集合
    var data = [];

    var medBedName = $("input[name='medBedName']").val();
    var name = $("input[name='name']").val();
    var sexName = $("input[name='sexName']").val();
    var registerNumber = $("input[name='registerNumber']").val();
    var createTime = $api.text($("input[name='hsqmrq']"));
    var tiwen = $("input[name='temperature']").val();
    var maibo = $("input[name='pulse']").val();//脉搏
    var huxi = $("input[name='breath']").val();
    var xueya = $("input[name='bloodpressure']").val();
    var xueyangbaohedu = $api.val($api.byId("xueyangbaohedu"));//血氧饱和度
    var xiyang = $("input[name='inputogen']").val();//吸氧
    var ruliangmingcheng = $("select[name='RLMCval']").val();
    var ruliangml = $("input[name='RLRLval']").val();
    var chuliangmingcheng = $("select[name='CHMCval']").val();
    var chuliangml = $("input[name='CLRLval']").val();
    var yansexingzhuang = $("select[name='YSXZval']").val();
    var yishi = "";
    var dxysArr = $("input[name='dx-ys']");
    for(var i=0;i<dxysArr.length;i++){
        if(dxysArr[i].checked){

            yishi += dxysArr[i].value+",";
        }
    }
    var dxtw = "";
    var dxtwArr = $("input[name='dx-tw']");
    for(var i=0;i<dxtwArr.length;i++){
        if(dxtwArr[i].checked){

            dxtw += dxtwArr[i].value + ",";
        }
    }

    var daoguanhuli = "";
    var dxdghlArr = $("input[name='dx-dghl']");
    var qgqkmjz = $("select[name='qgqkmjz']").val();

    for(var i=0;i<dxdghlArr.length;i++){
        if(dxdghlArr[i].checked){

            if("气管切开"==dxdghlArr[i].value){
                daoguanhuli += dxdghlArr[i].value+"("+qgqkmjz+")"+",";
            }else {

                daoguanhuli += dxdghlArr[i].value+",";
            }
        }

    }

    var yinshi = "";
    var dxswArr = $("input[name='dx-sw']");//饮食
    for(var i=0;i<dxswArr.length;i++){
        if(dxswArr[i].checked){

            yinshi += dxswArr[i].value+",";
        }
    }
    var jiankangzhidao = "";
    var dxjkzdArr = $("input[name='dx-jkzd']");//健康指导
    for(var i=0;i<dxjkzdArr.length;i++){
        if(dxjkzdArr[i].checked){

            jiankangzhidao += dxjkzdArr[i].value+",";
        }
    }
    var bingqingguancha ="";
    var dxbqgcArr = $("input[name='dx-bqgc']");//病情观察
    var sctksel = $("select[name='sctksel']").val();//双侧瞳孔
    var dkdgfs = $("select[name='dkdgfs']").val();//瞳孔对光发散
    var czthdza = $("select[name='czthdza']").val();//语言
    var hzhz = $("select[name='hzhz']").val();//患肢
    var hzfw = $("select[name='hzfw']").val();//患肢皮温
    var jljl = $("select[name='jljl']").val();//肌力
    var czthdlr = $("select[name='czthdlr']").val();//侧肢体活动障碍
    for(var i=0;i<dxbqgcArr.length;i++){
        if(dxbqgcArr[i].checked){
            if("双侧瞳孔"==dxbqgcArr[i].value){
                bingqingguancha += dxbqgcArr[i].value+"("+sctksel+")"+",";
                continue;
            }
            if("瞳孔对光发散"==dxbqgcArr[i].value){
                bingqingguancha += dxbqgcArr[i].value+"("+dkdgfs+")"+",";
                continue;
            }
            if("语言"==dxbqgcArr[i].value){
                bingqingguancha += dxbqgcArr[i].value+"("+czthdza+")"+",";
                continue;
            }
            if("患肢"==dxbqgcArr[i].value){
                bingqingguancha += dxbqgcArr[i].value+"("+hzhz+")"+",";
                continue;
            }
            if("患肢皮温"==dxbqgcArr[i].value){
                bingqingguancha += dxbqgcArr[i].value+"("+hzfw+")"+",";
                continue;
            }
            if("肌力"==dxbqgcArr[i].value){
                bingqingguancha += dxbqgcArr[i].value+"("+jljl+")"+",";
                continue;
            }
            if("侧肢体活动障碍"==dxbqgcArr[i].value) {
                bingqingguancha += dxbqgcArr[i].value+"("+czthdlr+")"+",";
                continue;
            }
            bingqingguancha += dxbqgcArr[i].value+",";
        }
    }

    var hulicuoshi = "";
    var wljw = $("select[name='wljw']").val();
    var dxhlcsArr = $("input[name='dx-hlcs']");
    for(var i=0;i<dxhlcsArr.length;i++){
        if(dxhlcsArr[i].checked){
            if("物理降温"===dxhlcsArr[i].value){
                hulicuoshi += dxhlcsArr[i].value +"(" + wljw + ")" + ",";
            }else{

                hulicuoshi += dxhlcsArr[i].value + ",";
            }
        }

    }
    var params = {
        id : (api.pageParam.data.id).toString(),
        paramList : []
    };
    params.paramList.push({
        key: 'tiwen',
        value: tiwen
    });
    params.paramList.push({
        key: 'maibo',
        value: maibo
    });
    params.paramList.push({
        key: 'huxi',
        value: huxi
    });
    params.paramList.push({
        key: 'xueya',
        value: xueya
    });
    params.paramList.push({
        key: 'xueyangbaohedu',
        value: xueyangbaohedu
    });
    params.paramList.push({
        key: 'xiyang',
        value: xiyang
    });
    params.paramList.push({
        key: 'ruliangmingcheng',
        value: ruliangmingcheng
    });
    params.paramList.push({
        key: 'ruliangml',
        value: ruliangml
    });
    params.paramList.push({
        key: 'chuliangmingcheng',
        value: chuliangmingcheng
    });
    params.paramList.push({
        key: 'chuliangml',
        value: chuliangml
    });
    params.paramList.push({
        key: 'yansexingzhuang',
        value: yansexingzhuang
    });
    params.paramList.push({
        key: 'yishi',
        value: yishi
    });

    params.paramList.push({
        key: 'yinshi',
        value: yinshi
    });
    params.paramList.push({
        key: 'tiwei',
        value: dxtw
    });
    params.paramList.push({
        key: 'pifuqingkuang',
        value: ''
    });
    params.paramList.push({
        key: 'daoguanguanli',
        value: daoguanhuli
    });
    params.paramList.push({
        key: 'jiankangjiaoyu',
        value: jiankangzhidao
    });
    params.paramList.push({
        key: 'hulicuoshi',
        value: hulicuoshi
    });
    params.paramList.push({
        key: 'bingqingguancha',
        value: bingqingguancha
    });
    /*params.paramList.xueyangbaohedu = xueyangbaohedu;
    params.paramList.medBedName = medBedName;
    params.paramList.name = name;
    params.paramList.sexName = sexName;
    params.paramList.registerNumber = registerNumber;
    params.paramList.createTime = createTime;
    params.paramList.tiwen = tiwen;
    params.paramList.maibo = maibo;
    params.paramList.huxi = huxi;
    params.paramList.xueya = xueya;
    params.paramList.xiyang = xiyang;
    params.paramList.ruliangmingcheng = ruliangmingcheng;
    params.paramList.ruliangml = ruliangml;
    params.paramList.chuliangmingcheng = chuliangmingcheng;
    params.paramList.tiwei = dxtw;
    params.paramList.chuliangml = chuliangml;
    params.paramList.yansexingzhuang = yansexingzhuang;
    params.paramList.yishi = yishi;
    params.paramList.daoguanguanli = daoguanhuli;
    params.paramList.yinshi = yinshi;
    params.paramList.jiankangjiaoyu = jiankangzhidao;
    params.paramList.bingqingguancha = bingqingguancha;
    params.paramList.hulicuoshi = hulicuoshi;
    params.paramList.medPatientId = person.id;
    params.paramList.homepageId = person.homepageId;
    params.paramList.medTemplateId = 223;
    params.paramList.name = "血液肿瘤科危重患者护理记录单";*/
    //params.measureDate= currentTime()+":00";
    console.log("----------" + JSON.stringify(params))
    api.confirm({
        title: '提示',
        msg: '确定保存吗？',
        buttons: ['确定', '取消']
    }, function (ret, err) {
        if (ret.buttonIndex === 1) {
            common.post({
                url: config.wzhznursePlan,
                isLoading: true,
                text: "正在保存...",
                data: JSON.stringify(params),
                success: function (ret) {
                    console.log("=========="+JSON.stringify(ret))
                    if (ret.code===200) {
                        api.alert({
                            title: '提示',
                            msg: '修改成功！',
                        }),function () {
                        }
                        cancel()
                    }else {
                        api.alert({
                            title: '提示',
                            msg: '修改失败！',
                        }),function () {}
                    }
                }
            });

        }
    });
}
//取消按钮
function cancel() {
    $("input").attr("readonly","readonly");
    document.getElementById("update").style.display="";
    document.getElementById("saveUpdate").style.display="none";
    document.getElementById("cancel").style.display="none";

    document.getElementById("yinshi_checkbox").style.display="none";
    document.getElementById("yishi_checkbox").style.display="none";
    document.getElementById("tiwei_checkbox").style.display="none";
    document.getElementById("dghl_checkbox").style.display="none";
    document.getElementById("jkjy_checkbox").style.display="none";
    document.getElementById("bqgc_checkbox").style.display="none";
    document.getElementById("hlcs_checkbox").style.display="none";

    document.getElementById("yinshi_input").style.display="block";
    document.getElementById("yishi_input").style.display="block";
    document.getElementById("tiwei_input").style.display="block";
    document.getElementById("dghl_input").style.display="block";
    document.getElementById("jkjy_input").style.display="block";
    document.getElementById("bqgc_input").style.display="block";
    document.getElementById("hlcs_input").style.display="block";

}
function QGQKselect(ele){
    var sctksel = $api.next(ele);
    if(ele.checked){

        $api.removeCls(sctksel, 'hide');
    }else{
        $api.addCls(sctksel, 'hide');
    }
}
