<template>
  <view class="menu mr24">
    <!-- :class="{
          'g-border-bottom': list.length > 1 && i !== list.length - 1,
        }" -->
    <view
      v-for="(item, i) in list"
      :key="'menu' + i"
      @click="itemClick(item)"
      class="g-border-bottom"
    >
      <view class="p32 flex-between">
        <view class="flex-normal">
          <view :class="[item.iconfont]" class="icon-font menu-icon mr16" />

          <view>
            <view class="g-bold title f32">{{ item.title }}</view>
            <view v-if="item.detail" class="f24 color-888">
              {{ item.detail }}
            </view>
          </view>
        </view>

        <view>
          <view class="icon-font ico_arrow"></view>
        </view>
      </view>
    </view>

    <view v-if="x.requestId" class="p32c pb24">
      <Evaluate-Btn1 :requestId="x.requestId" />
    </view>
  </view>
</template>

<script>
  import { useToPath } from '@/common/checkJump';
  import EvaluateBtn1 from './EvaluateBtn1.vue';
  export default {
    props: {
      list: {
        type: Array,
        default: () => [],
      },
      x: {
        type: Object,
        default: () => ({}),
      },
    },

    methods: {
      itemClick(item) {
        useToPath(item);
      },
    },

    components: {
      EvaluateBtn1,
    },
  };
</script>

<style lang="scss" scoped>
  .menu {
    background-color: #e8f4ff;
    border-radius: 0px 8px 8px 8px;
    width: 85vw;

    .title {
      line-height: 32rpx;
    }

    .menu-icon {
      width: 100rpx;
      height: 100rpx;
    }

    .ico_arrow {
      width: 24px;
      height: 24px;
    }
  }
</style>
