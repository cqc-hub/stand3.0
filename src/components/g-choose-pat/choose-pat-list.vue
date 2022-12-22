<template>
  <view class="pat-list">
    <view
      v-for="(pat, i) in gStores.userStore.patList"
      :key="pat.patientId"
      @click="patClick(pat, i)"
      :class="{
        'pat-active': gStores.userStore.patChoose.patientId === pat.patientId,
      }"
      class="pat-item"
    >
      <image
        class="user-avatar"
        :src="getAvatar(pat.patientSex)"
        mode="widthFix"
      />
      <view class="user-label text-ellipsis">
        <text class="user-name">{{ pat.patientNameEncry }}</text>

        <text v-if="!isAreaProgram()">
          {{ (pat._showId && `(${pat._showId})`) || '' }}
        </text>
      </view>

      <view
        v-if="gStores.userStore.patChoose.patientId === pat.patientId"
        class="iconfont ico-checkbox"
      >
        &#xe6d0;
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { GStores } from '@/utils';
  import { IPat, getAvatar, isAreaProgram } from '@/stores';

  const gStores = new GStores();

  const emits = defineEmits(['choose-pat']);
  const patClick = (pat: IPat, index: number) => {
    emits('choose-pat', {
      item: pat,
      index,
    });
  };
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
      grid-template-columns: 88rpx 1fr 40rpx;
      align-items: center;

      .user-avatar {
        border-radius: 300rpx;
        width: 64rpx;
      }

      .user-label {
        color: var(--hr-neutral-color-8);
        font-size: var(--hr-font-size-xs);

        .user-name {
          color: var(--hr-neutral-color-10);
          font-size: var(--hr-font-size-xl);
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
</style>
