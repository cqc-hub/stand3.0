<template>
  <view class="order">
    <Order-Sel-Date
      :value="checkedDay"
      :choose-days="chooseDays"
      :enable-days="chooseDaysEnabled"
      @change="dateChange"
    />

    <scroll-view class="container" scroll-y>
      <view class="container-contract">
        <Order-Doc-Item v-for="(item, i) in allDocList" :item="item" :key="i" />
      </view>
    </scroll-view>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { onReady } from '@dcloudio/uni-app';
  import { useOrder, IChooseDays } from './utils';

  import OrderSelDate from './components/orderSelDate/orderSelDate.vue';
  import OrderDocItem from './components/orderDocList/orderDocItem.vue';

  const props = defineProps<{
    hosId: string;
    hosDeptId?: string;
    firstHosDeptId?: string;
    secondHosDeptId?: string;
    deptName: string;
    isExpertDeptId?: string; // 是否是专家科室（0否 1是） 是：按一级科室ID查询排班 否：按二级科室ID查询排班
    clinicalType?: string; // 1、普通预约 2-膏方预约 3-名医在线夜门诊 4-云诊室 5-自助便民门诊（省人民凤凰HIS）6-专病门诊 7-成人 8-儿童 9-弹性门诊 10-军属门诊 11-军人门诊
  }>();

  const hosDeptId = ref(
    (props.hosDeptId && decodeURIComponent(props.hosDeptId)) || ''
  );
  const firstHosDeptId = ref(
    (props.firstHosDeptId && decodeURIComponent(props.firstHosDeptId)) || ''
  );
  const secondHosDeptId = ref(
    (props.secondHosDeptId && decodeURIComponent(props.secondHosDeptId)) || ''
  );
  const deptName = ref(decodeURIComponent(props.deptName));
  const {
    init,
    orderConfig,
    chooseDays,
    checkedDay,
    chooseDaysEnabled,
    allDocList
  } = useOrder();

  onReady(() => {
    uni.setNavigationBarTitle({
      title: `选择${decodeURIComponent(deptName.value)}医生`
    });
  });

  const dateChange = (item: IChooseDays) => {
    checkedDay.value = item.fullDay;
  };

  init({
    ...props,
    hosDeptId: hosDeptId.value,
    firstHosDeptId: firstHosDeptId.value,
    secondHosDeptId: secondHosDeptId.value
  });

  console.log(props);
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

      .container-contract {
        padding: 0 32rpx;
        padding-top: 24rpx;
      }
    }
  }
</style>
