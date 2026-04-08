<template>
  <view class="">
    <block v-if="list.length">
      <view
        v-for="(item, i) in list"
        :key="item.hosDocId"
        :class="{
          mb24: i !== list.length - 1,
          pt32: !i,
        }"
      >
        <OrderDocListContainer
          :item="item"
          :pageConfig="pageConfig"
          @avatar-click="avatarClick"
          isHideGoodAt
          isShowDeptName
        >
          <template #footer>
            <view>
              <view
                @click="avatarClick(item)"
                class="flex mb12"
                v-if="item.clinicTime"
              >
                <text class="color-fff ico_major pr12 pl12 tags mr12">
                  就诊提醒
                </text>
                <view class="flex-1">
                  <rich-text
                    v-if="item.goodAt"
                    class="color-888 f28 text-ellipsis ellipsis-line-clamp1"
                    :nodes="
                      HTMLParser(
                        throughCharacterLineFeed(item.clinicTime, '\n')
                      )
                    "
                  />
                </view>
              </view>
              <view @click="avatarClick(item)" class="flex">
                <text class="icon-font ico_major good_at_icon mr12" />
                <view class="flex-1">
                  <rich-text
                    v-if="item.goodAt"
                    class="color-888 f28 text-ellipsis ellipsis-line-clamp2"
                    :nodes="
                      HTMLParser(throughCharacterLineFeed(item.goodAt, '\n'))
                    "
                  />
                </view>
              </view>
            </view>
          </template>
        </OrderDocListContainer>
      </view>
    </block>

    <view class="empty-list" v-else>
      <g-empty :current="1" />
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { IDocResItem } from '../../utils/RegSearch';
  import HTMLParser from '@/common/html-parser';
  import { throughCharacterLineFeed, type ISystemConfig } from '@/utils';

  import OrderDocListContainer from '../orderDocList/OrderDocListContainer.vue';

  defineProps<{
    list: IDocResItem[];
    pageConfig: ISystemConfig['order'];
  }>();

  const emits = defineEmits(['item-click']);

  const avatarClick = (item: IDocResItem) => {
    emits('item-click', item);
  };
</script>

<style lang="scss" scoped>
  .good_at_icon {
    width: 60rpx;
    height: 24rpx;
    position: relative;
    top: 4rpx;
    flex-basis: 60rpx;
  }
  .tags {
    background: var(--hr-brand-color-6);
    border-radius: 4rpx;
    padding: 0 4rpx;
    // line-height: 42rpx;
  }
</style>
