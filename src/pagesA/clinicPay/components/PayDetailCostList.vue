<template>
  <view class="">
    <view v-for="(item, idx) in list" :key="idx" class="">
      <block v-if="item.costList && item.costList.length">
        <g-collapse ref="collapseRef" :border="false">
          <template #title>
            <view class="collapse-title flex-between g-bold">
              <view v-if="mulit || mulitChildren" class="flex1 f32 flex-normal">
                <view @click.stop="selItem(item, idx)" class="flex-normal">
                  <text
                    :class="{
                      'color-blue': isActive(item) || isActiveItemNums(item),
                      'color-888': isItemDisabled(item),
                    }"
                    class="sel-icon mr12 iconfont animate__animated animate__fadeIn"
                  >
                    {{
                      isActiveItemNums(item)
                        ? isActiveItemNums(item) === item.costList.length
                          ? '&#xe6d0;'
                          : '&#xe6e6;'
                        : isActive(item)
                        ? '&#xe6d0;'
                        : '&#xe6ce;'
                    }}
                  </text>

                  <text>
                    {{ item.subCostTypeName }}
                  </text>
                </view>
              </view>

              <view v-else class="flex1 f32">
                {{ item.subCostTypeName }}
              </view>

              <view class="item-fee">{{ item.subCost }}元</view>
            </view>
          </template>

          <template #default>
            <view
              v-if="item.subCostTypeCode === 'chineseMedicine'"
              class="medical-content"
            >
              <view
                v-for="(citem, ci) in item.costList"
                :key="ci"
                class="citem-content"
              >
                <view v-if="mulitChildren">
                  <text
                    :class="{
                      'color-blue': isChildrenActive(citem),
                      'color-888': citem.disabled,
                    }"
                    class="sel-icon mr12 ml12 iconfont animate__animated animate__fadeIn"
                  >
                    {{ isChildrenActive(citem) ? '&#xe6d0;' : '&#xe6ce;' }}
                  </text>
                </view>

                <view
                  :class="{
                    active: isActive(item) || isChildrenActive(citem),
                  }"
                  @click="selChildren([citem])"
                  class="medical-item flex-between f28 color-444 flex1"
                >
                  <view class="text-ellipsis mr8 label-medical">
                    {{ citem.subCostTypeName }}
                  </view>

                  <view class="color-888">
                    {{ `${citem.itemPrice}元/${citem.units}` }}
                  </view>
                  <view class="color-888">
                    {{ `x${mulitChildren ? citem.amountRem : citem.amount}` }}
                  </view>

                  <view class="text-no-wrap color-888">
                    {{ `${citem.subCost}元` }}
                  </view>
                </view>
              </view>
            </view>

            <view v-else>
              <view
                v-for="(citem, ci) in item.costList"
                :key="ci"
                :class="{
                  mb8: ci !== item.costList.length - 1,
                }"
                @click="selChildren([citem])"
                class="citem-content flex-normal"
              >
                <view v-if="mulitChildren">
                  <text
                    :class="{
                      'color-blue': isChildrenActive(citem),
                      'color-888': citem.disabled,
                    }"
                    class="sel-icon mr12 ml12 iconfont animate__animated animate__fadeIn"
                  >
                    {{ isChildrenActive(citem) ? '&#xe6d0;' : '&#xe6ce;' }}
                  </text>
                </view>

                <view
                  :class="{
                    active: isActive(item) || isChildrenActive(citem),
                  }"
                  class="item-content f28 color-444 flex1"
                >
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
                      {{ `x${mulitChildren ? citem.amountRem : citem.amount}` }}
                    </text>
                  </view>
                </view>
              </view>
            </view>
          </template>
        </g-collapse>
      </block>

      <block v-else>
        <view class="collapse-title flex-between cost-item-nochild">
          <view class="flex1 f32">{{ item.subCostTypeName }}</view>

          <view class="item-fee g-bold">{{ item.subCost }}元</view>
        </view>
      </block>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { watch, ref } from 'vue';
  import {
    type TCostList,
    compareDetailCostItem,
  } from '../utils/clinicPayDetail';

  const props = defineProps<{
    list: TCostList;
    selList: TCostList;
    selListChildren: TCostList[number]['costList'];
    mulit: boolean;
    mulitChildren: boolean;
  }>();
  const emits = defineEmits(['sel-item', 'sel-children']);

  const isActive = (item: TCostList[number]) => {
    return (
      props.mulit &&
      props.selList.findIndex((o) => o.serialNo === item.serialNo) !== -1
    );
  };

  const isItemDisabled = (item: TCostList[number]) => {
    return item.costList.every((o) => o.amountRem === '0');
  };

  const isChildrenActive = (citem: TCostList[number]['costList'][number]) => {
    return (
      props.selListChildren.findIndex((o) =>
        compareDetailCostItem(citem, o)
      ) !== -1
    );
  };

  const isActiveItemNums = (item: TCostList[number]) => {
    const fList = item.costList.filter((o) => isChildrenActive(o));
    return fList.length;
  };

  const selChildren = (list: TCostList[number]['costList']) => {
    if (props.mulitChildren) {
      emits('sel-children', {
        list,
      });
    }
  };

  const selItem = (item: TCostList[number], idx) => {
    if (props.mulitChildren) {
      selChildren(item.costList);
      return;
    }

    emits('sel-item', {
      item,
      index: idx,
    });
  };

  const collapseRef = ref(<any>'');
  watch(
    () => props.mulitChildren,
    () => {
      collapseRef.value &&
        collapseRef.value.map((inst) => {
          inst.init();
        });
    }
  );
</script>

<style lang="scss" scoped>
  .collapse-title {
    width: 100%;
    padding: 24rpx 0;

    .item-fee {
      margin: 0 12rpx;
    }
  }

  .item-content {
    background: var(--hr-neutral-color-1);
    border-radius: 4px;
    padding: 16rpx 24rpx;
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
