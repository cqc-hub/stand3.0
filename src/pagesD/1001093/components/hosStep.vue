<template>
  <view class="">
    <uv-steps :current="current">
      <uv-steps-item
        v-for="(item, i) in list"
        :key="item.value"
        :customStyle="{
          padding: '0 6px',
        }"
      >
        <template v-slot:icon>
          <view @click="itemClick(item, i)">
            <view class="dot flex items-center justify-center relative">
              <!-- <text v-if="current > i" class="color-blue iconfont f70 ">
                &#xe6c7;
              </text> -->
              <view
                :class="{
                  ['active']: item.value === status,
                  'bg-blue': current >= i,
                }"
                class="item-dot relative f32 font-semibold z-1"
              >
                <view
                  :class="{
                    'breathing-active': i === current,
                  }"
                  class="breathing"
                />

                <text
                  v-if="current > i && selStatus !== item.value"
                  class="w-full h-full flex items-center justify-center bg-white color-blue item-dot-did"
                />

                <text
                  v-else
                  :class="{
                    'bg-blue': current >= i,
                    'bg-ccc': current < i,
                  }"
                  class="radius-full w-full h-full flex items-center justify-center color-fff relative z-1"
                >
                  {{ i + 1 }}
                </text>
              </view>
            </view>
          </view>
        </template>

        <template v-slot:title>
          <view
            :class="{
              [item.value === selStatus ? 'color-blue' : 'color-888']: 1,
            }"
            @click="itemClick(item, i)"
            class="pt16 f28 text-no-wrap"
          >
            {{ item.label }}
          </view>
        </template>
      </uv-steps-item>
    </uv-steps>
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';

  const props = defineProps<{
    status: string;
    selStatus: string;
    list: IOptions[];
  }>();
  const emits = defineEmits(['item-click']);

  const current = computed(() => {
    const idx = props.list.findIndex((item) => item.value === props.status);
    return idx === -1 ? 0 : idx;
  });

  const itemClick = (item, i) => {
    if (current.value >= i && props.selStatus !== item.value) {
      emits('item-click', item);
    }
  };
</script>

<style lang="scss" scoped>
  .bg-ccc {
    background-color: #ccc;
  }
  .radius-full {
    border-radius: 100%;
  }
  .dot {
    width: 86rpx;
    height: 86rpx;
  }

  .item-dot {
    border-radius: 100%;
    width: 64rpx;
    height: 64rpx;

    .item-dot-did {
      border-radius: 100%;
      box-shadow: inset 0 0 0 1px var(--hr-brand-color-6);
      &::before {
        content: '';
        position: relative;
        display: block;
        width: 15rpx;
        height: 30rpx;
        border: solid var(--hr-brand-color-6);
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
        top: -2px;
      }
    }
  }

  .breathing {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 4px solid transparent;
    left: -4px;
    top: -4px;
    border-radius: 100%;

    &.breathing-active {
      animation: OpacityBreath 1.1s ease-in-out infinite;
      position: absolute;
      border-color: #ccddff;

      &::before,
      &::after {
        content: '';
        border: 1px solid var(--hr-brand-color-6);
        width: 100%;
        height: 100%;
        position: absolute;
        opacity: 0;
        border-radius: 50%;
      }

      &::before {
        animation: Wave 1.1s ease-in-out infinite;
      }

      &::after {
        animation: Wave 0.7s ease-in-out 0.4s infinite;
      }
    }
  }

  @keyframes OpacityBreath {
    0% {
      opacity: 1;
    }

    50% {
      opacity: 0.8;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes Wave {
    0% {
      transform: scale(1);
      opacity: 0.4;
    }

    100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }
</style>
