<template>
  <view class="">
    <view v-for="(item, idx) in list" :key="idx" class="">
      <block v-if="item.costList && item.costList.length">
        <g-collapse :border="false">
          <template #title>
            <view class="collapse-title flex-between g-bold">
              <view class="flex1 f32">{{ item.subCostTypeName }}</view>

              <view class="item-fee">{{ item.subCost }}元</view>
            </view>
          </template>

          <template #default>
            <view
              v-if="item.subCostTypeCode === '4'"
              :class="{
                'less-content': item.costList.length < 3,
              }"
              class="medical-content flex-between"
            >
              <view
                v-for="(citem, ci) in item.costList"
                :key="ci"
                class="medical-item flex-normal f28"
              >
                <view class="text-ellipsis color-444 mr8">
                  {{ citem.subCostTypeName }}
                </view>

                <view class="text-no-wrap color-888">
                  {{ `${citem.amount}${citem.units}` }}
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
                <view class="item-content f28 color-444">
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
  import { defineComponent, ref } from 'vue';
  import { TCostList } from '../utils/clinicPayDetail';

  defineProps<{
    list: TCostList;
  }>();
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
  }

  .medical-content {
    @extend .item-content;
    padding: 24rpx;

    flex-wrap: wrap;

    .medical-item {
      width: 46%;

      margin-bottom: 24rpx;
    }
  }

  .less-content {
    padding-bottom: 0;
  }

  .cost-item-nochild {
    padding: 16rpx 0;
  }
</style>
