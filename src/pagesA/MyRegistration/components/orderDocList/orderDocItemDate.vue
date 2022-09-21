<template>
  <view>
    <Order-Doc-List-Container :item="item">
      <template #footer>
        <view>
          <view
            v-for="(_item, i) in item.schemeList"
            :key="i"
            @click="schemeClick(_item)"
            class="scheme-item"
          >
            <view class="scheme-item-ampm-name">{{ _item.ampmName }}</view>
            <view class="scheme-item-detail">
              <view class="scheme-item-detail-num">
                <text>总{{ _item.numCount }}个</text>
                <text>剩{{ _item.numRemain }}个</text>
              </view>

              <button class="btn btn-primary btn-reg">挂号</button>
            </view>
          </view>
        </view>
      </template>
    </Order-Doc-List-Container>
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive } from 'vue';
  import { IDocListByDate } from '../../utils';
  import dayjs from 'dayjs';

  import OrderDocListContainer from './orderDocListContainer.vue';
  type IItem = IDocListByDate['schDateList'][number]['schemeList'][number];
  const props = defineProps<{
    item: IItem;
  }>();

  const schemeClick = (item: IItem['schemeList'][number]) => {
    console.log({
      item,
      pItem: props.item
    });
  };
</script>

<style lang="scss" scoped>
  .scheme-item {
    background-color: var(--hr-brand-color-1);
    border-radius: 8rpx;
    padding: 18rpx 24rpx;

    display: flex;
    align-items: center;
    justify-content: space-between;

    .scheme-item-ampm-name {
      font-weight: 600;
      font-size: var(--hr-font-size-xs);
    }

    .scheme-item-detail {
      display: flex;
      align-items: center;

      .scheme-item-detail-num {
        color: var(--hr-neutral-color-7);
        font-size: var(--hr-font-size-xxxs);
        > text {
          margin-right: 12rpx;
        }
      }

      .btn-reg {
        font-size: var(--hr-font-size-xxs);
        height: 48rpx;
        border-radius: 28rpx;
        display: flex;
        align-items: center;
      }
    }
  }
</style>
