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
                  'collapse-header-close': !arrowBottom,
                  'collapse-unfinished': isActive(item),
                }"
                class="pl24 pr24 pt32 pb32 bg-white animate__animated relative collapse-header"
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
                    &#xe6c8;
                  </view>
                </view>

                <view v-if="item.tip" class="g-break-word f28 color-warn">
                  {{ item.tip }}
                </view>
              </view>
            </template>

            <view class="bg-white p24 pb32 collapse-content f28 row">
              <view
                v-for="col in column"
                :key="col.key"
                :class="{
                  'address-content': col.key === 'address',
                }"
                :style="{
                  'background-image':
                    (col.key === 'address' &&
                      `url(${
                        globalGl.BASE_IMG + 'stand3-guide-location-bg.png'
                      })`) ||
                    '',
                }"
              >
                <view v-if="item[col.key]" class="flex justify-start relative">
                  <view class="color-888 mr16 text-no-wrap label">
                    {{ col.label }}
                  </view>
                  <view
                    class="g-break-word relative flex flex-between items-start"
                  >
                    <text class="">
                      {{ item[col.key] || '' }}
                    </text>

                    <text
                      v-if="col.key === 'address'"
                      class="text-no-wrap color-blue mr12 location-tip"
                    >
                      带我去
                    </text>
                  </view>
                </view>
              </view>
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
  import globalGl from '@/config/global';

  const props = withDefaults(
    defineProps<{
      list: any[];
    }>(),
    {
      list: () => [
        {
          title: '诊区签到',
          status: '1',
          tip: '缴费成功，请到分诊台签到取号',
          hosName: '朝晖院区',
          deptName: '皮肤-脱发专科-专家号',
          _orderTime: '2022-09-15  下午16:00  24号',
          address:
            '门诊三楼A区门诊三门门诊三楼A区门诊三楼A区门诊三门门诊三楼A区',
        },
        {
          title: '诊区签到233',
          status: '1',
          hosName: '朝晖院区',
          deptName:
            '皮肤-脱发专科-专家号皮肤-脱发专科-专家号皮肤-脱发专科-专家号皮肤-脱发专科-专家号',
          _orderTime:
            '2022-09-152022-09-152022-09-152022-09-152022-09-152022-09-15  下午16:00  24号',
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
          title: '诊区签到666',
          status: '0',
        },
      ],
    }
  );

  const isActive = (item) => {
    return item.status === '1';
  };

  const column = ref([
    {
      label: '院区',
      key: 'hosName',
    },
    {
      label: '科室号别',
      key: 'deptName',
    },
    {
      label: '预约时间',
      key: '_orderTime',
    },
    {
      label: '医生',
      key: 'docName',
    },
    {
      label: '就诊地点',
      key: 'address',
    },
  ]);

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
  $r: 12px;

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
    border: 0.5px solid #e6e6e6;

    &.collapse-unfinished {
      background: linear-gradient(180deg, #e9f0ff, #ffffff);
      &::before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 24rpx;
        right: 24rpx;
        height: 2px;
        background-color: var(--hr-brand-color-6);
      }
    }

    &.collapse-header-open {
      border-bottom: none;
      border-radius: $r $r 0 0;
    }

    &.collapse-header-close {
      @keyframes headerCloseAction {
        0% {
          border-radius: $r $r 0 0;
          border-bottom: none;
        }

        100% {
          border-radius: $r;
          border: 0.5px solid #e6e6e6;
        }
      }

      animation-name: headerCloseAction;
      animation-delay: 0.28s;
      animation-duration: 0.3s;
    }
  }

  .collapse-content {
    border: 0.5px solid #e6e6e6;
    border-radius: 0 0 $r $r;
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

  .row {
    line-height: 72rpx;
    .label {
      width: 4em;
    }

    .address-content {
      background-position: top right;
      background-repeat: no-repeat;
      background-size: auto 72rpx;
    }
  }

  .location-bg {
    height: 72rpx;
    position: absolute;
    right: 0;
  }

  .location-tip {
    margin-left: 1.5em;
  }
</style>
