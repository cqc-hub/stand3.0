<template>
  <view class="">
    <button @click="useTBanner(testbuttonConfig)">
      杭口质保卡正式环境（测试用）
    </button>
  </view>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';

  import { GStores, type TButtonConfig, useTBanner } from '@/utils';
  import globalGl from '@/config/global';
  import { joinQuery } from '../../common/utils';
  import { encryptDes } from '@/common';

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

  const 用药查询: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/medicationQuery/medicationQuery',
    text: '用药查询',
    isLocal: '1',
    addition: {
      patientId: '_patientId',
    },
  };

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

  const 多住院记录: TButtonConfig = {
    path: 'pagesA/hospitalCare/choosePatient',
    type: 'self',
    extraData: {
      type: '2',
    },
    text: '多住院记录',
  };

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

  const testbuttonConfig = ref(杭口质保卡);
  onMounted(() => {
    setTimeout(() => {
      //   useTBanner({
      //     type: 'h5',
      //     path: 'https://health.eheren.com/v3/#/pagesB/historicalMess/historicalMess?sysCode=1001067&appId=2021004193658562',
      //   });
      // useTBanner({
      //   type: 'h5',
      //   isSelfH5: '1',
      //   path: 'mDisease/detail/healthGrade',
      //   addition: {
      //     patientId: '_patientId',
      //   },
      // });
      // useTBanner({
      //   type: 'h5',
      //   isSelfH5: '1',
      //   path: 'mDisease/detail/blood',
      //   addition: {
      //     patientId: '_patientId',
      //   },
      // });
      // useTBanner({
      //   type: 'h5',
      //   isSelfH5: '1',
      //   path: 'mDisease/index/index',
      //   addition: {
      //     patientId: '_patientId',
      //   },
      // });
      // useTBanner({
      //   type: 'h5',
      //   isSelfH5: '1',
      //   path: 'pages/index/test',
      //   addition: {
      //     // patientId: '_patientId',
      //   },
      // });
      // useTBanner(healthRecord)
      useTBanner(我的收藏);
      // useTBanner(会员权益);
      // useTBanner(queryCase);
    }, 1000);
  });
</script>
