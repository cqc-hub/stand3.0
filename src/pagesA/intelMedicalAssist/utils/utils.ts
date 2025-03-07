import { computed, ref, reactive, nextTick, warn } from 'vue';
import {
  type StyleConfigType,
  type MsgListType,
  type MsgStatusType,
  type MessFormListType,
  type ChunkStatusType,
  TaskQueue,
  OrderStatusName,
  OrderStatusDescript,
} from './types';
import {
  type TButtonConfig,
  type ISystemConfig,
  ServerStaticData,
  useTBanner,
  openLocation,
  getLocation,
  apiAsync,
  GStores,
  throttle,
} from '@/utils';
import {
  cloneUtil,
  joinQuery,
  joinQueryForUrl,
  getLocalStorage,
} from '@/common';
import type { TInstance } from '@/components/g-form/index';
import { IPat, useDeptStore } from '@/stores';
import { isOpenSm4 } from '@/service';
import { getMyPowerQx } from '@/components/greenPower';
import globalGl from '@/config/global';
import api from '@/service/api';
import env from '@/config/env';
import dayjs from 'dayjs';

export const pageConfig = ref(
  <ISystemConfig['Electronic_Consultation_Sheet']>{}
);
export const pageOrderConfig = ref({} as ISystemConfig['order']);
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
export const isReportAnalysis = ref<boolean>(false);
export const isPhoto = ref(true);
export const popipHasShow = ref<boolean>(false);
export const hosData = ref<any>([]);
export const showOrder = ref(false);
export const schOrderInfo = ref<any>({});
const deptStore = useDeptStore();

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

export const chunkStatus = ref<ChunkStatusType>({
  isWXStreamApi: false,
  isTyping: false,
  chunkTemp: '',
});

export const reload = async (isMess) => {
  popipHasShow.value = false;
  isPhoto.value = true;
};

export const init = async (props) => {
  pageConfig.value = await ServerStaticData.getSystemConfig(
    'Electronic_Consultation_Sheet'
  );
  if (pageConfig.value?.intelMedicalAssistConfig?.isReportAnalysis === '1') {
    isReportAnalysis.value = true;
  }
  if (pageConfig.value?.intelMedicalAssistConfig?.isWXStreamApi === '1') {
    chunkStatus.value.isWXStreamApi = true;
  }
  msgState.value = {
    msgLoad: false,
    lastChatId: '',
    msg: '',
    focus: false,
  };
  msgList.value = [];
  styleConfig.value = {
    transition: true, //初始过渡效果
    showHeader: true, //展示首页
    isMessage: false, //通知效果
    simpleHeadInit: false, //初始服务居中
    historyMess: false,
  };
  props?.isMess && props?.isMess == '1' && initWithMess();
  reload(props?.isMess);
  test();
};

export const initWithMess = async () => {
  const gStores = new GStores();
  if (!gStores?.userStore?.patChoose?.patientId) {
    gStores.messageStore.showMessage('请先绑定就诊人！', 3000, {
      closeCallBack() {
        const pages = getCurrentPages();
        const fullPathNow = (pages[pages.length - 1] as any).$page
          .fullPath as string;
        uni.navigateTo({
          url:
            globalGl.addPersonUrl + '?_url=' + encodeURIComponent(fullPathNow),
        });
      },
    });

    return;
  }
  styleConfig.value = {
    transition: false, //初始过渡效果
    showHeader: false, //展示首页
    isMessage: true, //通知效果
    simpleHeadInit: false, //初始服务居中
    historyMess: true,
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
  msgList.value = [
    {
      my: false,
      type: 6,
    },
  ];
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
    ico: `srm-chat-room-recommend-1.png`,
    key: 'guideSmart',
  },
  {
    label: '智能问药',
    ico: `srm-chat-room-recommend-2.png`,
    key: 'guideMedical',
  },
  {
    label: '智能问病',
    ico: `srm-chat-room-recommend-3.png`,
    key: 'guideDisease',
  },
  {
    label: '健康自测',
    ico: `srm-chat-room-recommend-4.png`,
    key: 'healthTestSelf',
  },
  {
    label: '健康百科',
    ico: `srm-chat-room-recommend-5.png`,
    key: 'healthCyclopaedia',
  },
  {
    label: '联系医院',
    ico: `srm-chat-room-recommend-6.png`,
    key: 'serviceCenter',
  },
];
/**
 *
 * @param str 提问内容
 * @param answertype 回答模式：0普通；1常见问答
 * @returns
 */
export const sendMsg = async (str: string, answertype?: 1 | 0) => {
  // #ifdef  MP-ALIPAY
  if (msgList.value.length == 0) {
    styleConfig.value.showHeader = false;
  }

  // #endif
  const gStores = new GStores();
  let value = str.trim().replace(/\s+/g, '');
  if (!value) {
    gStores.messageStore.showMessage('不能发送空白消息~', 3000);
    return;
  }
  if (msgState.value.msgLoad || chunkStatus.value?.isTyping) {
    gStores.messageStore.showMessage('正在为你解答，请稍等~', 3000);
    return;
  }

  chunkStatus.value?.isTyping && stopChunkRequest();

  msgList.value.push({
    my: true,
    msg: value,
    type: 1,
  });
  msgState.value.msgLoad = true;
  scrollToNewMsg();
  // #ifdef  MP-WEIXIN
  if (chunkStatus.value?.isWXStreamApi) {
    typeInAsk(value, answertype || 0);
    return;
  }
  // #endif

  // #ifdef  H5
  if (chunkStatus.value?.isWXStreamApi) {
    typeInAskH5(value, answertype || 0);
    return;
  }
  // #endif

  const {
    result: { showType, list, requestId, chatId },
  } = await api
    .customerAIask({
      content: value,
      sysCode: globalGl.SYS_CODE,
      source: 1,
      type: answertype || 0,
      chatId: msgState.value.lastChatId,
    })
    .finally(() => {
      msgState.value.msgLoad = false;
    });
  msgState.value.lastChatId = chatId;

  switchHandleResult(showType, list, requestId, chatId);
};

const switchHandleResult = async (
  showType: number,
  list: Array<any>,
  requestId: string,
  chatId: string,
  typeInIndex?: number
) => {
  if (!(list && list.length)) {
    msgList.value.push({
      my: false,
      msg: '未查询到您想要了解的问题，请拨打客服电话获取帮助！',
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
        // #ifdef  MP-WEIXIN || H5
        if (chunkStatus.value?.isWXStreamApi) {
          dealShowType1withStream(list, requestId, chatId, typeInIndex);
          return;
        }
        // #endif
        dealShowType1(list, requestId, chatId);
        break;

      case 7:
        //医生名片
        dealShowType7(list, requestId, chatId);
        break;
      //科室列表
      case 6:
        await dealShowType6(list, requestId, chatId);
        break;
      case 9:
        //地址
        dealShowType9(list, requestId, chatId);
        break;

      case 10:
        // 医院|科室 信息
        dealShowType10(list, requestId, chatId);
        break;

      case 11:
        dealShowType11(list, requestId, chatId);
        break;

      case 12:
        dealShowType12(list, requestId, chatId);
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
    let target = '';
    // #ifdef H5
    target = selector || `#smartChatRoomItem_load`;
    // #endif

    // #ifndef H5
    // target =
    //   selector ||
    //   `#pageScroll >>> #smartChatRoomItem_${msgList.value.length - 1}`;
    target = selector || `#pageScroll >>> #smartChatRoomItem_load`;
    // #endif

    uni.pageScrollTo({
      selector: target,
      duration: duration === 0 ? 0 : duration || 300,
      success: () => {
        // console.log('滚动成功');
      },
      fail: (err) => {
        console.log('滚动失败：', err);
      },
    });
  });
};

// export const scrollToNewMsg = throttle(scrollToNewMsgFun, 300);
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

  try {
    reportPopupRef.value.hide();
  } catch (e) {}
  nextTick(() => {
    styleConfig.value.showHeader = false;
  });
  const allPromise: any[] = [];
  msgState.value.msgLoad = true;
  await reports.forEach(async (element) => {
    let promise = new Promise(async (resolve, reject) => {
      // let setting={
      //   url: `https://testphs.eheren.com/gateway/phs-extend/customer/inspectionAnalysis`,
      //   method: 'POST',
      //   responseType: 'text',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     phsId: isOpenSm4 ? '81681766' : '81681688',
      //   },
      //   data: JSON.stringify({
      //     args: {
      //       sysCode: globalGl.SYS_CODE,
      //       source: 1,
      //       repId: element.repId,
      //       repType: 1,
      //       extend: element.extend,
      //     },
      //   })
      // }
      // console.warn('setting',setting);
      //
      // scrollToNewMsg();

      // const { result } = await wx.request({
      //   ...setting,
      //   success: (response) => {
      //     // console.log(response, 'response________');
      //     // let res: any = {};
      //     // try {
      //     //   res = JSON.parse(response);
      //     // } catch (e) {
      //     //   gStores.messageStore.showMessage('err', response);
      //     // }
      //     const { showType, list, requestId, chatId } = response.data.result;
      //     if(showType === 1){
      //       dealShowType1(list, requestId, chatId);
      //     }else{
      //       dealShowType12(list, requestId, chatId);
      //     }
      //   },
      //   fail: (err) => {
      //     console.log('errror', err);
      //     msgState.value.msgLoad = false;
      //     if (err.errMsg == 'request:fail abort') {
      //       gStores.messageStore.showMessage('已暂停生成', 3000);
      //     } else {
      //       msgList.value.push({
      //         my: false,
      //         msg: err?.message || '啊哦～网络连接异常，请稍后尝试。',
      //         type: -1,
      //       });
      //     }
      //   },
      //   complete: () => {
      //     scrollToNewMsg();
      //     msgState.value.msgLoad = false;
      //     resolve(0);
      //   },
      // });

      const { result } = await api.inspectionAnalysis({
        sysCode: globalGl.SYS_CODE,
        source: 1,
        repId: element.repId,
        repType: 1,
        extend: element.extend,
      });
      const { showType, list, requestId, chatId } = result;
      if (showType === 1) {
        dealShowType1(list, requestId, chatId);
      } else {
        dealShowType12(list, requestId, chatId);
      }
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
  try {
    reportPopupRef.value.hide();
  } catch (e) {}
  msgState.value.msgLoad = true;
  msgList.value.push({
    my: true,
    imgUrl: tempFilePaths[0],
    type: 5,
  });
  scrollToNewMsg();
  // uni.showLoading({})
  // @ts-expect-error
  const { data } = await apiAsync(uni.uploadFile, {
    // url: `http://10.10.83.108:9907/customer/picTrans?sysCode=${gStores.globalStore.sysCode}`,
    url: `${env.baseApi}/phs-extend/customer/picTrans?sysCode=${gStores.globalStore.sysCode}`,
    filePath: tempFilePaths[0],
    name: 'file',
    fileType: 'image',
    header: {
      phsId: isOpenSm4 ? '81681766' : '81681688',
    },
  });
  const { result, code, message } = JSON.parse(data);
  if (code == 1) {
    msgList.value.push({
      my: false,
      msg: '啊哦～网络连接异常，请稍后尝试。',
      type: -1,
    });
    msgState.value.msgLoad = false;
    console.error('picTrans接口报错', JSON.parse(data));
    return;
  }

  const { showType, list, requestId, chatId } = result;
  dealShowType12(list, requestId, chatId);
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
  // console.log('onBlur', value);
};

export const handleGuess = (item) => {
  msgState.value.lastChatId = '';
  sendMsg(item.value, 1);
};

export const handleServer = (
  item: TButtonConfig & { isSelfMethod?: string }
) => {
  if (item?.isSelfMethod) {
    item.isSelfMethod == 'reportAnalysis' && reportShow();
    item.isSelfMethod == 'openWxService' && openServicesChat(item.extraData);
    item.isSelfMethod == 'makePhone' && makePhone(item.extraData);
  } else {
    useTBanner(item);
  }
};
export const openServicesChat = (query) => {
  wx.openCustomerServiceChat({
    extInfo: { url: query.extInfo },
    corpId: query.corpId,
    complete(res) {},
  });
};

export const makePhone = (query) => {
  console.log('makePhone');
  uni.makePhoneCall({
    phoneNumber: query.phone,
    fail(res) {
      console.warn('拨打电话失败原因', res);
    },
  });
};

export const clearChatId = async (id: string) => {
  // let lastMyContent = '';
  // let lastMsg: any = {};
  // msgList.value.forEach((item, index) => {
  //   if (item?.requestId && item.requestId === id) {
  //     lastMyContent = lastMsg.msg;
  //   }
  //   if (item.my) lastMsg = item;
  // });
  // lastMyContent && (msgState.value.msg = lastMyContent);
  const gStores = new GStores();
  msgState.value.lastChatId !== '' &&
    gStores.messageStore.showMessage('已结束会话，请继续提问', 3000);

  msgState.value.lastChatId = '';
  chunkStatus.value?.isTyping && stopChunkRequest();
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

const dealShowType1withStream = async (
  list,
  requestId,
  chatId,
  typeInIndex
) => {
  const { question, answer } = list[0];
  await new Promise((rl, rj) => {
    if (msgList.value?.length === typeInIndex) {
      msgList.value.push({
        my: false,
        msg: '',
        boldMsg: (question && question) || '',
        type: 1,
        requestId,
        chatId,
        isSysAppMore: judgeIsSysAppMore(chatId),
      });
    }
    let index = 0; // 当前添加的字符索引
    msgList.value[typeInIndex].msg += answer;
    scrollToNewMsg();
    rl('');
    // const interval = setInterval(() => {
    //   if (index < answer?.length) {
    //     // 将当前字符添加到目标变量
    //     msgList.value[typeInIndex].msg += answer[index];
    //     index++;
    //   } else {
    //     scrollToNewMsg();
    //     clearInterval(interval); // 停止定时器
    //     rl('');
    //   }
    // }, 5);
  });
};

const dealShowType1 = (list, requestId, chatId) => {
  const { question, answer } = list[0];

  msgList.value.push({
    my: false,
    msg: answer,
    boldMsg: (question && question) || '',
    type: 1,
    requestId,
    chatId,
    isSysAppMore: judgeIsSysAppMore(requestId),
  });
  let index = 0; // 当前添加的字符索引
};

const dealShowType7 = (list, requestId, chatId) => {
  let myList = list;
  if (list?.length) {
    myList = list.map((item, index) => {
      // @ts-expect-error
      item.date = item.date.sort((a, b) => new Date(a) - new Date(b));

      return item;
    });
  }
  msgList.value.push({
    my: false,
    msg: '为您推荐以下医生和排班 ',
    type: 61,
    addRessList: myList,
    requestId,
    chatId,
    isSysAppMore: false,
  });
};

const dealShowType6 = async (list, requestId, chatId) => {
  // #ifndef H5 
  // h5暂时不支持距离
  if (!hosData.value?.length) {
    msgState.value.msgLoad = true;
    const location: any = await getLocation().catch((err) => {
      console.error(err);
    });

    hosData.value = await ServerStaticData.getHosList(
      {
        gisLng: location?.longitude,
        gisLat: location?.latitude,
      },
      {
        noCache: true,
      }
    );
    msgState.value.msgLoad = false;
  }
  // #endif
  msgList.value.push({
    my: false,
    msg: '建议您到以下科室挂号就诊',
    type: 62,
    addRessList: list,
    hosData: hosData.value,
    requestId,
    chatId,
    isSysAppMore: false,
  });
};

const dealShowType9 = (list, requestId, chatId) => {
  if (list?.length) {
    list.forEach((item, index) => {
      msgList.value.push({
        my: false,
        msg: index == 0 ? '为您推荐: ' : '',
        type: 3,
        addRessList: [item],
        requestId,
        chatId,
        isSysAppMore: judgeIsSysAppMore(requestId),
      });
    });
  }
};

const dealShowType10 = (list, requestId, chatId) => {
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
    chatId,
    isSysAppMore: judgeIsSysAppMore(requestId),
    addRessInfo: {
      title,
      subTitle,
      latitude,
      longitude,
      phones,
    },
  });
};

const dealShowType11 = (list, requestId, chatId) => {
  msgList.value.push({
    my: false,
    type: 4,
    homeMenuConfig: list,
    requestId,
    chatId,
    isSysAppMore: judgeIsSysAppMore(requestId),
  });
};

const dealShowType12 = (lists, requestId, chatId) => {
  let htmlStr = ``;
  // htmlStr +=
  //   '<br> <div style="color:#444"> 好的，已收到报告单，以下是详细的报告解读:</div><br>';
  let flag = false;
  lists.forEach((list) => {
    if (JSON.stringify(list) !== '{}') flag = true;
    if (list?.judgment_criteria) {
      htmlStr += `<strong>结果分析：</strong><br>`;
      list.judgment_criteria.forEach((item, judgeIndex) => {
        htmlStr += `${judgeIndex + 1}.${
          item?.project_name.replaceAll('<', '小于').replaceAll('>', '大于') ||
          ''
        }${item.describe.replaceAll('<', '小于').replaceAll('>', '大于')}<br/>`;
      });
      // htmlStr += `<br>`;
    }
    if (list?.risk_type) {
      htmlStr += `<strong>风险类型：</strong>${list.risk_type
        .replaceAll('<', '小于')
        .replaceAll('>', '大于')}<br>`;
    }
    if (list?.disease) {
      htmlStr += `<strong>可能疾病：</strong>${list.disease
        .replaceAll('<', '小于')
        .replaceAll('>', '大于')}<br>`;
    }
    if (list?.symptom_manifestations) {
      htmlStr += `<strong>症状表现：</strong>${list.symptom_manifestations
        .replaceAll('<', '小于')
        .replaceAll('>', '大于')}<br>`;
    }
    if (list?.triggering_reasons) {
      htmlStr += `<strong>诱发原因：</strong>${list.triggering_reasons
        .replaceAll('<', '小于')
        .replaceAll('>', '大于')}<br>`;
    }
    if (list?.treatment_suggestions) {
      htmlStr += `<strong>诊治建议：</strong>${list.treatment_suggestions
        .replaceAll('<', '小于')
        .replaceAll('>', '大于')}<br>`;
    }
    if (list?.department) {
      htmlStr += `<strong>推荐治疗科室：</strong><text style="color:#296FFF">${list.department
        .replaceAll('<', '小于')
        .replaceAll('>', '大于')}</text><br>`;
    }
    // htmlStr += `<div style="color:#444;font-size:28rpx;line-height:36rpx">告结果仅供参考，具体诊断和治疗应以医生的纸质检查单为准<br>请及时与医生沟通，以便获得专业的医疗建议和治疗方案。</div><br/>`;
  });
  if (!flag) {
    msgList.value.push({
      my: false,
      msg: '报告解读完成。您的报告各项指标正常，无异常情况。',
      type: 1,
      requestId,
      chatId,
      isSysAppMore: judgeIsSysAppMore(requestId),
    });
  } else {
    msgList.value.push({
      my: false,
      msg: htmlStr,
      type: 99,
      requestId,
      chatId,
    });
  }
};

const judgeIsSysAppMore = (requestIdStr) => {
  if (requestIdStr && msgList.value?.length) {
    let lastQuesetIdStr = '';
    msgList.value?.forEach((item) => {
      item?.chatId && (lastQuesetIdStr = item.chatId);
    });

    if (lastQuesetIdStr) {
      let lastQuesetId = lastQuesetIdStr.split('-')[1];
      let nowQuesetId = requestIdStr.split('-')[1];
      return lastQuesetId !== nowQuesetId;
    } else {
      return true;
    }
  } else {
    return true;
  }
};
// 处理分块数据
const processChunks = (chunkTemp: string, typeInIndex: number) => {
  let tempData = chunkTemp.split('\n\n');
  if (tempData.length > 1) {
    tempData.forEach((item, index) => {
      if (index === tempData.length - 1) {
        chunkStatus.value.chunkTemp = item;
      } else {
        handleOneChunk(item, typeInIndex);
      }
    });
  }
};

let requestTask: any = null;
let taskQueue = new TaskQueue();
const typeInAsk = (value, answertype) => {
  const gStores = new GStores();
  const settings = {
    url: `${env.baseApi}/phs-extend/customer/aiStreamAsk`,
    method: 'POST',
    timeout: 0,
    responseType: 'text',
    enableChunked: true,
    headers: {
      'Content-Type': 'application/json',
      phsId: isOpenSm4 ? '81681766' : '81681688',
    },
    data: JSON.stringify({
      args: {
        content: value,
        sysCode: gStores.globalStore.sysCode,
        source: gStores.globalStore.browser.source == 19 ? 1 : 2,
        chatId: msgState.value.lastChatId,
        type: answertype,
      },
    }),
  };

  const typeInIndex = msgList.value.length;
  console.warn('手动请求', settings);
  requestTask = wx.request({
    ...settings,
    success: (response) => {},
    fail: (err) => {
      console.log('errror', err);
      msgState.value.msgLoad = false;
      if (err.errMsg == 'request:fail abort') {
        gStores.messageStore.showMessage('已暂停生成', 3000);
      } else {
        msgList.value.push({
          my: false,
          msg: err?.message || '啊哦～网络连接异常，请稍后尝试。',
          type: -1,
        });
        scrollToNewMsg();
      }
    },
    complete: () => {
      msgState.value.msgLoad = false;
      requestTask?.offChunkReceived();
      chunkStatus.value.chunkTemp = '';
      chunkStatus.value.isTyping = false;
    },
  });
  requestTask?.onHeadersReceived((res) => {});
  requestTask?.onChunkReceived((res) => {
    chunkStatus.value.isTyping = true;
    const buf16 = buf2hex(res.data);
    const resStr = hexToString(buf16);
    chunkStatus.value.chunkTemp += resStr;
    processChunks(chunkStatus.value.chunkTemp,typeInIndex)
  });
};

const typeInAskH5 = (value: string, answertype) => {
  const gStores = new GStores();
  const settings = {
    url: `${env.baseApi}/phs-extend/customer/aiStreamAsk`,
    method: 'POST',
    timeout: 0,
    headers: {
      'Content-Type': 'application/json',
      phsId: isOpenSm4 ? '81681766' : '81681688',
    },
    data: JSON.stringify({
      args: {
        content: value,
        sysCode: gStores.globalStore.sysCode,
        source: 1,
        chatId: msgState.value.lastChatId,
        // type: answertype,
        type: 'h5',
      },
    }),
  };

  const typeInIndex = msgList.value.length;
  console.warn('手动请求', settings);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', settings.url, true);
  xhr.setRequestHeader('Content-Type', settings.headers['Content-Type']);
  xhr.setRequestHeader('phsId', settings.headers['phsId']);
  xhr.responseType = 'text';

  let previousResponse = ''; 
  
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 3 || xhr.readyState === 4) {
      const newResponse = xhr.responseText;
      const newChunk = newResponse.substring(previousResponse.length);
      previousResponse = newResponse; 
      if (newChunk) {
        chunkStatus.value.isTyping = true;
        chunkStatus.value.chunkTemp += newChunk;
        processChunks(chunkStatus.value.chunkTemp, typeInIndex);
      }
      if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            // 处理成功响应
            chunkStatus.value.isTyping = false;
            msgState.value.msgLoad = false; 
          } else {
            // 处理错误响应
            console.log('errror', xhr.statusText);
            msgState.value.msgLoad = false;
            msgList.value.push({
              my: false,
              msg: xhr.statusText || '啊哦～网络连接异常，请稍后尝试。',
              type: -1,
            });
            scrollToNewMsg();
          }
    }
      } 
  };

  xhr.onerror = () => {
    console.log('请求出错');
    msgState.value.msgLoad = false;
    msgList.value.push({
      my: false,
      msg: '啊哦～网络连接异常，请稍后尝试。',
      type: -1,
    });
    scrollToNewMsg();
  };

  xhr.send(settings.data);
};
 
export const stopChunkRequest = () => {
  requestTask?.abort();
  msgState.value.msgLoad = false;
  chunkStatus.value.isTyping = false;
  taskQueue.clearTask();
};

const handleOneChunk = async (chunk: string, typeInIndex: number) => {
  if (chunk.includes('event:message')) {
    const idMatch = chunk.match(/id:(.*)/);
    let idStr = idMatch ? idMatch[1] : null;
    const id = idStr?.split(',')[0];
    const questionId = idStr?.split(',')[1];
    // 提取data:和event:message之间的字符
    const dataMatch = chunk.match(/data:(.*?)event:message/s);
    const data = dataMatch ? dataMatch[1].trim() : null;
    console.warn('文本：', data); 
    id && (msgState.value.lastChatId = id);
    if (data) {
      await taskQueue.addTask(
        dealShowType1withStream,
        [
          {
            answer: convertAsciiEscapeSequences(data),
            question: '',
          },
        ],
        questionId,
        id,
        typeInIndex
      );
    } else {
      console.warn('未截取到标志文本:');
    }
  } else {
    const jsonMatch = chunk.replaceAll('\r\n', '').match(/data:(\{.*\})/);
    const jsonData = JSON.parse(jsonMatch?.length ? jsonMatch[1] : '{}');
    console.log('提取的 JSON 数据:', jsonData);
    const { showType, list, requestId, chatId } = jsonData;
    if (JSON.stringify({}) === '[{}]') {
      msgList.value.push({
        my: false,
        msg: '啊哦～网络连接异常，请稍后尝试。',
        type: -1,
      });
      scrollToNewMsg();
      return;
    }
    chatId && (msgState.value.lastChatId = chatId);
    switchHandleResult(showType, list, requestId, chatId, typeInIndex);
  }
};

//将2进制转为16进制
const buf2hex = (arrayBuffer) => {
  return Array.prototype.map
    .call(new Uint8Array(arrayBuffer), (x) => ('00' + x.toString(16)).slice(-2))
    .join('');
};

//将16进制转为 字符串
const hexToString = (str) => {
  var val = '',
    len = str.length / 2;
  for (var i = 0; i < len; i++) {
    val += String.fromCharCode(parseInt(str.substr(i * 2, 2), 16));
  }
  return utf8to16(val);
};
//处理中文乱码问题
const utf8to16 = (str) => {
  var out, i, len, c;
  var char2, char3;
  out = '';
  len = str.length;
  i = 0;
  while (i < len) {
    c = str.charCodeAt(i++);
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        out += str.charAt(i - 1);
        break;
      case 12:
      case 13:
        char2 = str.charCodeAt(i++);
        out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
        break;
      case 14:
        char2 = str.charCodeAt(i++);
        char3 = str.charCodeAt(i++);
        out += String.fromCharCode(
          ((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0)
        );
        break;
    }
  }
  return out;
};

// 将文本中的 ASCII 转义序列（如 \x0A）转换为实际字符
function convertAsciiEscapeSequences(input) {
  return input.replace(/\\x([0-9A-Fa-f]{2})/g, (match, hex) => {
    // 将十六进制字符串转换为对应的字符
    return String.fromCharCode(parseInt(hex, 16));
  });
}

//处理h5 医生跳转
export const gotoH5DoctorDetails = (docInfo) => {
  const gStores = new GStores();
  const sysCode = gStores.globalStore.sysCode;
  const { hosId, hosDocId, hosDeptId, docName } = docInfo;
  // location.href=
  uni.navigateTo({
    url: joinQueryForUrl('/pagesA/MyRegistration/DoctorDetails', {
      hosId,
      hosDocId,
      hosDeptId,
      docName,
    }),
  });
  switch (sysCode) {
    case '1001035':
      break;

    default:
      break;
  }
};

export const handleChooseSchDate = (docInfo: any, date: string) => {
  showOrder.value = true;
  schOrderInfo.value = {
    docInfo,
    date,
  };
};
const handlerConfirmPatReal = async () => {
  const gStores = new GStores();
  const pages = getCurrentPages();
  const fullUrl: string = (pages[pages.length - 1] as any).$page.fullPath;
  const { title, content } = await gStores.getSysAppMore('1204');
  const { confirm } = await new Promise<{ confirm: boolean }>((r) => {
    gStores.messageStore.showMessage(content, 0, {
      useDialog: true,
      dialogOpt: {
        title,
        isShowCancel: true,
        cancelText: '暂不预约',
        confirmText: '去实名认证',
      },
      closeCallBack: r,
    });
  });

  if (confirm) {
    uni.navigateTo({
      url: joinQueryForUrl('/pagesA/medicalCardMan/medicalCardMan', {
        _url: fullUrl,
      }),
    });
  }

  throw new Error('实名?');
};

export const regConfirm = async (pageArg) => {
  const gStores = new GStores();
  const { isOrderPay, wxOrderSubscribeMessage, isOrderWithoutPat } =
    pageOrderConfig.value;
  const {
    ampm,
    categor,
    categorName,
    deptName,
    disNo,
    docName,
    fee,
    hosDeptId,
    hosDocId,
    hosId,
    numId,
    schDate,
    schId,
    schQukCategor,
    timeDesc,
    clinicalType,
    promptMessage,
    docTitleName,
    thRegisterId,
    regVerificationMode,
  } = pageArg;
  let { patientId, realNameAuth } = gStores.userStore.patChoose;
  const { source } = gStores.globalStore.browser;
  if (regVerificationMode === '2' && realNameAuth === '0') {
    await handlerConfirmPatReal();
  }
  // #ifdef MP-WEIXIN
  if (wxOrderSubscribeMessage?.length) {
    // @ts-expect-error
    await apiAsync(uni.requestSubscribeMessage, {
      tmplIds: wxOrderSubscribeMessage,
    }).catch((e) => {
      console.error(e);
    });
  }
  // #endif
  // 预约类型：1.预约挂号，2.当日挂号
  const resType = (dayjs().format('YYYY-MM-DD') === schDate && '2') || '1';
  const [firstDept, secondDept] = deptStore.deptClickStep;

  const requestArg = {
    freeSignData: '',
    firstDeptName: firstDept?.deptName,
    firstHosDeptId: firstDept?.deptId,
    secondDeptName: secondDept?.deptName,
    secondHosDeptId: secondDept?.deptId,
    ampm,
    categor,
    categorName,
    clinicalType: clinicalType === 'null' ? '1' : clinicalType || '1',
    deptName,
    disNo,
    docTitleName,
    docName,
    fee,
    hosDeptId,
    hosDocId,
    hosId,
    numId,
    schDate,
    schId,
    schQukCategor,
    timeDesc,
    patientId,
    source,
    resType,
    promptMessage,
    thRegisterId: thRegisterId || getLocalStorage('thRegisterId'),
    quickAppoint: '',
  };
  let alipayAuthCode = '';
  // #ifdef MP-ALIPAY
  const alipayPid = globalGl.systemInfo.alipayPid;
  if (alipayPid) {
    await getMyPowerQx()
      .then((qxRes: any) => {
        alipayAuthCode = qxRes.authCode;
      })
      .catch((e) => {});
  }
  // #endif
  //  正常挂号
  const actionApi = api.addReg;
  let {
    result: { orderId, hasCharge, hint },
  } = await actionApi(requestArg).catch(async (e) => {
    if (e) {
      const { respCode, message, code } = e;

      // 限制欠费用户预约挂号
      if (respCode === 999225) {
        gStores.messageStore.closeMessage();
        message && gStores.messageStore.showMessage(message, 3000);
      } else if (respCode === 999227) {
        //超限就诊提示
        message && gStores.messageStore.showMessage(message, 3000);
      } else if (respCode === 999231 && realNameAuth === '0') {
        // 去实名认证
        await handlerConfirmPatReal();
      } else if (code !== 4000) {
        message && gStores.messageStore.showMessage(message, 3000);
      }
    }
    throw new Error(e);
  });
  if (hasCharge === '0') {
    const { confirm } = await apiAsync(uni.showModal, {
      content: hint,
      cancelText: '稍后缴费',
      confirmText: '立即缴费',
    });

    if (confirm) {
      // goPay();

      throw new Error('去缴费');
    }
  } else if (hasCharge === '2') {
    await apiAsync(uni.showModal, {
      content: hint,
      confirmText: '确认',
      showCancel: false,
    });
  }

  deptStore.$patch({
    deptClickStep: [],
  });

  uni.navigateTo({
    url: joinQueryForUrl('/pagesA/MyRegistration/RegDetail', {
      orderId,
      preWz: '1',
      thRegisterId,
      patientId,
    }),
  });
};

export const handleSourceChoose = (pageArg) => {
  console.log('______________', pageArg);
  regConfirm(pageArg);
};

const test = async () => {
  //   const str = `id:zjsrmyy_search_doctor_office-87c9eb94fa5611efaa3f0242ac110003,1897539136071544832
  // data:{"chatId":"zjsrmyy_search_doctor_office-87c9eb94fa5611efaa3f0242ac110003","list":[{"deptName":"神经内科门诊","hosDeptId":"3000007|A0102013","showType":6,"hosId":"13001","hosName":"乐清市人民医院"}],"requestId":"","showType":6}
  // event:json
  // :`;
  // handleOneChunk(str, 0);
  // return;
  const data = {
    chatId: 'zjsrmyy_search_doctor_office-e403704efa4f11efaa3f0242ac110003',
    list: [
      {
        date: [
          '2025-03-06',
          '2025-03-07',
          '2025-03-09',
          '2025-03-10',
          '2025-03-11',
          '2025-03-13',
          '2025-03-14',
          '2025-03-16',
          '2025-03-17',
          '2025-03-18',
          '2025-03-20',
          '2025-03-21',
          '2025-03-23',
          '2025-03-24',
          '2025-03-25',
          '2025-03-27',
          '2025-03-28',
          '2025-03-30',
          '2025-03-31',
          '2025-04-01',
          '2025-04-03',
        ],
        deptName: '烧伤科',
        ampm: '2',
        hosDeptId: '3000042|A0102041',
        fee: '17.00',
        ampmName: '下午',
        hosId: '13001',
        schStateName: '有号',
        specialClinicName: '烧伤及创面修复外科门诊',
        schDate: '2025-03-06',
        schId: '20221129000000000634',
        docName: '胡加林',
        categorName: '专家（副高）',
        numHadReg: 3,
        schState: '0',
        numCount: 15,
        specialClinicDept: '3000042',
        numRemain: 12,
        categor: '5',
        hosDocId: '20212048',
        hosName: '乐清市人民医院',
        docTitleName: '副主任医师',
        specialDeptId: '3000042',
        schQukCategor: '烧伤及创面修复科(副高)',
      },
      {
        date: [
          '2025-03-07',
          '2025-03-08',
          '2025-03-11',
          '2025-03-14',
          '2025-03-15',
          '2025-03-18',
          '2025-03-19',
          '2025-03-21',
          '2025-03-22',
          '2025-03-25',
          '2025-03-26',
          '2025-03-28',
          '2025-03-29',
          '2025-04-01',
          '2025-04-02',
          '2025-04-03',
        ],
        deptName: '烧伤科',
        ampm: '2',
        hosDeptId: '3000042|A0102041',
        fee: '12.00',
        ampmName: '下午',
        hosId: '13001',
        schStateName: '有号',
        specialClinicName: '烧伤及创面修复外科门诊',
        schDate: '2025-03-07',
        schId: '20221213000000000105',
        docName: '崔丞硕',
        categorName: '普通号',
        numHadReg: 1,
        schState: '0',
        numCount: 10,
        specialClinicDept: '3000042',
        numRemain: 9,
        categor: '2',
        hosDocId: '20211947',
        hosName: '乐清市人民医院',
        docTitleName: '主治医师',
        specialDeptId: '3000042',
        schQukCategor: '烧伤及创面修复科',
      },
      {
        date: [
          '2025-03-12',
          '2025-03-13',
          '2025-03-17',
          '2025-03-20',
          '2025-03-23',
          '2025-03-24',
          '2025-04-01',
          '2025-04-02',
          '2025-04-03',
        ],
        deptName: '烧伤科',
        ampm: '1',
        hosDeptId: '3000042|A0102041',
        fee: '12.00',
        ampmName: '上午',
        hosId: '13001',
        schStateName: '有号',
        specialClinicName: '烧伤及创面修复外科门诊',
        schDate: '2025-03-12',
        schId: '20221129000000000535',
        docName: '林岳森',
        categorName: '普通号',
        numHadReg: 0,
        schState: '0',
        numCount: 10,
        specialClinicDept: '3000042',
        numRemain: 10,
        categor: '2',
        hosDocId: '20211848',
        hosName: '乐清市人民医院',
        docTitleName: '主治医师',
        specialDeptId: '3000042',
        schQukCategor: '烧伤及创面修复科',
      },
    ],
    requestId: '',
    showType: 7,
  };
  const { showType, list } = data;
  switchHandleResult(showType, list, '', '');
  // const { showType, list } = data;
  // switchHandleResult(showType, list, '', '');
  // const { result } = await api.inspectionAnalysis({
  //   sysCode: globalGl.SYS_CODE,
  //   source: 1,
  //   repId:"2025030400000460",
  //   repType: 1,
  //   extend:{"repIdDesc":"1deXdjssHbyuqyWVP4gJrHfoOdsC3MsR"}
  // });
  // const { showType, list, requestId, chatId } = result;
  // if (showType === 1) {
  //   dealShowType1(list, requestId, chatId);
  // } else {
  //   dealShowType12(list, requestId, chatId);
  // }
  // scrollToNewMsg();
};
