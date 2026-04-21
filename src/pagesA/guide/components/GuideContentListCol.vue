<template>
  <view class="row">
    <view v-if="cols && cols.length" class="relative">
      <view v-for="col in cols" :key="col.key">
        <view
          v-if="lab[col.key] ?? undefined !== undefined"
          :style="{
            'background-image':
              (showAddress(col) &&
                `url(${globalGl.BASE_IMG + 'stand3-guide-location-bg.png'})`) ||
              '',
          }"
          :class="{
            'address-content': showAddress(col),
          }"
        >
          <view class="flex justify-start relative">
            <view class="color-888 mr16 text-no-wrap label">
              {{ col.label }}
            </view>

            <view
              @click="rowClick(col)"
              class="g-break-word font-semibold relative flex items-start flex-1 row-value"
            >
              <view class="flex-1 flex items-center">
                {{ lab[col.key] }}

                <view
                  v-if="col.key === 'categorName' && lab.hosId"
                  class="ml12 color-blue flex items-center"
                >
                  <view class="icon-font ico_location2 right-icon guide-icon" />

                  <text>导航</text>
                </view>
              </view>

              <text
                v-if="showAddress(col)"
                class="text-no-wrap color-blue mr12 location-tip"
              >
                带我去
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import globalGl from '@/config/global';
  import { GStores } from '@/utils';

  const gStores = new GStores();
  const props = withDefaults(
    defineProps<{
      cols: any[];
      lab: any;
    }>(),
    {}
  );

  const showAddress = (col) => {
    if (
      gStores.globalStore.sysCode === '1001035' &&
      ['12675', '12713'].includes(props.lab.hosId) &&
      ['itemAddress'].includes(col.key)
    ) {
      //省中本部和紫东院区开启
      return true;
    }
    if (
      gStores.globalStore.sysCode === '1001067' &&
      ['13009'].includes(props.lab.hosId) &&
      ['itemAddress', 'site', 'areaName'].includes(col.key)
    ) {
      //温附二
      if (props.lab.performDeptName || props.lab.deptName) {
        return true;
      }
    }
    return props.lab.performDeptCode && ['itemAddress'].includes(col.key);
  };

  const emits = defineEmits(['go-report', 'go-address-map', 'click-row']);
  const rowClick = (col) => {

    if (showAddress(col)) {
      emits('go-address-map', props.lab);
    }

    emits('click-row', {
      col,
    });
  };
</script>

<style lang="scss" scoped>
  .row {
    min-height: 72rpx;

    .label {
      width: 5em;
      padding: 16rpx 0;
    }

    .row-value {
      // line-height: 1em;
      padding: 16rpx 0;
    }

    .address-content {
      background-position: top right;
      background-repeat: no-repeat;
      background-size: auto 72rpx;
      line-height: 72rpx;
      .row-value,
      .label {
        padding: 0;
      }
    }

    .location-bg {
      height: 72rpx;
      position: absolute;
      right: 0;
    }

    .location-tip {
      margin-left: 2em;
    }
  }

  .guide-icon {
    height: 40rpx;
    width: 40rpx;
  }
</style>
