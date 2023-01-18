<template>
  <view class="g-page">
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
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import { GStores } from '@/utils';

  import api from '@/service/api';

  const gStores = new GStores();
  const isWxRequestQxDialogShow = ref(false);
  const locationInfo = ref({
    latitude: '',
    longitude: '',
  });

  const getList = async () => {
    const { patientId } = gStores.userStore.patChoose;
    const { latitude, longitude } = locationInfo.value;

    api.getCheckInList({
      latitude,
      longitude,
      patientId,
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
    background-color: #fff;
  }
</style>
