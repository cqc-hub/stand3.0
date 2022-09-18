<template>
  <view class="order">
    <Order-Sel-Date
      :value="checkedDay"
      :choose-days="chooseDays"
      :enable-days="chooseDaysEnabled"
      @change="dateChange"
    />

    <scroll-view class="container" scroll-y>
      <!-- <view>233</view> -->
      {{ chooseDaysEnabled }}
    </scroll-view>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { onReady } from '@dcloudio/uni-app';
  import { useOrder, IChooseDays } from './utils';

  import OrderSelDate from './components/orderSelDate/orderSelDate.vue';

  const props = defineProps<{
    hosId: string;
    hosDeptId: string;
    deptName: string;
  }>();

  const hosDeptId = ref(decodeURIComponent(props.hosDeptId));
  const deptName = ref(decodeURIComponent(props.deptName));
  const { init, orderConfig, chooseDays, checkedDay, chooseDaysEnabled } = useOrder();

  onReady(() => {
    uni.setNavigationBarTitle({
      title: `选择${decodeURIComponent(deptName.value)}医生`
    });
  });

  const dateChange = (item: IChooseDays) => {
    checkedDay.value = item.fullDay;
  };

  init();
</script>

<style lang="scss" scoped>
  .order {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;

    .container {
      flex: 1;
      height: 1px;
    }
  }
</style>
