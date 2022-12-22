<template>
  <view class="g-page">
    <g-tbanner :config="orderConfig.bannerOrder" />
    <g-selhos
      v-model:hosId="hosId"
      @get-list="getHosList"
      @change="getDepList"
      type="selDepartment"
    />
    <view class="search-input" @click.prevent="goSearch">
      <view class="my-disabled">
        <uni-search-input placeholder="请输入医生/科室/症状" />
      </view>
    </view>

    <view class="g-container hidden-scrollbar" scroll-y>
      <Department-List
        v-if="depList.length"
        :list="depList"
        :level="depLevel"
        :active-lv1="deptStore.activeLv1"
        :active-lv2="deptStore.activeLv2"
        :active-lv3="deptStore.activeLv3"
        @item-click-lv1="itemClickLv1"
        @item-click-lv2="itemClickLv2"
        @item-click-lv3="itemClickLv3"
      />
      <view v-if="!depList.length && isComplete" class="empty-list">
        <g-empty :current="1" />
      </view>
    </view>

    <!-- <g-flag typeFg="8" isShowFg /> -->
    <xy-dialog
      :title="showRegTipTitle"
      :show="isShowRegTip"
      :isShowCancel="false"
      @confirmButton="isShowRegTip = false"
    >
      <scroll-view scroll-y class="reg-tip">
        <g-flag
          v-model:title="showRegTipTitle"
          isHideTitle
          isShowFgTip
          typeFg="8"
          aaa
        />
      </scroll-view>
    </xy-dialog>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import {
    GStores,
    ServerStaticData,
    IHosInfo,
    type ISystemConfig,
  } from '@/utils';
  import { joinQuery } from '@/common';
  import {
    IDeptLv1,
    IDeptLv2,
    IDeptLv3,
    isLev1,
    isLev2,
    loopDeptList,
    useDeptStore,
  } from '@/stores';

  import api from '@/service/api';
  import { onLoad } from '@dcloudio/uni-app';

  import DepartmentList from './components/departmentList/departmentList.vue';

  const props = defineProps<{
    hosId: string;
    clinicalType: string; // 1、普通预约 2-膏方预约 3-名医在线夜门诊 4-云诊室 5-自助便民门诊（省人民凤凰HIS）6-专病门诊 7-成人 8-儿童 9-弹性门诊 10-军属门诊 11-军人门诊
  }>();
  const isShowRegTip = ref(false);
  const showRegTipTitle = ref('');
  const orderConfig = ref({} as ISystemConfig['order']);

  const depList = ref<IDeptLv1[]>([]);
  const depLevel = ref('1');
  const gStores = new GStores();
  const deptStore = useDeptStore();
  const hosList = ref<IHosInfo[]>([]);
  const hosId = ref(props.hosId);
  const isComplete = ref(false);

  const init = async () => {
    orderConfig.value = await ServerStaticData.getSystemConfig('order');

    if (hosId.value) {
      getDepList();
    }
  };

  const getHosList = async ({ list }) => {
    hosList.value = list;

    if (!hosId.value) {
      hosId.value = list[0]!.hosId;
    }
  };

  const getDepList = async () => {
    const source = gStores.globalStore.browser.source;

    const requestArg = {
      source,
      hosId: hosId.value,
      clinicalType: props.clinicalType,
      // resType   // 预约类型：1.预约挂号，2.当日挂号
    };

    isComplete.value = false;
    const { result } = await api.getDeptList(requestArg).finally(() => {
      isComplete.value = true;
    });

    if (result) {
      let { firstDeptList, deptListLevel } = result;
      // deptListLevel = '2'
      if (firstDeptList && firstDeptList.length) {
        loopDeptList(firstDeptList, deptListLevel);
        depList.value = firstDeptList;
        depLevel.value = deptListLevel;
      } else {
        depList.value = [];
      }
      console.log({
        result,
        depList: depList.value,
        props,
      });
    }
  };

  const itemClickLv1 = (item: IDeptLv1) => {
    deptStore.changeActiveLv1(item);
    if (!item.children) {
      registerContinue(item);
    }
  };

  const itemClickLv2 = (item: IDeptLv2) => {
    deptStore.changeActiveLv2(item);

    if (!item.children) {
      registerContinue(item);
    }
  };

  const itemClickLv3 = (item: IDeptLv3) => {
    deptStore.changeActiveLv3(item);
    registerContinue(item);
  };

  const registerContinue = (item: IDeptLv3 | IDeptLv2 | IDeptLv1) => {
    // item.
    const queryArg = {
      hosId: hosId.value,
      clinicalType: props.clinicalType,
      deptName: encodeURIComponent(item.deptName),
      hosDeptId: '',
      promptMessage: '',
      firstHosDeptId: encodeURIComponent(deptStore.activeLv1.firstHosDeptId),
      secondHosDeptId: '',
      isExpertDeptId: deptStore.activeLv1.isExpertDeptId
        ? deptStore.activeLv1.isExpertDeptId
        : '0',
    };

    if (isLev1(item)) {
      queryArg.firstHosDeptId = encodeURIComponent(item.firstHosDeptId);
      queryArg.isExpertDeptId = '1';
    } else if (isLev2(item)) {
      queryArg.secondHosDeptId = encodeURIComponent(item.secondHosDeptId);
    } else {
      queryArg.secondHosDeptId = encodeURIComponent(
        deptStore.activeLv2.secondHosDeptId
      );
      queryArg.hosDeptId = encodeURIComponent(item.hosDeptId);
    }

    queryArg.promptMessage = encodeURIComponent(item.promptMessage || '');

    uni.navigateTo({
      url: joinQuery('/pagesA/MyRegistration/order', queryArg),
    });
  };

  onLoad(() => {
    deptStore.changeActiveLv1({} as any);
    deptStore.changeActiveLv2({} as any);
    deptStore.changeActiveLv3({} as any);

    setTimeout(() => {
      isShowRegTip.value = true;
    }, 500);
  });

  const goSearch = () => {
    uni.navigateTo({
      url: joinQuery('/pagesA/MyRegistration/RegSearch', {
        clinicalType: props.clinicalType,
        hosId: hosId.value,
      }),
    });
  };

  init();
</script>

<style lang="scss" scoped>
  .g-page {
    background-color: #fff;
  }

  .reg-tip {
    max-height: 700rpx;
    width: calc(100% - 64rpx);
    margin-left: 32rpx;
  }

  .search-input {
    margin: 16rpx 32rpx;
  }
</style>
