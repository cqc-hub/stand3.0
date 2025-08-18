import { computed, ref } from 'vue';
import { getLocation, GStores, TBannerConfig, useTBanner, wait } from '@/utils';
import { joinQueryForUrl } from '@/common';
import api from '@/service/api';
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
       * - _1 温附二 特检预约
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
        | '12';
      _type: 'useTBanner';
      [key: string]: any;
      // TBannerConfig
      btn?: string;
    }
  );

  const gStores = new GStores();
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
    } = pageProps.value;

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
      addition: {
        patientId: 'patientId',
      },
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
      type:'self',
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

  return {
    pageProps,
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
    initAddPat,
    tjyy1001067() {
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
    },
  };
};
