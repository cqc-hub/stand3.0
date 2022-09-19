import isoWeek from 'dayjs/plugin/isoWeek';
import dayjs from 'dayjs';
import api from '@/service/api';

import { ref } from 'vue';
import { ServerStaticData, ISystemConfig, GStores } from '@/utils';

dayjs.extend(isoWeek);

export interface IChooseDays {
  day: string;
  weekday: string;
  fullDay: string;
}

export interface IDocListAll {
  deptName: string;
  docJobName: string;
  docName: string;
  docNamePinYin: string;
  docPhoto: string;
  docTitleName: string;
  goodAt: string;
  hosDeptId: string;
  hosDocId: string;
  hosId: string;
  hosName: string;
  intro: string;
  showNo: string;
  schDocSubResultList: {
    schDate: string;
    schState: '0' | '1';
  }[];
}

export const useOrder = () => {
  const orderConfig = ref<ISystemConfig['order']>({
    chooseDay: 0
  });

  const allDocList = ref<IDocListAll[]>([]);
  const chooseDays = ref<IChooseDays[]>([]);
  // const chooseDaysEnabled = ref<string[]>(['2022-09-21', '2022-09-22', '2022-09-25', '2022-10-02']);
  const chooseDaysEnabled = ref<string[]>([]);
  const checkedDay = ref('');
  const gStores = new GStores();

  const getList = async (
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
    const { hosId, clinicalType, hosDeptId, firstHosDeptId, secondHosDeptId, isExpertDeptId } = payload;
    const args = {
      source: gStores.globalStore.browser.source,
      hosId,
      clinicalType,
      hosDeptId,
      firstHosDeptId,
      secondHosDeptId,
      isExpertDeptId
    };

    const eDaysEnabled: string[] = [];
    const { result: allList } = await api.getDeptSchForDoc<IDocListAll[]>(args);

    if (allList && allList.length) {
      allList.map((docInfo) => {
        docInfo.schDocSubResultList.map((o) => {
          const { schDate } = o;

          if (!eDaysEnabled.includes(schDate)) {
            eDaysEnabled.push(schDate);
          }
        });
      });

      allDocList.value = allList;
    }

    chooseDaysEnabled.value = eDaysEnabled;
  };

  const init = async (query: {
    hosId: string;
    hosDeptId?: string;
    firstHosDeptId?: string;
    secondHosDeptId?: string;
    isExpertDeptId?: string;
    clinicalType?: string;
  }) => {
    orderConfig.value = await ServerStaticData.getSystemConfig('order');
    chooseDays.value = getChooseDays(orderConfig.value.chooseDay);

    getList(checkedDay.value, query);
  };

  return {
    init,
    orderConfig,
    chooseDays,
    checkedDay,
    chooseDaysEnabled,
    allDocList
  };
};

const getChooseDays = (days: number) => {
  let _d = days - 1;

  const _arr: IChooseDays[] = [];
  const dayMap = {
    1: '周一',
    2: '周二',
    3: '周三',
    4: '周四',
    5: '周五',
    6: '周六',
    7: '周日'
  };

  while (_d >= 0) {
    const _date = dayjs().add(_d--, 'day');
    _arr.unshift({
      fullDay: _date.format('YYYY-MM-DD'),
      day: _date.format('MM-DD'),
      weekday: _d === -1 ? '今天' : dayMap[_date.isoWeekday()]
    });
  }

  return _arr;
};
