<template>
  <view>
    <g-popup :title="'时间筛选'" ref="actionSheet" :zIndex="20">
      <view class="p32">
        <view class="mb36">
          <g-select-flatten
            :value="dateRange.join(',')"
            :list="timeBtnOpt"
            :column="4"
            @item-click="itemClick"
            border
          />
        </view>

        <view>
          <view class="f28 g-bold mb24">自定义时间</view>

          <view @click="datePickerRef.show" class="flex items-center">
            <view class="flex-1 time-item flex items-center justify-center">
              {{ dateRange[0] }}
            </view>
            <view class="pr12 pl12">-</view>
            <view class="flex-1 time-item flex items-center justify-center">{{ dateRange[1] }}</view>
          </view>
        </view>

        <view class="safe-height"></view>
        <view class="safe-height"></view>

        <!-- <view class="flex">
          <view class="btn btn-primary btn-plain btn-border flex-1 mr18">
            取消
          </view>
          <view class="btn btn-primary flex-1">确定</view>
        </view> -->
      </view>
    </g-popup>

    <uni-datetime-picker
      ref="datePickerRef"
      :value="dateRange"
      :end="dayjs().format('YYYY-MM-DD')"
      type="daterange"
      return-type="string"
      @change="datetimechange"
    >
      <view class="my-display-none" />
    </uni-datetime-picker>
  </view>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { ref } from 'vue';

  const actionSheet = ref('' as any);
  const datePickerRef = ref<any>('');

  defineProps<{
    timeBtnOpt: IHOption;
    dateRange: [string, string];
  }>();

  const emits = defineEmits(['time-change']);

  const datetimechange = (range) => {
    emits('time-change', range);
    hide();
  };

  const itemClick = (item) => {
    const { value } = item;

    datetimechange(value.split(','));
  };

  const show = () => {
    actionSheet.value.show();
  };

  const hide = () => {
    actionSheet.value.hide();
  };

  defineExpose({
    show,
    hide,
    itemClick,
  });
</script>

<style lang="scss" scoped>
  .time-item {
    background: #f6f6f6;
    border-radius: 8px;
    height: 36px;
  }
</style>
