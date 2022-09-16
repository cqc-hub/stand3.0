<template>
  <view class="">
    <Gl-Popup ref="popup" :title="title" @hide="hide">
      <view>
        <view
          v-for="(item, i) in option"
          :key="i"
          :class="{
            'popup-row-active': isActive(item)
          }"
          @click="change(item)"
          class="popup-row"
        >
          <view class="popup-row-label text-ellipsis">
            {{ item[field.label] }}
          </view>
          <view v-if="isActive(item)" class="iconfont ico-check">&#xe6cc;</view>
        </view>
      </view>
    </Gl-Popup>
  </view>
</template>

<script lang="ts" setup>
  import { watch, ref } from 'vue';
  import GlPopup from '@/components/g-popup/g-popup.vue';

  const props = withDefaults(
    defineProps<{
      show: boolean;
      title?: string;
      option: any[];
      value: any;
      field?: {
        label: string;
        value: string;
      };
    }>(),
    {
      title: '',
      field: () => ({
        label: 'label',
        value: 'value'
      })
    }
  );

  const popup = ref<InstanceType<typeof GlPopup>>();
  const emits = defineEmits(['update:show', 'update:value', 'change']);

  const isActive = (item) => {
    return item[props.field.value] === props.value;
  };

  const hide = () => {
    emits('update:show', false);
  };

  const change = (item) => {
    const value = item[props.field.value];

    if (value === props.value) {
      return;
    }

    close();
    emits('update:value', value);
    emits('change', {
      item
    });
  };

  const close = () => {
    popup.value?.hide();
  };

  watch(
    () => props.show,
    () => {
      if (props.show) {
        popup.value?.show();
      }
    }
  );
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

    .ico-check {
      font-size: var(--hr-font-size-xxl);
    }
  }
</style>
