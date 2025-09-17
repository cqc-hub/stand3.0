<template>
  <view
    :class="{
      'system-mode-old': systemModeOld,
    }"
    class="clinic-pay-list"
  >
    <view
      v-for="(item, idx) in list"
      :key="idx"
      :class="{
        active: getIsActive(item),
      }"
      class="item flex-normal mb16"
    >
      <view v-if="isCheck" class="icon-content">
        <view @click.stop="selItem(item)" class="iconfont check-box-icon">
          {{
            getIsActive(item)
              ? getIsAllDetailActive(item)
                ? '&#xe6d0;'
                : '&#xe719;'
              : '&#xe6ce;'
          }}
        </view>

        <view class="icon-mask" @click.stop="selItem(item)" />
      </view>

      <view class="content">
        <view class="item-box f28">
          <g-collapse
            ref="listCollapseRef"
            :border="false"
            :iconPosition="'top'"
          >
            <template #title>
              <view class="flex-between flex-start-r">
                <view @click.stop="selItem(item)" class="g-bold f36 flex1 mr40">
                  <text
                    v-if="
                      !isModeMedicalHelp &&
                      item.costTypeCode &&
                      !getIsMedicalTradeTypeDefault()
                    "
                    :class="{
                      'pay-self': isPaySelfItem(item),
                      'pay-medical': !isPaySelfItem(item),
                    }"
                    class="type-block f24 mr8 text-no-wrap"
                  >
                    {{ tradeType[item.costTypeCode] || '未知' }}
                  </text>
                  <text>
                    {{ item.deptName }}
                  </text>
                </view>

                <view class="g-flex-rc-cc">
                  <view
                    v-if="isCheck && item.totalCost && !isHidePrice"
                    class="color-error g-bold f36"
                  >
                    {{ item.totalCost }}元
                  </view>
                </view>
              </view>

              <view @click.stop="itemClick(item)" class="row flex-normal mt24">
                <view class="row-label color-888">
                  {{
                    $global.SYS_CODE === '1001056' && !isCheck
                      ? '支付时间'
                      : '就诊时间'
                  }}
                </view>
                <view class="row-value g-break-word color-444">
                  {{ item.visitDate }}
                </view>
              </view>

              <view @click.stop="itemClick(item)" class="row flex-normal">
                <view class="row-label color-888 text-no-wrap">就诊医生</view>
                <view class="row-value g-break-word color-444 text-ellipsis">
                  <text
                    v-if="item.clinicTypeName || item.docName"
                    :class="{
                      'g-split-line': item.hosName,
                    }"
                    class="mr12 pr12"
                  >
                    {{
                      (item.clinicTypeName && `(${item.clinicTypeName})`) || ''
                    }}
                    {{ item.docName }}
                  </text>
                  <text>
                    {{ item.hosName }}
                  </text>
                </view>
              </view>

              <view v-if="item.diseaseTypeName" class="row flex-normal">
                <view class="row-label color-888">病种</view>
                <view class="row-value g-break-word color-444">
                  {{ item.diseaseTypeName }}
                </view>
              </view>

              <view
                v-if="!isModeMedicalHelp && !isCheck && item.totalCost"
                class="row flex-normal"
              >
                <view class="row-label color-888">费用金额</view>
                <view class="row-value g-break-word color-444">
                  {{ item.totalCost }}元
                </view>
              </view>
            </template>

            <template #default>
              <view class="mb24">
                <view
                  v-for="(detailItem, idx1) in item.costList"
                  :key="idx1"
                  :class="{
                    active: isActive(detailItem),
                  }"
                  class="item-content-detail"
                >
                  <block
                    v-if="detailItem.costList && detailItem.costList.length"
                  >
                    <g-collapse
                      ref="collapseRef"
                      :border="false"
                      :disabled="isDisabledCostList"
                      @change="handleSecCollapseChange(idx)"
                      :titleBackGroundColor="'#e9f0ff00'"
                      :isHideTransition="true"
                    >
                      <template #title>
                        <view class="collapse-title flex-between g-bold">
                          <view class="">
                            <view
                              @click.stop="
                                selDetailItem(item, detailItem, idx1)
                              "
                              class="flex-normal"
                            >
                              <text
                                :class="{
                                  'color-blue': isActive(detailItem),
                                  'color-888': isItemDisabled(detailItem),
                                }"
                                class="sel-icon mr12 iconfont animate__animated animate__fadeIn"
                              >
                                {{
                                  isActive(detailItem) ? '&#xe6d0;' : '&#xe6ce;'
                                }}
                              </text>
                            </view>
                          </view>
                          <view class="flex1 f32">
                            {{ detailItem.subCostTypeName }}
                          </view>
                          <view class="item-fee">
                            {{ detailItem.subCost }}元
                          </view>
                        </view>
                      </template>
                      <template #default>
                        <view
                          v-if="
                            detailItem.subCostTypeCode === 'chineseMedicine'
                          "
                          class="medical-content"
                        >
                          <view
                            v-for="(citem, ci) in detailItem.costList"
                            :key="ci"
                            class="citem-content"
                          >
                            <view
                              :class="{
                                active: isActive(detailItem),
                              }"
                              class="medical-item flex-between f28 color-444 flex1"
                            >
                              <view class="text-ellipsis mr8 label-medical">
                                {{ citem.subCostTypeName }}
                              </view>

                              <view class="color-888">
                                {{ `${citem.itemPrice}元/${citem.units}` }}
                              </view>
                              <view class="color-888">
                                {{ `x${citem.amount}` }}
                              </view>

                              <view class="text-no-wrap color-888">
                                {{ `${citem.subCost}元` }}
                              </view>
                            </view>
                          </view>
                        </view>
                        <view v-else>
                          <view
                            v-for="(citem, ci) in detailItem.costList"
                            :key="ci"
                            :class="{
                              mb8: ci !== detailItem.costList.length - 1,
                            }"
                            class="citem-content flex-normal"
                          >
                            <view class="item-content f28 color-444 flex1">
                              <view class="flex-between flex-start-r mb8">
                                <view class="flex1">
                                  {{ citem.subCostTypeName }}
                                </view>

                                <view>{{ citem.subCost }}元</view>
                              </view>

                              <view class="color-888 f24">
                                <text class="mr40">
                                  {{ `${citem.itemPrice}元/${citem.units}` }}
                                </text>
                                <text>
                                  {{ `x${citem.amount}` }}
                                </text>
                              </view>
                            </view>
                          </view>
                        </view>
                      </template>
                    </g-collapse>
                  </block>
                </view>
              </view>
              <!-- <view v-if="item.tips" class="row flex-normal">
            <view class="row-label color-888">提示</view>
            <view class="row-value g-break-word color-444">
              {{ item.totalCost }}元
            </view>
          </view>  -->
            </template>
          </g-collapse>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { GStores } from '@/utils';
  import {
    type IPayListItem,
    tradeType,
    TCostList,
    getIsMedicalTradeTypeDefault,
  } from '../utils/clinicPayDetail';
  import payDetailCostList from './PayDetailCostList.vue';

  const gStores = new GStores();

  const props = withDefaults(
    defineProps<{
      list: IPayListItem[];
      selUnPayList: IPayListItem[];
      isListShowClinicType?: boolean;
      isCheck?: boolean;
      // 药品配送
      isModeMedicalHelp?: boolean;
      isHidePrice?: boolean;
      systemModeOld?: boolean;
      isDisabledCostList?: boolean;
      isCanSelServerFee?: boolean;
    }>(),
    {
      selUnPayList: () => [],
    }
  );

  const listCollapseRef = ref();

  const emits = defineEmits(['sel-item', 'click-item', 'sel-deailt-item']);

  const selIds = computed(() => props.selUnPayList.map((o) => o.childOrder));

  const isActive = (item: TCostList[number]) => {
    if (props.selUnPayList.length && props.selUnPayList[0]?.costList) {
      return (
        props.selUnPayList[0].costList.findIndex(
          (o) => o.serialNo === item.serialNo
        ) !== -1
      );
    }
    return false;
  };
  const isItemDisabled = (item: TCostList[number]) => {
    return (
      item.executionFlag === '1' ||
      item.costList.every((o) => o.amountRem === '0')
    );
  };

  const getIsActive = (item: IPayListItem) => {
    console.log();

    return selIds.value.includes(item.childOrder);
  };

  const getIsAllDetailActive = (item: IPayListItem) => {
    return item?.costList?.length === props.selUnPayList[0]?.costList?.length;
  };

  const isPaySelfItem = (item: IPayListItem) => {
    return item.costTypeCode === '1';
  };
  const selDetailItem = (item, detailItem, idx) => {
    if (props.isCheck) {
      emits('sel-deailt-item', item, detailItem);
    } else {
      itemClick(item);
    }
  };

  const handleSecCollapseChange = (idx) => {
    listCollapseRef.value[idx].init();
  };

  const selItem = (item) => {
    if (props.isCheck) {
      emits('sel-item', item, 'notMerge');
    } else {
      itemClick(item);
    }
  };

  const itemClick = (item) => {
    console.log(111);

    emits('click-item', item);
  };
</script>

<style lang="scss" scoped>
  .clinic-pay-list {
    .item {
      background: #ffffff;
      border-radius: 8px;
      padding: 32rpx;
      align-items: flex-start;
      position: relative;
      border: 2rpx solid var(--hr-neutral-color-2);

      &:first-child {
        margin-top: 24rpx;
      }

      .icon-content {
        height: 100%;
        padding-top: 4rpx;

        .icon-mask {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 120rpx;
          left: -32rpx;
        }
      }

      .check-box-icon {
        font-size: var(--hr-font-size-xxl);
        line-height: var(--hr-font-size-base);
        position: relative;
        top: 7rpx;
        margin-right: 22rpx;
        color: var(--hr-neutral-color-7);
      }

      .content {
        flex: 1;
        position: relative;

        .type-block {
          font-weight: normal;
          border-radius: 4rpx;
          padding: 4rpx 12rpx;
          position: relative;
          top: -5rpx;
          &.pay-medical {
            background: #747c94;
            color: #ffe2c1;
          }

          &.pay-self {
            background: #ffe2c1;
            color: #51555e;
          }
        }

        .item-box {
          //   margin-top: 24rpx;
        }

        .row {
          margin-bottom: 8rpx;
          .row-label {
            width: 130rpx;
          }

          .row-value {
            flex: 1;
          }
        }
      }

      &.active {
        border-color: var(--hr-brand-color-6);
        .check-box-icon {
          color: var(--hr-brand-color-6);
        }
      }
    }
  }

  .system-mode-old {
    .item {
      .content {
        .row {
          .row-label {
            width: 160rpx;
          }
        }
      }
    }
  }
  .collapse {
    transform: rotate(90deg);
  }
  .expand {
    transform: rotate(-90deg);
  }
  .collapse-title {
    width: 100%;
    padding: 24rpx 0;

    .item-fee {
      margin: 0 12rpx;
    }
  }

  .item-content {
    border-radius: 4px;
    padding: 16rpx 24rpx;
    transition: all;
  }
  .item-content-detail {
    background: var(--hr-neutral-color-1);
    border-radius: 4px;
    padding: 0 24rpx;
    margin: 8rpx 0;
    transition: all;

    &.active {
      background: var(--hr-brand-color-1);
    }
  }

  .medical-content {
    .medical-item {
      @extend .item-content;

      margin-bottom: 12rpx;

      .label-medical {
        width: 33%;
      }
    }
  }

  .citem-content {
    display: flex;
    align-items: center;
  }

  .cost-item-nochild {
    padding: 16rpx 0;
  }

  .sel-icon {
    font-weight: normal;
    font-size: var(--h-size-40);
    border-radius: 100%;
  }
</style>
