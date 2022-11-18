import isoWeek from 'dayjs/plugin/isoWeek';
import dayjs from 'dayjs';
import api from '@/service/api';

import { ref, computed } from 'vue';
import { ServerStaticData, ISystemConfig, GStores } from '@/utils';
import { joinQueryForUrl, joinQuery } from '@/common/utils';
import { type XOR } from '@/typeUtils/obj';

dayjs.extend(isoWeek);

export interface IChooseDays {
  day: string;
  weekday: string;
  fullDay: string;
}

export interface IOrderSource {
  disNo: string;
  numId: string;
  timeDesc: string;
}

interface IDocRow {
  deptName: string;
  docJobName: string;
  docPhoto: string;
  docTitleName: string;
  goodAt: string;
  docName: string;
  hosDeptId: string;
  hosId: string;
  hosName: string;
  showNo: string;
  intro: string;
  hosDocId: string;

  // 快捷号别
  schQukCategor?: string;
}

export interface IDocListAll extends IDocRow {
  docNamePinYin: string;
  specialClinicName?: string;
  schDocSubResultList: {
    schDate: string;
    schState: '0' | '1';
    amPmResults: TSchInfo[];
  }[];
}

export interface IDocListByDate {
  schDate: string;
  schDateList: {
    categor: string;
    categorName: string;
    schDate: string;
    schemeList: ({
      docName: string;
      schemeList: TSchInfo[];
    } & IDocRow)[];
  }[];
}

export type TSchInfo = {
  // 上下午标志 1上午 2下午 3白天 4夜晚 5昼夜 6中午 7白昼 8前夜 9后夜 10全天
  ampm: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10';
  // 上下午标志名称
  ampmName: string;
  // 公务员是否可报销 1都可报销 2仅公务员可报销
  canCivilServantInsurance?: '1' | '2';
  // 医保是否可报销 1可报销 0不可报销
  canInsurance?: '1' | '0';
  // 号别编号
  categor: string;
  categorName: string;
  // 门诊类型：1、普通预约 2-膏方预约 3-名医在线夜门诊 4-云诊室 5-自助便民门诊（省人民凤凰HIS）6-专病门诊 7-成人 8-儿童 9-弹性门诊 10-军属门诊 11-军人门诊
  clinicalType?:
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
    | '11';

  empNo: string;
  // 挂号费
  fee: string;
  // 号源总数
  numCount: string;
  // 已预约数
  numHadReg: string;
  // 可预约数
  numRemain: string;
  // 查看医生电子名片 0 不查看 1 查看
  queryDocImage?: '0' | '1';
  // 排班日期
  schDate: string;
  schId: string;

  // 排班状态 0有号 1停诊 2约满 3未放号
  schState: '0' | '1' | '2' | '3';
  // 排班状态名称
  schStateName: string;
} & IDocRow;

export type TAllDayTScInfo = {
  schDate: string;
  schState: string;
  schDocAmPm: Pick<TSchInfo, 'ampm' | 'ampmName'> & {}[];
};

interface IOrderProps {
  hosId: string;
  clinicalType: string; // 1、普通预约 2-膏方预约 3-名医在线夜门诊 4-云诊室 5-自助便民门诊（省人民凤凰HIS）6-专病门诊 7-成人 8-儿童 9-弹性门诊 10-军属门诊 11-军人门诊
  hosDeptId?: string;
  firstHosDeptId?: string;
  secondHosDeptId?: string;
  promptMessage?: string;
  deptName: string;
  isExpertDeptId?: string; // 是否是专家科室（0否 1是） 是：按一级科室ID查询排班 否：按二级科室ID查询排班
}

export const useOrder = (props: IOrderProps) => {
  const orderConfig = ref<ISystemConfig['order']>({
    chooseDay: 0,
    selOrderColumn: 3,
    isOrderBlur: '1',
    isHideOutTimeOrderSource: '1',
    isOrderPay: '0',
  });

  // ref
  const selectOrderSource = ref<any>('');
  const selectOrderSourceNumId = ref('');
  const isSelectOrderSourceShow = ref(false);
  const isComplete = ref(false);
  const selectSchInfos = ref([] as TSchInfo[]);
  const orderSourceList = ref<IOrderSource[]>([]);

  const allDocList = ref<IDocListAll[]>([]);
  const dateDocList = ref<IDocListByDate[]>([]);
  const chooseDays = ref<IChooseDays[]>([]);
  const chooseDaysEnabled = ref<string[]>([]);
  const checkedDay = ref('');
  const gStores = new GStores();
  const dateDocListFilterByDate = computed(() => {
    if (checkedDay.value) {
      return dateDocList.value.filter((o) => o.schDate === checkedDay.value);
    } else {
      return [];
    }
  });

  const getListAll = async (
    date: string,
    payload: {
      hosId: string;
      clinicalType?: string;
      hosDeptId?: string;
      firstHosDeptId?: string;
      secondHosDeptId?: string;
      isExpertDeptId?: string;
    }
  ) => {
    const {
      hosId,
      clinicalType,
      hosDeptId,
      firstHosDeptId,
      secondHosDeptId,
      isExpertDeptId,
    } = payload;
    const args = {
      source: gStores.globalStore.browser.source,
      hosId,
      clinicalType,
      hosDeptId,
      firstHosDeptId,
      secondHosDeptId,
      isExpertDeptId,
    };

    const eDaysEnabled: string[] = [];
    isComplete.value = false;
    const { result: allList } = await api
      .getDeptSchForDoc<IDocListAll[]>(args)
      .finally(() => {
        isComplete.value = true;
      });

    if (allList && allList.length) {
      allList.map((docInfo) => {
        const { docPhoto } = docInfo;

        docInfo.schDocSubResultList.map((o) => {
          const { schDate, amPmResults } = o;

          if (!eDaysEnabled.includes(schDate)) {
            eDaysEnabled.push(schDate);
          }

          if (amPmResults && amPmResults.length) {
            amPmResults.map((amPmItem) => {
              amPmItem.docPhoto = docPhoto;
            });
          }
        });
      });

      allDocList.value = allList;
    }

    chooseDaysEnabled.value = eDaysEnabled;
  };

  const getListByDate = async (payload: {
    hosId: string;
    clinicalType?: string;
    hosDeptId?: string;
    firstHosDeptId?: string;
    secondHosDeptId?: string;
    isExpertDeptId?: string;
  }) => {
    const {
      hosId,
      clinicalType,
      hosDeptId,
      firstHosDeptId,
      secondHosDeptId,
      isExpertDeptId,
    } = payload;

    const args = {
      source: gStores.globalStore.browser.source,
      hosId,
      clinicalType,
      hosDeptId,
      firstHosDeptId,
      secondHosDeptId,
      isExpertDeptId,
    };
    isComplete.value = false;

    const { result } = await api
      .getDeptSchByDate<IDocListByDate[]>(args)
      .finally(() => {
        isComplete.value = true;
      });

    if (result && result.length) {
      result.map((o) => {
        const { schDateList } = o;
        if (schDateList && schDateList.length) {
          schDateList.map((schDate) => {
            const { schemeList } = schDate;

            if (schemeList && schemeList.length) {
              schemeList.map((scheme) => {
                const { schemeList: _schemeList } = scheme;

                if (_schemeList && _schemeList.length) {
                  const schInfo = _schemeList[0];

                  const {
                    deptName,
                    docJobName,
                    docName,
                    docPhoto,
                    docTitleName,
                    goodAt,
                    hosDeptId,
                    hosDocId,
                    hosId,
                    hosName,
                    intro,
                    schQukCategor,
                  } = schInfo;

                  Object.assign(scheme, {
                    deptName,
                    docJobName,
                    docName,
                    docPhoto,
                    docTitleName,
                    goodAt,
                    hosDeptId,
                    hosDocId,
                    hosId,
                    hosName,
                    intro,
                    schQukCategor,
                  });
                }
              });
            }
          });
        }
      });
    }
    dateDocList.value = result || [];
  };

  const dateClick = async (e: {
    item: IDocListAll;
    schInfo: IDocListAll['schDocSubResultList'][number];
  }) => {
    const { item, schInfo } = e;
    console.log(e);
    return;

    const amPmResults = schInfo.amPmResults;
    selectSchInfos.value = amPmResults;

    if (amPmResults && amPmResults.length) {
      await getOrderSource(amPmResults[0]);
      isSelectOrderSourceShow.value = true;
    }
  };

  // 某天点击 某个时间段(上午...)
  const regClick = async ({ scheme }: { scheme: TSchInfo }) => {
    selectSchInfos.value = [scheme];
    await getOrderSource(scheme);
    isSelectOrderSourceShow.value = true;
  };

  const amChange = async (schInfo: TSchInfo) => {
    getOrderSource(schInfo);
  };

  const getOrderSource = async (schInfo: TSchInfo) => {
    const {
      ampm,
      categor,
      deptName,
      hosDeptId,
      hosDocId,
      hosId,
      schDate,
      schId,
    } = schInfo;

    const source = gStores.globalStore.browser.source;

    const arg = {
      ampm,
      categor,
      deptName,
      hosDeptId,
      hosDocId,
      hosId,
      schDate,
      schId,
      source,
    };

    orderSourceList.value = [];
    isComplete.value = false;
    let { result } = await api
      .getNumberSource<IOrderSource[]>(arg)
      .finally(() => {
        isComplete.value = true;
      });

    if (result && result.length) {
      // 过滤剩余号源数为零的(精确号源是从 1 开始的)
      result.filter((o) => o.disNo != '0');
    }

    orderSourceList.value = result || [];

    // if (!orderSourceList.value.length) {
    //   gStores.messageStore.showMessage('该时段无可以选择的号源', 3000);
    //   return Promise.reject(void 0);
    // }
  };

  // 点击某个号源
  const orderSourceChoose = ({
    item,
    selectSchInfo,
  }: {
    item: IOrderSource;
    selectSchInfo: TSchInfo;
  }) => {
    const {
      ampmName,
      ampm,
      categor,
      categorName,
      deptName,
      docName,
      docPhoto,
      fee,
      hosDeptId,
      hosDocId,
      hosId,
      schDate,
      schId,
      schQukCategor,
      docTitleName,
    } = selectSchInfo;

    const { disNo, numId, timeDesc } = item;
    const { clinicalType, promptMessage } = props;

    const pageArg = {
      disNo,
      numId,
      timeDesc,
      ampmName,
      ampm,
      categor,
      categorName,
      deptName,
      docName,
      docPhoto,
      fee,
      hosDeptId,
      hosDocId,
      hosId,
      schDate,
      schId,
      schQukCategor,
      clinicalType,
      promptMessage,
      docTitleName,
    };
    selectOrderSourceNumId.value = numId;

    uni.navigateTo({
      url: joinQueryForUrl('/pagesA/MyRegistration/RegConfirm', pageArg),
    });
  };

  const init = async (query?: {
    hosId: string;
    hosDeptId?: string;
    firstHosDeptId?: string;
    secondHosDeptId?: string;
    isExpertDeptId?: string;
    clinicalType?: string;
  }) => {
    const config = await ServerStaticData.getSystemConfig('order');

    if (config) {
      Object.entries(config).map(([key, value]) => {
        orderConfig.value[key] = value;
      });
    }

    chooseDays.value = getChooseDays(orderConfig.value.chooseDay);

    if (query) {
      getListAll(checkedDay.value, query);
    }
  };

  return {
    orderConfig,
    init,
    chooseDays,
    checkedDay,
    chooseDaysEnabled,
    allDocList,
    dateDocList,
    getListByDate,
    dateDocListFilterByDate,
    dateClick,
    selectOrderSource,
    isSelectOrderSourceShow,
    selectSchInfos,
    orderSourceList,
    orderSourceChoose,
    selectOrderSourceNumId,
    amChange,
    regClick,
    isComplete,
  };
};

export const getChooseDays = (days: number) => {
  let _d = days - 1;

  const _arr: IChooseDays[] = [];
  const dayMap = {
    1: '周一',
    2: '周二',
    3: '周三',
    4: '周四',
    5: '周五',
    6: '周六',
    7: '周日',
  };

  while (_d >= 0) {
    const _date = dayjs().add(_d--, 'day');
    _arr.unshift({
      fullDay: _date.format('YYYY-MM-DD'),
      day: _date.format('MM-DD'),
      weekday: _d === -1 ? '今天' : dayMap[_date.isoWeekday()],
    });
  }

  return _arr;
};
