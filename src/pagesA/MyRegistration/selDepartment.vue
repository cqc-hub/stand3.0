<template>
  <view class="page">
    <g-selhos
      v-model:hosId="hosId"
      @get-list="getHosList"
      @change="getDepList"
    />

    <view class="container" scroll-y>
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

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { GStores, ServerStaticData, IHosInfo } from '@/utils';
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

  import DepartmentList from './components/departmentList/departmentList.vue';

  const props = defineProps<{
    hosId: string;
    clinicalType: string; // 1、普通预约 2-膏方预约 3-名医在线夜门诊 4-云诊室 5-自助便民门诊（省人民凤凰HIS）6-专病门诊 7-成人 8-儿童 9-弹性门诊 10-军属门诊 11-军人门诊
  }>();

  const depList = ref<IDeptLv1[]>([]);
  const depLevel = ref('1');
  const gStores = new GStores();
  const deptStore = useDeptStore();
  const hosList = ref<IHosInfo[]>([]);
  const hosId = ref(props.hosId);
  const isComplete = ref(false);

  const init = () => {
    getDepList();
  };

  const getHosList = async ({ list }) => {
    hosList.value = list;
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
      }
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

  init();
</script>

<style lang="scss" scoped>
  .page {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #fff;

    .bread-crumbs {
      display: flex;

      font-size: var(--hr-font-size-xs);
      color: var(--hr-neutral-color-7);
      align-items: center;
      padding: 14rpx 30rpx;

      .hos-name {
        // flex: 1;
        color: var(--hr-neutral-color-10);
      }

      .ico-arrow {
        font-size: var(--hr-font-size-xl);
      }

      .hos-label {
        white-space: nowrap;
      }
    }

    .container {
      flex: 1;
      height: 1px;
    }
  }
</style>
