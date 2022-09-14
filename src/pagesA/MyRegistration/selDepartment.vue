<template>
  <view class="page">
    <view class="container" scroll-y>
      <Department-List :list="depList" :level="depLevel" />
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { GStores } from '@/utils';
  import { IDeptLv1, loopDeptList } from './utils';

  import api from '@/service/api';

  import DepartmentList from './components/departmentList/departmentList.vue';

  const props = defineProps<{
    hosId: string;
  }>();

  const depList = ref<IDeptLv1[]>([]);
  const depLevel = ref('1');
  const gStores = new GStores();

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

    const { firstDeptList, deptListLevel } = result;
    loopDeptList(firstDeptList);

    depList.value = firstDeptList;
    depLevel.value = deptListLevel;
  };

  init();
</script>

<style lang="scss" scoped>
  .page {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;

    .container {
      flex: 1;
      height: 1px;
    }
  }
</style>
