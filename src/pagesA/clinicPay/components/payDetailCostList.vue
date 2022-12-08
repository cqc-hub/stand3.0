<template>
  <view class="">
    <view v-for="(item, idx) in list" :key="idx" class="">
      <block v-if="item.costList && item.costList.length">
        <g-collapse :border="false">
          <template #title>
            <view class="collapse-title flex-between g-bold">
              <view v-if="mulit" class="flex1 f32 flex-normal">
                <view @click.stop="selItem(item)" class="flex-normal">
                  <text
                    :class="{
                      'color-blue': isActive(item),
                    }"
                    class="iconfont sel-icon mr12"
                  >
                    {{ isActive(item) ? '&#xe6d0;' : '&#xe6ce;' }}
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
                :class="{
                  active: isActive(item),
                }"
                class="medical-item flex-between f28 color-444"
              >
                <view class="text-ellipsis mr8 label-medical">
                  {{ citem.subCostTypeName }}
                </view>

                <view class="color-888">
                  {{ `${citem.itemPrice}元/${citem.units}` }}
                </view>
                <view class="color-888">{{ `x${citem.amount}` }}</view>

                <view class="text-no-wrap color-888">
                  {{ `${citem.subCost}元` }}
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
              >
                <view
                  :class="{
                    active: isActive(item),
                  }"
                  class="item-content f28 color-444"
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
                    <text>{{ `x${citem.amount}` }}</text>
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
  import { computed, ref } from 'vue';
  import { type TCostList } from '../utils/clinicPayDetail';

  const props = defineProps<{
    list: TCostList;
    selList: TCostList;
    mulit: boolean;
  }>();
  const emits = defineEmits(['sel-item']);

  const isActive = (item: TCostList[number]) => {
    return props.selList.findIndex((o) => o.serialNo === item.serialNo) !== -1;
  };

  const selItem = (item) => {
    emits('sel-item', item);
  };
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

    &.active {
      background: var(--hr-brand-color-1);
    }
  }

  .medical-content {
    .medical-item {
      @extend .item-content;

      margin-bottom: 24rpx;

      .label-medical {
        width: 33%;
      }
    }
  }

  .cost-item-nochild {
    padding: 16rpx 0;
  }

  .sel-icon {
    font-weight: normal;
    font-size: 40rpx;
  }
</style>
