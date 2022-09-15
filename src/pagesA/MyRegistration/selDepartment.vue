<template>
  <view class="page">
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
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { GStores } from '@/utils';
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

  const init = () => {
    getDepList();
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

  const registerContinue = (item: IDeptLv3) => {
    console.log(item);
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

    .container {
      flex: 1;
      height: 1px;
    }
  }
</style>
