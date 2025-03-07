<template>
  <view class="popTopLevel">
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
  </view>
</template>
<script setup lang="ts">
  import OrderSelectSource from '@/pagesA/MyRegistration/components/orderSelectSource/OrderSelectSource.vue';
  import { ref, watch } from 'vue';
  import { showOrder ,handleSourceChoose} from '../utils/utils';
  import { cloneUtil, joinQuery, joinQueryForUrl } from '@/common';
  import {
    useOrder,
    IChooseDays,
    type TSchInfo,
    type IOrderSource,
  } from '@/pagesA/MyRegistration/utils';
  const props = defineProps<{
    orderInfo: any;
  }>();

  const {
    chooseDays,
    dateClick,
    isSelectOrderSourceShow,
    selectOrderSource,
    selectSchInfos,
    orderSourceList,
    orderConfig,
    selectOrderSourceNumId,
    amChange,
    isComplete,
    regDate,
  } = useOrder(
    ref<any>({ ...JSON.parse(JSON.stringify(props.orderInfo.docInfo)) })
  );

  watch(
    () => isSelectOrderSourceShow?.value,
    () => {
      if (!isSelectOrderSourceShow?.value) {
        showOrder.value = false;
      }
    }
  );

// 点击某个号源
const orderSourceChoose = async ({
    item,
    selectSchInfo,
  }: {
    item: IOrderSource;
    selectSchInfo: TSchInfo;
  }) => {
    console.log('_________',selectSchInfo);
    
    const {
      ampmName,
      ampm,
      categor,
      categorName,
      deptName,
      docName,
      docPhoto,
      fee,
      hosDeptId,
      hosDocId,
      hosId,
      schDate,
      schId,
      schQukCategor,
      docTitleName,
      regVerificationMode,
      visitingArea,
    } = selectSchInfo;
    const { disNo, numId, timeDesc } = item;
    const {
      clinicalType,
      promptMessage,
      thRegisterId,
      hosId: _pHosId,
    } = props.orderInfo.docInfo;

    const pageArg = {
      disNo,
      numId,
      timeDesc,
      ampmName,
      ampm,
      categor,
      categorName,
      deptName,
      docName,
      docPhoto,
      fee,
      hosDeptId,
      hosDocId,
      hosId: hosId || _pHosId,
      // hosId,
      schDate,
      schId,
      schQukCategor,
      clinicalType,
      promptMessage,
      docTitleName,
      thRegisterId,
      regVerificationMode,
      visitingArea,
    };
    selectOrderSourceNumId.value = numId;
    // uni.navigateTo({
    //   url: joinQueryForUrl('/pagesA/MyRegistration/RegConfirm', pageArg),
    // });
    handleSourceChoose(pageArg)    
  };

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
            fee: '17.00',
            hosDeptId: '3000042|A0102041',
            hosId: '13001',
            schDate: '2025-03-09',
            schId: '20221129000000000634',
            categor: '5',
            hosDocId: '20212048',
            numRemain: '13',
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

  dateClick({
    item: props.orderInfo.docInfo,
    // @ts-expect-error
    schInfo: testData,
  });
</script>
<style lang="scss" scoped>
  .popTopLevel {
    z-index: 10;
  }
</style>
