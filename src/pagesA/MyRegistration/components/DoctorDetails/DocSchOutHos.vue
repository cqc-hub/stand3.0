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
    {{ schList }}
  </view>
</template>

<script lang="ts" setup>
  import { ref, watch, computed } from 'vue';
  import { IDocSchOutHosItem } from '../../utils/DoctorDetails';
  import { getChooseDays, IChooseDays } from '../../utils';

  import OrderSelDate from '../orderSelDate/OrderSelDate.vue';

  const props = defineProps<{
    list: IDocSchOutHosItem[];
    hosId: string;
    day: string;
  }>();
  const emits = defineEmits(['update:hosId', 'update:day']);
  const tabCurrent = ref(0);
  const chooseDays = ref<IChooseDays[]>([]);

  const activeSchInfo = computed(() => {
    return props.list[tabCurrent.value];
  });

  const schList = computed(() => {
    return activeSchInfo.value.schList || [];
  });

  const changeHos = (hosId: string) => {
    emits('update:hosId', hosId);
  };

  const changeDay = (day: string) => {
    emits('update:day', day);
  };

  const tabChange = (idx: number) => {
    changeHos(props.list[idx].hosId);
  };

  const dateChange = (item: IChooseDays) => {
    changeDay(item.fullDay);
  };

  const init = () => {
    chooseDays.value = getChooseDays(30);
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
