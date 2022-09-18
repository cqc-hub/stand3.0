<template>
  <view class="choose-day">
    <view class="choose-day-container">
      <view
        :class="{
          'item-active': value === ''
        }"
        @click="
          change({
            day: '',
            weekday: '全部日期',
            fullDay: ''
          })
        "
        class="choose-day-all item"
      >
        <view>全部</view>
        <view>日期</view>
      </view>

      <scroll-view class="choose-day-container-scroll" :scroll-into-view="scrollToId" @scroll="scrollEvt" scroll-x>
        <view class="scroll-content">
          <view
            v-for="item in chooseDays"
            :class="{
              'item-active': item.fullDay === value,
              'item-disabled': !enableDays.includes(item.fullDay)
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

      <view class="choose-day-all choose-day-calendar" @click="calendarRef.show">
        <view>展开</view>
        <view>日历</view>
        <view class="iconfont ico-arrow">&#xe6c4;</view>
      </view>
    </view>

    <Datetime-Picker
      ref="calendarRef"
      type="date"
      :modelValue="value"
      :enableDays="enableDays"
      :clear-icon="false"
      @change="dateTimeChange"
    >
      <view />
    </Datetime-Picker>
  </view>
</template>

<script lang="ts" setup>
  import { nextTick, ref, getCurrentInstance, watch } from 'vue';
  import { IChooseDays } from '../../utils';
  import isoWeek from 'dayjs/plugin/isoWeek';
  import dayjs from 'dayjs';

  import DatetimePicker from './datetime-picker.vue';

  dayjs.extend(isoWeek);

  const props = withDefaults(
    defineProps<{
      chooseDays: IChooseDays[];
      enableDays: string[];
      value: string;
    }>(),
    {
      chooseDays: () => [],
      enableDays: () => [],
      value: ''
    }
  );

  const emits = defineEmits(['change']);
  const calendarRef = ref<any>('');
  const scrollToId = ref('');
  const scrollLeft = ref(0);
  const inst = getCurrentInstance();

  const change = (item: IChooseDays) => {
    emits('change', item);
  };

  const scrollEvt = (e) => {
    scrollLeft.value = e.detail.scrollLeft;
  };

  const dateTimeChange = (fullDay) => {
    const dayMap = {
      1: '周一',
      2: '周二',
      3: '周三',
      4: '周四',
      5: '周五',
      6: '周六',
      7: '周日'
    };
    const _date = dayjs(fullDay);

    change({
      day: _date.format('MM-DD'),
      fullDay: fullDay,
      weekday: dayMap[_date.isoWeekday()]
    });

    watch(
      () => props.value,
      () => {
        nextTick(async () => {
          const query = uni.createSelectorQuery().in(inst);
          let scrollWidth = 0;
          await new Promise((resolve) => {
            query
              .select('.choose-day-container-scroll')
              .boundingClientRect((data) => {
                if (data && data.width) {
                  scrollWidth = data.width;
                }

                resolve(void 0);
              })
              .exec();
          });

          query
            .select(`#day-` + props.value)
            .boundingClientRect((data) => {
              if (data) {
                const itemLeft = (data as any).left;
                if (!(scrollLeft.value < itemLeft && scrollLeft.value + scrollWidth > itemLeft)) {
                  scrollToId.value = 'day-' + props.value;
                }
              }
            })
            .exec();
        });
      }
    );
  };
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
        color: var(--hr-neutral-color-7);
        pointer-events: none;
      }
    }
  }
</style>
