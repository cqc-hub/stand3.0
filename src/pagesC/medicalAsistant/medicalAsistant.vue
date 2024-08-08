<template>
  <view class="g-page bg-white">
    <g-flag typeFg="1206" isShowFg />
    <g-choose-pat @choose-pat="init" />
    <view v-if="guideSheetList.length" class="pat-box">
      <ATabList v-model:tabs-data="guideContent" :guidet-list="guideSheetList" @item-click="tabClick"  />
    </view>
    <view v-else class="empty-list">
      <g-empty :current="1" noTransformY />
    </view>
  </view>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import { GStores, wait, debounce } from '@/utils';
  import { HosGuideParams, HosGuideSheet, GuideContent } from './types';
  import ATabList from './components/ATabList.vue';
  const gStores = new GStores();
  const params = new HosGuideParams(gStores.userStore.patChoose.patientId);
  const guideSheetList = ref<HosGuideSheet[] | []>([]);
  const guideContent = ref<GuideContent>({
    list: [],
    navigationCode: {
      boilerRoom: '',
      wheelchair: '',
      supermarket: '',
    },
    tabValue: '',
    disposeTime: '',
  });
  onLoad(() => {
    init();
  });
  const init = () => {
    getListData();
  };
  let getListData = async () => {
    console.log('init', params);

    guideSheetList.value = [];
    wait(50);
    const { result } = {
      result: [
        {
          deptName: '头颈外科(头颈甲状腺外科、头颈颌面外科)',
          disposeTime: '2024-08-03',
          navigationCodeJson: '{}',
          hosId: '01',
          processResultList: [
            {
              deptName: '头颈外科(头颈甲状腺外科、头颈颌面外科)',
              orderId: '2024080310024304',
              orderClass: '2',
              itemName: '甲状腺功能+TPO [血清]',
              prescNo: '202408031000002864',
              clinicalType: '1',
              sortNum: '1',
              hosName: '朝晖院区',
              isAppoint: '0',
              address: '2号楼二楼',
              billDeptName: '头颈外科(头颈甲状腺外科、头颈颌面外科)',
              navigationCodeJson: '{}',
              deptId: 'A01020460000',
              hosId: '01',
              disposeTime: '2024-08-03 08:08:04',
              performDeptCode: 'A01030030000',
              disposeStatus: '3',
              billDeptId: 'A01020460000',
              visitNo: '20240803100935',
              uuid: '',
            },
            {
              deptName: '头颈外科(头颈甲状腺外科、头颈颌面外科)',
              orderId: '2024080310023898',
              appointIndicator: '1',
              orderClass: '3',
              itemName: '浅表超声[甲状腺、颈部淋巴结(浅表超声)]',
              prescNo: '24080312606',
              clinicalType: '1',
              sortNum: '2',
              hosName: '朝晖院区',
              isAppoint: '0',
              address: '检查预约中心',
              billDeptName: '头颈外科(头颈甲状腺外科、头颈颌面外科)',
              navigationCodeJson: '{}',
              deptId: 'A01020460000',
              hosId: '01',
              disposeTime: '2024-08-03 08:08:36',
              performDeptCode: 'ZJSRMYYTJZX',
              disposeStatus: '3',
              billDeptId: 'A01020460000',
              visitNo: '20240803100935',
            },
          ],
          hosName: '朝晖院区',
          visitNo: '20240803100935',
        },
        {
          deptName: '测试科室',
          disposeTime: '2024-08-03',
          navigationCodeJson: '{}',
          hosId: '01',
          processResultList: [
            {
              deptName: '头颈外科(头颈甲状腺外科、头颈颌面外科)',
              orderId: '2024080310024304',
              orderClass: '2',
              itemName: '甲状腺功能+TPO [血清]',
              prescNo: '202408031000002864',
              clinicalType: '1',
              sortNum: '1',
              hosName: '朝晖院区',
              isAppoint: '0',
              address: '2号楼二楼',
              billDeptName: '头颈外科(头颈甲状腺外科、头颈颌面外科)',
              navigationCodeJson: '{}',
              deptId: 'A01020460000',
              hosId: '01',
              disposeTime: '2024-08-03 08:08:04',
              performDeptCode: 'A01030030000',
              disposeStatus: '3',
              billDeptId: 'A01020460000',
              visitNo: '20240803100935',
              uuid: '',
            },
            {
              deptName: '头颈外科(头颈甲状腺外科、头颈颌面外科)',
              orderId: '2024080310023898',
              appointIndicator: '1',
              orderClass: '3',
              itemName: '浅表超声[甲状腺、颈部淋巴结(浅表超声)]',
              prescNo: '24080312606',
              clinicalType: '1',
              sortNum: '2',
              hosName: '朝晖院区',
              isAppoint: '0',
              address: '检查预约中心',
              billDeptName: '头颈外科(头颈甲状腺外科、头颈颌面外科)',
              navigationCodeJson: '{}',
              deptId: 'A01020460000',
              hosId: '01',
              disposeTime: '2024-08-03 08:08:36',
              performDeptCode: 'ZJSRMYYTJZX',
              disposeStatus: '3',
              billDeptId: 'A01020460000',
              visitNo: '20240803100935',
            },
          ],
          hosName: '朝晖院区',
          visitNo: '202408031009352',
        },
      ],
    };
    const list = result || [];
    if (list.length) {
      list.map(({ processResultList, visitNo }) => {
        if (processResultList?.length) {
          processResultList.map((p, j) => {
            p.uuid = 'bw' + visitNo + p.visitNo + p.billDeptId + p.prescNo + j;
          });
        }
      });
    }
    guideSheetList.value = list;
    tabClick({ idx: 0 });
  };
  getListData = debounce(getListData, 80);
  const tabClick = ({ idx }) => {
    const item = guideSheetList.value[idx];
    console.log(8888,item,guideSheetList)
    const { processResultList, visitNo, disposeTime, navigationCodeJson } =
      item;
    guideContent.value = {
      list: processResultList || [],
      navigationCode: {},
      disposeTime,
      tabValue: visitNo || '',
    };
    if (navigationCodeJson) {
      guideContent.value.navigationCode = JSON.parse(navigationCodeJson);
    }
  };
</script>

<style></style>
