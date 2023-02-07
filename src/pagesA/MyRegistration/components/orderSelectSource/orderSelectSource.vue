<template>
  <view class="">
    <g-popup
      :subTitle="subTitle"
      @hide="hide"
      title="请选择就诊时间"
      ref="popup"
    >
      <view class="content">
        <view
          v-if="selectSchInfos && selectSchInfos.length"
          class="g-border-bottom"
        >
          <view>
            <g-tabs
              v-model:value="tabCurrent"
              :tabs="selectSchInfos"
              :scroll="false"
              @change="tabChange"
              field="ampmName"
              style="width: 100%"
            />
          </view>
        </view>
        <scroll-view
          class="container"
          :class="{
            'container-all-day': selectSchInfo.amPmResults,
            'container-href-day': !selectSchInfo.amPmResults,
          }"
          :scroll-into-view="scrollToView"
          scroll-y
        >
          <view
            v-if="selectSchInfo.amPmResults && refreshList"
            class="animate__animated animate__fadeIn"
          >
            <block v-if="selectSchInfo.amPmResults.length">
              <view
                v-for="(_item, idx) in selectSchInfo.amPmResults"
                :key="getCollapseOrderSourceListKey(_item)"
                :id="'collapse-item-' + idx"
                class="collapse-item g-border-bottom"
              >
                <g-collapse
                  :border="false"
                  :isTitleSticky="collapseOpens['' + idx + tabCurrent]"
                  :disabled="selectSchInfo.amPmResults.length === 1"
                  @change="(b) => collapseChange(idx, b, _item)"
                  titlePadding="0 32rpx"
                  activebg="transparent"
                  titleBackGroundColor="#fff"
                  accordionId="order"
                  accordion
                  ref="refCollapse"
                >
                  <template #title>
                    <view :class="{}" class="collapse-title f32 g-bold">
                      <text
                        v-if="_item.schQukCategor || _item.categorName"
                        class="mr12"
                      >
                        {{ _item.schQukCategor || _item.categorName || '' }}
                      </text>
                      <text v-if="_item.fee">{{ _item.fee }}元</text>
                    </view>
                  </template>

                  <template #title-next>
                    <view class="collapse-item-title-next" />
                  </template>

                  <template #default>
                    <view class="collapse-content">
                      <orderSelectSourceList
                        :column="column"
                        :orderSourceList="
                          collapseOrderSourceList[
                            getCollapseOrderSourceListKey(_item)
                          ]
                        "
                        :value="value"
                        :isBlur="isBlur"
                        @item-click="itemClick"
                        itemBgc="#fff"
                        disabledActiveStyle
                      />
                    </view>
                  </template>
                </g-collapse>
              </view>
            </block>

            <view v-else class="empty-list1">
              <g-empty :current="1" text="暂无号源" />
            </view>
          </view>

          <block v-else>
            <view class="fix-top">
              <view
                v-if="
                  selectSchInfo.schQukCategor ||
                  selectSchInfo.deptName ||
                  selectSchInfo.categorName
                "
                class="order-info mb24"
              >
                <text class="mr24">
                  {{
                    selectSchInfo.schQukCategor ||
                    `${selectSchInfo.deptName || ''}/${
                      selectSchInfo.categorName || ''
                    }`
                  }}
                </text>

                <text>{{ selectSchInfo.fee }}元</text>
              </view>
            </view>

            <view class="container-source">
              <view
                v-if="!orderSourceList.length && isComplete && refreshList"
                class="empty-list1"
              >
                <g-empty :current="1" text="暂无号源" />
              </view>

              <orderSelectSourceList
                :column="column"
                :orderSourceList="orderSourceList"
                :value="value"
                :isBlur="isBlur"
                @item-click="itemClick"
                itemBgc="#fff"
                disabledActiveStyle
              />
            </view>
          </block>
          <view class="safe-height" />
        </scroll-view>
      </view>
    </g-popup>
  </view>
</template>

<script lang="ts" setup>
  import { watch, ref, computed } from 'vue';
  import {
    TSchInfo,
    IOrderSource,
    TSchInfoWhole,
    IChooseDays,
  } from '../../utils/index';
  import { GStores } from '@/utils';

  import orderSelectSourceList from './orderSourceList.vue';
  import api from '@/service/api';

  const popup = ref<any>('');
  const gStores = new GStores();
  const props = defineProps<{
    show: boolean;
    isComplete: boolean;
    column: number;
    value: string;
    checkedDay: string;
    isBlur: '0' | '1';
    selectSchInfos: TSchInfoWhole[];
    orderSourceList: IOrderSource[];
    chooseDays: IChooseDays[];
  }>();
  const emits = defineEmits(['update:show', 'item-click', 'am-change']);
  const selectSchInfo = computed(() => {
    if (props.selectSchInfos.length) {
      return props.selectSchInfos[tabCurrent.value];
    } else {
      return {} as TSchInfoWhole;
    }
  });

  const subTitle = computed(() => {
    const dayItem = props.chooseDays.find(
      (o) => o.fullDay === props.checkedDay
    );

    if (dayItem) {
      return `${dayItem.day} ${dayItem.weekday}`;
    } else {
      return '';
    }
  });

  const enabledItemClick = ref(true);
  const refreshList = ref(true);
  const refCollapse = ref('' as any);
  const scrollToView = ref('');
  const collapseOpens = ref<Record<string, boolean>>({});
  const collapseOrderSourceList = ref<Record<string, IOrderSource[]>>({});
  const getCollapseOrderSourceListKey = (item: TSchInfo) => {
    const { ampm, categor, schId, schQukCategor } = item;

    return ampm + categor + schId + schQukCategor + tabCurrent.value;
  };

  const currentSchInfo = ref({} as TSchInfo);
  const collapseChange = async (idx, type: boolean, _item: TSchInfo) => {
    collapseOpens.value = {
      ['' + idx + tabCurrent.value]: type,
    };
    currentSchInfo.value = _item;
    if (type) {
      const scrollToView_id = 'collapse-item-' + idx;
      enabledItemClick.value = false;

      setTimeout(() => {
        // bug(不能解决, 限制一下)...
        enabledItemClick.value = true;
      }, 100);
      if (scrollToView_id !== scrollToView.value) {
        scrollToView.value = scrollToView_id;
      }

      const {
        ampm,
        categor,
        deptName,
        hosDeptId,
        hosDocId,
        hosId,
        schDate,
        schId,
      } = _item;
      const listKey = getCollapseOrderSourceListKey(_item);
      const oldList = collapseOrderSourceList.value[listKey];
      if (!oldList) {
        const {
          browser: { source },
          sysCode,
        } = gStores.globalStore;
        const refCollapseNow = refCollapse.value[idx];
        const args = {
          ampm,
          categor,
          deptName,
          hosDeptId,
          hosDocId,
          hosId,
          schDate,
          schId,
          source,
          sysCode,
        };

        const { result } = await api.getNumberSource<any>(args);
        collapseOrderSourceList.value[listKey] = result || [];
        refCollapseNow.init();
      }
    }
  };

  const tabCurrent = ref(0);
  const show = () => {
    popup.value.show();
  };

  const hide = () => {
    emits('update:show', false);
  };

  const itemClick = (item: IOrderSource) => {
    if (!enabledItemClick.value) {
      return;
    }
    const selectValue = selectSchInfo.value.amPmResults
      ? currentSchInfo.value
      : selectSchInfo.value;

    emits('item-click', {
      item,
      selectSchInfo: selectValue,
    });
  };

  const tabChange = (e) => {
    emits('am-change', props.selectSchInfos[e]);
    resetData();
    refreshList.value = false;

    setTimeout(() => {
      refreshList.value = true;
      initAmPmResList();
    }, 100);
  };

  const initAmPmResList = async () => {
    const amPmResults = selectSchInfo.value.amPmResults;
    if (amPmResults && amPmResults.length === 1) {
      setTimeout(() => {
        const refCollapseNow = refCollapse.value[0];
        refCollapseNow.show(true);
      }, 200);
    }
  };

  const setTabIndex = (idx: number) => {
    tabCurrent.value = idx;
    resetData();
  };

  const resetData = () => {
    collapseOpens.value = {};
    collapseOrderSourceList.value = {};
  };

  watch(
    () => props.show,
    (v) => {
      if (v) {
        show();
        resetData();
        initAmPmResList();
      }
    }
  );

  watch(
    () => props.selectSchInfos,
    () => {
      tabCurrent.value = 0;
    }
  );

  defineExpose({
    setTabIndex,
  });
</script>

<style lang="scss" scoped>
  .container {
    background-color: var(--hr-neutral-color-1);

    &.container-href-day {
      max-height: calc(var(--h-popup-max-height) - 90rpx);
      min-height: 400rpx;
    }

    &.container-all-day {
      height: calc(var(--h-popup-max-height) - 90rpx);
    }

    .fix-top {
      position: sticky;
      z-index: 10;
      top: 0;
    }

    .order-info {
      font-weight: 600;
      display: flex;
      background-color: #fff;
      padding: 32rpx;

      > view {
        padding-right: 24rpx;
      }
    }

    .container-source {
      // #ifdef MP-WEIXIN
      // width: calc(100% - 64rpx);
      // #endif
      padding: 0 32rpx;
    }

    .empty-list {
      transform: translateY(25%);
    }
  }

  .collapse-item {
    background-color: var(--hr-neutral-color-1);

    .collapse-item-title-next {
      position: relative;
      width: 100%;
    }

    .collapse-content {
      padding: 16rpx 32rpx;
      // padding: 0  32rpx;
    }
  }

  .collapse-title {
    background-color: #fff;
    padding: 28rpx 0;
    position: relative;

    // &::after {
    //   content: 'wee';
    //   display: block;
    //   width: 100rpx;
    //   top: 0;
    //   bottom: 0;
    //   right: 0;

    //   background-color: #fff;
    //   position: absolute;
    // }

    // &::before {
    //   content: '';
    //   display: block;
    //   width: 100rpx;
    //   top: 0;
    //   bottom: 0;
    //   left: -99rpx;

    //   background-color: #fff;
    //   position: absolute;
    // }
  }

  .empty-list1 {
    position: relative;
    top: 200rpx;
  }
</style>
