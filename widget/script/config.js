var cmcServer="http://doclever.cn:8090/mock/5ad3f5ff995b693f603c9eeb";
var localServer = "http://172.17.100.2:8084/cmc-server";
//var localServer = "http://192.168.43.200:8085/cmc-server";

var ws = "ws://172.17.100.2:8889/";
// var ws = "ws://192.168.1.126:8888/";
var config={
    // 已用
    duration:3000,
    versionUpdateUrl: localServer+"/sys/appVersion/verification", //版本更新
    loginUrl: localServer+"/sys/login", //登录
    dictUrl: localServer+"/sys/dictionary/getComboBoxList", // 通用字段值查询
    loginUserInfoUrl: localServer+"/personnel/detailByOperator", //登陆人员信息
    organizationUrl: localServer+"/sys/organization/listByOperator", //疗区查询
    patientSearchUrl: localServer+"/med/patient", //病人查询
    patientDetailUrl: localServer+"/med/patient/", //病人详情
    patientLastExamineUrl: localServer+"/nur/nurseTemperatureChart/getSignValue/", //护理检查信息
    costSituationUrl: localServer+"/med/cost/situation/", //费用情况（金额汇总）
    medAssayUrl: localServer+"/med/assay?patientId=", //化验结果
    medAssayDetailUrl: localServer+"/med/assay/", //化验结果明细
    medExaminelUrl: localServer+"/med/examine?patientId=", //检查结果
    medExamineDetailUrl: localServer+"/med/examine/", //检查结果明细
    // 20190709添加
    patientSaveUrl:localServer+"/med/patient/patientSaveUrl/", //入科确认
    inspectionSave:localServer+"/med/inspection/inspectionSave", //巡视记录保存
    inspectionQuery:localServer+"/med/inspection/inspectionQueryPda", //巡视记录查询
    // 20190926 Mela.S
    inspectionDelete:localServer+"/med/inspection/deleteInspectionByOrId/", //巡视记录查询
    // 20190711 添加注册
    register: localServer+"/sys/user/register", //注册
    // 20190712 添加修改密码
    changePassword: localServer+"/sys/user/password", //修改密码
    // 20190714 添加 新医嘱数量查询
    adviceTipCount: localServer+"/med/newadvicesend/adviceTipCount/", //新医嘱数量查询
    // 20190714 添加 皮试列表/皮试保存
    querySkinList: localServer+"/med/advice/skin/querySkinList", //皮试列表
    updateSkin: localServer+"/med/advice/skin/updateSkin", //皮试保存
    // 20190715 添加新开医嘱列表、新开医嘱已读、医嘱记录
    adviceTipList: localServer+"/med/newadvicesend/adviceTipList",  // 新开医嘱列表
    adviceTipRead: localServer+"/med/newadvicesend/adviceTipRead/",  // 新开医嘱已读
    queryAdviceList: localServer+"/med/advice/queryAdviceList",  // 医嘱记录
    // 20190716 添加费用明细
    costItemStatisticsList: localServer+"/med/cost/detailByPatientIdByPda/list", //费用明细 按医嘱大类拆分
    // 20190717 添加医嘱发送记录
    querySendList: localServer+"/med/V4gMedicalAdviceSendList/querySendList", //医嘱发送记录
    // 20190722 添加新开新停医嘱全部已读
    adviceAllRead: localServer+"/med/newadvicesend/adviceAllRead/",     //新开新停医嘱全部已读
    // 20190814 添加保存所有体征项
    saveNurseTemperatureChart: localServer+"/nur/nurseTemperatureChart/saveAllPda",     //添加保存所有体征项
    getFileId: localServer+"/nur/nurseTemperatureChart/getFileId",     //获取病人护理文件ID
    getSelfDefining: localServer+"/nur/nurseTemperatureChart/queryItems",     //查询其他体征项
    // 20190828整理护理单url
    nurseLogNew: localServer+"/nur/nursePlan/listDetails/json",//plan通用护理单查询
    nursePlanUrl:localServer+"/nur/nursePlan",
    saveBased:localServer+"/nur/nursePlan/saveBased",//保存胰岛素强化治疗剂量
    saveInsulinPda: localServer+"/nur/nursePlan/saveInsulin/pda",  //保存胰岛素列表
    saveMonitoring:localServer+"/nur/nursePlan/saveMonitoring",//保存血糖动态监测表
    selectInsulin:localServer+"/nur/nursePlan/selectInsulinPda",//查询胰岛素泵记录列表
    selectInsulindetail:localServer+"/nur/nursePlan/selectInsulin/detail", //胰岛素记录表详情
    nurseBloodSugar: localServer+"/nur/nursePlan/json",//血糖监测录入（通用的）
    nurseBloodSheet: localServer+"/nur/bloodSugar",//血糖监测表
    nurseBloodSheetShow: localServer+"/nur/nursePlan/listDetails/json",//血糖监测表
    // 20190827 一次性卫生材料相关
    saveParentMaterial: localServer+"/nur/nursePlan/saveMaterial",//保存一次卫材父数据
    saveSonMaterial: localServer+"/nur/nursePlan/saveMaterialSon",//保存一次卫材子数据
    updateParentMaterial: localServer+"/nur/nursePlan/updateParentMaterial/",//保存一次卫材子数据
    selectParentMaterial: localServer+"/nur/nursePlan/selectMaterial",  //查询父数据列表
    selectSonMaterial: localServer+"/nur/nursePlan/selectMaterialSon",  //通过父id查询子数据列表
    selectMaterialById: localServer+"/nur/nursePlan/selectMaterialById/",  //通过id获取一次卫材数据
    // 20190830 生命体征监测相关
    saveVitalSigns: localServer+"/nur/nursePlan/saveVitalSigns",  //生命体征检测保存
    selectVitalSigns: localServer+"/nur/nursePlan/selectVitalSigns",  //生命体征检测查询
    selectVitalSignsById: localServer+"/nur/nursePlan/selectVitalSignsById/",  //通过id获取生命体征检测查询
    scanMedical: localServer+"/med/advice/barcode/getByMaterialCode/", //扫码核对查询医嘱信息
    updateTelephone:localServer+"/med/patient/updateTelephone/", //修改联系电话


    // 未用+护理单
    animalHeatSituationUrl: localServer+"/nur/nurseLog/animalHeat/situation/{patientId}", //体温变化
    transfuseSituationUrl: localServer+"/med/transfuse/situation/", //输液情况
    nursePlanSituationUrl: cmcServer+"/med/nursePlan/situation/{patientId}", //护理文书

    patientrelationUrl: localServer + "/sys/dictionary/getComboBoxList",
    animalHeatSituation: localServer+"/nur/nurseLog/animalHeat/situation/", //体温变化
    bloodGlucose: localServer+"/nur/nurseLog?templateCode=xtjchl&templateVersion=1&patientId=", //血糖监测查询
    bloodGlucoseDetail: localServer+"/nur/nurseLog/", //血糖监测明细
    nurseLogCommon: localServer+"/nur/nurseLog/listDetails", //护理记录
    nurseSMTZhljld: localServer+"/nur/VitalSigns"  ,//生命体征护理记录单



    nurseLogTXSJCreate: localServer+"/nur/nurseLog", //体征收集创建
    nurseLogCreate: localServer+"/nur/nurseLog", //护理创建
    nurseLogTZSJ: localServer+"/nur/nurseLog/listDetails", //体征收集历史
    nurseLogTZSJHis: localServer+"/nur/nurseLog?templateCode=temperature&templateVersion=1", //体征收集曲线
    nurseLogQuery:localServer+"/nur/nurseLog", //护理查询
    accessoryUploadUrl: localServer+"/sys/accessory/upload", //附件上传文件
    accessoryInfoUrl: localServer+"/med/wardRound", //附件上传字段post方法
    accessoryDownloadUrl: localServer+"/sys/accessory/downLoad/", //附件下载
    accessoryQueryUrl: localServer+"/med/wardRound", //附件分页查询
    accessoryGetUrl:localServer+"/med/wardRound/", //附件明细get方法
    accessoryDelUrl: localServer+"/med/wardRound/delete/", //附件删除
    adviceDetail: localServer+"/med/advice?patientId=" ,//医嘱明细
    caseQueryUrl: localServer+"/med/clinicalHistory" , //病历查阅中左侧病历列表查询
    caseInfoUrl: localServer+"/med/clinicalHistory" , //病历查询右侧的信息
    caseOfflineUrl: localServer+"/med/clinicalHistory/downloadList" , //病历查询右侧的信息
    alertMonthUrl: localServer+"/nur/alert/monthList", //事件提醒获取月数据
    alertAddUrl: localServer+"/nur/alert", //事件提醒新增
    alertUpdateUrl: localServer+"/nur/alert/", //事件提醒修改
    alertListUrl:localServer+"/nur/alert/dateList?date=",//选择日期对应的事件列表
    alertDelUrl:localServer+"/nur/alert/delete/",//事件提醒删除
    nurseLogInHospitalDetail: localServer+"/nur/nurseLog/listDetails?templateCode=inHospital&templateVersion=1", //入院评估单内容获取
    //离线下载接口
    patientDownloadUrl: localServer+"/med/patient/downloadList",  //我的病人信息
    medAssayDownloadUrl: localServer+"/med/assay/downloadList",  //化验信息
    medExamineDownloadUrl: localServer+"/med/examine/downloadList",  //检查信息
    medAdviceDownloadUrl: localServer+"/med/advice/list/download",  //医嘱列表
    medAdviceExecuteDownloadUrl: localServer+"/med/adviceExecute/list/download",  //医嘱列表
    nurAnimalHeatSituationDownloadUrl: localServer+"/nur/nurseLog/animalHeat/situation/download",  //体温变化
    nurLastExamineDownloadUrl: localServer+"/nur/nurseLog/lastExamine/download",  //护理信息
    medCostSituationDownloadUrl: localServer+"/med/cost/situation/downLoad",  //费用信息
    medPatientDetailsDownloadUrl: localServer+"/med/patient/details/download",  //病人详情

}

var accessoryType={
    audio:0, //音频
    note:1   //记事本
}

var caseReviceType={
    //病历查阅类型
    index:"index",
    checkin:"checkin",
    record:"record",
    checkout:"checkout"
}

//数据库
var cmcdb={
    name:"cmc",
    path:"fs://cmc.db",
    resTable:"t_res",
    dlStatusTable:"t_dl_status", //下载数据总表
    dlPatientTable:"t_dl_patient", //病人明细表
    dbMedAssayTable:"t_dl_med_assay", //病人化验列表
    dbMedExamine:"t_dl_med_examine", //病人检查列表
    dbMedAdvice:"t_dl_med_advice", //病人医嘱列表
    dbMedAdviceExecute:"t_dl_med_advice_execute", //医嘱执行记录
    dbNurAnimalHeatSituation:"t_dl_nur_animalHeat_situation", //体温变化
    dbNurLastExamine:"t_dl_nur_lastExamine", //护理信息
    dbMedCostSituation:"t_dl_med_cost_situation", //费用信息
    dbMedPatientDetails:"t_dl_med_patient_details", //病人详情

    dlCaseMenu:"t_dl_case_menu", //病历左侧菜单
    dlCaseInfo:"t_dl_case_info", //病历明细
}

//事件列表
var eventName={
    InpatientAreaChanged: 'InpatientAreaChanged', //疗区改变事件
    personChanged:'personChanged', //用户切换更改事件
    mainRefresh:'main_refresh', //由于有患者列表查询和病区查询，这两个共用一样的localstorage，因此需要到病区页面重新进行查询
    personChoosed:'personChoosed', //搜索列表点击事件
    offlineOrOnline:'offlineOrOnline',//切换离线或者在线
    layerEvent:'layerEvent',//弹出层时间
    openFrame:'openFrame', //其它页面中打开中间的frame窗口
    addAlertOk:'addAlertOk', //成功添加事件警告event
}

//localstorage的key
var storageKey={
    loginName:"loginName",//登录填写的用户名
    userName:"userName", //登录用户名
    userId:"userId", //登录用户id
    token:"token",//访问token
    areaId:"areaId", //疗区id
    areaName:"areaName", //疗区名称
    persons:"persons", //查询到的相关病人信息
    currentPerson:"currentPerson", //当前选择的一个病人的信息
    currentIdx:"currentIdx", //记录当前选择的病人在数组中的索引信息，左右箭头点击时使用
    lastIdx:"lastIdx", //记录当前病人的数量，数组.length-1
    offlineFlag:"offlineFlag",//是否是离线查询
    motion:"motionCache", //重要事件中的动作的缓存
    careSheet:"careSheet", //登录用户该疗区的护理文书
    scannerStatus:"scannerStatus", // 扫码监听事件类型
    newAdviceCount:"newAdviceCount", // 新开医嘱数量
    cmcScan:"cmcScan",  // 扫描模块
    createFlag:"createFlag", //websocket是否已经连接
    tourRecordsPersonId: "tourRecordsPersonId"
}
