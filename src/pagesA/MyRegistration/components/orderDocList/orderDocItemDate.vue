<template>
  <view>
    <Order-Doc-List-Container
      :item="item"
      @avatar-click="emits('avatar-click', item)"
    >
      <template #footer>
        <view>
          <view
            v-for="(_item, i) in item.schemeList"
            :key="i"
            class="scheme-item"
          >
            <view class="scheme-item-ampm-name">
              <view class="ampm-name">{{ _item.ampmName }}</view>
              <view class="ampm-fee">{{ _item.fee }}元</view>
            </view>
            <view class="scheme-item-detail">
              <view class="scheme-item-detail-num">
                <text>总{{ _item.numCount }}个</text>
                <text v-if="!(_item.schState in warnSchStateMap)">
                  剩{{ _item.numRemain }}个
                </text>
              </view>

              <view
                v-if="_item.schState in warnSchStateMap"
                class="f26 g-bold color-888"
              >
                {{ warnSchStateMap[_item.schState] }}
              </view>
              <g-login v-else @handler-next="regClick(_item)" patient>
                <button
                  class="btn btn-primary btn-reg"
                  @click="regClick(_item)"
                >
                  挂号
                </button>
              </g-login>
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
  const emits = defineEmits(['reg-click', 'avatar-click']);
  type IItem = IDocListByDate['schDateList'][number]['schemeList'][number];
  const props = defineProps<{
    item: IItem;
  }>();

  const warnSchStateMap = {
    1: '停诊',
    2: '约满',
    3: '未放号',
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

    &:not(:last-child) {
      margin-bottom: 8rpx;
    }
  }
</style>
