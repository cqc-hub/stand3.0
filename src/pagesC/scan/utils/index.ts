import { computed, ref } from 'vue';
import {
  getLocation,
  GStores,
  PatientUtils,
  TBannerConfig,
  useTBanner,
  wait,
} from '@/utils';
import { encryptDes, joinQuery, joinQueryForUrl } from '@/common';
import api from '@/service/api';
import globalGl from '@/config/global';
import { beforeEach } from '@/router';
export const useScan = () => {
  const pageProps = ref(
    {} as {
      /**
       * - 1 温附二+3.0基线】扫描院内纸质凭条二维码，快捷绑定就诊人
       * - 2 温附二 满意度问卷
       * - 3 温附二 化验排队
       * - 4 江苏省中 用药详情
       * - 5 江苏省中电子发票
       * - 6 满意度评价
       * - 7 电子发票
       * - 8 报告查询
       * - 9 用药提醒
       * - 10 电子导致单
       * - 11 健康咨询
       * - 12 健康咨询-详情
       * - 13 濮阳满意度问卷
       * - 14 乐清满意度
       * - 15 温附二跳转新生儿筛查登录
       * - _1 温附二 特检预约
       * - 16 健康温州 艾检测
       * - 17 健康温州 温心在线
       * - 18 健康温州 云影像
       * - 19 江苏省中 健康商城
       * - 23 用药查询
       * - 24 检查预约 1001093
       * - 25 院前服务 1001093
       * - 26 中西医满意度
       */
      type:
        | '_1'
        | '1'
        | '2'
        | '3'
        | '4'
        | '5'
        | '6'
        | '7'
        | '8'
        | '9'
        | '10'
        | '11'
        | '12'
        | '13'
        | '14'
        | '15'
        | '16'
        | '17'
        | '18'
        | '19'
        | '20'
        | '21'
        | '22'
        | '23'
        | '24'
        | '25'
        | '26';
      _type: 'useTBanner';
      [key: string]: any;
      // TBannerConfig
      btn?: string;
    }
  );

  const gStores = new GStores();
  const patientUtils = new PatientUtils();

  const _props = computed(() => {
    return {
      ...pageProps.value,
      type: undefined,
    };
  });

  const initAddPat = async () => {
    const { params } = pageProps.value;
    const {
      result: { patientName, patientPhone },
    } = await api.analyzePatInfoInHos({
      patData: params,
      source: gStores.globalStore.browser.source,
    });

    if (patientName && patientPhone) {
      const pat = gStores.userStore.patList.find(
        (p) => p.patientName === patientName
      );

      if (!pat) {
        uni.reLaunch({
          url: joinQueryForUrl('/pagesA/medicalCardMan/perfectReal', {
            patientPhone,
            patientName,
          }),
        });

        return;
      }
    }

    uni.reLaunch({
      url: `/pages/home/home`,
    });
  };

  const initQuestionList58 = async () => {
    const {
      tab, //  50 门诊  55 住院
    } = pageProps.value;
    useTBanner({
      type: 'h5',
      isLocal: '1',
      isSelfH5: '1',
      path: 'pagesC/question/questionAfterVisit',
      extraData: {
        tab,
      },
      addition: {
        herenId: 'herenId',
        token: 'token',
      },
    });
  };
  const initQuestion85 = async () => {
    const {
      category, //  50 门诊  55 住院
      a: patientName,
      b: cardNumber,
      c: patientPhone,
      d: visitNo,
      e: hosName,
      f: deptName,
      g: docName,
      h: visitDate,
      i: inHospitalNo,
      j: source = gStores.globalStore.browser.source,
      k: outTime,
      l: hospitalWard,
      n: hosId,
      m: attendingDoctor,
      o: admissionTime,
    } = pageProps.value;

    const addition: any = {
      // patientId: 'patientId',
    };

    if (!cardNumber) {
      addition.patientId = 'patientId';
    }

    useTBanner({
      type: 'h5',
      isLocal: '1',
      isSelfH5: '1',
      path: `pagesC/question/wzzxyQuestion${category == '55' ? 2 : 1}`,
      extraData: {
        category,
        patientName,
        cardNumber,
        hospitalWard,
        deptName,
        docName,
        visitDate,
        visitNo,
        outTime,
        hosId,
        source,
        inHospitalNo,
        patientPhone,
        hosName,
        attendingDoctor,
        admissionTime,
      },
      addition,
    });
  };

  const initQuestion52 = async () => {
    const {
      category, //  50 门诊  55 住院
      a: patientName,
      b: cardNumber,
      c: patientPhone,
      d: visitNo,
      e: hosName,
      f: deptName,
      g: docName,
      h: visitDate,
      i: inHospitalNo,
      j: source = gStores.globalStore.browser.source,
      k: outTime,
      l: hospitalWard,
      n: hosId,
      m: attendingDoctor,
      o: admissionTime,
    } = pageProps.value;

    const addition: any = {
      // patientId: 'patientId',
    };

    if (!cardNumber) {
      addition.patientId = 'patientId';
    }

    useTBanner({
      type: 'h5',
      isLocal: '1',
      isSelfH5: '1',
      path: `pagesC/question/yqQuestion${category == '55' ? 2 : 1}`,
      extraData: {
        category,
        patientName,
        cardNumber,
        hospitalWard,
        deptName,
        docName,
        visitDate,
        visitNo,
        outTime,
        hosId,
        source,
        inHospitalNo,
        patientPhone,
        hosName,
        attendingDoctor,
        admissionTime,
      },
      addition,
    });
  };

  const initQuestion = async () => {
    const {
      category, //  50 门诊  55 住院
      a: patientName,
      b: cardNumber,
      c: patientPhone,
      d: visitNo,
      e: hosName,
      f: deptName,
      g: docName,
      h: visitDate,
      i: inHospitalNo,
      j: source = gStores.globalStore.browser.source,
      k: outTime,
      l: hospitalWard,
      n: hosId,
      m: typeName,
    } = pageProps.value;

    const addition: any = {
      // patientId: 'patientId',
    };

    if (!cardNumber) {
      addition.patientId = 'patientId';
    }

    useTBanner({
      type: 'h5',
      isLocal: '1',
      isSelfH5: '1',
      path: 'pagesC/question/questionAfterVisit1',
      extraData: {
        category,
        patientName,
        cardNumber,
        hospitalWard,
        deptName,
        docName,
        visitDate,
        visitNo,
        outTime,
        hosId,
        source,
        inHospitalNo,
        patientPhone,
        hosName,
      },
      addition,
    });
  };

  // 化验排队 https://h5.eheren.com/scan/1001067/scan?type=3&windowId=233
  const initTakeNumber = async () => {
    const { windowId } = pageProps.value;
    const { longitude, latitude } = await getLocation(true);

    useTBanner({
      type: 'h5',
      isSelfH5: '1',
      path: 'pagesC/queueNumber/queueNumber',
      text: '化验排队',
      extraData: {
        windowId,
        type: '3',
        longitude,
        latitude,
      },
      addition: {
        herenId: 'herenId',
        patientId: 'aaa',
        token: 'token',
      },
      isLocal: '1',
    });
  };

  // 用药详情1001035 1.eheren.com/s/35/13/tHWQeC057CvyF  ->(运维转) https://h5.eheren.com/note/?s=35&p=13&q=tHWQeC057CvyF
  // https://iheren.feishu.cn/docx/doxcnlxOHeTwHeYEpkswCvkba8f
  const initDrugDetail35 = async () => {
    const { queryDes } = pageProps.value;

    useTBanner({
      type: 'self',
      path: 'pagesB/medicationAssistant/medicalHelpDetail',
      text: '用药详情',
      extraData: {
        linkRecordId: queryDes,
      },
    });
  };

  const initInvoice = () => {
    const { params, patientName, sex } = pageProps.value;

    useTBanner({
      type: 'h5',
      isSelfH5: '1',
      path: 'pagesA/eletronicInvoice/eletronicInvoice',
      extraData: {
        params,
        patientName,
        sex,
      },
    });
  };

  const goQuestion = () => {
    useTBanner({
      path: 'pagesC/question/questionAfterVisit',
      type: 'h5',
      isSelfH5: '1',
      addition: { patientId: '_p' },
      text: '满意度',
      extraData: {
        /**
         * tab 1 门诊 2 住院
         */
        ..._props.value,
      },
    });
  };

  const goInvoice = () => {
    const addition: any = {};
    const { params } = pageProps.value;
    if (!params) {
      Object.assign(addition, {
        token: 'token',
        herenId: 'herenId',
      });
    }
    useTBanner({
      type: 'h5',
      isSelfH5: '1',
      path: 'pagesA/eletronicInvoice/eletronicInvoice',
      text: '电子发票',
      addition,
      extraData: {
        /**
         * params 扫码带
         */
        ..._props.value,
      },
      isLocal: '1',
    });
  };

  const goReport = () => {
    const addition: any = {};
    const { params } = pageProps.value;
    if (!params) {
      Object.assign(addition, {
        token: 'token',
        herenId: 'herenId',
      });
    }
    useTBanner({
      type: 'self',
      isSelfH5: '1',
      path: 'pagesB/reportQuery/reportQuery',
      text: '报告查询',
      addition,
      extraData: {
        /**
         * params 扫码带
         */
        ..._props.value,
      },
      isLocal: '1',
    });
  };

  const goMedicationQuery = () => {
    // 用药查询  出院带药
    useTBanner({
      type: 'h5',
      isSelfH5: '1',
      path: 'pagesC/medicationQuery/medicationQuery',
      text: '用药查询',
      isLocal: '1',
      addition: {
        patientId: '_patientId',
      },
      extraData: {
        /**
         * tab 1, 2, 3
         */
        ..._props.value,
      },
    });
  };

  const goMedicalAssistant = () => {
    const addition: any = {};
    const { params } = pageProps.value;
    if (!params) {
      Object.assign(addition, {
        patientId: '_patientId',
      });
    }

    useTBanner({
      type: 'h5',
      isSelfH5: '1',
      path: 'pagesC/medicalAssistant/medicalAssistant',
      text: '电子导诊单',
      addition,
      extraData: {
        ..._props.value,
      },
      isLocal: '1',
    });
  };

  const healthAdvisory = () => {
    useTBanner({
      type: 'h5',
      isSelfH5: '1',
      path: 'pagesA/healthAdvisory/healthAdvisory',
      text: '健康咨询',
      isLocal: '1',
    });
  };

  const healthAdvisoryDetail = () => {
    useTBanner({
      type: 'h5',
      isSelfH5: '1',
      path: 'pagesA/healthAdvisory/healthAdvisoryDetail',
      text: '健康咨询详情',
      isLocal: '1',
      extraData: {
        /**
         * id
         */
        ..._props.value,
      },
    });
  };

  /**
   * 新生儿筛查登录校验
   */
  const childNewborn10001067 = async () => {
    await beforeEach({
      _isLogin: true,
    });

    const { openId } = gStores.globalStore;
    const params = encryptDes(
      JSON.stringify({
        openId,
      }),
      'phsDesKey'
    );

    useTBanner({
      type: 'h5',
      path: joinQueryForUrl(
        'https://crm.wzhealth.com/sso/h5-login/fey/Y06/pages/home/index',
        {
          params,
        }
      ),
    });
  };

  /**
   * 健康温州——艾检测
   */
  const aijiance1001082 = () => {
    useTBanner({
      isExpired: '1',
      type: 'h5',
      path: 'https://azyy.wzswsj.gov.cn/index.html',
      addition: {
        token: 'token',
        patientId: 'patientId',
        herenId: 'herenId',
      },
      extraData: {
        sysCode: '1001082',
        reqForward: 'true',
        source: '19',
        verify1001082: '1',
      },
    });
  };

  /**
   * 健康温州——云影像
   */
  const yun1001082 = () => {
    useTBanner({
      isExpired: '1',
      type: 'h5',
      path: ' https://cloud-exam-view-wzswsj.wzxcpacs.kayicloud.com/hisLogin',
      addition: {
        token: 'token',
        patientId: 'patientId',
        herenId: 'herenId',
      },
      extraData: {
        sysCode: '1001082',
        reqForward: 'true',
        source: '19',
        verify1001082: '1',
      },
    });
  };

  /**
   * 健康温州——温心在线
   */
  const wenxinzaixian1001082 = () => {
    useTBanner({
      isExpired: '1',
      type: 'h5',
      path: 'https://xljk.wzswsj.gov.cn/municipalCitizen/#/pages/skip/index?origin=%E6%B8%A9%E5%B7%9E%E6%99%BA%E5%BA%B7',
      addition: {
        token: 'token',
        patientId: 'patientId',
        herenId: 'herenId',
      },
      extraData: {
        sysCode: '1001082',
        reqForward: 'true',
        source: '19',
      },
    });
  };

  /**
   * 健康温州——学生体检
   */
  const healthCheckUp1001082 = () => {
    useTBanner({
      isExpired: '1',
      type: 'h5',
      path: 'https://health.wzswsj.gov.cn/wzwjwh5_wzapp/#/pages/parent/home/home',
      addition: {
        token: 'token',
        patientId: 'patientId',
        herenId: 'herenId',
      },
      extraData: {
        sysCode: '1001082',
        reqForward: 'true',
        source: '19',
      },
    });
  };

  /**
   * 用药查询
   */
  const goYYcx = () => {
    useTBanner({
      type: 'h5',
      isSelfH5: '1',
      path: 'pagesC/question/questionAfterVisit',
      extraData: {
        type: 'yycx',
      },
      addition: {
        patientId: '_patientId',
      },
    });
  };

  /**
   * 检查预约1001093
   */
  const goJCYY1001093 = () => {
    useTBanner({
      type: 'h5',
      isSelfH5: '1',
      path: 'pagesC/choosePat/choosePat',
      extraData: {
        _type: 'jcyy1001093',
      },
      addition: {
        patientId: '_patientId',
      },
    });
  };

  /**
   * 院前服务 1001093
   */
  const goYQFW1001093 = () => {
    useTBanner({
      type: 'h5',
      isSelfH5: '1',
      path: 'pagesA/1001093/hosButler',
      addition: {
        patientId: '_patientId',
      },
      text: '',
    });
  };

  /**
   * 江苏省中——健康商城(有问题)
   */
  const healthMall1001035 = () => {
    useTBanner({
      type: 'h5',
      path:
        globalGl.env === 'prod'
          ? 'https://shop.jshtcm.com/mobile/pages/login/index'
          : 'https://jksc.eheren.com/mobile/pages/login/index',
      addition: {
        TOKEN: 'token',
        PATIENTID: 'patientId',
        HERENID: 'herenId',
        OPENID: 'openId',
      },
      extraData: {
        sysCode: gStores.globalStore.sysCode,
        reqForward: 'true',
        source: gStores.globalStore.browser.source,
      },
    });
  };

  const tjyy1001067 = () => {
    useTBanner({
      type: 'h5',
      isSelfH5: '1',
      path: 'pagesC/choosePat/choosePat',
      text: '',
      extraData: {
        _type: 'Wfe_check',
      },
      addition: {
        patientId: '_patientId',
      },
    });
  };

  return {
    pageProps,
    childNewborn10001067,
    healthAdvisoryDetail,
    healthAdvisory,
    goMedicalAssistant,
    goMedicationQuery,
    goReport,
    goInvoice,
    goQuestion,
    initInvoice,
    initDrugDetail35,
    initTakeNumber,
    initQuestion,
    initQuestionList58,
    initAddPat,
    initQuestion52,
    initQuestion85,
    tjyy1001067,
    aijiance1001082,
    yun1001082,
    wenxinzaixian1001082,
    healthCheckUp1001082,
    healthMall1001035,
    goYYcx,
    goJCYY1001093,
    goYQFW1001093,
  };
};
