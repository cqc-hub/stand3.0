<template>
  <view class="progress">
    <view
      v-for="(item, i) in list"
      :key="i"
      :class="{
        pb24: i !== list.length - 1,
      }"
      class="progress-item relative"
    >
      <view v-if="i !== list.length - 1" class="progress-line" />

      <view class="flex">
        <view
          :class="{
            ['bg-blue']: isActive(item),
          }"
          class="progress-number flex items-center justify-center relative f26 color-fff mr12"
        >
          {{ list.length - i }}
        </view>

        <view class="flex-1">
          <g-collapse ref="collapseRef" :border="false" open>
            <template #header="{ isShow: arrowBottom }">
              <view
                :class="{
                  'collapse-header-open': arrowBottom,
                }"
                class="pl24 pr24 pt32 pb32 bg-white collapse-header"
              >
                <view class="flex items-center">
                  <view class="f40">{{ item.title }}</view>
                  <view class="flex-1"></view>
                  <view v-if="item.status === '0'" class="mr60">
                    <Tag-Status
                      color="#B0F0DF"
                      text-color="#00B39E"
                      text="已完成"
                    />
                  </view>
                  <view
                    :class="{
                      arrowBottom,
                    }"
                    class="iconfont right-icon color-888 f48"
                  >
                    &#xe66b;
                  </view>
                </view>

                <view v-if="item.tip" class="g-break-word f28 color-warn">
                  {{ item.tip }}
                </view>
              </view>
            </template>

            <view>
              233
              <view class="safe-height"></view>
              <view class="safe-height"></view>
              <view class="safe-height"></view>
            </view>
          </g-collapse>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { watch, ref } from 'vue';
  import TagStatus from './TagStatus.vue';

  const props = withDefaults(
    defineProps<{
      list: any[];
    }>(),
    {
      list: () => [
        {
          title: '诊区签到',
          status: '0',
          tip: '缴费成功，请到分诊台签到取号',
        },
        {
          title: '诊区签到233',
          status: '1',
        },
        {
          title: '诊区签到444',
          status: '0',
        },
        {
          title: '诊区签到555',
          status: '1',
        },
        {
          title: '诊区签到666',
          status: '0',
        },
        {
          title: '诊区签到777',
          status: '1',
        },
        {
          title: '诊区签到',
          status: '0',
        },
        {
          title: '诊区签到233',
          status: '1',
        },
        {
          title: '诊区签到444',
          status: '0',
        },
        {
          title: '诊区签到555',
          status: '1',
        },
        {
          title: '诊区签到666',
          status: '0',
        },
        {
          title: '诊区签到777',
          status: '1',
        },
      ],
    }
  );

  const isActive = (item) => {
    return item.status === '0';
  };

  const collapseRef = ref(<any>'');
  watch(
    () => props.list,
    () => {
      collapseRef.value &&
        collapseRef.value.map((inst) => {
          inst.init();
        });
    }
  );
</script>

<style lang="scss" scoped>
  .progress {
    .progress-number {
      width: 40rpx;
      height: 40rpx;
      background: #bbbbbb;
      border-radius: 100px;
    }

    .progress-line {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 20rpx;
      width: 1rpx;
      border-left: 1px dashed #cccccc;
      z-index: 0;
    }
  }

  .collapse-header {
    $r: 12px;
    border: 0.5px solid #e6e6e6;
    border-radius: $r;

    &.collapse-header-open {
      border-bottom: none;
      border-radius: $r $r 0 0;
    }
  }

  .right-icon {
    transform: rotate(90deg);
    transition: 0.4s all;
    position: relative;
    // right: 0upx;

    &.arrowBottom {
      transform: rotate(-90deg);
    }
  }
</style>
