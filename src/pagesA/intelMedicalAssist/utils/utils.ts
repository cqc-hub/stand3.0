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
  isMess && initWithMess();
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

  const Hoslist = await ServerStaticData.getHosList({}, { noCache: true });
  messFormData.value = result.map(async (item) => {
    let hosItem = Hoslist.find((hos) => {
      // return hos.hosId === item.hosId;
      return hos.hosId === '13001';
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
    console.log('开始滚动', selector, duration || 300);
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

export const sendImg = async () => {
  if (msgState.value.msgLoad) {
    return;
  }

  const { tempFilePaths } = await apiAsync(uni.chooseImage, {
    count: 1,
    sizeType: ['compressed', 'original'],
    sourceType: ['album', 'camera'],
  });
  msgState.value.msgLoad = true;
  msgList.value.push({
    my: true,
    imgUrl: tempFilePaths[0],
    type: 5,
  });
  scrollToNewMsg();
  msgState.value.msgLoad = false;
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
