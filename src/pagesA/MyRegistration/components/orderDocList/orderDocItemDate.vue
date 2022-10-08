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
            <view class="scheme-item-ampm-name">
              <view class="ampm-name">{{ _item.ampmName }}</view>
              <view class="ampm-fee">{{ _item.fee }}元</view>
            </view>
            <view class="scheme-item-detail">
              <view class="scheme-item-detail-num">
                <text>总{{ _item.numCount }}个</text>
                <text>剩{{ _item.numRemain }}个</text>
              </view>

              <button class="btn btn-primary btn-reg" @click="regClick(_item)">
                挂号
              </button>
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
  const emits = defineEmits(['reg-click']);
  type IItem = IDocListByDate['schDateList'][number]['schemeList'][number];
  const props = defineProps<{
    item: IItem;
  }>();

  const schemeClick = (item: IItem['schemeList'][number]) => {
    // console.log({
    //   item,
    //   pItem: props.item,
    // });
  };

  const regClick = (scheme: IItem['schemeList'][number]) => {
    emits('reg-click', {
      scheme,
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
      display: flex;

      .ampm-name {
        margin-right: 40rpx;
      }
      .ampm-fee {
        color: var(--hr-error-color-6);
      }
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
        padding: 0 24rpx;
      }
    }
  }
</style>
