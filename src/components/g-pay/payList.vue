<template>
  <view class="pat-list">
    <!--  'pat-active': curr === i,-->
    <view
      v-for="(item, i) in list"
      :key="item.key"
      @click="patClick(item, i)"
      :class="{
        'pat-active': false,
      }"
      class="pat-item mb16"
    >
      <img v-if="getIconSrc(item)" :src="getIconSrc(item)" class="pay-icon" />
      <view
        v-else
        :class="{
          'ico_share-blue': item.key === 'isFaceRemote',
          ico_camera: item.key === 'isFace',
          ico_pay: item.key === 'online' || item.key === 'digital',
          ico_card: item.key === 'medicare' || item.key === 'familyPay',
          ico_hospital:
            item.key === 'offline' ||
            item.key === 'bizType' ||
            item.key === 'navToMini',
        }"
        class="icon-font pay-icon"
      />
      <view class="user-label text-ellipsis">
        <text class="user-name">{{ item.label }}</text>
      </view>

      <!-- <view
        v-if="gStores.userStore.patChoose.patientId === pat.patientId"
        class="iconfont ico-checkbox"
      >
        &#xe6d0;
      </view> -->
    </view>

    <!-- <view class="pat-item my-hide" /> -->
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { GStores } from '@/utils';
  import { IGPay } from './index';
  import globalGl from '@/config/global';

  const props = defineProps<{
    list: IGPay[];
  }>();
  const gStores = new GStores();
  const curr = ref(-1);

  const emits = defineEmits(['choose-pat']);
  const patClick = (pat: IGPay, index: number) => {
    emits('choose-pat', {
      item: pat,
      index,
    });

    curr.value = index;
  };

  const getIconSrc = (item: IGPay) => {
    const { key } = item;
    const { ev } = gStores.globalStore;
    let iconName = '';

    switch (key) {
      case 'online':
        if (ev === 'wx') {
          iconName = 'stand3-g-pay-wx.png';
        } else if (ev === 'alipay') {
          iconName = 'stand3-g-pay-alipay.png';
        }
        break;

      case 'medicare':
      case 'bizType':
      case 'navToMini':
        iconName = 'stand3-g-pay-yibao.png';
        break;

      case 'digital':
        iconName = 'stand3-g-pay-shuzi.png';
        break;

      default:
        break;
    }

    if (iconName) {
      return globalGl.BASE_IMG + iconName;
    }

    return '';
  };
</script>

<style lang="scss" scoped>
  .pat-list {
    width: calc(100% - 64rpx);
    display: flex;
    flex-direction: column;
    // gap: 16rpx;
    padding: 0 32rpx;

    .pat-item {
      flex: 1;
      border: 2rpx solid var(--hr-neutral-color-4);
      border-radius: 16rpx;
      padding: 32rpx;
      background-color: #fff;

      display: grid;
      grid-template-columns: 58rpx 1fr 40rpx;
      align-items: center;

      .pay-icon {
        width: 48rpx;
        height: 48rpx;
      }

      .user-avatar {
        border-radius: 300rpx;
        width: 64rpx;
      }

      .user-label {
        color: var(--hr-neutral-color-8);
        font-size: var(--hr-font-size-xs);
        flex: 1;
        width: 100%;

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
