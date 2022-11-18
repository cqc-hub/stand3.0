<template>
  <view class="">
    <g-popup @hide="hide" title="请选择就诊时间" ref="popup">
      <view class="content">
        <view
          v-if="selectSchInfos && selectSchInfos.length > 1"
          class="g-border-bottom"
        >
          <g-tabs
            v-model:value="tabCurrent"
            :tabs="selectSchInfos"
            :scroll="false"
            @change="tabChange"
            field="ampmName"
            style="width: 100%"
          />
        </view>
        <scroll-view
          class="container"
          :class="{
            'container-all-day': selectSchInfo.amPmResults,
            'container-href-day': !selectSchInfo.amPmResults,
            'container-padding': !selectSchInfo.amPmResults,
          }"
          :scroll-into-view="scrollToView"
          scroll-y
        >
          <view
            v-if="selectSchInfo.amPmResults && refreshList"
            class="animate__animated animate__fadeIn"
          >
            <view
              v-for="(_item, idx) in selectSchInfo.amPmResults"
              :key="getCollapseOrderSourceListKey(_item)"
              :id="'collapse-item-' + idx"
              class="collapse-item g-border-bottom"
            >
              <g-collapse
                :border="false"
                :isTitleSticky="collapseOpens[idx]"
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
                    <text class="mr12">
                      {{ _item.schQukCategor || _item.categorName }}
                    </text>
                    <text>{{ _item.fee }}元</text>
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
                    />
                  </view>
                </template>
              </g-collapse>
            </view>
          </view>

          <block v-else>
            <view class="order-info">
              <view>{{ selectSchInfo.docName }}</view>
              <view>{{ selectSchInfo.schDate }}</view>
              <view>{{ selectSchInfo.fee }}元</view>
            </view>

            <view class="container-source">
              <view
                v-if="!orderSourceList.length && isComplete && refreshList"
                class="empty-list"
              >
                <g-empty :current="1" text="暂无号源" />
              </view>

              <orderSelectSourceList
                :column="column"
                :orderSourceList="orderSourceList"
                :value="value"
                :isBlur="isBlur"
                @item-click="itemClick"
              />
            </view>
          </block>
        </scroll-view>
      </view>
    </g-popup>
  </view>
</template>

<script lang="ts" setup>
  import { watch, ref, computed } from 'vue';
  import { TSchInfo, IOrderSource, TSchInfoWhole } from '../../utils/index';
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
    isBlur: '0' | '1';
    selectSchInfos: TSchInfoWhole[];
    orderSourceList: IOrderSource[];
  }>();
  const emits = defineEmits(['update:show', 'item-click', 'am-change']);
  const selectSchInfo = computed(() => {
    if (props.selectSchInfos.length) {
      return props.selectSchInfos[tabCurrent.value];
    } else {
      return {} as TSchInfoWhole;
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
    collapseOpens.value[idx] = type;
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
    }, 100);
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
    &.container-padding {
      padding: 0 32rpx;
    }

    &.container-href-day {
      max-height: calc(var(--h-popup-max-height) - 90rpx);
      min-height: 400rpx;
    }

    &.container-all-day {
      height: calc(var(--h-popup-max-height) - 90rpx);
    }

    .order-info {
      font-weight: 600;
      padding: 32rpx 0;
      display: flex;

      > view {
        margin-right: 24rpx;
      }
    }

    .container-source {
      // #ifdef MP-WEIXIN
      width: calc(100% - 64rpx);
      // #endif
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
</style>
