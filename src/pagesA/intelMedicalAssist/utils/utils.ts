import { computed, ref, reactive, nextTick } from 'vue';
import { type StyleConfigType } from './types';
import { type TButtonConfig, useTBanner } from '@/utils';
import { cloneUtil } from '@/common';
import globalGl from '@/config/global';
import api from '@/service/api';
export const msgList = ref<
  Array<{
    msgLoad?: boolean;
    my?: boolean;
    msg?: string;
    type: number;
    boldMsg?: string;
    requestId?: string;
    addRessList?: any[];
    addRessInfo?: object;
    homeMenuConfig?: any[];
    firstCommendList?: any[];
  }>
>([]);
export const msgState = ref<any>({
  scrollIntoView: '',
  msgLoad: false,
  lastChatId: '',
  msg:'',
  focus:false
});
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
});

export const guessAskList = ref([
  {
    label: '不知道挂什么号',
    value: '不知道挂什么号',
  },
  {
    label: '感冒要可以买那些',
    value: '感冒要可以买那些',
  },
  {
    label: '帮我解读预先这份报告',
    value: '帮我解读预先这份报告',
  },
  {
    label: '不知道挂什么号',
    value: '不知道挂什么号',
  },
  {
    label: '感冒要可以买那些',
    value: '感冒要可以买那些',
  },
  {
    label: '帮我解读预先这份报告',
    value: '帮我解读预先这份报告',
  },
  {
    label: '不知道挂什么号',
    value: '不知道挂什么号',
  },
  {
    label: '感冒要可以买那些',
    value: '感冒要可以买那些',
  },
  {
    label: '帮我解读预先这份报告',
    value: '帮我解读预先这份报告',
  },
]);
export const guessServerList = ref([
  {
    icon: 'intelMedicalAssist_zhgl.png',
    label: '智能导诊',
    type: 'self',
    path: 'pagesB/reportQuery/reportQuery',
    addition: { orderClassTabIndex: 'tabIndex' },
  },
  {
    icon: 'intelMedicalAssist_chuan card.png',
    label: '预约挂号',
    type: 'self',
    path: 'pagesB/reportQuery/reportQuery',
    addition: { orderClassTabIndex: 'tabIndex' },
  },
  {
    icon: 'intelMedicalAssist_search.png',
    label: '报告查询',
    type: 'self',
    path: 'pagesB/reportQuery/reportQuery',
    addition: { orderClassTabIndex: 'tabIndex' },
  },
  {
    icon: 'intelMedicalAssist_dbsj.png',
    label: '门诊缴费',
    type: 'self',
    path: 'pagesB/reportQuery/reportQuery',
    addition: { orderClassTabIndex: 'tabIndex' },
  },
  {
    icon: 'intelMedicalAssist_ssjj.png',
    label: '治疗预约',
    type: 'self',
    path: 'pagesB/reportQuery/reportQuery',
    addition: { orderClassTabIndex: 'tabIndex' },
  },
  {
    icon: 'intelMedicalAssist_document.png',
    label: '病案复印',
    type: 'self',
    path: 'pagesB/reportQuery/reportQuery',
    addition: { orderClassTabIndex: 'tabIndex' },
  },
  {
    icon: 'intelMedicalAssist_card.png',
    label: '在线取号',
    type: 'self',
    path: 'pagesB/reportQuery/reportQuery',
    addition: { orderClassTabIndex: 'tabIndex' },
  },
  {
    icon: 'intelMedicalAssist_hljl.png',
    label: '满意度调查',
    type: 'self',
    path: 'pagesB/reportQuery/reportQuery',
    addition: { orderClassTabIndex: 'tabIndex' },
  },
  {
    icon: 'intelMedicalAssist_rypg.png',
    label: '门诊签到',
    type: 'self',
    path: 'pagesB/reportQuery/reportQuery',
    addition: { orderClassTabIndex: 'tabIndex' },
  },
]);
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

export const sendMsg = async (value) => {
  msgList.value.push({
    my: true,
    msg: value,
    type: 1,
  });
  msgState.value.msgLoad = true;
  scrollToNewMsg();
  const {
    result: { showType, list, requestId, chatId },
  } = await api.customerAIask({
    content: value,
    sysCode: globalGl.SYS_CODE,
    source: 1,
    chatId: msgState.value.lastChatId,
  });
  msgState.value.lastChatId = chatId;
  msgState.value.msgLoad = false;
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

const scrollToNewMsg = () => {
  nextTick(() => {
    uni.pageScrollTo({
      selector:
        '#pageScroll >>> #smartChatRoomItem_' + (msgList.value.length - 1),
      duration: 300,
      success: () => {
        console.log('滚动成功');
      },
      fail: (err) => {
        console.log('滚动失败：', err);
      },
    });
  });
};

export const onBlur = (value) => {
  console.log('onBlur', value);
};

export const handleGuess = (item) => {
  console.log('handleGuess', item);
};

export const handleServer = (item: TButtonConfig) => {
  console.log('handleServer', item);

  useTBanner(item);
};

export const clearChatId = async (id: string) => {
  let lastMyContent=''
  let lastMsg:any={}
  msgList.value.forEach((item,index)=>{
    if(item?.requestId&&item.requestId===id){
      lastMyContent=lastMsg.msg
    }
    if(item.my) lastMsg=item
  })
  lastMyContent&&(msgState.value.msg=lastMyContent)
  msgState.value.lastChatId=''

};

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
