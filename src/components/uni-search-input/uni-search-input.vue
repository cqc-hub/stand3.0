<template>
  <view class="">
    <view :class="{ 'bg-home': type === '2' }">
      <easy-input
        :value="value"
        :styles="{
          color: 'var(--hr-neutral-color-10)',
          borderColor: 'var(--hr-neutral-color-9)',
        }"
        :placeholder="placeholder"
        :inputBorder="inputBorder"
        :focus="focus"
        @input="changeInput"
        @confirm="confirm"
        suffixIcon="ico_search1"
        confirmType="search"
        placeholderStyle="font-size: 28rpx;color: #bbbbbb;"
        ref="easyinput"
      >
        <template #prefix>
          <view>
            <view class="iconfont icon-search prefix-icon">&#xe6e4;</view>
          </view>
        </template>
        <template #suffixIcon>
          <view class="flex-normal">
            <view @click.stop="clear" class="suffix-icon">
              <view v-if="value" class="iconfont icon-search icon-searchColor">
                &#xe6de;
              </view>
            </view>

            <slot name="suffixRight" />
          </view>
        </template>

        <!-- <template #right>
          <view>
            <view v-if="value" @click="cancel" class="suffix-right">取消</view>
          </view>
        </template> -->
      </easy-input>
    </view>
  </view>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import easyInput from './easyInput.vue';

  export default defineComponent({
    components: {
      easyInput,
    },

    props: {
      //type：1:默认无边框  2:默认有边框(首页)
      type: {
        type: String,
        default: '1',
      },
      placeholder: {
        type: String,
        default: '',
      },

      focus: {
        type: Boolean,
        default: false,
      },

      inputBorder: {
        type: Boolean,
        default: false,
      },

      value: {
        type: String,
        default: '',
      },
    },

    emits: ['update:value', 'cancel', 'clear', 'confirm', 'change'],

    setup(props, { emit }) {
      const easyinput = ref('');

      const changeInput = (e) => {
        if (typeof e === 'string') {
          emit('update:value', e);
          emit('change', e);
        }
      };

      const clear = () => {
        changeInput('');
        emit('clear');
      };

      const cancel = () => {
        emit('cancel');
      };

      const confirm = (e) => {
        emit('confirm', e);
      };

      return {
        changeInput,
        clear,
        cancel,
        confirm,
        easyinput,
      };
    },

    options: {
      // 微信样式穿透需要配置
      styleIsolation: 'shared',
    },
  });
</script>

<style lang="scss" scoped>
  .bg-home {
    :deep(.uni-easyinput__content) {
      background-color: #fff;
      height: 80rpx;
      border-radius: 16rpx;
    }
  }

  :deep(.uni-easyinput__content) {
    background-color: var(--hr-neutral-color-1);
    height: 80rpx;
    border-radius: 16rpx;
  }

  :deep(input) {
    font-size: var(--hr-font-size-base) !important;
    background-color: transparent;
  }

  :deep(.uni-easyinput__content .uni-icons) {
    font-size: var(--hr-font-size-xxl) !important;
    color: var(--hr-neutral-color-9) !important;
  }

  .suffix-icon {
    padding: 0 20rpx;
    padding-left: 10rpx;
  }
  .suffix-right {
    padding-right: 20rpx;
  }

  .icon-search {
    font-size: var(--h-size-40);
    color: var(--hr-neutral-color-9);
  }
  .icon-searchColor {
    color: var(--hr-neutral-color-7);
  }

  .prefix-icon {
    padding-left: 20rpx;
  }
</style>
