<template>
  <view class="g-border-top mt12 w100p lineH48">
    <view
      v-for="(item,index) in showList"
      :key="`recommendAddress${index}`"
      @click="itemClick(item)"
      class="flex-between content pt32 pb32 g-border-bottom"
    >
      <view class="flex1 mr48 g-break-word">
        <view>
          <text class="f32">{{ item.question }}</text>
        </view>
        <text class="icon-font ico_location2 mr8 address-icon"></text>
        <text class="color-666 f26">{{ item.answer }}</text>
      </view>

      <view class="flex-normal f26 color-blue">
        <text class="g-bold">去这里</text>
        <text class="iconfont f40 arrow-icon">&#xe66b;</text>
      </view>
    </view>

    <view
      v-if="!isShowMore && list.length > 10"
      @click="isShowMore = true"
      class="color-blue g-flex-rc-cc pt12"
    >
      查看更多
    </view>
  </view>
</template>

<script>
  import { useToPath } from '@/common/checkJump';

  export default {
    props: {
      list: {
        type: Array,
        default: () => [],
      },
    },

    data() {
      return {
        isShowMore: false,
      };
    },

    computed: {
      showList({ isShowMore }) {
        return this.list.filter((o, i) => i < 10 || isShowMore);
      },
    },

    methods: {
      itemClick(item) {
        useToPath(item);
      },
    },

    components: {},
  };
</script>

<style lang="scss" scoped>
  .content {
    align-items: flex-start;
  }
  .address-icon {
    transform: translate(0, 5rpx);
  }

  .arrow-icon {
    line-height: 26rpx;
  }
  .lineH48{
  line-height: 48rpx;
}
</style>
