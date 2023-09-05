<template>
  <view class="g-page">
    <view class="g-container">
      <block v-if="isComplete">
        <Complaint-List
          v-if="list.length"
          :list="list"
          @item-click="itemClick"
        />

        <view v-else class="empty-list">
          <g-empty noTransformY />
        </view>
      </block>
    </view>

    <g-message />

    <view class="g-footer">
      <button
        @click="goComplaint"
        class="btn btn-primary btn-plain btn-border flex1"
      >
        <text class="iconfont icon-kefu">&#xe6e2;</text>
        <text>我要反馈</text>
      </button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { shallowRef, ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import { TListComPlain } from './utils';
  import { GStores, type TButtonConfig, useTBanner } from '@/utils';

  import api from '@/service/api';

  import ComplaintList from './components/ComplaintList.vue';

  const gStores = new GStores();
  const isComplete = shallowRef(false);
  const list = ref<TListComPlain>([]);

  const goComplaint = () => {
    uni.navigateTo({
      url: '/pagesC/serviceCenter/serviceComplaint',
    });
  };

  const getList = async () => {
    isComplete.value = false;

    const { result } = await api.getComplainsList({}).finally(() => {
      isComplete.value = true;
    });

    list.value = result || [];
  };

  const itemClick = (item: TListComPlain[number]) => {
    console.log(item);
    useTBanner({
      type: 'h5',
      isSelfH5: '1',
      path: 'pagesC/serviceCenter/serviceChat',
      // isLocal: '1',
      extraData: {
        id: item.id,
      },
      addition: {
        herenId: 'herenId',
      },
    });
  };

  const init = async () => {
    getList();
  };

  onLoad(() => {
    init();
  });
</script>

<style lang="scss" scoped>
  .icon-kefu {
    font-size: 56rpx;
    line-height: 32rpx;
    margin-right: 8rpx;
  }
</style>
