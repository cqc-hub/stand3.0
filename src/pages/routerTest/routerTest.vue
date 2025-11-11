<template>
  <view class="g-page">
    <!-- <web-view src="https://h5.eheren.com/v3/#/pagesC/queueNumber/queueNumber?_d=f9%2F7ZB3FyR2yucaAhk%2F6mKYykAGXBuzmjCHzvSRtzXypGmFQH6HkFaHVNfPNYtqMIe1BAUnBbvVSHOIC5RlXDxnZm267jW5eaNRgHHhW44E%3D&sysCode=1001035&modeOld=false&isTcmStyle=1&token=a6e8289c389d8ece73750fe57fc1201152898898f684f119d7a0ca6668102698ca3dd7cdc5a19fbdf58f6595ad3b9117346368fdc9d5fbd11abe6ccef7ce7e45e1c0eea280a81b81a2dcb67d30b4526f01e9c9fecaf225ab506683889b9cd0b773410849e14649ca3f4945298a0a426cf511979de9adb4b2f7fb60fd186a56b9b47d2c0b2f90f072d0f6cbfac60dc9becf8ce05fd86e3aed6d9f2cbd8900fcdebf6c16000cbab01dd04511141285f12138d29ec90a890ec0b3f75aed2477ff6a7454bea23b6b3e677aa4595d33a2588209f0241d3425518c090caf87d5a4a36b52b7847c79f202d6cfb35460b82bb87b91aa9c6dff459592040268cf3c8b358672b0a21557a61c7fb4bb35a7671c3e77"></web-view> -->

    <view
      :style="{
        '--circle-color': color,
      }"
      class="container-circle"
    >
      <view class="half-circle"></view>
      <view
        :style="{
          color: color,
        }"
        class="g-bold"
      >
        待完成
      </view>
    </view>
    <g-message />
    <g-pay ref="refPay"></g-pay>

    <view class="g-footer">
      <!-- <view @click="testClick" class="btn1"> -->
      <button @click="test233">testbtn233</button>
      <!-- </view> -->

      <tttt :list="l">
        <template #default="{ item }">
          <view>{{ item.id }}2455</view>
        </template>
      </tttt>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { GStores, wait } from '@/utils';
  import { onLoad } from '@dcloudio/uni-app';
  import { ref } from 'vue';
  import tttt from './comp/tttt.vue';
  const props = withDefaults(
    defineProps<{
      color?: string;
    }>(),
    {
      color: 'var(--hr-brand-color-6)',
    }
  );
  const refPay = ref<any>('');
  const gStores = new GStores();
  uni.$emit('hahah');

  const l = ref([
    {
      name: 'cqc',
      id: 12,
    },
    {
      name: 'sdf',
      id: 45,
    },
  ]);

  onLoad(async () => {
    await wait(1500);
    console.log('23332');
    uni.setNavigationBarTitle({
      title: '初学者1',
    });
    // gStores.messageStore.showMessage('test', 0);
    // refPay.value.show();
  });

  const testClick = async (e) => {
    console.log('testClick');
  };

  const test233 = async (e) => {
    const { title, content } = await gStores.getSysAppMore('4');

    const { confirm, maskClose } = await new Promise<any>((closeCallBack) => {
      gStores.messageStore.showMessage(content, 0, {
        useDialog: true,
        dialogOpt: {
          isShowCancel: true,
          title: title,
          cancelColor: '#333',
          cancelText: '自费扫码',
          confirmColor: '#333',
          confirmText: '医保扫码',
        },
        closeCallBack,
      });
    });

    uni.navigateTo({
      url: '/cacheUtil/index1',
    });
  };
</script>

<style lang="scss" scoped>
  .g-page {
    background-color: red;
  }
  .container-circle {
    $circleOutSize: 120rpx;
    $circleInSize: $circleOutSize * 0.7;
    border-radius: 50%;
    width: $circleOutSize;
    height: $circleOutSize;
    align-items: center;
    justify-content: center;
    position: relative;
    display: flex;
    transform: rotate(-20deg);

    border: var(--circle-color) solid 6rpx;
    opacity: 0.5;
    .half-circle {
      border: var(--circle-color) solid 6rpx;
      position: absolute;
      width: $circleInSize;
      border-radius: 50%;
      height: $circleInSize;
      top: 50%;
      border-left-color: transparent;
      border-right-color: transparent;

      transform: translateY(-50%);
    }
  }

  .btn1 {
    all: unset;
  }
</style>
