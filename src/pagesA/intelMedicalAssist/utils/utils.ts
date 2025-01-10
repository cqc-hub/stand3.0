import { computed, ref, reactive, nextTick } from 'vue';
import { type StyleConfigType } from './types';
import { type TButtonConfig, useTBanner } from '@/utils';
import globalGl from '@/config/global';
import api from '@/service/api';
export const msgList = ref<Array<any>>([]);
export const msgState = ref<any>({
  scrollIntoView: '',
  msgLoad: false,
});
const focus = ref<boolean>(false);
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
export const sendMsg = async (value) => {
  console.log('sendMsg', value);
  msgList.value.push({
    my: true,
    msg: value,
    type:1
  });
  msgList.value.msgLoad = true;
  scrollToNewMsg();
  const { result: { showType, list, requestId, chatId }  } = await api.customerAsk({
    content: value,
    sysCode: 1001017,
    // sysCode: globalGl.SYS_CODE,
    source: 1,
    chatId: msgList.value.lastChatId,
  });
  msgList.value.lastChatId=chatId
  msgList.value.msgLoad = false;
  if (!(list && list.length)) {
    msgList.value.push({
      my: false,
      msg: '未查询到您想要了解的问题，点击客服中心获取帮助！',
    });
  }else{
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
          msg: "未对接的showType: " + showType,
          type: 1,
        });
        break;
    
    }
  }
  
  scrollToNewMsg();

  // await new Promise((rl, rj) => {
  //   setTimeout(() => {
  //     msgList.value.msgLoad = false;
  //     // let i = 0;
  //     // let msg =
  //     //   '这是一条系统回复，这是一条系统回复，这是一条系统回复，这是一条系统回复，';
  //     // msgList.value[msgList.value.length - 1].msg = '';
  //     // for (; i <= msg.length; i++) {
  //     //   setTimeout(() => {
  //     //     msgList.value[msgList.value.length - 1].msg.push(msg[i]);
  //     //   }, 50);
  //     // }

  //     // msgList.value[msgList.value.length - 1].msg = '';
  //     msgList.value.push({
  //       my: false,
  //       msg: '系统回复1',
  //     });
  //     scrollToNewMsg();
  //   }, 1000);
  // });
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


const dealShowType1=(list, requestId)=> {
  const { question, answer } = list[0];

  msgList.value.push({
    my: false,
    msg: answer,
    boldMsg: (question && question + "为") || "",
    type: 1,
    requestId,
  });
}

const dealShowType9=(list, requestId)=> {
  msgList.value.push({
    my: false,
    msg: "为您推荐: ",
    type: 3,
    addRessList: list,
    requestId,
  });
}

const dealShowType10=(list, requestId)=> {
  const {
    question: title,
    intro: subTitle,
    latitude,
    longitude,
    phones,
  } = list[0];

  msgList.value.push({
    my: false,
    msg: "为您找到以下内容",
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
}

const dealShowType11=(list, requestId)=> {
  msgList.value.push({
    my: false,
    type: 4,
    homeMenuConfig: list,
    requestId,
  });
  
}