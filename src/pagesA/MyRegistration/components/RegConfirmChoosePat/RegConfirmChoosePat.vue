<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
      [pb0 ? 'pb0' : 'pb40']: 1,
    }"
    class="choose g-border pt40 pr32 pl32"
  >
    <slot name="header" :chooseAction="chooseAction" />
    <view v-if="showPat.patientName">
      <view class="choose-row">
        <view class="user-info text-ellipsis" @tap="closeEyes">
          <text class="title">
            {{ `${isClose ? showPat.patientNameEncry : showPat.patientName}` }}
          </text>

          <text v-if="showPat._showId">
            {{ ` (${showPat._showId})` }}
          </text>
          <text :class="`iconfont icon-resize`">
            {{ isClose ? '&#xe6d4;' : '&#xe6db;' }}
          </text>
        </view>

        <view>
          <view
            v-if="!isOrderWithoutPat"
            class="choose-icon flex-normal"
            @click="chooseAction"
          >
            <text>更换</text>
            <text class="iconfont">&#xe66b;</text>
          </view>
        </view>
      </view>

      <view class="choose-phone">
        <text class="label">手机号</text>

        <text>
          {{ `${showPat.patientPhone}` }}
        </text>
      </view>

      <view class="choose-phone">
        <text class="label">证件号码</text>

        <text>
          {{ `${showPat.idCard}` }}
        </text>
      </view>
    </view>

    <slot name="footer" :chooseAction="chooseAction" :showPat="showPat" />
    <Choose-Pat @choose-pat="choosePatHandler" ref="actionSheet" />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';

  import { GStores } from '@/utils';
  import { getAvatar, IPat } from '@/stores';

  import ChoosePat from '@/components/g-choose-pat/choose-pat-action.vue';

  const gStores = new GStores();
  const actionSheet = ref<InstanceType<typeof ChoosePat>>();
  const emits = defineEmits(['choose-pat', 'go-choose-pat']);
  const isClose = ref(true);
  const props = defineProps<{
    pat?: any;
    isOrderWithoutPat?: boolean;
    isUnSelPat?: boolean;
    pb0?: boolean;
  }>();

  const showPat = computed(() => {
    if (props.pat?.patientName) {
      return props.pat;
    }

    return gStores.userStore.patChoose;
  });

  const chooseAction = () => {
    const patList = gStores.userStore.patList;
    emits('go-choose-pat');

    if (props.isUnSelPat) {
      return;
    }

    // if (!patList.length) {
    //   gStores.messageStore.showMessage('暂无就诊人， 请先添加就诊人');
    //   return;
    // }

    if (actionSheet.value) {
      actionSheet.value.show();
    }
  };

  const choosePatHandler = ({ item }: { item: IPat; number: number }) => {
    gStores.userStore.updatePatChoose(item);
    emits('choose-pat', { item });
  };

  const closeEyes = () => {
    isClose.value = !isClose.value;
  };
</script>

<style lang="scss" scoped>
  .choose {
    background-color: #fff;
    border-radius: 16rpx;

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
