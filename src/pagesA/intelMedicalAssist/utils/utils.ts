import { computed, ref, reactive, nextTick } from 'vue';
import {
  type StyleConfigType,
  type MsgListType,
  type MsgStatusType,
  type MessFormListType,
  OrderStatusName,
  OrderStatusDescript,
} from './types';
import {
  type TButtonConfig,
  type ISystemConfig,
  ServerStaticData,
  useTBanner,
  openLocation,
  apiAsync,
  GStores,
} from '@/utils';
import { cloneUtil, joinQuery } from '@/common';
import type { TInstance } from '@/components/g-form/index';
import { isOpenSm4 } from '@/service';
import globalGl from '@/config/global';
import api from '@/service/api';
import env from '@/config/env';

export const pageConfig = ref(
  <ISystemConfig['Electronic_Consultation_Sheet']>{}
);
export const msgList = ref<Array<MsgListType>>([]);
export const msgState = ref<MsgStatusType>({
  msgLoad: false,
  lastChatId: '',
  msg: '',
  focus: false,
});
export const messFormData = ref<Array<MessFormListType>>([]);
export const messHisFormData = ref<Array<Array<MessFormListType>>>([[]]);
export const reportPopupRef = ref<any>();
export  const isPhoto = ref(true);
export const popipHasShow = ref<boolean>(false);
//普通首页
// {
//   transition: true,//初始过渡效果
//   showHeader: true,//展示首页
//   isMessage: false,//通知效果
//   simpleHeadInit:false,//初始服务居中
// }
//通知
// {
//   transition: false,//初始过渡效果
//   showHeader: false,//展示首页
//   isMessage: true,//通知效果
//   simpleHeadInit:false,//初始服务居中
// }
export const styleConfig = ref<StyleConfigType>({
  transition: true, //初始过渡效果
  showHeader: true, //展示首页
  isMessage: false, //通知效果
  simpleHeadInit: false, //初始服务居中
  historyMess: false,
});

export const init = async (isMess) => {
  pageConfig.value = await ServerStaticData.getSystemConfig(
    'Electronic_Consultation_Sheet'
  );
  console.log('isMess', isMess);
  isMess && isMess == '1' && initWithMess();
//  setTimeout(()=>{
//  styleConfig.value.showHeader=false
//  msgState.value.msgLoad=true

//  },200)
};

const initWithMess = async () => {
  const gStores = new GStores();
  styleConfig.value = {
    transition: false, //初始过渡效果
    showHeader: false, //展示首页
    isMessage: true, //通知效果
    simpleHeadInit: false, //初始服务居中
    historyMess: false,
  };
  const { result = [] } = await api.getTodayVisit({
    patientId: gStores?.userStore?.patChoose?.patientId,
  });

  if (result.length == 0) {
    return;
  }
  const Hoslist = await ServerStaticData.getHosList({}, { noCache: true });
  messFormData.value = result.map((item) => {
    let hosItem = Hoslist.find((hos) => {
      return hos.hosId === item.hosId;
      // return hos.hosId === '13001';
    });
    !hosItem && (hosItem = Hoslist[0]);
    item.hosName = hosItem?.label;
    item.gisLat = hosItem?.gisLat;
    item.gisLng = hosItem?.gisLng;
    item.address = hosItem?.address;
    item.orderStatus = item.c + item.b + item.a;
    item.statusName = OrderStatusName[`orderStatus_${item.orderStatus}`];
    item.statusDesciption =
      OrderStatusDescript[`orderStatus_${item.orderStatus}`];
    item.patientNameEncry = gStores?.userStore?.patChoose?.patientName;
    return item;
  });
  msgList.value.push({
    my: false,
    type: 6,
    // type: 7,
  });
  messFormData.value.length &&
    messFormData.value.forEach((item, index) => {
      const hisList: Array<MessFormListType> = [];
      if (item.a === '1')
        hisList.push({
          ...item,
          statusName: OrderStatusName[`orderStatus_000`],
          statusDesciption: OrderStatusDescript[`orderStatus_000`],
        });

      if (item.b === '1')
        hisList.push({
          ...item,
          statusName: OrderStatusName[`orderStatus_001`],
          statusDesciption: OrderStatusDescript[`orderStatus_001`],
        });
      if (item.c === '1')
        hisList.push({
          ...item,
          statusName: OrderStatusName[`orderStatus_011`],
          statusDesciption: OrderStatusDescript[`orderStatus_011`],
        });

      messHisFormData.value[index] = hisList;
    });
};

export const recommendMenuList = [
  {
    label: '智能导诊',
    ico: `${globalGl.BASE_IMG}srm-chat-room-recommend-1.png`,
    key: 'guideSmart',
  },
  {
    label: '智能问药',
    ico: `${globalGl.BASE_IMG}srm-chat-room-recommend-2.png`,
    key: 'guideMedical',
  },
  {
    label: '智能问病',
    ico: `${globalGl.BASE_IMG}srm-chat-room-recommend-3.png`,
    key: 'guideDisease',
  },
  {
    label: '健康自测',
    ico: `${globalGl.BASE_IMG}srm-chat-room-recommend-4.png`,
    key: 'healthTestSelf',
  },
  {
    label: '健康百科',
    ico: `${globalGl.BASE_IMG}srm-chat-room-recommend-5.png`,
    key: 'healthCyclopaedia',
  },
  {
    label: '联系医院',
    ico: `${globalGl.BASE_IMG}srm-chat-room-recommend-6.png`,
    key: 'serviceCenter',
  },
];

export const sendMsg = async (value: string) => {
  // #ifdef  MP-ALIPAY
  // console.log('msgList.value.length',msgList.value.length)
  if (msgList.value.length == 0) {
    styleConfig.value.showHeader = false;
  }
  // #endif
  msgList.value.push({
    my: true,
    msg: value,
    type: 1,
  });
  msgState.value.msgLoad = true;
  scrollToNewMsg();
  const {
    result: { showType, list, requestId, chatId },
  } = await api
    .customerAIask({
      content: value,
      sysCode: globalGl.SYS_CODE,
      source: 1,
      chatId: msgState.value.lastChatId,
    })
    .finally(() => {
      msgState.value.msgLoad = false;
    });
  msgState.value.lastChatId = chatId;

  if (!(list && list.length)) {
    msgList.value.push({
      my: false,
      msg: '未查询到您想要了解的问题，点击客服中心获取帮助！',
      type: 1,
      requestId,
      firstCommendList: cloneUtil(recommendMenuList).filter((o) =>
        ['serviceCenter'].includes(o.key)
      ),
    });
  } else {
    switch (showType) {
      case 1:
        // 文本
        dealShowType1(list, requestId);
        break;

      case 9:
        //地址
        dealShowType9(list, requestId);
        break;

      case 10:
        // 医院|科室 信息
        dealShowType10(list, requestId);
        break;

      case 11:
        dealShowType11(list, requestId);
        break;

      case 12:
        dealShowType12(list, requestId);
        break;

      default:
        msgList.value.push({
          my: false,
          msg: '未对接的showType: ' + showType,
          type: 1,
        });
        break;
    }
  }

  scrollToNewMsg();
};

export const scrollToNewMsg = (selector?: string, duration?: number) => {
  nextTick(() => {
    console.log(
      '开始滚动',
      selector ||
        `#pageScroll >>> #smartChatRoomItem_${msgList.value.length - 1}`,
      duration || 300
    );
    uni.pageScrollTo({
      selector:
        selector ||
        `#pageScroll >>> #smartChatRoomItem_${msgList.value.length - 1}`,
      duration: duration === 0 ? 0 : duration || 300,
      success: () => {
        console.log('滚动成功');
      },
      fail: (err) => {
        console.log('滚动失败：', err);
      },
    });
  });
};
export const reportShow = () => {
  if (msgState.value.msgLoad) {
    return;
  }
  !popipHasShow.value && (popipHasShow.value = true);
  setTimeout(() => {
    reportPopupRef.value.show();
  }, 200);
};
export const inspectionAnalysis = async (reports) => {
  msgState.value.msgLoad = true;
  reportPopupRef.value.hide();
  nextTick(() => {
    styleConfig.value.showHeader = false;
  });
  const allPromise: any[] = [];
  await reports.forEach(async (element) => {
    let promise = new Promise(async (resolve, reject) => {
      const { result } = await api.inspectionAnalysis({
        sysCode: globalGl.SYS_CODE,
        source: 1,
        repId: element.repId,
        repType: 1,
        extend: element.extend,
      });
      const { showType, list, requestId } = result;
      dealShowType12(list, requestId);
      scrollToNewMsg();
      resolve(0);
    });
    allPromise.push(promise);
  });
  Promise.all(allPromise).then(() => {
    scrollToNewMsg();
    msgState.value.msgLoad = false;
  });

  // msgState.value.msgLoad = false;
};

export const sendImg = async () => {
  if (msgState.value.msgLoad) {
    return;
  }
  const gStores = new GStores();
  const { tempFilePaths } = await apiAsync(uni.chooseImage, {
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
  });
  reportPopupRef.value.hide()
  msgState.value.msgLoad = true;
  msgList.value.push({
    my: true,
    imgUrl: tempFilePaths[0],
    type: 5,
  });
  scrollToNewMsg();
  // uni.showLoading({})
  // @ts-expect-error
  const {data} = await apiAsync(uni.uploadFile, {
    url: `${env.baseApi}/phs-extend/customer/picTrans?sysCode=${gStores.globalStore.sysCode}`,
    filePath: tempFilePaths[0],
    name: 'file',
    fileType: 'image',
    header: {
      phsId: isOpenSm4 ? '81681766' : '81681688',
    },
  });
  const {result}=JSON.parse(data)
  console.log('___________________result',result)
  const { showType, list, requestId } = result;
  dealShowType12(list, requestId);
  msgState.value.msgLoad = false;
  // uni.hideLoading()
  //// @ts-expect-error
  // const { data } = await apiAsync(uni.uploadFile, {
  //   url: `${env.baseApi}/phs-base/upload/imageUpload`,
  //   filePath: tempFilePaths[0],
  //   name: 'file',
  //   fileType: 'image',
  //   formData: {
  //     imageName: `_${new Date().getTime()}${tempFilePaths[0].slice(
  //       tempFilePaths[0].lastIndexOf('.')
  //     )}`,
  //     sysCode: globalGl.SYS_CODE,
  //     Authorization: gStores.globalStore.token.accessToken,
  //   },
  // });
  // var jsonData = JSON.parse(data) as {
  //   code: number;
  //   result: string;
  //   message: string;
  // };

  //请求接口
};

export const onBlur = (value) => {
  console.log('onBlur', value);
};

export const handleGuess = (item) => {
  sendMsg(item.value);
};

export const handleServer = (item: TButtonConfig) => {
  useTBanner(item);
};

export const clearChatId = async (id: string) => {
  let lastMyContent = '';
  let lastMsg: any = {};
  msgList.value.forEach((item, index) => {
    if (item?.requestId && item.requestId === id) {
      lastMyContent = lastMsg.msg;
    }
    if (item.my) lastMsg = item;
  });
  lastMyContent && (msgState.value.msg = lastMyContent);
  msgState.value.lastChatId = '';
};

export const formatterTemp = (list: TInstance[], modeOld = false) => {
  list.map((o) => {
    let baseSize = 150;
    const baseBateSize = 10;

    if (o.label.length > 4) {
      baseSize = 210;

      baseSize += baseBateSize * o.label.length;
    }
    if (modeOld) {
      o.labelWidth = `${baseSize + 30}rpx`;
    } else {
      o.labelWidth = `${baseSize}rpx`;
    }
    o.showBodyStyle = 'text-align: left;';
    o.labelStyle =
      'padding-top: 0; color: var(--hr-neutral-color-7);font-size: var(--hr-font-size-s);';
    o.bodyStyle =
      'padding-top: 4rpx;font-size: var(--hr-font-size-s);font-weight:600;';
    o.rowStyle =
      'margin-top: -15rpx;margin-bottom:4rpx; background-color: #e8f4ff;';

    o.disabled = true;
    o.isForShow = true;
  });
};

export const goLocation = (item) => {
  const gStores = new GStores();
  const { gisLat, gisLng, hosName, address } = item;
  if (gisLat) {
    openLocation([gisLat!, gisLng!], {
      name: hosName,
      address,
    });
  } else {
    gStores.messageStore.showMessage('暂不支持导航(无该医院位置信息)', 3000);
  }
};

export const gotoGuide = (item) => {
  uni.navigateTo({
    url: joinQuery('/pagesA/guide/guide', {}),
  });
};
export const goDoctorCard = (item) => {
  console.log('item', item);
  const { docName, docId, hosId, deptName } = item;
  uni.navigateTo({
    url: joinQuery('/pagesA/MyRegistration/DoctorDetails', {
      hosDocId: docId,
      hosId,
      docName,
      deptName,
    }),
  });
};
export const changeShowHistory = (isHistory: boolean = false) => {
  styleConfig.value.historyMess = isHistory;
  if (isHistory) {
    getHisData();
  }
};

const getHisData = () => {};

const dealShowType1 = (list, requestId) => {
  const { question, answer } = list[0];

  msgList.value.push({
    my: false,
    msg: answer,
    boldMsg: (question && question + '为') || '',
    type: 1,
    requestId,
  });
};

const dealShowType9 = (list, requestId) => {
  msgList.value.push({
    my: false,
    msg: '为您推荐: ',
    type: 3,
    addRessList: list,
    requestId,
  });
};

const dealShowType10 = (list, requestId) => {
  const {
    question: title,
    intro: subTitle,
    latitude,
    longitude,
    phones,
  } = list[0];

  msgList.value.push({
    my: false,
    msg: '为您找到以下内容',
    type: 3,
    requestId,
    addRessInfo: {
      title,
      subTitle,
      latitude,
      longitude,
      phones,
    },
  });
};

const dealShowType11 = (list, requestId) => {
  msgList.value.push({
    my: false,
    type: 4,
    homeMenuConfig: list,
    requestId,
  });
};

const dealShowType12 = (lists, requestId) => {
  let htmlStr = ``;
  // htmlStr +=
  //   '<br> <div style="color:#444"> 好的，已收到报告单，以下是详细的报告解读:</div><br>';
  let flag = false;
  lists.forEach((list) => {
    if (JSON.stringify(list) !== '{}') flag = true;

    if (list?.judgment_criteria) {
      htmlStr += `<strong>结果分析：</strong><br>`;
      list.judgment_criteria.forEach((item, judgeIndex) => {
        htmlStr += `${judgeIndex + 1}.${item?.project_name.replaceAll('<','小于').replaceAll('>','大于') || ''}${
          item.describe.replaceAll('<','小于').replaceAll('>','大于')
        }<br/>`;
      });
      // htmlStr += `<br>`;
    }
    if (list?.risk_type) {
      htmlStr += `<strong>风险类型：</strong>${list.risk_type.replaceAll('<','小于').replaceAll('>','大于')}<br>`;
    }
    if (list?.disease) {
      htmlStr += `<strong>可能疾病：</strong>${list.disease.replaceAll('<','小于').replaceAll('>','大于')}<br>`;
    }
    if (list?.symptom_manifestations) {
      htmlStr += `<strong>症状表现：</strong>${list.symptom_manifestations.replaceAll('<','小于').replaceAll('>','大于')}<br>`;
    }
    if (list?.triggering_reasons) {
      htmlStr += `<strong>诱发原因：</strong>${list.triggering_reasons.replaceAll('<','小于').replaceAll('>','大于')}<br>`;
    }
    if (list?.treatment_suggestions) {
      htmlStr += `<strong>诊治建议：</strong>${list.treatment_suggestions.replaceAll('<','小于').replaceAll('>','大于')}<br>`;
    }
    if (list?.department) {
      htmlStr += `<strong>推荐治疗科室：</strong><text style="color:#296FFF">${list.department.replaceAll('<','小于').replaceAll('>','大于')}</text><br>`;
    }
    // htmlStr += `<div style="color:#444;font-size:28rpx;line-height:36rpx">告结果仅供参考，具体诊断和治疗应以医生的纸质检查单为准<br>请及时与医生沟通，以便获得专业的医疗建议和治疗方案。</div><br/>`;
  });
  if (!flag) {
    msgList.value.push({
      my: false,
      msg: '报告解读完成。您的报告各项指标正常，无异常情况。',
      type: 1,
      requestId,
    });
  } else {
    msgList.value.push({
      my: false,
      msg: htmlStr,
      type: 99,
      requestId,
    });
  }
};
