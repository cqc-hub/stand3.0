<template>
  <view class="page">
    <scroll-view class="container" scroll-y>
      <view>
        <view class="title g-border-bottom text-ellipsis">
          {{ subType || '常见问题' }}
        </view>
        <service-List
          :list="list"
          :rowStyle="getRowStyle"
          @item-click="itemClick"
        />
      </view>
    </scroll-view>

    <view class="footer" v-if="!getLv">
      <view class="g-border-right">
        <view class="iconfont icon-kefu">&#xe6e2;</view>
        <view>
          <view class="title">咨询客服</view>
          <view class="desc">请在工作时间咨询</view>
        </view>
      </view>

      <view>
        <view class="iconfont icon-kefu">&#xe6b9;</view>
        <view>
          <view class="title">意见反馈</view>
          <view class="desc">我们会尽快给予回复</view>
        </view>
      </view>
    </view>
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import api from '@/service/api';

  import serviceList from './components/serviceList.vue';
  import { ISecondItemService } from './utils/index';

  // api.getSubTypeList = () =>
  //   Promise.resolve({
  //     code: 0,
  //     respCode: 999002,
  //     message: 'success',
  //     result: ['注册相关', '忘记密码'],
  //   });

  // api.getCmsListBySubType = () =>
  //   Promise.resolve({
  //     code: 0,
  //     respCode: 999002,
  //     message: 'success',
  //     result: [
  //       {
  //         id: 421,
  //         typeId: '4',
  //         title: '怎么注册？',
  //         titleImg: '',
  //         subType: '注册相关',
  //         informationLink: '',
  //         source: '客服',
  //         createTime: '2022-05-24',
  //       },
  //     ],
  //   });

  const props = defineProps<{
    subType?: string;
  }>();
  const subType = props.subType && decodeURIComponent(props.subType!);

  const list = ref<(string | ISecondItemService)[]>([]);

  // true 二级
  const getLv = computed(() => !!props.subType);
  const getRowStyle = computed(() => {
    if (getLv.value) {
      return 'padding: 28rpx 32rpx 20rpx; color: var(--hr-neutral-color-9); font-size: var(--hr-font-size-base);';
    } else {
      return 'padding: 28rpx 32rpx 20rpx; color: var(--hr-neutral-color-10); font-size: var(--hr-font-size-xl);';
    }
  });

  onLoad((q) => {
    init();
  });

  const getFirstList = async () => {
    const { result } = await api.getSubTypeList({});

    list.value = result;
  };

  const getSecondList = async () => {
    const { result } = await api.getCmsListBySubType({
      subType,
    });
    list.value = result;

    console.log({
      result,
    });
  };

  const init = () => {
    if (getLv.value) {
      getSecondList();
    } else {
      getFirstList();
    }
  };

  const itemClick = ({
    item,
  }: {
    item: { target: string | ISecondItemService };
  }) => {
    const { target } = item;

    if (typeof target === 'string') {
      uni.navigateTo({
        url: `/pagesA/serviceCenter/serviceCenter?subType=${encodeURIComponent(
          target
        )}`,
      });
    } else {
      const { id, informationLink } = target;
      console.log(target);

      if (informationLink) {
        uni.navigateTo({
          url: `/pagesA/webView/webView?https=${encodeURIComponent(
            informationLink
          )}`,
        });
      } else {
        uni.navigateTo({
          url: '/pagesA/serviceCenter/serviceCenterDetail?id=' + id,
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .page {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--hr-neutral-color-1);

    .container {
      flex: 1;
      height: 1px;
      .title {
        background-color: #fff;

        padding: 24rpx 32rpx;
        padding-top: 40rpx;
        font-weight: 600;
        font-size: var(--hr-font-size-xxl);
      }
    }

    .footer {
      display: flex;
      background-color: #fff;
      box-shadow: 16rpx 0 30rpx rgba($color: #000, $alpha: 0.06);
      font-size: var(--hr-font-size-xl);
      > view {
        flex: 1;
        padding: 24rpx 0;
        display: flex;
        justify-content: center;
        border-radius: 0;

        box-sizing: content-box;
        padding-bottom: 68rpx;

        &:after {
          border: none;
        }
      }

      .icon-kefu {
        font-size: 56rpx;
        color: var(--hr-neutral-color-10);
        margin-right: 8rpx;
      }

      .title {
        font-weight: 600;
      }
      .desc {
        font-size: 20rpx;
        color: var(--hr-neutral-color-7);
      }
    }
  }
</style>
