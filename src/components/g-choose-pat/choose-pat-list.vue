<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="pat-list"
  >
    <view
      v-for="(pat, i) in patList"
      :key="pat.patientId"
      @click="patClick(pat, i)"
      :class="{
        'pat-active': getShowPat.patientId === pat.patientId,
      }"
      class="pat-item"
    >
      <image
        class="user-avatar"
        :src="getAvatar(pat.patientSex)"
        mode="widthFix"
      />
      <view class="user-label f36 text-ellipsis">
        <text class="user-name">{{ pat.patientNameEncry }}</text>

        <text v-if="!isAreaProgram()">
          {{ (pat._showId && `(${pat._showId})`) || '' }}
        </text>
      </view>

      <view
        v-if="getShowPat.patientId === pat.patientId"
        class="iconfont ico-checkbox"
      >
        &#xe6d0;
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { GStores } from '@/utils';
  import { IPat, getAvatar, isAreaProgram } from '@/stores';

  const props = defineProps<{
    isShowAll?: boolean;
    showPat?: IPat;
  }>();

  const gStores = new GStores();

  const emits = defineEmits(['choose-pat']);
  const patClick = (pat: IPat, index: number) => {
    emits('choose-pat', {
      item: pat,
      index,
    });
  };

  const patList = computed(() => {
    if (props.isShowAll) {
      return [
        <IPat>{
          patientName: '所有就诊人',
          patientNameEncry: '所有就诊人',
          patientId: '',
        },
        ...gStores.userStore.patList,
      ];
    } else {
      return gStores.userStore.patList;
    }
  });

  const getShowPat = computed(() => {
    return props.showPat || gStores.userStore.patChoose;
  });
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
