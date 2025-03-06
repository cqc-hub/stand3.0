<template>
  <Order-Select-Source
    v-model:show="isSelectOrderSourceShow"
    v-model:selectSchInfos="selectSchInfos"
    v-model:value="selectOrderSourceNumId"
    :isComplete="isComplete"
    :orderSourceList="orderSourceList"
    :column="orderConfig.selOrderColumn"
    :is-blur="orderConfig.isOrderBlur"
    :choose-days="chooseDays"
    :checked-day="regDate"
    @item-click="orderSourceChoose"
    @am-change="amChange"
    ref="selectOrderSource"
  />
</template>
<script setup lang="ts">
  import { ref, computed, getCurrentInstance, onMounted } from 'vue';
  const {
    init,
    chooseDays,
    checkedDay,
    getListByDate,
    allDocList,
    dateDocList,
    dateDocListFilterByDate,
    dateClick,
    isSelectOrderSourceShow,
    selectOrderSource,
    selectSchInfos,
    orderSourceList,
    orderConfig,
    orderSourceChoose,
    selectOrderSourceNumId,
    amChange,
    regClick,
    waitRegClick,
    isComplete,
    enabledDays,
    getDeptInfo,
    deptInfo,
    regDate,
    gStores,
    preregistrationClick,
    isOrderPreSourceShow,
    preregistrationRegNumbers,
    goPreregistration,
  } = useOrder(ref({ ...props }));
  let testData = {
    schDate: '2025-03-09',
    schState: '0',
    schDocAmPm: [
      {
        ampm: '1',
        ampmName: '上午',
        amPmResults: [
          {
            deptName: '烧伤科',
            ampm: '1',
            hosDeptId: '3000042|A0102041',
            fee: '17.00',
            ampmName: '上午',
            hosId: '13001',
            schDate: '2025-03-09',
            schId: '20221129000000000634',
            docName: '胡加林',
            categorName: '专家（副高）',
            schState: '0',
            numCount: '15',
            categor: '5',
            hosDocId: '20212048',
            numRemain: '13',
            hosName: '乐清市人民医院',
            schQukCategor: '烧伤及创面修复科(副高)',
            docPhoto: '',
          },
        ],
      },
      {
        ampm: '2',
        ampmName: '下午',
        amPmResults: [
          {
            deptName: '烧伤科',
            ampm: '2',
            hosDeptId: '3000042|A0102041',
            fee: '17.00',
            ampmName: '下午',
            hosId: '13001',
            schDate: '2025-03-09',
            schId: '20221129000000000634',
            docName: '胡加林',
            categorName: '专家（副高）',
            schState: '0',
            numCount: '15',
            categor: '5',
            hosDocId: '20212048',
            numRemain: '15',
            hosName: '乐清市人民医院',
            schQukCategor: '烧伤及创面修复科(副高)',
            docPhoto: '',
          },
        ],
      },
    ],
  };

//   dateClick({
//     item: docInfo,
//     schInfo: testData,
//   });
</script>
