<template>
  <view class="order">
    <Order-Sel-Date
      :value="checkedDay"
      :choose-days="chooseDays"
      :enable-days="chooseDaysEnabled"
      @change="dateChange"
    />
    <view @click="regDialogConfirm.show">cqccccc</view>
    <scroll-view class="container" scroll-y>
      <view
        v-if="!checkedDay"
        class="container-contract animate__animated animate__fadeIn"
      >
        <view v-for="(item, i) in allDocList" :key="i" class="item-content">
          <Order-Doc-Item-All :item="item" />
        </view>
      </view>

      <view v-if="checkedDay" class="container-contract">
        <view v-for="(item, i) in dateDocListFilterByDate" :key="i" class="">
          <view v-for="(_item, _i) in item.schDateList" :key="_i">
            <view class="item-scheme-date">{{ _item.categorName }}</view>
            <view
              v-for="(__item, __i) in _item.schemeList"
              class="item-content animate__animated animate__fadeIn"
              :key="__i"
            >
              <Order-Doc-Item-Date :item="__item" />
            </view>
          </view>
        </view>

        <view v-for="(item, i) in dateDocListFilterByDate" :key="i" class="">
          <view v-for="(_item, _i) in item.schDateList" :key="_i">
            <view class="item-scheme-date">{{ _item.categorName }}</view>
            <view
              v-for="(__item, __i) in _item.schemeList"
              class="item-content animate__animated animate__fadeIn"
              :key="__i"
            >
              <Order-Doc-Item-Date :item="__item" />
            </view>
          </view>
        </view>

        <view v-for="(item, i) in dateDocListFilterByDate" :key="i" class="">
          <view v-for="(_item, _i) in item.schDateList" :key="_i">
            <view class="item-scheme-date">{{ _item.categorName }}</view>
            <view
              v-for="(__item, __i) in _item.schemeList"
              class="item-content animate__animated animate__fadeIn"
              :key="__i"
            >
              <Order-Doc-Item-Date :item="__item" />
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <Order-Reg-Confirm ref="regDialogConfirm" />
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { onReady } from '@dcloudio/uni-app';
  import { useOrder, IChooseDays } from './utils';

  import OrderSelDate from './components/orderSelDate/orderSelDate.vue';
  import OrderDocItemAll from './components/orderDocList/orderDocItemAll.vue';
  import OrderDocItemDate from './components/orderDocList/orderDocItemDate.vue';
  import OrderRegConfirm from './components/orderRegConfirm/orderRegConfirm.vue';

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
    getListByDate,
    allDocList,
    dateDocList,
    dateDocListFilterByDate
  } = useOrder();

  onReady(() => {
    uni.setNavigationBarTitle({
      title: `选择${decodeURIComponent(deptName.value)}医生`
    });
  });

  const dateChange = (item: IChooseDays) => {
    checkedDay.value = item.fullDay;

    if (!dateDocList.value.length) {
      getListByDate({
        ...props,
        hosDeptId: hosDeptId.value,
        firstHosDeptId: firstHosDeptId.value,
        secondHosDeptId: secondHosDeptId.value
      });
    }
  };

  init({
    ...props,
    hosDeptId: hosDeptId.value,
    firstHosDeptId: firstHosDeptId.value,
    secondHosDeptId: secondHosDeptId.value
  });

  const regDialogConfirm = ref<any>('');
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

      .animate__animated {
        animation-duration: 0.3s;
      }
    }

    .container-contract {
      padding: 0 32rpx;
      padding-top: 24rpx;

      .item-content {
        padding-bottom: 16rpx;
      }
    }

    .item-scheme-date {
      color: var(--hr-neutral-color-7);
      font-size: var(--hr-font-size-xs);
      margin: 16rpx 0;
    }
  }
</style>