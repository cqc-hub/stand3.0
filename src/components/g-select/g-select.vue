<template>
  <view class="pop">
    <view @click="show">
      <slot :label="getShowLabel" />
    </view>

    <Gl-Popup ref="popup" :type="type" :title="title" @hide="hide">
      <template v-if="$slots.header" #header>
        <slot name="header" />
      </template>

      <view>
        <view
          v-for="(item, i) in option"
          :key="i"
          :class="{
            'popup-row-active': isActive(item),
            'g-border-top': type === 'top',
          }"
          @click="change(item)"
          class="popup-row g-border-bottom"
        >
          <view class="popup-row-label f32 text-ellipsis">
            {{ field ? item[field.label] : item }}
          </view>
          <view v-if="isActive(item)" class="iconfont ico-check">&#xe6cc;</view>
        </view>
      </view>
    </Gl-Popup>
  </view>
</template>

<script lang="ts" setup>
  import { watch, ref, computed } from 'vue';
  import GlPopup from '@/components/g-popup/g-popup.vue';

  const props = withDefaults(
    defineProps<{
      show: boolean;
      title?: string;
      option: any[];
      value: any;
      type?: 'top' | 'bottom';
      field?: {
        label: string;
        value: string;
      };
    }>(),
    {
      title: '',
      type: 'bottom',
    }
  );

  const _id = new Date().getTime();
  const popup = ref<InstanceType<typeof GlPopup>>();
  const emits = defineEmits(['update:show', 'update:value', 'change']);

  const getShowLabel = computed(() => {
    const field = props.field;

    let label = props.value;
    props.option.map((item) => {
      const v = field ? item[field.value] : item;

      v === label && (label = field ? item[field.label] : item);
    });

    return label;
  });

  const isActive = (item) => {
    return (props.field ? item[props.field.value] : item) === props.value;
  };

  const hide = () => {
    emits('update:show', false);
  };

  const change = (item) => {
    const value = props.field ? item[props.field.value] : item;

    if (value === props.value) {
      return;
    }

    close();
    emits('update:value', value);
    emits('change', {
      item,
    });
  };

  uni.$on('_CloseGlobalSelector', (e) => {
    if (_id !== e) {
      close();
    }
  });

  const close = () => {
    popup.value?.hide();
  };

  const show = () => {
    uni.$emit('_CloseGlobalSelector', _id);
    popup.value?.show();
  };

  watch(
    () => props.show,
    () => {
      if (props.show) {
        show();
      } else {
        close();
      }
    }
  );

  defineExpose({
    show,
    close,
  });
</script>

<style lang="scss" scoped>
  .popup-row {
    display: grid;
    align-items: center;
    padding: 24rpx 32rpx;

    grid-template-columns: 1fr 40rpx;

    color: var(--hr-neutral-color-10);

    &-active {
      color: var(--hr-brand-color-6);
      font-weight: 600;
    }

    &:last-child {
      margin-bottom: 50rpx;
    }

    .ico-check {
      font-size: var(--hr-font-size-xxl);
      font-weight: normal;
    }
  }

  .pop {
    position: relative;
    z-index: 10;
  }
</style>
