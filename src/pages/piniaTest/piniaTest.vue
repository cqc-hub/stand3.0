<template>
  <view class="">
    <button @click="init">
      <view class="aa">智慧医院</view>
    </button>
  </view>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';

  import {
    GStores,
    LoginUtils,
    PatientUtils,
    type TButtonConfig,
    useTBanner,
  } from '@/utils';
  import globalGl from '@/config/global';
  import { joinQuery } from '../../common/utils';
  import { encryptDes, encryptedAes } from '@/common';
  import { onLoad } from '@dcloudio/uni-app';

  const gStores = new GStores();
  const { source } = gStores.globalStore.browser;

  // 电子发票
  const eletronicInvoice: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesA/eletronicInvoice/eletronicInvoice',
    text: '电子发票',
    extraData: {
      sysCode: globalGl.SYS_CODE,
    },
    addition: {
      token: 'token',
      herenId: 'herenId',
    },
    isLocal: '1',
  };

  // 用药管家
  const yonyao: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/medicationManager/medicationList',
    text: '用药管家',
    extraData: {
      sysCode: globalGl.SYS_CODE,
    },
    addition: {
      token: 'token',
      herenId: 'herenId',
      patientId: '_patientId',
    },

    isLocal: '1',
  };

  // 排队叫号
  const queryNumber: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/queueNumber/queueNumber',
    text: '排队叫号',
    extraData: {
      sysCode: globalGl.SYS_CODE,
    },
    addition: {
      herenId: 'herenId',
      patientId: 'aaa',
      token: 'token',
    },
    isLocal: '1',
  };

  // 病历查询
  const queryCase: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/queryCase/queryCase',
    text: '病历查询',
    extraData: {
      sysCode: globalGl.SYS_CODE,
    },
    addition: {
      herenId: 'herenId',
      patientId: 'aaa',
      token: 'token',
    },
    isLocal: '1',
  };

  // 意见反馈
  const serviceCenter: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/queryCase/queryCase',
    text: '意见反馈',
    extraData: {
      pageType: 2,
    },
    isLocal: '1',
  };

  // 家医签约
  const qinfenSignDocTeam: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/qinfen/signDocTeam',
    text: '家医签约',
    extraData: {
      sysCode: globalGl.SYS_CODE,
    },
    addition: {
      herenId: 'herenId',
      token: 'token',
      patientId: 'a',
    },
    isLocal: '1',
  };

  // 健康档案
  const healthRecord: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/choosePat/choosePat',
    text: '健康档案',
    extraData: {
      rePath: 'pagesC/healthRecord/healthRecord',
    },
    addition: {
      patientId: '_patientId',
    },
  };

  const tiyy1001035 = {
    _type: 'useTBanner',
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/choosePat/choosePat',
    text: '体检预约与报告',
    extraData: {
      _type: 'tjyy1001035',
    },
    addition: {
      patientId: '_patientId',
    },
  };

  // 智能导诊
  const smartDiseaseGuide: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/choosePat/choosePat',
    text: '智能导诊',
    extraData: {
      _type: 'taizhouZNDZ',
    },
    addition: {
      patientId: '_patientId',
    },
    isLocal: '1',
  };

  // 麻醉病历申请
  const historyAnaesthesia: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/choosePat/choosePat',
    // path: '/',
    text: '麻醉病历申请',
    extraData: {
      _type: 'historyAnaesthesia',
    },
    addition: {
      patientId: '_patientId',
    },
    isLocal: '1',
  };

  // 就诊后微信推送消息，用户填写问卷
  const questionnaireAfterVisitDoc: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/question/questionAfterVisit',
    text: '麻醉病历申请',
    addition: {
      patientId: '_patientId',
    },
    isLocal: '1',
  };

  const questionkupperman: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/choosePat/choosePat',
    text: 'kupperman',
    extraData: {
      _type: 'kupperman',
    },
    addition: {
      patientId: '_patientId',
    },
    isLocal: '1',
  };

  const ziXun: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesA/healthAdvisory/healthAdvisory',
    text: '健康咨询',
    isLocal: '1',
  };

  const 绍兴检查预约: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/choosePat/choosePat',
    text: '绍兴检查预约',
    extraData: {
      _type: 'shaoxinInspectOrder',
    },
    addition: {
      patientId: '_patientId',
    },
    isLocal: '1',
  };

  const 绍兴二院采血预约: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/choosePat/choosePat',
    text: '绍兴二院采血预约',
    extraData: {
      _type: 'shaoxinSecondBloodSampling',
    },
    addition: {
      patientId: '_patientId',
    },
    isLocal: '1',
  };

  const 消息订阅管理: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/subMsgs/subMsgs',
    text: '消息订阅管理',
    extraData: {
      source,
    },
    addition: {
      patientId: '_patientId',
    },
    isLocal: '1',
  };

  const 电子导诊单: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/medicalAssistant/medicalAssistant',
    text: '电子导诊单',
    addition: {
      patientId: '_patientId',
    },
    extraData: {
      isOpenDelivery: '1',
    },
    isLocal: '1',
  };

  const 客服中心: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/serviceCenter/serviceChat',
    text: '客服中心',
    isLocal: '1',
    addition: {
      patientId: '_patientId',
    },
  };

  const 医保结算清单: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesA/eletronicInvoice/settleList',
    text: '医保结算清单',
    isLocal: '1',
    addition: {
      patientId: '_patientId',
    },
  };

  const 用药查询 = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/medicationQuery/medicationQuery',
    text: '用药查询',
    isLocal: '1',
    addition: {
      patientId: '_patientId',
    },
    _type: 'useTBanner',
  } as TButtonConfig;

  const 分数问卷: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/choosePat/choosePat',
    text: '分数问卷',
    isLocal: '1',
    addition: {
      patientId: '_patientId',
    },
    extraData: {
      rePath: joinQuery('pagesC/question/gradeQuestion', {
        category: '22',
        source,
      }),
    },
  };

  // 健康档案
  const 咸阳智能陪诊: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/choosePat/choosePat',
    text: '健康档案',
    extraData: {
      _type: 'XyZnpz',
    },
    addition: {
      patientId: '_patientId',
    },
  };

  const 省中体检预约: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/choosePat/choosePat',
    text: '省中体检预约',
    extraData: {
      _type: 'tjyy1001035',
    },
    addition: {
      patientId: '_patientId',
    },
  };

  const 种植档案: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesB/toothRecord/index',
    text: '种植档案',
    addition: {
      patientId: '_patientId',
    },
    extraData: {
      hosId: 13078,
    },
  };

  const 预问诊: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pages/inquiries/inquiries3',
    text: '预问诊',
    extraData: {
      params: encodeURIComponent(
        encryptDes(
          JSON.stringify({
            patientSex: '男',
            patientAge: '24',
            patientName: '陈钦川',
            orderId: '2404190502700017',
          }),
          'phsDesKe'
        )
      ),
    },
    addition: {
      token: 'token',
      herenId: 'herenId',
    },
  };

  const 我的收藏: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/myDoctor/myCollect',
    text: '我的收藏',
    extraData: {
      sysCode: globalGl.SYS_CODE,
    },
    addition: {
      token: 'token',
      herenId: 'herenId',
    },
    isLocal: '1',
  };

  const 会员权益: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesB/discount/discount',
    text: '会员权益',
    addition: {
      patientId: '_patientId',
    },
  };

  const 满意度: TButtonConfig = {
    path: 'pagesC/question/questionAfterVisit',
    type: 'h5',
    isSelfH5: '1',
    addition: { patientId: '_p' },
    text: '满意度',
  };
  const 天水处方查询: TButtonConfig = {
    path: 'pagesC/question/questionAfterVisit3',
    type: 'h5',
    isSelfH5: '1',
    addition: { patientId: '_p' },
    text: '天水处方查询',
  };

  const 多住院记录: TButtonConfig = {
    path: 'pagesA/hospitalCare/choosePatient',
    type: 'self',
    extraData: {
      type: '2',
    },
    text: '多住院记录',
  };

  const aaa = {
    path: 'pagesA/hospitalCare/choosePatient',
    type: 'self',
    extraData: {
      type: '2',
    },
    text: '多住院记录',
  } as TButtonConfig;

  const 绍兴导航: TButtonConfig = {
    type: 'otherProgram',
    path: 'pages/index/index',
    text: '院内导航',
    appId: 'wx0815c00f0b4bd7c3',
    extraData: {
      type: '8_2',
      typeData: JSON.stringify({
        buildingId: 208089,
        type: 1,
        hisName: 'A010215',
      }),
    },
  };

  const 湖三检查预约: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/choosePat/choosePat',
    extraData: {
      _type: 'HS_IMCIS',
    },
    addition: {
      token: 'token',
      herenId: 'herenId',
    },
    text: '检查预约',
  };

  const 杭口质保卡: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/periodArchives/qualityEnsureCard',
    extraData: {
      hosList: '13079,13080',
    },
    addition: {
      token: 'token',
      herenId: 'herenId',
    },
    text: '检查预约',
  };

  const 红会旧就诊卡退款: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/choosePat/choosePat',
    text: '红会旧就诊卡退款',
    extraData: {
      _type: 'hhjzktkdj',
    },
    addition: {
      patientId: '_patientId',
    },
    isLocal: '1',
  };

  const 宜兴检查预约: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/choosePat/choosePat',
    text: '宜兴检查预约',
    extraData: {
      _type: 'yx_jcyy',
    },
    addition: {
      patientId: '_patientId',
    },
    isLocal: '1',
  };

  const 乐清产科问卷 = {
    _type: 'useTBanner',
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/question/question1001063',
    text: '自助问卷',
    extraData: {
      submitType: '0',
      category: '5201',
      disabled: 1,
    },
    addition: {
      herenId: 'herenId',
    },
    isLocal: '1',
  } as TButtonConfig;

  const 省中云诊室 = {
    _type: 'useTBanner',
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesA/MyRegistration/registrationTypeYun',
    text: '省中云诊室',
    extraData: {},
    addition: {},
    isLocal: '1',
  } as TButtonConfig;
  //药品详情
  const medicineDetail: TButtonConfig = {
    type: 'self',
    path: 'pagesB/medicationAssistant/medicalHelpDetail',
    text: '用药详情',
    extraData: {
      linkRecordId: 'tIQQjB798AFfB',
    },
  };
  //h5首页
  const index = {
    _type: 'useTBanner',
    type: 'h5',
    isSelfH5: '1',
    path: 'pages/index/index',
    text: 'h5首页',
    isLocal: '1',
  } as TButtonConfig;

  const 智能客服 = {
    text: '智能客服',
    path: 'pagesA/intelMedicalAssist/intelMedicalAssist',
    type: 'self',
  } as TButtonConfig;

  const 医院指南 = {
    text: '医院指南',
    path: 'pages/hospitalGuide/hospitalGuide',
    type: 'h5',
    isSelfH5: '1',
    extraData: {
      hosId: '12675',
    },
  } as TButtonConfig;

  const testbuttonConfig = ref(智能客服);

  const 住院点餐 = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/choosePat/choosePat',
    text: '住院点餐',
    extraData: {
      _type: 'zydc1001094',
    },
    addition: {
      patientId: '_patientId',
    },
    _type: 'useTBanner',
  } as TButtonConfig;

  const 住院点餐1 = {
    appId: 'wx081a6fb9ee8778e4',
    type: 'otherProgram',
    path: 'pages/home/home',
    text: ' ',
    _type: 'useTBanner',
  } as TButtonConfig;

  const 住院满意度问卷 = {
    _type: 'useTBanner',
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/question/question1001063',
    text: '地址随便填的',
    extraData: {
      category: '50',
    },
    addition: {
      herenId: 'herenId',
    },
    isLocal: '1',
  } as TButtonConfig;

  const 住院点餐1001093 = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/choosePat/choosePat',
    text: '住院点餐',
    extraData: {
      _type: 'zydc1001093',
    },
    addition: {
      patientId: '_patientId',
    },
    _type: 'useTBanner',
  } as TButtonConfig;
  const 用药查询1001093 = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/question/questionAfterVisit',
    text: '住院点餐',
    extraData: {
      type: 'yycx',
    },
    addition: {
      patientId: '_patientId',
    },
    _type: 'useTBanner',
  } as TButtonConfig;

  const 检查预约1001093 = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/choosePat/choosePat',
    text: ' ',
    extraData: {
      _type: 'jcyy1001093',
    },
    addition: {
      patientId: '_patientId',
    },
    _type: 'useTBanner',
  } as TButtonConfig;

  const 停车发票1001093 = {
    type: 'h5',
    path: 'http://s.appykt.com/zld/invoice/parkInvoice/1308830006',
    text: ' ',
    addition: {
      openId: 'openid',
    },
    _type: 'useTBanner',
  } as TButtonConfig;

  const viewImg = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/showImg/index',
    text: ' ',
    extraData: {
      img: 'https%3A%2F%2Fphsdevoss.eheren.com%2Fpcloud%2Fphs3.0%2F1001093%2F%E5%81%A5%E5%BA%B7%E4%BD%93%E6%A3%80%E4%B8%AD%E5%BF%83.jpg',
      title: '健康体检中心',
    },
    _type: 'useTBanner',
  } as TButtonConfig;

  const patientUtils = new PatientUtils();

  const 肿瘤浙里护理护士页面 = {
    type: 'otherProgram',
    appId: 'wxf1e8ea9f6a96c1db',
    path: 'pages/index/tenant/enter?linkType=11&emNo=815',
  } as TButtonConfig;

  const 肿瘤住院管家 = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesA/1001093/hosButler',
    addition: {
      patientId: '_patientId',
    },
  } as TButtonConfig;

  onMounted(() => {
    setTimeout(() => {
      init();
    }, 1000);
  });
  const init = async () => {
    // useTBanner(肿瘤浙里护理护士页面);
    // useTBanner(用药查询1001093);
    useTBanner(肿瘤住院管家);
  };

  onLoad(() => {
    // uni.loadFontFace({
    //   family: 'custom-font',
    //   source: `url("${globalGl.BASE_IMG}font/custom.ttf")`, // 你的字体网络地址
    //   success: () => console.log('字体加载成功'),
    //   fail: (err) => console.error('字体加载失败', err),
    // });
  });
</script>

<style lang="scss" scoped>
  .aa {
    color: red;
    font-family: 'custom-font';
  }
</style>
