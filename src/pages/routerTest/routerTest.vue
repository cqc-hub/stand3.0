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
    <view class="g-footer">
      <button @click="testClick" class="btn1">233</button>
    </view>

    <canvas
      canvas-id="myCanvas"
      id="myCanvas"
      style="
        width: 300px;
        height: 200px;
        background: #f5f5f5;
        border: 1px solid #ccc;
      "
      :width="canvasWidth"
      :height="canvasHeight"
    />
    <view style="margin-top: 20px">Canvas 调试区域</view>
  </view>
</template>

<script lang="ts" setup>
  import { decryptDes } from '@/common';
  import api from '@/service/api';
  import { getShareTotalUrl, LoginUtils, wait } from '@/utils';
  import { onLoad, onShow } from '@dcloudio/uni-app';
  import sm from 'miniprogram-sm-crypto';
  import { getCurrentInstance, onMounted, ref } from 'vue';

  const props = withDefaults(
    defineProps<{
      color?: string;
    }>(),
    {
      color: 'var(--hr-brand-color-6)',
    }
  );
  const inst = getCurrentInstance();
  const { createCanvasContext, getSystemInfo, getImageInfo } = uni;
  const canvasWidth = ref(300);
  const canvasHeight = ref(200);
  const dpr = ref(1);

  onLoad(async () => {
    console.log('object');
  });

  const testClick = async (e) => {
    getShareTotalUrl(
      {
        e: '温附二(瓯江口院区)',
        l: '',
        h: '2025-08-26',
        d: '20250826017084',
        type: '2',
        k: '',
        c: '18858832891',
        f: '内科门诊',
        b: '30340263',
        a: '王小平',
        i: '20250826017084',
        category: '50',
        g: '侯翰凇',
        n: '13011',
      },
      '/pagesC/scan/scan'
    );
  };

  onMounted(async () => {
    const p =
      'H3tiGzGqpbh31rG5v/FV6smFfZbiVwlm2eAxqYEVQ5t+CnnGYyPy41bW+P20Ddt82/22gkcqfRYHm8rurptl/TrsO+GBNGjcpaW6lj4GcLzUAWynkCWxi+cgBYk8fAsTk1eGgUpwZbUyg4Txl3IrBtZjL+h1vTQ0gMmBOWAy5jIFCI5LKL0tC2AMZhg0iHojr34DFqYM1HXAPwaTt2NeOzidFwrEjQqMZMGaXnXkStzPFkRe/MDuBQ8sfxVjHTzj8umzsZ+uLCQeWSc5KLs1LoQqIUDGlHu3nWqrZw9JW6UoLz/D30Dt2oTIujk3bEWMC7Mz2uIgqMnmzqbm1enQHJL3Lj8HFqaH3XFY0Kk+xPLZXs7/CM2lZaZq8oyRBEDEzk4zHx9FoVESpU0sb5/Rb+kyUcEITXDCCxAIbeRBn+MHQIGmWK1aRRkhGtvl2eQism4/sYJmrTiTYJ/fGBhceOf0AvoBIbA4t32QG87KViQeGJlEJdhUbQ020v+R4pqIa74w85jk1IMpV+MvppVLTpP8xMNl1VPfVNRs0RK1lolzhvDVf38KeDt0kXYs5+0zJiGwobkeYi4o4xyO/wTybjC2mu7YIb0AmMkHytGcnCU7So97sdhbs+hhbhwvzN3bikOmGrRZGbtkn9x9z5F44WEXgEx5EQZCtFmJfvQdt19M2/O1kk3uoSPxQGNcZgJQ6t5u/OHxYywrb7z30w69W5fsVP2jZpZNEIurC5HRZOmUrA+3RtdO+ixCuLW6Dn/NYv+fc0ECkQJiD065Hqm1aQuT7vaW+mCoUAowmQojHwbhf9zJXvETWw==';
    const r = decryptDes(p);
    console.log(r);
  });
</script>

<style lang="scss" scoped>
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
