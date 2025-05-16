<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="pat-list"
  >
    <view
      v-for="(pat, i) in gStores.userStore.patList"
      :key="pat.patientId"
      @click="patClick(pat, i)"
      :class="{
        'pat-active':
          gStores.userStore.patChoose.patientId === pat.patientId && _firstIn,
      }"
      class="pat-item"
    >
      <image
        class="user-avatar"
        :src="getAvatar(pat.patientSex)"
        mode="widthFix"
      />
      <view>
        <view class="user-label text-ellipsis">
          <text class="user-name">{{ pat.patientName }}</text>
          <text v-if="!isAreaProgram()">
            {{ (pat._showId && `(${pat._showId})`) || '' }}
          </text>
        </view>

        <view class="color-666 f28">
          <text class="mr12 text-no-wrap">身份证号:</text>
          <text>{{ pat.idCard }}</text>
        </view>
      </view>

      <view
        v-if="
          gStores.userStore.patChoose.patientId === pat.patientId && _firstIn
        "
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

  const props = defineProps<{
    _firstIn?: boolean;
  }>();
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
      grid-template-columns: 120rpx 1fr 40rpx;
      align-items: center;

      .user-avatar {
        border-radius: 300rpx;
        width: 96rpx;
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

  .system-mode-old {

  }
</style>
