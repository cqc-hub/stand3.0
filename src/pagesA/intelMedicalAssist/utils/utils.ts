import { computed, ref, reactive } from 'vue';
import { type StyleConfigType } from './types';
const msg = ref<string>();
const msgLoad = ref<boolean>(false);
const focus = ref<boolean>(false);
export const styleConfig = ref<StyleConfigType>({
  transition: false,
  showHeader: false,
  isMessage: true,
  simpleHeadInit:false,
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
export const sendMsg = (value) => {
  console.log('sendMsg', value);
};
export const onBlur = (value) => {
  console.log('onBlur', value);
};

export const handleGuess = (item) => {
  console.log('handleGuess', item);
};

export const handleServer = (item) => {
  console.log('handleServer', item);
};