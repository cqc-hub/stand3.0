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
              <AGuideList
                :list="pageConfig?.medicalAsistantConfig?.timeLineBtn"
                :data="currentTab"
              />
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
                :btns="pageConfig?.medicalAsistantConfig?.contentBtn"
              />
            </view>
          </view>
        </view>
      </view>
      <view class="footer flex-normal g-footer pb24">
        <view
          @click="useTBanner(btn,'navigateTo',currentTab)"
          class="footer-icon-btn item mr12"
          :class="{
            'icon-flex': btn.icon,
            mr24:
              pageConfig?.medicalAsistantConfig?.bottomBtn?.length &&
              pageConfig?.medicalAsistantConfig?.bottomBtn?.length < 4,
          }"
          v-for="(btn, idx) in pageConfig?.medicalAsistantConfig?.bottomBtn"
          :key="idx"
        >
          <view
            v-if="btn.icon"
            :class="{
              [btn.icon]: 1,
            }"
            class="icon-font mb4 icon-button"
          />

          <view
            class="f24 text-no-wrap"
            :class="{
              'footer-btn': !btn.icon,
              f36: !btn.icon,
            }"
          >
            {{ btn?.text }}
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
    useTBanner,
  } from '@/utils';
  import api from '@/service/api';
  import { HosGuideParams, HosGuideSheet, GuideContent } from './types';
  import { getItemStyle } from './utils';
  import ATabList from './components/ATabList.vue';
  import AGuideList from './components/AGuideList.vue';
  import AListItem from './components/AListItem.vue';

  const gStores = new GStores();
  const params = new HosGuideParams(gStores.userStore.patChoose.patientId);
  const guideSheetList = ref<HosGuideSheet[] | []>([]);
  let guideContent = reactive<GuideContent>({
    list: [],
    navigationCode: {
      boilerRoom: '',
      wheelchair: '',
      supermarket: '',
    },
    tabValue: '',
    disposeTime: '',
  });
  const currentTab = ref<HosGuideSheet>();
  const pageConfig = ref(<ISystemConfig['Electronic_Consultation_Sheet']>{});
  onLoad(() => {
    init();
  });
  const init = async () => {
    pageConfig.value = await ServerStaticData.getSystemConfig(
      'Electronic_Consultation_Sheet'
    );
    getListData();
  };
  let getListData = async () => {
    guideSheetList.value = [];
    wait(50);
    const { patientId } = gStores.userStore.patChoose;
    const { result } = await api.getHosGuideSheet({
      patientId,
    });

    const list = (result as any) || [];
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
    currentTab.value = item;
    guideContent.list = processResultList || [];
    guideContent.navigationCode = {};
    guideContent.disposeTime = disposeTime;
    guideContent.tabValue = visitNo || '';

    // console.log('guideContent.value.list', guideContent.list);
    // if (navigationCodeJson) {
    //   guideContent.navigationCode = JSON.parse(navigationCodeJson);
    // }
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
    flex: 1 1 auto;
  }

  .w100 {
    width: 100%;
  }

  .aaa {
    overflow: hidden;
    overflow-y: scroll;
    width: 100%;
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
  }
  .item {
    justify-content: center;
    min-height: 88rpx;

    .icon-font {
      height: 48rpx;
      width: 48rpx;
    }
  }
  .footer-btn {
    padding: 20rpx 0;
    font-weight: 600;
    background: #ffffff;
    border: 1px solid #cccccc;
    border-radius: 8px;
    width: 100% !important;
    overflow-x: auto;
    text-align: center;
  }
  .footer-icon-btn:last-of-type .footer-btn {
    color: #fff;
    background: #296fff;
  }
  .icon-flex {
    flex: 0 0 50rpx;
  }
</style>
