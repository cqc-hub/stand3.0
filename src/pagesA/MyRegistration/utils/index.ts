import isoWeek from 'dayjs/plugin/isoWeek';
import dayjs from 'dayjs';

import { ref } from 'vue';
import { ServerStaticData, ISystemConfig } from '@/utils';

dayjs.extend(isoWeek);

export interface IChooseDays {
  day: string;
  weekday: string;
  fullDay: string;
}

export const useOrder = () => {
  const orderConfig = ref<ISystemConfig['order']>({
    chooseDay: 0
  });

  const chooseDays = ref<IChooseDays[]>([]);
  const chooseDaysEnabled = ref<string[]>(['09-18', '09-21', '09-22']);
  const checkedDay = ref('');

  const init = async () => {
    orderConfig.value = await ServerStaticData.getSystemConfig('order');
    chooseDays.value = getChooseDays(orderConfig.value.chooseDay);
  };

  return {
    init,
    orderConfig,
    chooseDays,
    checkedDay,
    chooseDaysEnabled
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
