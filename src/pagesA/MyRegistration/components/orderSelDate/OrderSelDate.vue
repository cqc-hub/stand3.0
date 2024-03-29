<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="choose-day"
  >
    <view v-if="chooseDays.length" class="choose-day-container">
      <view
        v-if="isShowAllDate"
        :class="{
          'item-active': value === '',
        }"
        @click="
          change({
            day: '',
            weekday: '全部日期',
            fullDay: '',
          })
        "
        class="choose-day-all item"
      >
        <view>全部</view>
        <view>日期</view>
      </view>

      <scroll-view
        class="choose-day-container-scroll"
        :scroll-into-view="scrollToId"
        scroll-x
      >
        <view class="scroll-content">
          <view
            v-for="item in chooseDays"
            :class="{
              'item-active': item.fullDay === value,
              'item-disabled': enableDays[item.fullDay] !== '0',
            }"
            :key="item.day"
            :id="'day-' + item.fullDay"
            @click="change(item)"
            class="choose-day-item g-flex-rc-cc item"
          >
            <view class="choose-day-item-day">{{ item.day }}</view>
            <view class="choose-day-item-weekday">{{ item.weekday }}</view>
          </view>
        </view>
      </scroll-view>

      <view
        v-if="isOpenCalendar"
        @click="showCalendar"
        class="choose-day-all choose-day-calendar"
      >
        <view>展开</view>
        <view>日历</view>
        <view class="iconfont ico-arrow">&#xe6c4;</view>
      </view>
    </view>

    <Datetime-Picker
      v-if="isOpenCalendar"
      ref="calendarRef"
      type="date"
      :modelValue="value"
      :value="value"
      :enableDays="enableDays"
      :dateShow="dateShow"
      :clear-icon="false"
      :systemModeOld="gStores.globalStore.modeOld"
      @change="dateTimeChange"
    >
      <view />
    </Datetime-Picker>
  </view>
</template>

<script lang="ts" setup>
  import { nextTick, ref, getCurrentInstance, watch, computed } from 'vue';
  import { IChooseDays } from '../../utils';
  import { GStores } from '@/utils';
  import isoWeek from 'dayjs/plugin/isoWeek';
  import dayjs from 'dayjs';

  import DatetimePicker from './order-datetime-picker.vue';

  dayjs.extend(isoWeek);

  const props = withDefaults(
    defineProps<{
      chooseDays: IChooseDays[];
      enableDays: Record<string, string>;
      value: string;
      isShowAllDate?: boolean;
    }>(),
    {
      chooseDays: () => [],
      enableDays: () => ({}),
      value: '',
      isShowAllDate: false,
    }
  );
  const gStores = new GStores();

  const emits = defineEmits(['change']);
  const calendarRef = ref<any>('');
  const scrollToId = ref('');
  const inst = getCurrentInstance();
  const dateShow = ref<string[]>([]);

  const isOpenCalendar = computed(() => {
    return props.chooseDays.length > 6;
  });

  const showCalendar = () => {
    calendarRef.value.show();
  };

  const change = (item: IChooseDays) => {
    emits('change', item);
  };

  const dateTimeChange = (fullDay) => {
    const dayMap = {
      1: '周一',
      2: '周二',
      3: '周三',
      4: '周四',
      5: '周五',
      6: '周六',
      7: '周日',
    };
    const _date = dayjs(fullDay);

    change({
      day: _date.format('MM-DD'),
      fullDay: fullDay,
      weekday: dayMap[_date.isoWeekday()],
    });
  };

  let scrollWidth = 0;

  watch(
    () => props.value,
    () => {
      nextTick(async () => {
        const query = uni.createSelectorQuery().in(inst);

        if (!scrollWidth) {
          await new Promise((resolve) => {
            query
              .select('.choose-day-container-scroll')
              .boundingClientRect((data: any) => {
                if (data && data.width) {
                  scrollWidth = data.width;
                }

                resolve(void 0);
              })
              .exec();
          });
        }

        query
          .select(`#day-` + props.value)
          .boundingClientRect((data) => {
            if (data) {
              const { left: itemLeft, width: itemWidth } = data as any;
              const sLeft = itemLeft - itemWidth;

              const reLocation = () => {
                scrollToId.value = 'day-' + props.value;
              };

              if (Math.abs(sLeft) + itemWidth > scrollWidth) {
                reLocation();
              } else if (itemLeft < 0 && Math.abs(itemLeft) < itemWidth) {
                reLocation();
              }
            }
          })
          .exec();
      });
    }
  );

  watch(
    () => props.chooseDays,
    (v) => {
      if (v.length > 1) {
        const _first = v[0].fullDay;
        const _last = v[v.length - 1].fullDay;
        let dateNow = dayjs(_first);
        const dates: string[] = [dateNow.format('YYYY-MM-DD')];
        const lastDate = dayjs(_last);

        while (dayjs(dateNow).isBefore(lastDate)) {
          dateNow = dateNow.add(1, 'day');
          dates.push(dateNow.format('YYYY-MM-DD'));
        }

        dateShow.value = dates;
      }
    },
    {
      immediate: true,
    }
  );
</script>

<style lang="scss" scoped>
  .choose-day {
    background-color: #fff;

    .choose-day-container {
      display: flex;
      padding: 8rpx 0;

      .choose-day-all {
        font-size: var(--hr-font-size-xs);
        border-radius: 16rpx;
        font-weight: 600;
        margin-left: 8rpx;
        padding: 22rpx 24rpx;
      }

      .choose-day-calendar {
        font-weight: 400;
        color: var(--hr-neutral-color-8);
        position: relative;
        font-size: var(--hr-font-size-xxxs);
        position: relative;
        border-radius: 0 16rpx 16rpx 0;
        box-shadow: -14rpx 0px 14rpx -14rpx #5e5e5e57;

        .ico-arrow {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
      }

      .choose-day-container-scroll {
        flex: 1;
        width: 1px;
        position: reactive;
        display: flex;
        align-items: center;

        .scroll-content {
          display: flex;
        }
      }
    }

    .choose-day-item {
      flex-direction: column;
      padding: 15rpx 10rpx;
      position: relative;
      border-radius: 16rpx;

      view {
        white-space: nowrap;
      }

      &-day {
        font-weight: 600;
        margin-bottom: 10rpx;
      }

      &-weekday {
        font-size: var(--hr-font-size-xxxs);
      }
    }

    .item {
      transition: all 0.17s linear;
      &.item-active {
        background-color: var(--hr-brand-color-1);
      }

      &.item-disabled {
        color: var(--hr-neutral-color-5);
        // pointer-events: none;
      }
    }
  }

  .system-mode-old {
    .choose-day-item {
      padding: 15rpx 20rpx;
    }
  }
</style>
