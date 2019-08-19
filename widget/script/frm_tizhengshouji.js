var person = $api.getStorage(storageKey.currentPerson);
var medPatientId = person.id
var homePageID = person.homepageId
var fileId = "1"
var measureDate
var measureTime
var measureTimeSection
var page = 1;
var limit = 10;
var currIdx = 1;
var re = /^[1-9]+[0-9]*]*$/;
var double = /^[0-9]+\.?[0-9]*$/;

apiready = function () {
    api.parseTapmode();
    // 获取病人field_id
    common.post({
        url: config.getFileId,
        isLoading: false,
        text: "正在保存...",
        data: JSON.stringify({
            medPatientId: medPatientId,
            homePageID: homePageID
        }),
        success: function (ret) {
            if (!isEmpty(ret.content)) {
                fileId = ret.content
            }
        }
    });


    //定义点击tab
    var tab = new auiTab({
        element: document.getElementById("tab"),
        index: 1,
        repeatClick: false
    }, function (ret) {
        if (ret.index == 1) {
            //体征采集
            initPager();
            currIdx = 1;
            showTZCJ();
        } else if (ret.index == 2) {
            //历史记录
            initPager();
            currIdx = 2;
            showHis();
        } else if (ret.index == 3) {
            currIdx = 3;
            showChart();
        }
    });

    //设置content的高度，设置会内部滚动
    var tabHeight = $api.byId("tab").offsetHeight;
    contentHeight = api.frameHeight - tabHeight;
    $("#content").css("height", contentHeight);
    $("#content").css("overflow-y", "auto");


    showTZCJ();

    //上拉加载更多
    api.addEventListener({name: 'scrolltobottom', extra: {threshold: 0}}, function (ret, err) {
        loadMore();
    });
}

//每个tab页面点击之后会进行的初始化
function initPager() {
    page = 1;
    limit = 20;
}

//显示体征采集页面
function showTZCJ() {
    $api.html($api.byId('content'), "");
    var contentTmpl = doT.template($api.text($api.byId('tzRecord-tpl')));
    var time = currentTime()

    $api.html($api.byId('content'), contentTmpl({
        "currentDate": currentDate(),
        "currentTime": time,
        'createUserName': $api.getStorage(storageKey.userName)
    }));
    getMeasureTimeSection(time.substring(0, 2))
    api.parseTapmode();
}

//保存体征采集
function saveTZ() {
    // 是否允许保存
    var measureDateValue = $("#measureDate").val()
    measureDate = measureDateValue
    var measureTimeValue = $("#measureTime").val();
    measureTime = measureTimeValue
    var measureTimeSectionValue = $("#measureTimeSection").val();
    measureTimeSection = measureTimeSectionValue
    if (!measureTime || !measureTimeSection) {
        api.toast({
            msg: '请输入测量时间和时点',
            duration: config.duration,
            location: 'bottom'
        });
        return;
    }
    if (!testTime(measureTime)) {
        api.toast({
            msg: '测量时间格式不正确',
            duration: config.duration,
            location: 'bottom'
        });
        return;
    }
    //读取其它的字段，只要有一个字段不为空，则可以进行保存
    //体温值
    var temperature_value = $("#temperature_value").val()
    //体温部位
    var temperature_part = $("#temperature_part").val()
    // 脉搏值
    var pulse_value = $("#pulse_value").val();
    // 脉搏部位
    var pulse_part = $("#pulse_part").val();
    // 心率值
    var heartRate_value = $("#heartRate_value").val();
    // 呼吸值
    var breathRate_value = $("#breathRate_value").val();
    // 呼吸部位
    var breathRate_part = $("#breathRate_part").val();
    // 血压
    var bloodPressure_value = $("#bloodPressure_value").val();
    // 疼痛强度
    var painIntensity_value = $("#painIntensity_value").val();
    // 大便次数
    var shitTime_value = $("#shitTime_value").val();
    // 小便次数
    var urineTime_value = $("#urineTime_value").val();
    // 尿量
    var upd_value = $("#upd_value").val();
    // 总入量
    var totalInput_value = $("#totalInput_value").val();
    // 总出量
    var totalOutput_value = $("#totalOutput_value").val();
    // 体重
    var weight_value = $("#weight_value").val();
    // 身高
    var height_value = $("#height_value").val();

    var data = [];
    // 此处传入得key是固定得，取自字典值
    addMapIfNotNull(data, "体温", "1", temperature_value, temperature_part);
    addMapIfNotNull(data, "脉搏", "2", pulse_value, pulse_part);
    addMapIfNotNull(data, "心率", "-1", heartRate_value, null);
    addMapIfNotNull(data, "呼吸", "3", breathRate_value, breathRate_part);
    addMapIfNotNull(data, "血压", "4", bloodPressure_value, null);
    addMapIfNotNull(data, "疼痛强度", "162", painIntensity_value, null);
    addMapIfNotNull(data, "大便", "10", shitTime_value, null);
    addMapIfNotNull(data, "小便", "11", urineTime_value, null);
    addMapIfNotNull(data, "尿量", "22", upd_value, null);
    addMapIfNotNull(data, "总入量", "7", totalInput_value, null);
    addMapIfNotNull(data, "总出量", "9", totalOutput_value, null);
    addMapIfNotNull(data, "体重", "19", weight_value, null);
    addMapIfNotNull(data, "身高", "20", height_value, null);
    var selfKey = $("input[name='selfKey']");
    var selfValue = $("input[name='selfValue']");
    for (var i = 0; i<selfKey.length;i++){
        var key = (selfKey[i].id)
        var keyName = (selfKey[i].value)
        var value = (selfValue[i].value)
        if (!isEmpty(key)&&!isEmpty(value)) {
            addMapIfNotNull(data, keyName, key, value, null);
        }
    }

    if (data.length <= 0) {
        api.toast({
            msg: '没有可保存的项',
            duration: config.duration,
            location: 'bottom'
        });
        return;
    }
    api.confirm({
        title: '提示',
        msg: '确定保存吗？',
        buttons: ['确定', '取消']
    }, function (ret, err) {
        if (ret.buttonIndex == 1) {
            common.post({
                url: config.saveNurseTemperatureChart,
                isLoading: true,
                text: "正在保存...",
                data: JSON.stringify(data),
                success: function (ret) {
                    api.hideProgress();
                    api.alert({
                        title: '提示',
                        msg: ret.content.resultRemark
                    }, function (ret, err) {
                        showTZCJ();
                    });
                }
            });

        }
    });
}

//显示体征采集历史
function showHis() {
    $api.html($api.byId('content'), "");
    var person = $api.getStorage(storageKey.currentPerson);
    var requestUrl = config.nurseLogTZSJ;
    common.post({
        url: requestUrl,
        isLoading: true,
        data: JSON.stringify({
            patientId: person.id,
            page: page,
            limit: limit,
            templateList: [{"templateCode": "temperature", "templateVersion": 1}]
        }),
        success: function (ret) {
            // alert(JSON.stringify(ret.content.list));
            if (!ret.content.list || ret.content.list.length <= 0) {
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
                for (var j = 0; j < ret.content.list[i].itemList.length; j++) {
                    map[ret.content.list[i].itemList[j].key] = ret.content.list[i].itemList[j].value;
                }
                ret.content.list[i]._map = map;
            }
            var contentTmpl = doT.template($api.text($api.byId('hisRecord-tpl')));

            if (page == 1) {
                $api.html($api.byId('content'), contentTmpl(ret.content));
            } else {
                $api.append($api.byId('content'), contentTmpl(ret.content));
                page = page + 1;
            }
            api.parseTapmode();
            api.hideProgress();
        }
    });
}

//历史记录列表点击查看详情页面
function showDetail(idx) {
    var mapStr = $api.html($api.byId("content-" + idx));
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
function loadMore() {
    //判断是不是第二个tab页面，是的话才走
    if (currIdx != 5) {
        return;
    }
    showHis();
}

//新增自定义字段
function addField() {
    $("#fieldAdd").after('' +
        '<div class="custom-field">' +
        '<li class="aui-list-item">' +
        '<div class="aui-list-item-inner">' +
        '<div class="aui-list-item-label" style="width: 40%;">自定义内容</div>' +
        '<div class="aui-list-item-input">' +
        '<input type="text" class="aui-pull-left"  name="selfKey" ' +
        'style="width:90%;"  placeholder="请输入内容" onclick="openSelfDefiningListPage(this)">' +
        '<i class="aui-iconfont aui-icon-minus aui-pull-right" ' +
        'style="line-height: 2.2rem;" tapmode onclick="delField(this);">' +
        '</i>' +
        '</div>' +
        '</div>' +
        '</li>' +
        '<li class="aui-list-item">' +
        '<div class="aui-list-item-inner">' +
        '<div class="aui-list-item-label" style="width: 40%;">值</div>' +
        '<div class="aui-list-item-input">' +
        '<input class="custom-val" type="text" name="selfValue" placeholder="请输入内容">' +
        '</div>' +
        '</div>' +
        '</li>' +
        '</div>');
    api.parseTapmode();
}

//删除自定义字段
function delField(el) {
    var cur = $api.closest(el, 'li');
    //这里有坑，需要使用两次next，具体查看https://www.cnblogs.com/lijinwen/p/5690223.html
    $api.remove(cur.nextElementSibling);
    $api.remove(cur);
}

function openSelfDefiningListPage(obj) {
    api.openFrame({
        name: 'self_defining_list',
        url: './nurse/self_defining_list.html',
        rect: {
            x: 0,
            y: 80,
            w: 'auto',
            h: 500
        },
        progress: {
            type:"default",
            title:"",
            text:"正在加载数据"
        },
        animation:{
            type:"flip",
            subType:"from_bottom"
        },
        vScrollBarEnabled: false,
        hScrollBarEnabled: false
    });

    api.addEventListener({
        name:'chooseSelfDefining'
    }, function(ret, err){
        if (ret.value&&ret.value.value&&ret.value.key) {
            $api.val(obj,ret.value.value)
            $api.attr(obj,"id",ret.value.key)
        }
    });
}

//正则判断  小时:分钟 格式
function testTime(time) {
    var regu = /^([0-1]{1}\d|2[0-3]):([0-5]\d)$/;
    var re = new RegExp(regu);
    if (re.test(time)) {
        return true;
    } else {
        return false;
    }
}

function currentDate() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    return year + "-" + month + "-" + day;
}

function currentTime() {
    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes()
    if (hour < 10) {
        hour = "0" + hour
    }
    if (minute < 10) {
        minute = "0" + minute
    }
    return hour + ":" + minute;

}

//如果value不会空，则放入到map中
function addMapIfNotNull(arr, keyName, key, value, part) {
    if (value && key) {
        arr.push({
            medPatientId: medPatientId,
            fileId: fileId,
            measureDate: measureDate,
            measureTime: measureTime,
            measureTimeSection: measureTimeSection,
            measureKey: key,
            measureKeyName: keyName,
            measureValue: value,
            measurePart: part
        });
    }
}


var currentFirstDate;
var currentDates = [];
var zr;
var currentStartDate = null;
var currentEndDate = null;
var limitEndDate = null;
var yWdLow = 34; //最低体温34
var yMbLow = 20; //最低脉搏20
//显示温度曲线
function showChart() {
    var contentTmpl = doT.template($api.text($api.byId('chart-tpl')));
    $api.html($api.byId('content'), contentTmpl({}));
    api.parseTapmode();

    //设置canvas外部的宽高
    var btnHeight = $api.byId("weekBtn").offsetHeight;
    var frameWidth = api.frameWidth;
    var frameHeight = api.frameHeight;
    $("#mainDiv").css("width", frameWidth);

    zr = zrender.init(document.getElementById('main'));
    //todo 请求具体数据
    //绘图准备
    currentFirstDate = null;
    currentDates.length = 0;
    currentStartDate = null;
    currentEndDate = null;
    limitEndDate = null;
    setDate(new Date());
    draw();
}

//绘图逻辑
function draw() {
    zr.clear();
    zr.add(DrawUtil.drawXAxis());
    zr.add(DrawUtil.drawYAxis());
    zr.add(DrawUtil.drawXAxisSolid());
    zr.add(DrawUtil.drawYAxisSolid());
    zr.add(DrawUtil.drawXAxisText(currentDates));
    zr.add(DrawUtil.drawYAxisText());
    zr.add(DrawUtil.drawDesc());
    //根据请求回来的排序数据，判断体温还是脉搏，体温的情况判断是那种温度，然后画出对应的图形

    //请求数据
    var person = $api.getStorage(storageKey.currentPerson);
    var requestUrl = config.nurseLogTZSJ; /*+ "?patientId="+person.id+"&limit=-1&beginTime="+currentStartDate+" 00:00:00&endTime="+currentEndDate+" 23:59:59";*/
    var currentSDate = currentStartDate + " 00:00:00";
    var currentEDate = currentEndDate + " 23:59:59";
    //alert("currentStartDate: "+currentStartDate+"currentEndDate: "+currentEndDate+"petientId: "+person.id);
    common.post({
        url: requestUrl,
        isLoading: true,
        data: JSON.stringify({
            patientId: person.id,
            limit: -1,
            templateList: [{"templateCode": "temperature", "templateVersion": 1}],
            beginTime: currentSDate,
            endTime: currentEDate
        }),
        success: function (ret) {
            if (ret.content && ret.content.list && ret.content.list.length > 0) {
                var wdDatas = [];
                var mbDatas = [];
                for (var i = 0; i < ret.content.list.length; i++) {
                    var data = {};
                    var mbData = {};
                    //type
                    if (ret.content.list[i].itemList && ret.content.list[i].itemList.length > 0) {
                        data["handleTime"] = ret.content.list[i].handleTime;
                        for (var j = 0; j < ret.content.list[i].itemList.length; j++) {
                            if (ret.content.list[i].itemList[j].key == "temperature") {
                                data["type"] = 0;
                                data["value"] = ret.content.list[i].itemList[j].value;
                                wdDatas.push(data);
                            } else if (ret.content.list[i].itemList[j].key == "temperature1") {
                                data["type"] = 1;
                                data["value"] = ret.content.list[i].itemList[j].value;
                                wdDatas.push(data);
                            } else if (ret.content.list[i].itemList[j].key == "temperature2") {
                                data["type"] = 2;
                                data["value"] = ret.content.list[i].itemList[j].value;
                                wdDatas.push(data);
                            } else if (ret.content.list[i].itemList[j].key == "temperature3") {
                                data["type"] = 3;
                                data["value"] = ret.content.list[i].itemList[j].value;
                                wdDatas.push(data);
                            } else if (ret.content.list[i].itemList[j].key == "temperature4") {
                                data["type"] = 5;
                                data["value"] = ret.content.list[i].itemList[j].value;
                                wdDatas.push(data);
                            }
                        }
                    }//end if
                    if (ret.content.list[i].itemList && ret.content.list[i].itemList.length > 0) {
                        mbData["handleTime"] = ret.content.list[i].handleTime;
                        for (var j = 0; j < ret.content.list[i].itemList.length; j++) {
                            if (ret.content.list[i].itemList[j].key == "pulse") {
                                mbData["type"] = 4; //脉搏
                                mbData["value"] = ret.content.list[i].itemList[j].value;
                                mbDatas.push(mbData);
                                break;
                            }
                        }
                    }//end if
                }//end for
                //计算温度的每个的坐标
                // console.log(JSON.stringify(wdDatas));
                // console.log(JSON.stringify(mbDatas));
                for (var i = 0; i < wdDatas.length; i++) {
                    if (Number(wdDatas[i].value) - yWdLow >= 0 && Number(wdDatas[i].value) - yWdLow <= 8) {
                        wdDatas[i].y = DrawUtil.startY - (Number(wdDatas[i].value) - yWdLow) * DrawUtil.yWidth * 5;
                    } else {
                        wdDatas.splice(i, 1);
                        i--;
                        continue;
                    }

                    var d1 = currentStartDate.replace(/\-/g, "/");
                    var date1 = new Date(d1);
                    var d2 = wdDatas[i].handleTime.replace(/\-/g, "/");
                    var date2 = new Date(d2);
                    var minutes = parseInt(date2 - date1) / 1000 / 60; //两个时间相差的分钟数
                    // alert("wdDatas[i].value"+wdDatas[i].value)
                    // alert(d1) //2019/05/27
                    // alert(date1) //
                    // alert(d2) //2019/05/28 11:33:51
                    // alert(date2) //
                    // alert(minutes) //2132.85
                    //console.log("minutes="+minutes);
                    wdDatas[i].x = DrawUtil.startX + minutes * DrawUtil.xWidth / (4 * 60);
                    // alert( wdDatas[i].x)
                }
                //画图形
                for (var i = 0; i < wdDatas.length; i++) {
                    if (wdDatas[i].type == 0) {
                        zr.add(DrawUtil.drawX({x: wdDatas[i].x, y: wdDatas[i].y}, '#03a9f4')); //腋温  type=0
                    } else if (wdDatas[i].type == 1) {
                        zr.add(DrawUtil.drawCircle({x: wdDatas[i].x, y: wdDatas[i].y}, '#03a9f4')); //口温 type=1
                    } else if (wdDatas[i].type == 2) {
                        zr.add(DrawUtil.drawPointCircle({x: wdDatas[i].x, y: wdDatas[i].y}, '#03a9f4')); //肛温 type=2
                    } else if (wdDatas[i].type == 3) {
                        zr.add(DrawUtil.drawIsogon({x: wdDatas[i].x, y: wdDatas[i].y}, '#03a9f4')); //耳温 type=3
                    } else if (wdDatas[i].type == 5) {
                        zr.add(DrawUtil.drawCircle({x: wdDatas[i].x, y: wdDatas[i].y}, '#ff3223')); //额温 type=5
                    }
                }
                //画连线
                for (var i = 0; i < wdDatas.length - 1; i++) {
                    var line = new zrender.Line({
                        shape: {
                            x1: wdDatas[i].x,
                            y1: wdDatas[i].y,
                            x2: wdDatas[i + 1].x,
                            y2: wdDatas[i + 1].y
                        },
                        style: {
                            stroke: '#000',
                            lineWidth: 1
                        }
                    });
                    zr.add(line);
                }
                //计算脉搏的每个的坐标
                for (var i = 0; i < mbDatas.length; i++) {
                    if (Number(mbDatas[i].value) - yMbLow >= 0 && Number(mbDatas[i].value) - yMbLow <= 160) {
                        mbDatas[i].y = DrawUtil.startY - (Number(mbDatas[i].value) - yMbLow) * 75 / 30
                    } else {
                        mbDatas.splice(i, 1);
                        i--;
                        continue;
                    }
                    var d1 = currentStartDate.replace(/\-/g, "/");
                    var date1 = new Date(d1);
                    var d2 = mbDatas[i].handleTime.replace(/\-/g, "/");
                    var date2 = new Date(d2);
                    var minutes = parseInt(date2 - date1) / 1000 / 60; //两个时间相差的分钟数
                    mbDatas[i].x = DrawUtil.startX + minutes * DrawUtil.xWidth / (4 * 60);
                }
                //console.log(JSON.stringify(wdDatas));
                //console.log(JSON.stringify(mbDatas));
                for (var i = 0; i < mbDatas.length; i++) {
                    zr.add(DrawUtil.drawHollowCircle({x: mbDatas[i].x, y: mbDatas[i].y}, '#03a9f4')); //脉搏 type=4
                }
                for (var i = 0; i < mbDatas.length - 1; i++) {
                    var line = new zrender.Line({
                        shape: {
                            x1: mbDatas[i].x,
                            y1: mbDatas[i].y,
                            x2: mbDatas[i + 1].x,
                            y2: mbDatas[i + 1].y
                        },
                        style: {
                            stroke: '#e51c23',
                            lineWidth: 1
                        }
                    });
                    zr.add(line);
                }

                api.hideProgress();
            } else {
                api.hideProgress();
                api.toast({
                    msg: '没有查询到数据',
                    duration: 2000,
                    location: 'bottom'
                });
            }
        }
    });
}

var formatDate = function (date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    return year + "-" + month + "-" + day;
};
var addDate = function (date, n) {
    date.setDate(date.getDate() + n);
    return date;
};
var setDate = function (date) {
    var week = date.getDay() - 1;
    date = addDate(date, week * -1);
    currentFirstDate = new Date(date);
    currentDates.length = 0;
    for (var i = 0; i < 7; i++) {
        var tmp = formatDate(i == 0 ? date : addDate(date, 1));
        if (i == 0) {
            currentStartDate = tmp;
        } else if (i == 6) {
            currentEndDate = tmp;
            if (limitEndDate == null) {
                limitEndDate = tmp;
            }
        }
        currentDates.push(i == 0 ? truncMD(tmp) : truncD(tmp));
    }
};

//截取月日
function truncMD(datestr) {
    return datestr.substr(5);
}

//截取日
function truncD(datestr) {
    return datestr.substr(8);
}

function lastweek() {
    setDate(addDate(currentFirstDate, -7));
    draw();
};

function nextweek() {
    //下一周最大控制到当前周
    if (currentEndDate == limitEndDate) {
        api.toast({
            msg: '没有下一周啦',
            duration: 2000,
            location: 'bottom'
        });

        return;
    }
    setDate(addDate(currentFirstDate, 7));
    draw();
};


// 20190814
function chooseTime(el) {
    api.openPicker({
        type: 'time',
        title: '时间'
    }, function (ret, err) {
        var hour = ret.hour;
        if (hour < 10) {
            hour = "0" + hour;
        }
        var minute = ret.minute;
        if (minute < 10) {
            minute = "0" + minute;
        }
        var time = hour + ":" + minute;
        $api.val(el, time);
        getMeasureTimeSection(hour)
    });
}


function getMeasureTimeSection(number) {
    var hour = parseInt(number);
    if (hour >= 0 && hour < 4) {
        hour = 2
    }
    // >=4 <8 在6的格子里
    if (hour >= 4 && hour < 8) {
        hour = 6
    }
    // >=8 <12 在10的格子里
    if (hour >= 8 && hour < 12) {
        hour = 10
    }
    // >=12 <16 在14的格子里
    if (hour >= 12 && hour < 16) {
        hour = 14
    }
    // >=16 <20 在18的格子里
    if (hour >= 16 && hour < 20) {
        hour = 18
    }
    // >=20 <24 在22的格子里
    if (hour >= 20 && hour < 24) {
        hour = 22
    }
    $api.attr($api.byId('measureTimeSection' + hour), 'selected', 'true');
    var start = hour - 2 < 10 ? "0" + (hour - 2) : hour - 2
    var end = hour + 1 < 10 ? "0" + (hour + 1) : hour + 1
    var el1 = $api.dom('#measureTimeSectionRemark')
    $api.val(el1, "(" + start + ":00-" + end + ":59)");
}

function changeMeasureTime(obj) {
    var measureTimeSection = $api.val(obj)
    var el = $api.dom('#measureTime')
    var el1 = $api.dom('#measureTimeSectionRemark')
    if (isEmpty(measureTimeSection)){
        $api.val(el, currentTime());
        $api.val(el1, "");
    } else{
        var hour = parseInt(measureTimeSection);
        var start = hour - 2 < 10 ? "0" + (hour - 2) : hour - 2
        var end = hour + 1 < 10 ? "0" + (hour + 1) : hour + 1
        if (hour < 10) {
            hour = "0" + hour;
        }
        $api.val(el, hour + ":00");
        $api.val(el1, "(" + start + ":00-" + end + ":59)");
    }
}

function isEmpty(str) {
    if (str === null || str === '' || str === undefined) {
        return true
    }
}