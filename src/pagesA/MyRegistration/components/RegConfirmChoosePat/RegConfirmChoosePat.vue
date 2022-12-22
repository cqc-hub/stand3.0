<template>
  <view class="choose g-border">
    <view class="choose-row">
      <view class="user-info text-ellipsis" @tap="closeEyes">
        <text class="title">
          {{ `${isClose?gStores.userStore.patChoose.patientNameEncry:gStores.userStore.patChoose.patientName}` }}
        </text>

        <text>
          {{ ` (${gStores.userStore.patChoose._showId})` }}
        </text>
        <text :class="`iconfont icon-resize`" > {{isClose?'&#xe6d4;':'&#xe6db;'}}</text>
      </view>

      <view class="choose-icon flex-normal" @click="chooseAction">
        <text>更换</text>
        <text class="iconfont">&#xe66b;</text>
      </view>
    </view>

    <view class="choose-phone">
      <text class="label">手机号</text>

      <text>
        {{ `${gStores.userStore.patChoose.patientPhone}` }}
      </text>
    </view>

    <view class="choose-phone">
      <text class="label">证件号码</text>

      <text>
        {{ `${gStores.userStore.patChoose.idCard}` }}
      </text>
    </view>
    <Choose-Pat @choose-pat="choosePatHandler" ref="actionSheet" />
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  import { GStores } from '@/utils';
  import { getAvatar, IPat } from '@/stores';

  import ChoosePat from '@/components/g-choose-pat/choose-pat-action.vue';

  const gStores = new GStores();
  const actionSheet = ref<InstanceType<typeof ChoosePat>>();
  const emits = defineEmits(['choose-pat']);
  const isClose = ref(true)

  const chooseAction = () => {
    const patList = gStores.userStore.patList;

    if (!patList.length) {
      gStores.messageStore.showMessage('暂无就诊人， 请先添加就诊人');
      return;
    }

    if (actionSheet.value) {
      actionSheet.value.show();
    }
  };

  const choosePatHandler = ({ item }: { item: IPat; number: number }) => {
    gStores.userStore.updatePatChoose(item);
    emits('choose-pat', { item });
  };

  const closeEyes = ()=>{
    isClose.value=!isClose.value
  }
</script>

<style lang="scss" scoped>
  .choose {
    background-color: #fff;
    border-radius: 16rpx;

    padding: 40rpx 32rpx;
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
        font-size: 48rpx; 
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
</style>
