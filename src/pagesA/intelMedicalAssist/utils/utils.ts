import { computed, ref, reactive } from 'vue';
import { type StyleConfigType } from './types';
import { type TButtonConfig, useTBanner } from '@/utils';
export const msgList = ref<Array<any>>([]);
const msgLoad = ref<boolean>(false);
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
  transition: true,//初始过渡效果
  showHeader: true,//展示首页
  isMessage: false,//通知效果
  simpleHeadInit:false,//初始服务居中
});


export  const guessAskList = ref([
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
  })
  await new Promise((rl,rj)=>{
    setTimeout(()=>{
      msgList.value.push({
        my: false,
        msg: '系统回复1',
      })
    },1000)
  })
};
export const onBlur = (value) => {
  console.log('onBlur', value);
};

export const handleGuess = (item) => {
  console.log('handleGuess', item);
};

export const handleServer = (item:TButtonConfig) => {
  console.log('handleServer', item);

  useTBanner(item)
};