<template>
  <view class="page">
    <view class="bread-crumbs" @click="toggleHos">
      <view class="hos-label">当前医院：</view>
      <view class="hos-name text-ellipsis">{{ getHosName }}</view>
      <view class="iconfont ico-arrow">&#xe66b;</view>
    </view>

    <view class="container" scroll-y>
      <Department-List
        :list="depList"
        :level="depLevel"
        :active-lv1="deptStore.activeLv1"
        :active-lv2="deptStore.activeLv2"
        :active-lv3="deptStore.activeLv3"
        @item-click-lv1="itemClickLv1"
        @item-click-lv2="itemClickLv2"
        @item-click-lv3="itemClickLv3"
      />
    </view>

    <g-select
      v-model:value="hosId"
      v-model:show="isToggleDialogShow"
      :option="hosList"
      :field="{
        label: 'hosName',
        value: 'hosId'
      }"
      title="切换医院"
    />
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { GStores, ServerStaticData, IHosInfo } from '@/utils';
  import { IDeptLv1, IDeptLv2, IDeptLv3, loopDeptList, useDeptStore } from '@/stores';

  import api from '@/service/api';

  import DepartmentList from './components/departmentList/departmentList.vue';

  const props = defineProps<{
    hosId: string;
  }>();

  const depList = ref<IDeptLv1[]>([]);
  const depLevel = ref('1');
  const gStores = new GStores();
  const deptStore = useDeptStore();
  const hosList = ref<IHosInfo[]>([]);
  const hosId = ref(props.hosId);
  const isToggleDialogShow = ref(false);

  const init = () => {
    getHosList();
    getDepList();
  };

  const getHosList = async () => {
    const list = await ServerStaticData.getHosList();
    hosList.value = list;
  };

  const getDepList = async () => {
    const source = gStores.globalStore.browser.source;

    const requestArg = {
      source,
      sysCode: '1001017',
      hosId: '449'
      // resType   // 预约类型：1.预约挂号，2.当日挂号
      // clinicalType   // 门诊类型 1、普通预约 2-膏方预约 3-名医在线夜门诊 4-云诊室 5-自助便民门诊（省人民凤凰HIS）6-专病门诊 7-成人 8-儿童 9-弹性门诊 10-军属门诊 11-军人门诊
    };

    const { result } = await api.getDeptList(requestArg);

    let { firstDeptList, deptListLevel } = result;

    // deptListLevel = '1'
    loopDeptList(firstDeptList, deptListLevel);

    // depList.value = [
    //   ...firstDeptList,
    //   ...firstDeptList,
    //   ...firstDeptList,
    //   ...firstDeptList,
    //   ...firstDeptList,
    //   ...firstDeptList
    // ];

    depList.value = firstDeptList;
    depLevel.value = deptListLevel;
  };

  const itemClickLv1 = (item: IDeptLv1) => {
    deptStore.changeActiveLv1(item);
    if (depLevel.value === '1') {
      registerContinue(item);
    }
  };

  const itemClickLv2 = (item: IDeptLv2) => {
    deptStore.changeActiveLv2(item);
    if (depLevel.value === '2') {
      registerContinue(item);
    }
  };

  const itemClickLv3 = (item: IDeptLv3) => {
    deptStore.changeActiveLv3(item);
    if (depLevel.value === '3') {
      registerContinue(item);
    }
  };

  const getHosName = computed(() => {
    if (hosList.value.length) {
      const item = hosList.value.find((o) => o.hosId == hosId.value);
      if (item) {
        return item.hosName;
      } else {
        return hosId.value;
      }
    } else {
      return '';
    }
  });

  const registerContinue = (item: IDeptLv3) => {
    console.log(item);
  };

  const toggleHos = () => {
    const len = hosList.value.length;
    if (len) {
      isToggleDialogShow.value = true;
      return;
      if (len === 1) {
        gStores.messageStore.showMessage('没有可切换的院区', 1500);
      } else {
        isToggleDialogShow.value = true;
      }
    } else {
      gStores.messageStore.showMessage('请求医院列表中， 请稍后点击', 1500);
    }
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
