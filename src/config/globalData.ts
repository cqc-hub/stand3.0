//整体配置参数文件
export default {

  /* 配置参数：
    title:''	//标题
      hosType: 0, //0不显示医院列表，1显示医院列表
      ChooseTime: true, // /是否显示分时段号源页面
      ChooseTimeLayout: 2, // 分时段号源页面布局，2列，4列
    ChooseTimeVague: true, // 是否是模糊号源
      verifyType: 1, //1:不开启验证 2:开启验证
      face: false //是否开启人脸识别
      address：[] //默认地址
      idType:01 //证件类型 ：01-居民身份证 02-居民户口簿 03-护照 04-军官证 05-驾驶证 06-港澳居民来往内地通行证 07-台湾居民来往内地通行证 99-其他法定有效证件
      isOpen:true //是否开启网络医院,
    isPay: false //是否开启支付功能
    resType:1 （选填)//预约类型 {"1": "预约挂号", "2": "当日挂号", "3": "实时挂号","4":"预约",5:弹性门诊}
    logo: 'jxfy_logo.png' //logo名称
    isClinicPay:1,//门诊缴费是否有就诊记录 0 没有-不分项支付 1 有分项支付
    isHospitalpay:0,//住院预缴功能 0无 1 有
    isMaterialScience: true //物价查询是否配置耗材查询
    evaluate: true //挂号详情是否开启评价功能
    source(PHS)：1.IOS，2.安卓，3.微网站（公众号），4.服务窗（生活号） 5.web（PC）6.湖南乐众7 趣医网 8 就医160  9 健康之路 10 凯歌 20其他(附属同步)，19-微信小程序  21-支付宝小程序
    cloudHospital:ty //网络医院配置，区分医院
    isOpenLouCeng:true //是否开启楼层导航.
    isBigData:false //是否开启医生名片-近一年大数据
    isEvaluate:false //是否开启医生名片-满意度评价
    isNewborn:false //是否开启绑定未落户新生儿功能
    isRiskCode:false //是否开启挂号健康码
    isRiskCodePopup:false //是否开启挂号健康码弹窗提示
    isShowDrugDetail:true //门诊和住院 详情 是否展示药品详情 目前仅陕中二不展示
    isSearchDocAndDept:false //是否开启关键字查询医生和科室信息
    isCodeInfoBGColor: false// 是否就诊卡详情健康码背景颜色
    isHospitalList:false// 住院日费用清单是否列表 false 展示详情  true  展示列表
  */
  /**
   * sysCode:系统码
   * homeConfig:首页里面的配置参数
   */
  //首页home配置参数：
  paramsBySysCode: {
    sysCode: '1001033',
    homeConfig: {
      //页面栏目配置
    },
    myConfig: {

    }
  }
}