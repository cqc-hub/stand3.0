<template>
  <view class="">
    <view v-for="(item, idx) in list" :key="idx" class="">
      <block v-if="item.costList && item.costList.length">
        <List-Collapse :border="false">
          <template #title>
            <view class="collapse-title flex-between g-bold">
              <view class="flex1 f32">{{ item.subCostTypeName }}</view>

              <view class="item-fee">{{ item.subCost }}元</view>
            </view>
          </template>

          <template #default>
            <view>
              <view
                v-for="(citem, ci) in item.costList"
                :key="citem.subCostTypeCode"
                :class="{
                  mb8: ci !== item.costList.length - 1,
                }"
              >
                <view v-if="1" class="item-content f28 color-444">
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
        </List-Collapse>
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
  import { defineComponent, ref } from 'vue';
  import { TCostList } from '../utils/clinicPayDetail';

  import ListCollapse from './payDetailCostListCollapse.vue';

  const props = defineProps<{
    list: TCostList;
  }>();
</script>

<style lang="scss" scoped>
  .collapse-title {
    width: 100%;

    .item-fee {
      margin: 0 12rpx;
    }
  }

  .item-content {
    background: var(--hr-neutral-color-1);
    border-radius: 4px;
    padding: 16rpx 24rpx;
  }

  .cost-item-nochild {
    padding: 16rpx 0;
  }
</style>
