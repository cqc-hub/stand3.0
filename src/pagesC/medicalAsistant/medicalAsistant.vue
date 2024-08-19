<template>
  <view class="g-page bg-white">
    <g-flag typeFg="1206" isShowFg />
    <g-choose-pat @choose-pat="init" />
    <view v-if="guideSheetList.length" class="pat-box">
      <ATabList
        v-model:tabs-data="guideContent"
        :guidet-list="guideSheetList"
        @item-click="tabClick"
      />
      <view class="g-container">
        <view v-if="guideSheetList.length" class="pr16 box">
          <view
            class="g-bold f36 color-111 a-point first-point flex-normal w100"
          >
            <view
              :style="{
                '--point-color': '#bbbbbb',
              }"
              class="b-point"
            />
            <text class="text-no-wrap mr32">
              {{ guideContent.disposeTime }}
            </text>
            <scroll-view scroll-x class="aaa">
              <!-- 按钮 -->
              <AGuideList :list="guideContent.navigationCode" />
            </scroll-view>
          </view>
          <view
            v-for="item in guideContent.list"
            :key="item.uuid"
            class="g-fade-in"
          >
            <view class="a-point">
              <view
                :style="{
                  '--point-color': getItemStyle(item).mainColor,
                }"
                class="b-point"
              />
              <AListItem
                :mainColor="getItemStyle(item).mainColor"
                :bgColor="getItemStyle(item).bgColor"
                :item="item"
              />
            </view>
          </view>
        </view>
      </view>
    </view>
    <view v-else class="empty-list">
      <g-empty :current="1" noTransformY />
    </view>
  </view>
</template>

<script setup lang="ts">
  import { computed, ref, reactive } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import {
    GStores,
    wait,
    debounce,
    ServerStaticData,
    ISystemConfig,
  } from '@/utils';
  import { HosGuideParams, HosGuideSheet, GuideContent } from './types';
  import { getItemStyle } from './utils';
  import ATabList from './components/ATabList.vue';
  import AGuideList from './components/AGuideList.vue';
  import AListItem from './components/AListItem.vue';

  const gStores = new GStores();
  const params = new HosGuideParams(gStores.userStore.patChoose.patientId);
  const guideSheetList = ref<HosGuideSheet[] | []>([]);
  const guideContent = reactive<GuideContent>({
    list: [],
    navigationCode: {
      boilerRoom: '',
      wheelchair: '',
      supermarket: '',
    },
    tabValue: '',
    disposeTime: '',
  });
  const pageConfig = ref(<ISystemConfig['Electronic_Consultation_Sheet']>{});
  onLoad(() => {
    init();
  });
  const init = async () => {
    // #ifdef MP-ALIPAY
    pageConfig.value = await ServerStaticData.getSystemConfig(
      'Electronic_Consultation_Sheet'
    )['inAlipay'];
    // #endif
    // #ifdef  MP-WEIXIN
    pageConfig.value = await ServerStaticData.getSystemConfig(
      'Electronic_Consultation_Sheet'
    )['inWx'];
    // #endif
    pageConfig.value.medicalAsistantConfig = {
      timeLineBtn: [
        {
          appId: 'wx8735a8a39cf58b5e',
          path: 'pages/index?id=RjCFT94AaD&appKey=4l2c52f0jU',
          text: '院内导航',
          type: 'otherProgram',
          addition: { hosDeptId: 'poi' },
          extraData:{code:'123456789'}
        },
      ],
    };

    console.log('pageConfig.value', pageConfig.value);
    getListData();
  };
  let getListData = async () => {
    guideSheetList.value = [];
    wait(50);
    const { result } = {
      result: [
        {
          deptName: '生殖内分泌科',
          disposeTime: '2024-08-16',
          navigationCodeJson:
            '{"boilerRoom":"TEA_ROOM", "wheelchair": "DES_TYPE559201", "supermarket": "CVS"}',
          hosId: '01',
          processResultList: [
            {
              deptName: '生殖内分泌科',
              no: '501',
              orderId: '2024081610145107',
              appointIndicator: '1',
              scheduledDateTime: '2024-08-16 13:30:00',
              remark: '7#*自带毛巾',
              orderClass: '3',
              itemName:
                '“一站式”超声[一站式男性生殖系统检查（睾丸、附睾、精索+经直肠前列腺+双肾静脉+三维脏器）]',
              prescNo: '24081616963',
              clinicalType: '1',
              sortNum: '4',
              hosName: '朝晖院区',
              isAppoint: '1',
              address: '五号楼二楼(超声医学科),5号楼2楼超声科',
              billDeptName: '生殖内分泌科',
              beforeNum: '8',
              navigationCodeJson: '{}',
              deptId: 'A01020290000',
              isEmptyStomach: '0',
              hosId: '01',
              disposeTime: '2024-08-16 10:08:09',
              performDeptCode: 'A01030020000',
              disposeStatus: '1',
              billDeptId: 'A01020290000',
              visitNo: '20240816106061',
            },
            {
              deptName: '生殖内分泌科',
              orderId: '2024081610145112',
              orderClass: '2',
              itemName: '血粘度测定 [全血]',
              prescNo: '202408161000011613',
              clinicalType: '1',
              sortNum: '1',
              hosName: '朝晖院区',
              isAppoint: '0',
              address: '2号楼二楼',
              billDeptName: '生殖内分泌科',
              navigationCodeJson: '{}',
              deptId: 'A01020290000',
              hosId: '01',
              disposeTime: '2024-08-16 10:08:11',
              performDeptCode: 'A01030030000',
              disposeStatus: '3',
              billDeptId: 'A01020290000',
              visitNo: '20240816106061',
            },
            {
              deptName: '生殖内分泌科',
              orderId: '2024081610145111',
              orderClass: '2',
              itemName: '生殖激素 [血清]',
              prescNo: '202408161000011614',
              clinicalType: '1',
              sortNum: '1',
              hosName: '朝晖院区',
              isAppoint: '0',
              address: '2号楼二楼',
              billDeptName: '生殖内分泌科',
              navigationCodeJson: '{}',
              deptId: 'A01020290000',
              hosId: '01',
              disposeTime: '2024-08-16 10:08:10',
              performDeptCode: 'A01030030000',
              disposeStatus: '3',
              billDeptId: 'A01020290000',
              visitNo: '20240816106061',
            },
            {
              deptName: '生殖内分泌科',
              orderId: '2024081610145109',
              appointIndicator: '1',
              scheduledDateTime: '2024-08-16 11:00:00',
              remark:
                '1.本检查无需空腹。 2.若因病情需要加做项目，请再补交费用。 3.HIV阳性、乙肝、丙肝及其他血液系统传染性疾病的患者，请在病史中注明。 4.有出血倾向、血小板明显低下等患者慎行针极肌电图检查。 5.肛门括约肌检查前，请排空大便，清洗肛周皮肤。',
              orderClass: '3',
              itemName: '肌电图[阴部神经体感诱发电位]',
              prescNo: '24081616961',
              clinicalType: '1',
              sortNum: '4',
              hosName: '朝晖院区',
              isAppoint: '1',
              address: '三号楼二楼(神经电生理科)',
              billDeptName: '生殖内分泌科',
              navigationCodeJson: '{}',
              deptId: 'A01020290000',
              hosId: '01',
              disposeTime: '2024-08-16 10:08:10',
              performDeptCode: 'A01030080000',
              disposeStatus: '3',
              billDeptId: 'A01020290000',
              visitNo: '20240816106061',
            },
            {
              deptName: '生殖内分泌科',
              orderId: '2024081610144365',
              appointIndicator: '1',
              scheduledDateTime: '2024-08-16 11:00:00',
              remark:
                '1.本检查无需空腹。 2.若因病情需要加做项目，请再补交费用。 3.HIV阳性、乙肝、丙肝及其他血液系统传染性疾病的患者，请在病史中注明。 4.有出血倾向、血小板明显低下等患者慎行针极肌电图检查。 5.肛门括约肌检查前，请排空大便，清洗肛周皮肤。',
              orderClass: '3',
              itemName: '肌电图[球海绵体肌反射]',
              prescNo: '24081616962',
              clinicalType: '1',
              sortNum: '4',
              hosName: '朝晖院区',
              isAppoint: '1',
              address: '三号楼二楼(神经电生理科)',
              billDeptName: '生殖内分泌科',
              navigationCodeJson: '{}',
              deptId: 'A01020290000',
              hosId: '01',
              disposeTime: '2024-08-16 10:08:09',
              performDeptCode: 'A01030080000',
              disposeStatus: '3',
              billDeptId: 'A01020290000',
              visitNo: '20240816106061',
            },
          ],
          hosName: '朝晖院区',
          visitNo: '20240816106061',
        },
        {
          deptName: '生殖内分泌科',
          disposeTime: '2024-08-05',
          navigationCodeJson: '{}',
          hosId: '01',
          processResultList: [
            {
              deptName: '生殖内分泌科',
              orderId: '2024080510028178',
              orderClass: '2',
              itemName: '胎盘生长因子 [血清]',
              prescNo: '202408051000002914',
              clinicalType: '1',
              sortNum: '1',
              hosName: '朝晖院区',
              isAppoint: '0',
              address: '2号楼二楼',
              billDeptName: '生殖内分泌科',
              navigationCodeJson: '{}',
              deptId: 'A01020290000',
              hosId: '01',
              disposeTime: '2024-08-05 08:08:14',
              performDeptCode: 'A01030030000',
              disposeStatus: '1',
              billDeptId: 'A01020290000',
              visitNo: '20240805101351',
            },
            {
              deptName: '生殖内分泌科',
              isDeptStorage: '0',
              orderClass: '1',
              itemName: '中药',
              prescNo: '2024080510027619',
              clinicalType: '1',
              sortNum: '12',
              hosName: '朝晖院区',
              address: '(门诊草药房)',
              billDeptName: '生殖内分泌科',
              navigationCodeJson: '{}',
              deptId: 'A01020290000',
              hosId: '01',
              disposeTime: '2024-08-05 08:08:42',
              performDeptCode: 'A01030050400',
              disposeStatus: '3',
              billDeptId: 'A01020290000',
              visitNo: '20240805101351',
            },
          ],
          hosName: '朝晖院区',
          visitNo: '20240805101351',
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
    const { processResultList, visitNo, disposeTime, navigationCodeJson } =
      item;

    guideContent.list = processResultList || [];
    guideContent.navigationCode = {};
    guideContent.disposeTime = disposeTime;
    guideContent.tabValue = visitNo || '';

    console.log('guideContent.value.list', guideContent.list);
    if (navigationCodeJson) {
      guideContent.navigationCode = JSON.parse(navigationCodeJson);
    }
  };
</script>

<style lang="scss" scoped>
  .g-page {
    background-color: #fff;
  }
  .g-container {
    height: fit-content;
  }

  .box {
    padding-left: 56rpx;
  }

  .b-point {
    --point-color: #bbbbbb;

    width: 16rpx;
    height: 16rpx;
    background-color: var(--point-color);
    border-radius: 100%;
    position: absolute;
    left: -32rpx;
    top: 32rpx;
  }

  .a-point {
    position: relative;

    &::before {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      bottom: -16rpx;
      width: 1rpx;
      background-color: #dddddd;
      transform: translate(-25rpx, 0);
    }

    &.first-point {
      $p-top: 25rpx;
      padding: 12rpx 0;
      .b-point {
        top: $p-top;
      }

      &::before {
        top: $p-top;
      }
    }
  }

  .a-btn-icon {
    width: 48rpx;
    height: 48rpx;
    margin-bottom: 6rpx;
  }

  .footer-icon-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .footer-btn {
    padding: 0 30rpx;
    font-weight: 600;
    background: #ffffff;
    border: 1px solid #cccccc;
    border-radius: 8px;
    width: 208rpx;
    overflow-x: auto;

    &.footer-btn-primary {
      color: #fff;
      background: #296fff;
    }
  }

  .w100 {
    width: 100%;
  }

  .aaa {
    overflow: hidden;
    overflow-y: scroll;
    width: 100%;
  }
</style>
