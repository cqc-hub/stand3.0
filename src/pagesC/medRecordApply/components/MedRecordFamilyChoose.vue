<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="choose"
  >
    <view class="choose-row">
      <view class="g-bold f36">办理人</view>

      <view
        v-if="patList().length > 1"
        class="choose-icon flex-normal"
        @click="chooseAction"
      >
        <text>更换</text>
        <text class="iconfont">&#xe66b;</text>
      </view>
    </view>

    <view v-if="selFamilyPat.patientName" class="choose-phone">
      <text class="label">姓名</text>

      <text>
        {{ `${selFamilyPat.patientName}` }}
      </text>
    </view>

    <view v-if="selFamilyPat.idCard" class="choose-phone">
      <text class="label">证件号码</text>

      <text>
        {{ `${selFamilyPat.idCard}` }}
      </text>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { inject, ref } from 'vue';

  import { GStores } from '@/utils';
  import { TFamilyItem, TFamilyList } from '../utils/recordApply';

  const gStores = new GStores();
  const emits = defineEmits(['choose-pat', 'show-family-action']);
  const isClose = ref(true);
  const props = defineProps<{
    selFamilyPat: TFamilyItem;
    familyList: TFamilyList;
  }>();

  const chooseAction = () => {
    emits('show-family-action');
  };

  const patList = inject('familyList', () => <TFamilyList>[]);
</script>

<style lang="scss" scoped>
  .choose {
    // background-color: #fff;
    // border-radius: 16rpx;

    // padding: 40rpx 32rpx;
    font-size: var(--hr-font-size-xs);

    .choose-row {
      display: flex;
      justify-content: space-between;

      .user-info {
        flex: 1;
        display: flex;
        align-items: center;
      }
      .icon-resize {
        font-size: var(--hr-font-size-xxl);
        margin-left: 24rpx;
        color: var(--hr-neutral-color-7);
      }

      .choose-icon {
        color: var(--hr-brand-color-6);

        .iconfont {
          font-size: calc(var(--hr-font-size-xs) + 8rpx);
        }
      }
    }

    .choose-phone {
      margin-top: 18rpx;
      .label {
        color: var(--hr-neutral-color-7);
        width: 140rpx;
        display: inline-block;
      }
    }

    .title {
      font-size: var(--hr-font-size-xl);
      font-weight: 600;
    }
  }

  .system-mode-old {
    .choose-phone {
      .label {
        width: 155rpx;
      }
    }
  }
</style>
