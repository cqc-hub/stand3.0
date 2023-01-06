<template>
  <view class="">
    <block v-if="deptInfo.deptName && isShow">
      <view @click="regDialogConfirm.show" class="flex-between content">
        <view class="flex-normal">
          <text class="iconfont order-icon color-blue f40">&#xe6dc;</text>
          <text class="f32 g-bold">{{ deptInfo.deptName }}</text>
        </view>

        <view class="flex-normal">
          <text class="color-888 f28">科室简介</text>
          <text class="iconfont arrow-icon color-888 f40">&#xe66b;</text>
        </view>
      </view>

      <Order-Reg-Confirm
        title="科室简介"
        height="90vh"
        confirmText="确定"
        cannerText="取消"
        ref="regDialogConfirm"
        :headerIcon="$global.BASE_IMG + 'v3-order-reg-confirm-add.png'"
        isHideFooter
      >
        <view>
          <view></view>
        </view>
      </Order-Reg-Confirm>
    </block>
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';

  import OrderRegConfirm from '@/components/orderRegConfirm/orderRegConfirm.vue';

  const props = defineProps<{
    deptInfo: {
      // 科室推介信息
      recommendation?: string;
      // 就诊提示
      promptMessage?: string;
      // 专科特色
      featuredTreatment?: string;
      deptName: string;
    };
  }>();

  const regDialogConfirm = ref('' as any);
  const isShow = computed(() => {
    return (
      props.deptInfo.deptName &&
      (props.deptInfo.featuredTreatment ||
        props.deptInfo.promptMessage ||
        props.deptInfo.featuredTreatment)
    );
  });
</script>

<style lang="scss" scoped>
  .content {
    padding: 22rpx 32rpx;
    background-color: #fff;
    box-shadow: 0 -1rpx 0 0 var(--hr-neutral-color-2) inset;

    .order-icon {
      margin-right: 8rpx;
    }

    .arrow-icon {
      line-height: 28rpx;
    }
  }
</style>
