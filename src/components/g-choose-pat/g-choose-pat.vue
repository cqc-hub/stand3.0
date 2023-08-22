<template>
  <view class="choose-pat" v-if="gStores.userStore.patChoose._showId">
    <view class="container" @click="chooseAction">
      <image
        v-show="isLoad"
        class="user-avatar"
        :src="getAvatar(getShowPat.patientSex)"
        mode="widthFix"
        @load="loadImg"
      />

      <view class="user-info text-ellipsis">
        {{ `${getShowPat.patientNameEncry}` }}
        <text>
          {{ `${(!isAreaProgram() && getShowPat._showId) || ''}` }}
        </text>
      </view>

      <text :class="`icon-font icon-resize ico_arrow f48`" />
    </view>

    <Choose-Pat
      @choose-pat="choosePatHandler"
      :isShowAll="isShowAll"
      :pat="pat"
      ref="actionSheet"
    />
  </view>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed } from 'vue';
  import { getAvatar, IPat, isAreaProgram } from '@/stores';
  import { GStores } from '@/utils';
  import { getQueryString } from '@/common/utils';

  import ChoosePat from './choose-pat-action.vue';

  const props = defineProps<{
    isShowAll?: boolean;
    pat?: IPat;
  }>();
  const gStores = new GStores();
  const actionSheet = ref<InstanceType<typeof ChoosePat>>();
  const emits = defineEmits(['choose-pat']);
  const isLoad = ref(false);

  const getShowPat = computed(() => {
    return props.pat || gStores.userStore.patChoose;
  });

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
    // 选所有就诊人时候不带 patientId
    if (item.patientId) {
      gStores.userStore.updatePatChoose(item);
    }
    emits('choose-pat', { item });
  };

  const loadImg = () => {
    isLoad.value = true;
  };

  onMounted(() => {
    //携带就诊人数据和默认就诊人不一致的情况
    const pages = getCurrentPages();
    if (pages.length) {
      const fullUrl: string = (pages[pages.length - 1] as any).$page.fullPath;
      let _pd = getQueryString(fullUrl, '_pd');
      let _hosPd = getQueryString(fullUrl, '_hosPd');
      if (
        _pd &&
        gStores.userStore.patList.length &&
        gStores.userStore.patChoose.patientId != _pd
      ) {
        console.warn('携带就诊人不一致的情况');
        const pat = <IPat>(
          gStores.userStore.patList.find((o) => o.patientId === _pd)
        );
        gStores.userStore.updatePatChoose(pat);
      }

      if (
        _hosPd &&
        gStores.userStore.patList.length &&
        gStores.userStore.patChoose.cardNumber != _hosPd
      ) {
        console.warn('携带院内就诊人不一致的情况');
        const pat = <IPat>(
          gStores.userStore.patList.find((o) => o.cardNumber === _hosPd)
        );
        gStores.userStore.updatePatChoose(pat);
      }
    }
  });
</script>

<style lang="scss" scoped>
  .choose-pat {
    &::after {
      content: '';
      display: block;
      width: 100%;
      height: 1rpx;
      background-color: #eee;
    }
  }
  .container {
    padding: 20rpx 40rpx;
    padding-right: 20rpx;
    background-color: var(--h-color-white);

    display: flex;
    align-items: center;

    .user-avatar {
      width: 48rpx;
      height: 48rpx;
      border-radius: 100px;
      margin-right: 20rpx;
    }

    .user-info {
      flex: 1;
      width: 1px;
      font-size: var(--hr-font-size-base);
      text {
        font-size: var(--hr-font-size-xxs);
        color: var(--hr-neutral-color-7);
      }
    }

    .icon-resize {
      width: 48rpx;
      height: 48rpx;
    }
  }
</style>
