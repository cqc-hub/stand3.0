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
export const isReportAnalysis = ref<boolean>(false);
export const isPhoto = ref(true);
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

export const chunkStatus = ref<ChunkStatusType>({
  isWXStreamApi: false,
  isTyping: false,
  chunkTemp: '',
});

export const reload = async (isMess) => {
  popipHasShow.value = false;
  isPhoto.value = true;
};

export const init = async (isMess) => {
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
  isMess && isMess == '1' && initWithMess();
  reload(isMess);
  // api.inspectionAnalysis({})
  // test();
  //  setTimeout(()=>{
  //  styleConfig.value.showHeader=false
  //  msgState.value.msgLoad=true
  //  },200)
};

export const initWithMess = async () => {
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
  msgList.value=[{
    my: false,
    type: 6,
    // type: 7,
  }];
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
export const sendMsg = async (str: string,answertype?:1|0) => {
  // #ifdef  MP-ALIPAY
  // console.log('msgList.value.length',msgList.value.length)
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
  console.log("_____________",msgState.value.msgLoad)
  scrollToNewMsg();
  // #ifdef  MP-WEIXIN
  if (chunkStatus.value?.isWXStreamApi) {
    typeInAsk(value,answertype||0);
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
      type:answertype||0,
      chatId: msgState.value.lastChatId,
    })
    .finally(() => {
      msgState.value.msgLoad = false;
    });
  msgState.value.lastChatId = chatId;

  switchHandleResult(showType, list, requestId, chatId);
};

const switchHandleResult = (
  showType: number,
  list: Array<any>,
  requestId: string,
  chatId: string,
  typeInIndex?: number
) => {
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
        // #ifdef  MP-WEIXIN
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

      case 6:
        dealShowType6(list, requestId, chatId);
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
    // console.log(
    //   '开始滚动',
    //   selector ||
    //     `#pageScroll >>> #smartChatRoomItem_${msgList.value.length - 1}`,
    //   duration || 300
    // );
    uni.pageScrollTo({
      selector:
        selector ||
        `#pageScroll >>> #smartChatRoomItem_${msgList.value.length - 1}`,
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
    // url: `https://testphs.eheren.com/gateway/phs-extend/customer/picTrans?sysCode=${gStores.globalStore.sysCode}`,
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
  sendMsg(item.value,1);
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
        boldMsg: (question && question + '为') || '',
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
    boldMsg: (question && question + '为') || '',
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

const dealShowType6 = (list, requestId, chatId) => {
  msgList.value.push({
    my: false,
    msg: '建议您到以下科室挂号就诊',
    type: 62,
    addRessList: list,
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

let requestTask: any = null;
let taskQueue = new TaskQueue();
const typeInAsk = (value,answertype) => {
  const gStores = new GStores();
  const settings = {
    // url: `https://testphs.eheren.com/gateway/phs-extend/customer/aiStreamAsk`,
    url: `${env.baseApi}/phs-extend/customer/aiStreamAsk`,
    // url: "http://10.10.117.58:9907/customer/aiStreamAsk",
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
        // sysCode: 1001017,
        chatId: msgState.value.lastChatId,
        type:answertype,
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
    let tempData = chunkStatus.value.chunkTemp.split('\n\n');
    if (tempData.length > 1) {
      tempData.forEach((item, index) => {
        if (index == tempData.length - 1) {
          chunkStatus.value.chunkTemp = item;
        } else {
          handleOneChunk(item, typeInIndex);
        }
      });
    }
  });
};

export const stopChunkRequest = () => {
  requestTask?.abort();
  msgState.value.msgLoad = false;
  chunkStatus.value.isTyping = false;
  taskQueue.clearTask();
};

const handleOneChunk = async (chunk: string, typeInIndex: number) => {
  // console.log('处理的数据:', chunk);
  if (chunk.includes('event:message')) {
    const idMatch = chunk.match(/id:(.*)/);
    let idStr = idMatch ? idMatch[1] : null;
    const id = idStr?.split(',')[0];
    const questionId = idStr?.split(',')[1];
    // 提取data:和event:message之间的字符
    const dataMatch = chunk.match(/data:(.*?)event:message/s);
    const data = dataMatch ? dataMatch[1].trim() : null;
    // console.log('解析的数据');
    console.log('chatId:', id, ';questionId:', questionId, ';文本：', data);
    // const regex = /data:([\s\S]*?)event:message/;
    // const match = chunk.match(regex);
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
      return;
    }
    chatId && (msgState.value.lastChatId = chatId);
    switchHandleResult(showType, list, requestId, chatId, typeInIndex);
  }
};

const test = () => {
  // const str = `id:,1894569410019172352
  // data:{"chatId":"","list":[{"date":["2025-03-10","2025-03-03","2025-03-04","2025-03-03","2025-03-03","2025-03-03","2025-03-03","2025-03-03","2025-03-03","2025-03-03","2025-03-03","2025-03-03","2025-03-03","2025-03-03"],"deptName":"多学科门诊(杭州口腔医院)","goodAt":"主诊：各类错牙合畸形的诊断、治疗，包括儿童早期矫治、儿童及成人牙列不齐、先天缺牙、埋伏牙及骨性错牙合正畸-正颌多学科联合治疗等。","ampm":"2","hosDeptId":"992246295136113548","fee":"15.0","ampmName":"下午","hosId":"13078","schDate":"2025-03-03","schId":"2025-03-03_2_992870638711017806","docName":"李琦","schState":"0","intro":"共产党员 \r\n毕业于山东大学、口腔正畸学硕士  \r\n中国口腔正畸学会（COS）会员、美国隐适美（Invisalign）矫正资格认证医师 接受系统专业的正畸学教育，熟练掌握功能矫治技术、固定矫治技术、自锁托槽矫治技术、无托槽隐形矫治技术等，诊治大量的正畸患者，具有先进的矫治理论。工作细心严谨，热情负责。多次参加国内外口腔正畸学术交流会议，对正畸领域的前沿矫治理念、技术与方法等有较全面的了解。参与《不同患者对姿势位微笑上唇线位置的审美评价》的临床研究，在口腔专业杂志发表论文多篇。","numRemain":5,"hosDocId":"992870638711017806","hosName":"杭州口腔医院平海院区","docTitleName":"主治医师"},{"date":["2025-03-03"],"deptName":"多学科门诊(杭州口腔医院)","goodAt":"主诊：各类错牙合畸形的诊断、治疗，包括儿童早期矫治、儿童及成人牙列不齐、先天缺牙、埋伏牙及骨性错牙合正畸-正颌多学科联合治疗等。","ampm":"2","hosDeptId":"992246295136113548","fee":"15.0","ampmName":"下午","hosId":"13078","schDate":"2025-03-03","schId":"2025-03-03_2_992870638711017806","docName":"李琦","schState":"0","intro":"共产党员 \r\n毕业于山东大学、口腔正畸学硕士  \r\n中国口腔正畸学会（COS）会员、美国隐适美（Invisalign）矫正资格认证医师 接受系统专业的正畸学教育，熟练掌握功能矫治技术、固定矫治技术、自锁托槽矫治技术、无托槽隐形矫治技术等，诊治大量的正畸患者，具有先进的矫治理论。工作细心严谨，热情负责。多次参加国内外口腔正畸学术交流会议，对正畸领域的前沿矫治理念、技术与方法等有较全面的了解。参与《不同患者对姿势位微笑上唇线位置的审美评价》的临床研究，在口腔专业杂志发表论文多篇。","numRemain":5,"hosDocId":"992870638711017806","hosName":"杭州口腔医院平海院区","docTitleName":"主治医师"}],"requestId":"1894569447688216576","showType":6}
  // event:json
  // :`;
  //   handleOneChunk(str, 0);
  //   return;
  const data = {
    chatId: '',
    list: [
      {
        path: '/pages/index/index',
        question: '镜湖院区内镜中心',
        answer: '2楼内镜中心',
        query:
          '{"type":"8_2","typeData":{"buildingId":208089,"type":"1","hisName":"A020220"}}',
        appId: 'wx0815c00f0b4bd7c3',
        showType: 9,
        terminalType: 'mini',
      },
      {
        path: '/pages/index?id=RjCFT94AaD&appKey=4l2c52f0jU&poi=A010220',
        question: '昌安院区内镜中心',
        answer: '3楼13诊区',
        appId: 'wx8735a8a39cf58b5e',
        showType: 9,
        terminalType: 'mini',
      },
    ],
    requestId: '1895451830515920896',
    showType: 9,
  };
  const { showType, list } = data;
  switchHandleResult(showType, list, '', '');
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
