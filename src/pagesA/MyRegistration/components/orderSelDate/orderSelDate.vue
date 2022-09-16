<template>
  <view class="choose-day">
    <!-- {{ chooseDays }} -->
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

      <scroll-view class="choose-day-container-scroll" scroll-x>
        <view class="scroll-content">
          <view
            v-for="item in chooseDays"
            :class="{
              'item-active': item.day === value,
              'item-disabled': !enableDays.includes(item.day)
            }"
            :key="item.day"
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

    <Datetime-Picker ref="calendarRef" type="date" :enableDays="enableDays" :clear-icon="false">
      <view />
    </Datetime-Picker>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref, reactive } from 'vue';
  import { IChooseDays } from '../../utils';

  import DatetimePicker from './datetime-picker.vue';

  const props = withDefaults(
    defineProps<{
      chooseDays: IChooseDays[];
      enableDays: string[];
      value: string;
    }>(),
    {
      chooseDays: () => [],
      enableDays: () => []
    }
  );

  const emits = defineEmits(['change']);
  const calendarRef = ref<any>('');
  const change = (item: IChooseDays) => {
    emits('change', item);
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
