<template>
  <view class="g-page">
    <g-flag typeFg="5" isShowFg />
    <g-choose-pat />

    <scroll-view class="g-container" scroll-y>
      <view v-if="isComplete || isRefresh" class="content">
        <view v-if="list.length">
          <Number-List
            :list="list"
            :loading="isRefresh"
            @refresh-data="refreshData"
          />
        </view>

        <view v-else class="empty-list">
          <g-empty :current="1" noTransformY />
        </view>
      </view>
    </scroll-view>

    <xy-dialog
      title="授权提示"
      content="未获取到您的位置,请允许位置授权,以便判断您是否处于医院规定取号区域内"
      :show="isWxRequestQxDialogShow"
      :isShowCancel="false"
    >
      <template #confirmBtn>
        <view @click="requestWxQx">去授权</view>
      </template>
    </xy-dialog>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import { GStores } from '@/utils';
  import { type TTakeNumberListItem } from './utils/takeNumber';

  import api from '@/service/api';

  import NumberList from './components/NumberList.vue';

  const gStores = new GStores();
  const isComplete = ref(false);
  const isRefresh = ref(false);
  const list = ref([] as TTakeNumberListItem[]);
  const isWxRequestQxDialogShow = ref(false);
  const locationInfo = ref({
    latitude: '',
    longitude: '',
  });

  const refreshData = () => {
    isRefresh.value = true;

    init();
  };

  const getList = async () => {
    const { patientId } = gStores.userStore.patChoose;
    const { latitude, longitude } = locationInfo.value;

    isComplete.value = false;
    if (!isRefresh.value) {
      list.value = [];
    }

    const { result } = await api
      .getCheckInList({
        latitude,
        longitude,
        patientId,
      })
      .finally(() => {
        isComplete.value = true;
        isRefresh.value = false;
      });

    list.value = result || [];

    list.value.map((o) => {
      o.signIn = false;
    });
  };

  const getLocation = async (compel = false) => {
    let isAuth = false;
    await new Promise((resolve) =>
      uni.getLocation({
        complete: resolve,
        success(e) {
          locationInfo.value = e as any;
          isAuth = true;
        },
      })
    );

    if (!isAuth) {
      await new Promise((resolve, reject) => {
        uni.getSetting({
          async success({ authSetting }) {
            const qx = authSetting['scope.userLocation'];
            if (!qx) {
              setTimeout(() => {
                isWxRequestQxDialogShow.value = true;
              }, 500);
              reject('未授权 Location');
            } else {
              resolve(void 0);
            }
          },
        });
      });
    }
  };

  const requestWxQx = async () => {
    isWxRequestQxDialogShow.value = false;

    await new Promise((resolve) => {
      uni.openSetting({
        complete: resolve,
      });
    });

    init();
  };

  const init = async () => {
    await getLocation();

    getList();
  };

  onLoad(() => {
    init();
  });
</script>

<style lang="scss" scoped>
  .g-page {
    background: var(--hr-neutral-color-1);
  }

  .content {
    padding: 0 32rpx;
  }
</style>
