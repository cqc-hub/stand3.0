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
          <view v-if="deptInfo.recommendation" class="mb40">
            <view class="flex-normal mb16">
              <view class="icon-font ico_doctor-hat mr12 title-icon" />
              <view class="g-bold f36">科室介绍</view>
            </view>

            <view class="color-444 f32 g-break-word">
              <rich-text :nodes="parseHtml(deptInfo.recommendation)" />
            </view>
          </view>

          <view v-if="deptInfo.featuredTreatment" class="mb40">
            <view class="flex-normal mb16">
              <view class="icon-font ico_doctor-diamond mr12 title-icon" />
              <view class="g-bold f36">专科特色</view>
            </view>

            <view class="color-444 f32 g-break-word">
              <rich-text :nodes="parseHtml(deptInfo.featuredTreatment)" />
            </view>
          </view>

          <view v-if="deptInfo.promptMessage" class="mb40">
            <view class="flex-normal mb16">
              <view class="icon-font ico_doctor-document mr12 title-icon" />
              <view class="g-bold f36">就诊须知</view>
            </view>

            <view class="color-444 f32 g-break-word">
              <rich-text :nodes="parseHtml(deptInfo.promptMessage)" />
            </view>
          </view>
        </view>
      </Order-Reg-Confirm>
    </block>
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import HTMLParser from '@/common/html-parser';

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
        props.deptInfo.recommendation)
    );
  });

  const parseHtml = (str: string) => {
    if (!str) {
      return '';
    }
    const _str = str.replace(/\\n/g, '<br></br>');

    return HTMLParser(_str);
  };
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

  .title-icon {
    width: 48rpx;
    height: 48rpx;
  }
</style>
