<template>
  <view class="">
    <view class="g-border-bottom flex flex-wrap">
      <view
        v-for="(s, si) in reportStatusMap"
        :key="s.value"
        :class="{
          '': si !== reportStatusMap.length,
          [(s.value === lab.status && 'color-blue') || 'color-888']: 1,
        }"
        class="flex f32 font-semibold"
      >
        <view
          :class="{
            'active-report': s.value === lab.status,
          }"
          class="relative pb12"
        >
          {{ s.label }}
        </view>
        <view v-if="si !== reportStatusMap.length - 1">
          <img
            :src="globalGl.BASE_IMG + 'guide-arrow-right.png'"
            alt=""
            class="icon-arrow-1"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import globalGl from '@/config/global';
  const props = withDefaults(
    defineProps<{
      lab: any;
      type?: string;
    }>(),
    {}
  );
      
  const reportStatusjYMap = ref([
    {
      label: '待预约',
      value: '1',
    },
    {
      label: '待检查',
      value: '2',
    },
    {
      label: '等待报告',
      value: '3',
    },
    {
      label: '已出报告',
      value: '4',
    },
  ]);

  const reportStatusJyMap = ref([ 
    {
      label: '待检验',
      value: '2',
    },
    {
      label: '等待报告',
      value: '3',
    },
    {
      label: '已出报告',
      value: '4',
    },
  ]);

  const reportStatusMap = ref();
  if(props.type === 'jy'){
    reportStatusMap.value = reportStatusJyMap.value
  }else{
    reportStatusMap.value = reportStatusjYMap.value
  }
     
</script>

<style lang="scss" scoped>
  .icon-arrow-1 {
    width: 40rpx;
    height: 40rpx;
    padding: 0 6rpx;
  }

  .active-report {
    &::after {
      content: '';
      display: block;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4rpx;
      background: #296fff;
    }
  }
</style>
