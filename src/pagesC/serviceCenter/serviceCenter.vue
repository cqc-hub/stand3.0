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
  import { onShow } from '@dcloudio/uni-app';
  import { TListComPlain } from './utils';
  import { GStores, useTBanner } from '@/utils';

  import api from '@/service/api';

  import ComplaintList from './components/ComplaintList.vue';
  const _props = defineProps<{
    selectRecords?: '1'; // 需要选择就诊记录---台州?
    tab?:string;//手动添加选择就诊记录页面的tab内容
  }>();
  const gStores = new GStores();
  const isComplete = shallowRef(false);
  const list = ref<TListComPlain>([]);

  const goComplaint = () => {
    if (_props?.selectRecords === '1') {
      let extraData = {
        sysCode: gStores.globalStore.sysCode,
        pageType: '2',
      };
      _props?.tab&&(extraData[`tab`]=_props.tab)
      useTBanner(
        {
          type: 'h5',
          isSelfH5: '1',
          path: 'pagesC/queryCase/queryCase',
          extraData: extraData,
          addition: {
            herenId: 'herenId',
          },
        },
        'navigateTo'
      );
    } else {
      uni.navigateTo({
        url: '/pagesC/serviceCenter/serviceComplaint',
      });
    }
  };

  const getList = async () => {
    isComplete.value = false;

    const { result } = await api.getComplainsList({}).finally(() => {
      isComplete.value = true;
    });

    list.value = result || [];
  };

  const itemClick = (item: TListComPlain[number]) => {
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

  onShow(() => {
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
