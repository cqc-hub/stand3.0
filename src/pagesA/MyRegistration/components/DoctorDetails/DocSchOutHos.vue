<template>
  <view class="">
    <g-tabs
      v-model:value="tabCurrent"
      :tabs="list"
      @change="tabChange"
      field="hosName"
      activeColor="#fff"
      pillsBorderRadius="10rpx"
      pillsColor="var(--hr-brand-color-6)"
      scroll
      pills
    />

    <order-sel-date
      :value="day"
      :choose-days="chooseDays"
      :enable-days="(activeSchInfo && activeSchInfo.enabledDays) || []"
      @change="dateChange"
    />

    <view class="mt24">
      <view
        v-for="item in schList"
        :key="item.schId"
        class="sch-item mb8 animate__animated animate__fadeIn"
      >
        <doc-sch-item
          :pageConfig="pageConfig"
          :item="item"
          :systemModeOld="gStores.globalStore.modeOld"
          disabled
          for-show
        />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, watch, computed } from 'vue';
  import { IDocSchOutHosItem } from '../../utils/DoctorDetails';
  import { getChooseDays, IChooseDays } from '../../utils';
  import { type ISystemConfig, GStores } from '@/utils';

  import OrderSelDate from '../orderSelDate/OrderSelDate.vue';
  import DocSchItem from '../DoctorDetails/DocShcItem.vue';

  const props = defineProps<{
    list: IDocSchOutHosItem[];
    hosId: string;
    day: string;
    pageConfig: ISystemConfig['order'];
  }>();
  const emits = defineEmits(['update:hosId', 'update:day']);
  const gStores = new GStores();
  const tabCurrent = ref(0);
  const _chooseDays = ref<IChooseDays[]>([]);

  const activeSchInfo = computed(() => {
    return props.list[tabCurrent.value];
  });

  const schList = computed(() => {
    const list = activeSchInfo.value.schList || [];
    const findList = list.find((o) => o.schDate === props.day);

    return findList?.schDateList || [];
  });

  const chooseDays = computed(() => {
    const days = Object.keys(activeSchInfo.value.enabledDays || {});
    return _chooseDays.value.filter((day) => days.includes(day.fullDay));
  });

  const changeHos = (hosId: string) => {
    emits('update:hosId', hosId);
  };

  const changeDay = (day: string) => {
    emits('update:day', day);
  };

  const tabChange = (idx: number) => {
    changeHos(props.list[idx].hosId);
    const days = Object.keys(activeSchInfo.value.enabledDays || {});
    changeDay(days[0] || '');
  };

  const dateChange = (item: IChooseDays) => {
    changeDay(item.fullDay);
  };

  const init = () => {
    _chooseDays.value = getChooseDays(30);

    tabChange(0);
  };

  init();

  // 此时 list 必定有长度
  watch(
    () => props.hosId,
    (v) => {
      if (v) {
        const idx = props.list.findIndex((o) => o.hosId === v);

        if (idx > -1) {
          tabCurrent.value = idx;
          return;
        }
      }

      changeHos(props.list[0].hosId);
    },
    {
      immediate: true,
    }
  );
</script>

<style lang="scss" scoped></style>
