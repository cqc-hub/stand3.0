<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="pat-list"
  >
    <view
      v-for="(pat, i) in getPatList"
      :key="pat.idCard"
      @click="patClick(pat, i)"
      :class="{
        'pat-active': getShowPat.idCard === pat.idCard,
      }"
      class="pat-item"
    >
      <!-- <image class="user-avatar" :src="getAvatar('')" mode="widthFix" /> -->
      <view class="user-label f36 text-ellipsis">
        <text class="user-name mr8">{{ pat.patientName }}</text>
        <text class="f28">({{ pat.idCard }})</text>
      </view>

      <view
        v-if="getShowPat.idCard === pat.idCard"
        class="iconfont ico-checkbox"
      >
        &#xe6d0;
      </view>
    </view>

    <view class="safe-height"></view>
    <view class="safe-height"></view>
  </view>
</template>

<script lang="ts" setup>
  import { computed, inject } from 'vue';
  import { GStores } from '@/utils';
  import { TFamilyItem, TFamilyList } from '../utils/recordApply';

  const gStores = new GStores();

  const activePat = inject('selFamilyPat', () => <TFamilyItem>{});
  const patList = inject('familyList', () => <TFamilyList>[]);

  const emits = defineEmits(['choose-pat']);
  const patClick = (pat: TFamilyItem, index: number) => {
    emits('choose-pat', {
      item: pat,
      index,
    });
  };

  const getShowPat = computed(() => activePat() || <TFamilyItem>{});
  const getPatList = computed(() => patList() || <TFamilyList>[]);
</script>

<style lang="scss" scoped>
  .pat-list {
    width: calc(100% - 64rpx);
    display: flex;
    flex-direction: column;
    gap: 16rpx;
    padding: 0 32rpx;

    .pat-item {
      flex: 1;
      border: 2rpx solid var(--hr-neutral-color-4);
      border-radius: 16rpx;
      padding: 32rpx;
      background-color: #fff;

      display: grid;
      grid-template-columns: 1fr 40rpx;
      align-items: center;

      .user-avatar {
        border-radius: 300rpx;
        width: 64rpx;
      }

      .user-label {
        color: var(--hr-neutral-color-8);

        .user-name {
          color: var(--hr-neutral-color-10);
          font-weight: 600;
        }
      }

      .ico-checkbox {
        color: var(--hr-brand-color-6);
        font-size: 46rpx;
      }

      &.pat-active {
        border-color: var(--hr-brand-color-6);
        border-width: 4rpx;
      }
    }
  }

  .system-mode-old {
    .pat-item {
      .ico-checkbox {
        font-size: 56rpx;
      }
    }
  }
</style>
